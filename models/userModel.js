import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, default: "" },
  address: { type: Object, default: { line1: "", line2: "" } },
  gender: { type: String, default: "Not Selected" },
  dob: { type: Object, required: true },
  phone: { type: String, default: "0000000" },
});

export const userModel =
  mongoose.models.user || mongoose.model("user", userSchema);
