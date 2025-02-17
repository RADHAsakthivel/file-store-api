import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    console.log("url");
    mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => {
        console.log("MongoDB Connected...");
        console.log("✅ MongoDB Connected Successfully");
      })
      .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
      });
  } catch (error) {
    console.error("MongoDB Connection Failed", error);
    process.exit(1);
  }
};

export default connectDB;
