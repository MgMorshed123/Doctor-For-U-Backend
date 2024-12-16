import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.Cloudinary_CloudName,
    api_key: process.env.Cloudinary_Api_Key,
    api_secret: process.env.Cloudinary_Secret_Key,
  });
};

export default connectCloudinary;
