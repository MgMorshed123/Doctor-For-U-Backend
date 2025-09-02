import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, default: "" },
  address: { type: Object, default: { line1: "", line2: "" } },
  gender: { type: String, default: "Not Selected" },
  dob: { type: Object },
  phone: { type: String, default: "0000000" },
  healthPackages: [
    {
      packageId: { type: mongoose.Schema.Types.ObjectId, ref: "HealthPackage" },
      purchaseDate: { type: Date, default: Date.now },
      expirationDate: { type: Date },
    },
  ],
});

export const userModel =
  mongoose.models.user || mongoose.model("user", userSchema);
