import express from "express";
import { upload } from "../middlewares/Multer.js";
import {
  addDoctor,
  allDoctors,
  loginAdmin,
} from "../controller/adminController.js";
import { AuthAdmin } from "../middlewares/AuthAdmin.js";
import { changeAvailablity } from "../controller/doctorController.js";

const adminRouter = express.Router();

adminRouter.post("/add-doctor", AuthAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-doctors", AuthAdmin, allDoctors);
adminRouter.post("/change-availablity", AuthAdmin, changeAvailablity);

export default adminRouter;
