import express from "express";
import { registerUser } from "../controller/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);

export default userRouter;
