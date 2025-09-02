import validator from "validator";
import bcrypt from "bcrypt";
import { userModel } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { doctorModel } from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import razorpay from "razorpay";
import Stripe from "stripe";
import { healthPackageModel } from "../models/healthPackageSchema.js";
import { sendAppointmentConfirmationEmail } from "../utils/sendAppointmentEmail.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// Replace with your Stripe secret key

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details " });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a Valid Email " });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a Valid Password " });
    }

    // hash user password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);

    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.jwt_Secret);

    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      res.json({ success: false, message: "User Does Not Exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.jwt_Secret);

      res.json({ success: true, token });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId).select("-password");

    res.json({ success: true, userData });
  } catch (error) {
    res.json({ success: fasle, message: error.message });
  }
};

export const UpdateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    // Check if required fields are missing
    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "All Fields Required" });
    }

    let parsedAddress = address;
    if (address && typeof address === "string") {
      try {
        parsedAddress = JSON.parse(address); // Only parse if address is a valid JSON string
      } catch (err) {
        return res.json({ success: false, message: "Invalid address format" });
      }
    }

    // Update user profile with the new information
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: parsedAddress,
      dob,
      gender,
    });

    // Handle image upload if a file is provided
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });

      const imageUrl = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    // console.log("slotDate, slotTime", slotDate, slotTime);

    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor Not available " });
    }

    let slot_booked = docData.slot_booked;

    if (slot_booked[slotDate]) {
      if (slot_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot Not Available" });
      } else {
        slot_booked[slotDate].push(slotTime);
      }
    } else {
      slot_booked[slotDate] = [];
      slot_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-passord");

    // what happend if dont delete
    delete docData.slot_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);

    await newAppointment.save();

    // save slot data in doctor data .

    await doctorModel.findByIdAndUpdate(docId, { slot_booked });

    res.json({ success: true, message: "Appoint Booked " });
  } catch (error) {
    // console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;

    // console.log(userId);
    const appointment = await appointmentModel.find({ userId });

    // console.log(appointment);

    res.json({ success: true, appointment });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    // console.log("appointmentId", appointmentId);

    // Find the appointment
    const appointmentData = await appointmentModel.findById(appointmentId);

    // Check if the appointment exists
    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Authorization check
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // Mark appointment as cancelled
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // Retrieve doctor data
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);

    if (!doctorData) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    // Make the slot available again
    let slot_booked = doctorData.slot_booked || {};
    if (slot_booked[slotDate]) {
      slot_booked[slotDate] = slot_booked[slotDate].filter(
        (e) => e !== slotTime
      );
    }

    // Update the doctor data
    await doctorModel.findByIdAndUpdate(docId, { slot_booked });

    // Send success response
    res.json({ success: true, message: "Appointment successfully cancelled" });
  } catch (error) {
    // console.error(error);
    res.json({
      success: false,
      message: "An error occurred while cancelling the appointment",
    });
  }
};

// Initialize Stripe with your secret key

// Initialize Stripe with your secret key

export const paymentApi = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    // Fetch appointment details from the database
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointmentData.cancelled) {
      return res.status(400).json({
        success: false,
        message: "Appointment is cancelled",
      });
    }

    const paymentAmount = appointmentData.amount * 100;

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "Appointment Payment",
            },
            unit_amount: paymentAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/my-appointments`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    // Update the payment field to true and save the updated appointment to the database
    appointmentData.payment = true;
    await appointmentData.save();

    // console.log("appointmentData", appointmentData.userData.email);
    // console.log("appointmentData", appointmentData);

    // Send confirmation email

    // Respond with the session URL
    res.status(200).json({
      appointmentData: appointmentData,
      success: true,
      paymentUrl: session.url,
    });
    await sendAppointmentConfirmationEmail(appointmentData);
  } catch (error) {
    console.error("Error creating payment session:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create payment session",
      error: error.message,
    });
  }
};

// export const purchaseHealthPackage = async (req, res) => {
//   try {
//     const { userId, packageId } = req.body;

//     const packageData = await healthPackageModel.findById(packageId);
//     if (!packageData) {
//       return res.status(404).json({
//         success: false,
//         message: "Health package not found",
//       });
//     }

//     const paymentAmount = packageData.price * 100;
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "USD",
//             product_data: {
//               name: `Health Package: ${packageData.name}`,
//             },
//             unit_amount: paymentAmount,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `${process.env.FRONTEND_URL}/my-packages`,
//       cancel_url: `${process.env.FRONTEND_URL}/cancel`,
//     });

//     const purchaseDate = new Date();
//     const expirationDate = new Date(purchaseDate);
//     expirationDate.setMonth(purchaseDate.getMonth() + 1);

//     await userModel.findByIdAndUpdate(userId, {
//       $push: {
//         healthPackages: {
//           packageId,
//           purchaseDate,
//           expirationDate,
//         },
//       },
//     });

//     res.status(200).json({
//       success: true,
//       paymentUrl: session.url,
//       packageData,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to create payment session for health package",
//       error: error.message,
//     });
//   }
// };
