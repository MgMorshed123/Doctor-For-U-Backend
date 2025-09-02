import express from "express";
import { upload } from "../middlewares/Multer.js";
import {
  addDoctor,
  adminDashboard,
  allDoctors,
  AppointmentCancel,
  appointmentsAdmin,
  loginAdmin,
} from "../controller/adminController.js";
import { AuthAdmin } from "../middlewares/AuthAdmin.js";
import { changeAvailablity } from "../controller/doctorController.js";
// import { cancelAppointment } from "../controller/userController.js";

const adminRouter = express.Router();

adminRouter.post("/add-doctor", AuthAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-doctors", AuthAdmin, allDoctors);
adminRouter.post("/change-availablity", AuthAdmin, changeAvailablity);
adminRouter.get("/appointments", AuthAdmin, appointmentsAdmin);
adminRouter.post("/appointment-cancel", AuthAdmin, AppointmentCancel);
adminRouter.get("/dashboard", AuthAdmin, adminDashboard);

export default adminRouter;
