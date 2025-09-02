// Import required modules
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import adminRouter from "./routes/adminRoutes.js";
import doctorRouter from "./routes/doctorRoutes.js";
import userRouter from "./routes/userRoutes.js";
import healthPackageRoutes from "./routes/healthPackageRoute.js";

dotenv.config();
const app = express();
// Define a port to run the server
const PORT = 4000;

// Middleware to parse JSON requests
app.use(express.json());

// Configure CORS middleware
app.use(
  cors({
    origin: "*", // Allow requests from your frontend's origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
    credentials: true, // Enable cookies and credentials sharing if required
  })
);

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Connect to the database
connectDB();

// Admin routes
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.use("/api/health", healthPackageRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
