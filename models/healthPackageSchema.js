import mongoose from "mongoose";

const healthPackageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  features: [{ type: String }],
});

export const healthPackageModel = mongoose.model(
  "HealthPackage",
  healthPackageSchema
);
