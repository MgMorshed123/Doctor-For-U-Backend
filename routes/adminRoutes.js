import express from "express";
import { addDoctor } from "../controller/doctorController.js";
import { upload } from "../middlewares/Multer.js";

// Use `Router` with the correct capitalization
const adminRouter = express.Router();

adminRouter.post("/add-doctor", upload.single("image"), addDoctor);

export default adminRouter;
