import express from "express";
import {
  getProfile,
  loginUser,
  registerUser,
} from "../controller/userController.js";
import { AuthUser } from "../middlewares/AuthUser.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/get-profile", AuthUser, getProfile);

export default userRouter;
