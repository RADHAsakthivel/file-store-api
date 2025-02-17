import express, { Request, Response } from "express";
import mongoose, { Connection } from "mongoose";
import upload from "./upload";
import { GridFSBucket, Db } from "mongodb";

const router = express.Router();

router.post(
  "/upload",
  upload.array("file", 10),
  (req: Request, res: Response) => {
    try {
      console.log("Files received:", req.files); // Debugging line
      if (!req.files) {
        res.status(400).json({ message: "No files uploaded" });
      }
      res
        .status(201)
        .json({ message: "Files uploaded successfully", files: req.files });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "File upload failed", error });
    }
  }
);

router.get(
  "/file/:filename",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const conn: Connection = mongoose.connection;
      if (conn.db == undefined) throw Error();
      const db: any = conn.db;
      const bucket = new GridFSBucket(db, { bucketName: "uploads" });

      const files = await bucket
        .find({ filename: req.params.filename })
        .toArray();
      if (!files || files.length === 0) {
        res.status(404).json({ message: "File not found" });
        return;
      }

      bucket.openDownloadStreamByName(req.params.filename).pipe(res);
    } catch (err) {
      res.status(500).json({ message: "Error retrieving file", error: err });
    }
  }
);

router.get("/health", (req: Request, res: Response) => {
  res.status(201).json({ message: "Api working Fine" });
});

export default router;
