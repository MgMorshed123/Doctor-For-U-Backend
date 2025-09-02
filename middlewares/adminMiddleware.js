import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";

export const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select("role");

    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Admin access required" });
    }

    req.body.userId = decoded.id; // Attach userId to request
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
