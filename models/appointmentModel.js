import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  docId: { type: String, required: true },
  slotDate: { type: String, required: true }, // Format: dd_mm_yyyy
  slotTime: { type: String, required: true }, // Format: hh:mm AM/PM
  userData: { type: Object, required: true }, // Add more specific validations if needed
  docData: { type: Object, required: true }, // Add more specific validations if needed
  date: { type: Number, required: true }, // Unix timestamp or other numeric date representation
  amount: { type: Number, required: true },
  cancelled: { type: Boolean, default: false }, // Default value to indicate not cancelled
  payment: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
});

const appointmentModel =
  mongoose.models.appointment ||
  mongoose.model("appointment", appointmentSchema);

export default appointmentModel;
