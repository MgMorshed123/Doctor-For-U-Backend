import { doctorModel } from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

export const changeAvailablity = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);

    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({ success: true, message: "Availability Changed " });
  } catch (error) {
    // console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);

    res.json({ success: true, doctors });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const loginDoctor = async (req, res) => {
  try {
    console.log(req.body.email);
    const doctor = await doctorModel.findOne({ email: req.body.email });

    console.log("doctor", doctor);
    if (!doctor) {
      return res.status(400).json({ message: "Doctor not found" });
    }
    const isMatch = await bcrypt.compare(req.body.password, doctor.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: doctor._id }, process.env.jwt_Secret);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// api to get doctor for doctor panel

export const appointmentDoctor = async (req, res) => {
  try {
    const { docId } = req.body;

    const appointments = await appointmentModel.find({ docId });
    res.json({ success: true, appointments });

    // console.log("appointments", appointments);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    // console.log("appointmentData", appointmentData);
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });

      await appointmentData.save();
      return res.json({
        success: true,
        message: "Appointment Completed ",
        appointmentData,
      });
    } else {
      return res.json({
        success: false,
        message: "Appointment Not Completed ",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });

      // console.log("appointmentData", appointmentData);

      await appointmentData.save();

      return res.json({
        success: true,
        message: "Appointment Cancelled ",
        appointmentData,
      });
    } else {
      return res.json({
        success: false,
        message: "Appointment Cant be  Cancelled",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// api to get dashboard data

export const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;

    // console.log("docId", docId);

    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;

    // console.log("appointments", appointments);

    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });

    let patients = [];

    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.slice(-5).reverse(),
    };

    console.log(dashData, "dashdata");
    res.json({ success: true, dashData });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;

    const profileData = await doctorModel.findById(docId).select("-password");

    console.log("profileData", profileData);

    res.json({
      success: true,
      profileData,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const UpdatedoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available } = req.body;

    await doctorModel.findByIdAndUpdate(docId, { fees, address, available });

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    res.json({ success: fasle, message: error.message });
  }
};
