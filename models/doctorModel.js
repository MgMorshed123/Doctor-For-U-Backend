import mongoose from "mongoose";
import { type } from "os";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: false },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    address: { type: Object, required: true },
    date: { type: Date, default: Date.now },
    slot_booked: { type: Object, default: {} },
  },
  { minimize: false }
);

export const doctorModel =
  mongoose.models.doctor || mongoose.model("doctor", doctorSchema);
