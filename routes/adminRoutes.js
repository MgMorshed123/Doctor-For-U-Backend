import express from "express";
import { upload } from "../middlewares/Multer.js";
import { addDoctor, loginAdmin } from "../controller/adminController.js";
import { AuthAdmin } from "../middlewares/AuthAdmin.js";

const adminRouter = express.Router();

adminRouter.post("/add-doctor", AuthAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", loginAdmin);

export default adminRouter;
