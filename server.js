// Import required modules
import express from "express";
// Initialize the Express application
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import adminRouter from "./routes/adminRoutes.js";

dotenv.config();
const app = express();
// Define a port to run the server
const PORT = 4000;
// Middleware to parse JSON requests
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

connectDB();

// api endpoint

// app.use((req, res, next) => {
//   res.setTimeout(15000, () => { // 15 seconds
//     console.error("Request timed out");
//     res.status(504).json({ success: false, message: "Request timed out" });
//   });
//   next();
// });

// console.log("Cloud Name:", process.env.CLOUD_NAME);
// console.log("API Key:", process.env.API_KEY);
// console.log("Secret Key:", process.env.API_SECRET);

app.use("/api/admin", adminRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
