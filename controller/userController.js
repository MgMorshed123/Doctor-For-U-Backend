import validator from "validator";
import bcrypt from "bcrypt";
import { userModel } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { doctorModel } from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

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
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
