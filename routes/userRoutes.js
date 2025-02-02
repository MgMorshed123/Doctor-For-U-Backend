import express from "express";
import {
  bookAppointment,
  cancelAppointment,
  getProfile,
  listAppointment,
  loginUser,
  paymentApi,
  registerUser,
  UpdateProfile,
} from "../controller/userController.js";
import { AuthUser } from "../middlewares/AuthUser.js";
import { upload } from "../middlewares/Multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-profile", AuthUser, getProfile);

userRouter.post(
  "/update-profile",
  upload.single("image"),
  AuthUser,
  UpdateProfile
);

userRouter.post("/book-appointment", AuthUser, bookAppointment);
userRouter.get("/list-appointment", AuthUser, listAppointment);
userRouter.post("/cancel-appointment", AuthUser, cancelAppointment);
userRouter.post("/payment", AuthUser, paymentApi);

export default userRouter;
