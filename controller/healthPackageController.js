// import { healthPackageModel } from "../models/healthPackageModel.js";
import Stripe from "stripe";
import { healthPackageModel } from "../models/healthPackageSchema.js";
import { userModel } from "../models/userModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Add your secret key in .env

export const getHealthPackages = async (req, res) => {
  try {
    const packages = await healthPackageModel.find();
    res.json({ success: true, packages });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const addHealthPackage = async (req, res) => {
  try {
    const { name, price, features } = req.body;

    // Validate input
    if (!name || !price || !features || !Array.isArray(features)) {
      return res.status(400).json({
        success: false,
        message: "Name, price, and features (as an array) are required",
      });
    }

    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number",
      });
    }

    // Check for duplicate package name
    const existingPackage = await healthPackageModel.findOne({ name });
    if (existingPackage) {
      return res.status(400).json({
        success: false,
        message: "A package with this name already exists",
      });
    }

    // Create and save new health package
    const newPackage = new healthPackageModel({
      name,
      price,
      features,
    });

    const savedPackage = await newPackage.save();

    res.status(201).json({
      success: true,
      message: "Health package added successfully",
      package: savedPackage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create Stripe Checkout Session
export const buyHealthPackage = async (req, res) => {
  try {
    // console.log("req.user", req.body.userId);
    const userId = req.body.userId; // from auth middleware
    const { packageId } = req.body;

    if (!packageId) {
      return res
        .status(400)
        .json({ success: false, message: "Package ID is required" });
    }

    const selectedPackage = await healthPackageModel.findById(packageId);
    if (!selectedPackage) {
      return res
        .status(404)
        .json({ success: false, message: "Package not found" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd", // or your currency
            product_data: {
              name: selectedPackage.name,
              description: selectedPackage.features.join(", "),
            },
            unit_amount: selectedPackage.price * 100, // price in cents
          },
          quantity: 1,
        },
      ],
      customer_email: user.email, // optional
      success_url: `${process.env.FRONTEND_URL}/payment-success?packageId=${packageId}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Handle Stripe webhook for successful payment
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const packageId = session.metadata.packageId;
    const customerEmail = session.customer_email;

    const user = await userModel.findOne({ email: customerEmail });
    const selectedPackage = await healthPackageModel.findById(packageId);

    if (user && selectedPackage) {
      user.purchasedPackages = user.purchasedPackages || [];
      user.purchasedPackages.push({
        packageId: selectedPackage._id,
        name: selectedPackage.name,
        price: selectedPackage.price,
        features: selectedPackage.features,
        purchasedAt: new Date(),
      });
      await user.save();
    }
  }

  res.status(200).json({ received: true });
};
