import express from "express";
import {
  appointmentCancel,
  appointmentComplete,
  appointmentDoctor,
  doctorDashboard,
  doctorList,
  doctorProfile,
  loginDoctor,
  UpdatedoctorProfile,
} from "../controller/doctorController.js";
// import { AuthDoctor } from "../middlewares/authDoctor.js";
import { UpdateProfile } from "../controller/userController.js";
import { AuthDoctor } from "../middlewares/AuthDoctor.js";

const doctorRouter = express.Router();

doctorRouter.get("/list", doctorList);
doctorRouter.post("/doctor-login", loginDoctor);

doctorRouter.get("/appointments", AuthDoctor, appointmentDoctor);

doctorRouter.post("/appointments-complete", AuthDoctor, appointmentComplete);

doctorRouter.post("/appointments-cancelled", AuthDoctor, appointmentCancel);

doctorRouter.get("/dashboard", AuthDoctor, doctorDashboard);

doctorRouter.get("/profile", AuthDoctor, doctorProfile);

doctorRouter.post("/update-profile", AuthDoctor, UpdatedoctorProfile);

export default doctorRouter;
