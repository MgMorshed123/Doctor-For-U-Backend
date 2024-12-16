import mongoose from "mongoose";

export const connectToMongoDB = async (uri) => {
  try {
    await mongoose.connect(process.env.Mongo_Uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
