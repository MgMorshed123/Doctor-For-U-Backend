import express from "express";
import { doctorList } from "../controller/doctorController.js";

const doctorRouter = express.Router();

doctorRouter.get("/list", doctorList);

export default doctorRouter;
