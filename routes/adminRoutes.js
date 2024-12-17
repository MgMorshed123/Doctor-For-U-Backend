import express from "express";
import { upload } from "../middlewares/Multer.js";
import { addDoctor } from "../controller/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/add-doctor", upload.single("image"), addDoctor);

export default adminRouter;
