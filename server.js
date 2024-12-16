// Import required modules
import express from "express";
// Initialize the Express application
import "dotenv/config";
import cors from "cors";

const app = express();
// Define a port to run the server
const PORT = 4000;
// Middleware to parse JSON requests
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
