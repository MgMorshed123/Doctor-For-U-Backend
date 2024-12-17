import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

// Load environment variables
dotenv.config();

console.log("API_KEY:", process.env.API_KEY); // Debugging line
console.log("API_SECRET:", process.env.API_SECRET); // Debugging line
console.log("CLOUD_NAME:", process.env.CLOUD_NAME); // Debugging line

// Cloudinary configuration
cloudinary.config({
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  cloud_name: process.env.CLOUD_NAME,
});

export default cloudinary;
