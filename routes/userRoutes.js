import express from "express";
import {
  getProfile,
  loginUser,
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

export default userRouter;
