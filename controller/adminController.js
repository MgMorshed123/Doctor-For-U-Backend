import dotenv from "dotenv";
import validator from "validator";
import bcrypt from "bcrypt";
import { doctorModel } from "../models/doctorModel.js";
import cloudinary from "../config/cloudinary.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import { userModel } from "../models/userModel.js";

dotenv.config();

export const addDoctor = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    // const imageFile = req.file;

    // console.log("image", imageFile);

    // Check for missing details
    if (
      !name ||
      !email ||
      !speciality ||
      !password ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Details" });
    }
    // cahge
    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Please enter a strong password (at least 8 characters)",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload image to Cloudinary
    // let imageUrl = "";
    // console.log(imageFile.path);
    // if (imageFile) {
    //   try {
    //     const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
    //       resource_type: "image",
    //     });
    //     imageUrl = imageUpload.secure_url;
    //   } catch (error) {
    //     return res.status(500).json({
    //       success: false,
    //       message: "Error uploading image to Cloudinary",
    //       error: error.message,
    //     });
    //   }
    // }

    // Prepare doctor data
    const doctorData = {
      name,
      email,
      // image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: new Date(),
    };

    // Save doctor to database
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    // Send success response
    res
      .status(201)
      .json({ success: true, message: "Doctor added successfully" });
  } catch (error) {
    console.error("Error adding doctor:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    if (
      email === process.env.Admin_Email &&
      password === process.env.Admin_Password
    ) {
      const token = jwt.sign(email + password, process.env.jwt_Secret);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error("Error adding doctor:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");

    res.json({ success: true, doctors });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    // console.log(appointments);
    res.json({ success: true, appointments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const AppointmentCancel = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    // console.log("appointmentId", appointmentId);

    // Find the appointment
    const appointmentData = await appointmentModel.findById(appointmentId);

    // Check if the appointment exists
    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // // Authorization check
    // if (appointmentData.userId !== userId) {
    //   return res.json({ success: false, message: "Unauthorized" });
    // }

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

export const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointment: appointments.length,
      patinets: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    console.log("dashData", dashData);
    res.json({ success: true, dashData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
