import express from "express";
import {
  addHealthPackage,
  buyHealthPackage,
  getHealthPackages,
} from "../controller/healthPackageController.js";
// import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { AuthAdmin } from "../middlewares/AuthAdmin.js";
import { AuthUser } from "../middlewares/AuthUser.js";

const healthPackageRoutes = express.Router();

// Health package routes
healthPackageRoutes.get("/healthPackages", getHealthPackages);
healthPackageRoutes.post("/addHealthPackages", AuthAdmin, addHealthPackage);
healthPackageRoutes.post("/buyHealthPackage", AuthUser, buyHealthPackage);

export default healthPackageRoutes;
