import express, { Request, Response } from "express";
import multer from "multer";
import { createFolder, uploadFile } from "../service";

const storage = multer.memoryStorage();
const upload = multer({ storage });
const postRouter = express.Router();


postRouter.post(
    "/upload",
    upload.single("file"),
    async (req: Request, res: Response) => {
      if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
      }
  
      try {
        const file = req.file;
  
        const metadata = JSON.parse(req.body.metadata);
  
        const uploadStream = uploadFile(
          req.file,
          req.body.metadata,
          req.body.createdBy,
          metadata.parentId
        );
        res
          .status(201)
          .json({ message: "File uploaded successfully", uploadStream });
      } catch (error) {
        res.status(500).json({ message: "File uploading failed", error });
      }
    }
  );

  postRouter.post("/save-folder", async (req: Request, res: Response) => {
    try {
      const folder = await createFolder(req.body);
      res.status(201).json({ message: "Folder created successfully", folder });
    } catch (error) {
      res.status(500).json({ message: "Folder creation failed", error });
    }
  });


  export {postRouter}