import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db";
import {deleteRouter,getRouter,postRouter} from "./router"

try {
  dotenv.config();
  const app = express();
  const PORT = process.env.PORT || 5000;

  app.use(cors());
  app.use(express.json());
  app.use("/api", [deleteRouter,getRouter,postRouter]);
  
  connectDB()
    .then(() => {
      app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((e) => {
      console.log("got error while connecting db", e);
    });
} catch (e) {
  console.log("gotError =>", e);
}
