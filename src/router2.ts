import express, { Request, Response } from "express";
import {
  upload as upload2,
  uploadFile,
  getFile,
  createFolder,
  getFolderHierarchy,
} from "./upload2";

const router2 = express.Router();

router2.post(
  "/upload",
  upload2.single("file"),
  async (req: Request, res: Response) => {
    console.log(req)
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const file = req.file;
      console.log("Uploaded File:", file);
      
      const metadata = JSON.parse(req.body.metadata);
      console.log("File Metadata:", metadata);
  
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

router2.get("/file/:filename", async (req: Request, res: Response) => {
  try {
    await getFile(req.params.filename, res);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving file", error });
  }
});

router2.post("/save-folder", async (req: Request, res: Response) => {
  try {
    const { name, createdBy, parentId } = req.body;
    const folder = await createFolder(name, createdBy, parentId);
    res.status(201).json({ message: "Folder created successfully", folder });
  } catch (error) {
    res.status(500).json({ message: "Folder creation failed", error });
  }
});

router2.get("/folders", async (req: Request, res: Response) => {
  try {
    const folderHierarchy = await getFolderHierarchy(null);
    res
      .status(200)
      .json({
        message: "Folders retrieved successfully",
        folders: folderHierarchy,
      });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving folders", error });
  }
});

router2.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "Api working Fine" });
});

export default router2;
