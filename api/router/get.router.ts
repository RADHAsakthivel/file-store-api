import express, { Request, Response } from "express";
import { findByQuery, getFile, getFolderHierarchy } from "../service";

const getRouter = express.Router();

getRouter.get("/file/:filename", async (req: Request, res: Response) => {
  try {
    await getFile(req.params.filename, res);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving file", error });
  }
});

getRouter.get("/folders", async (req: Request, res: Response) => {
  try {
    const folderHierarchy = await getFolderHierarchy(null);
    res.status(200).json({
      message: "Folders retrieved successfully",
      folders: folderHierarchy,
    });
  } catch (error) {
    console.log("Error =>", error);
    res.status(500).json({ message: "Error retrieving folders", error });
  }
});

getRouter.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "Api working Fine" });
});

getRouter.get("/query/files", async (req: Request, res: Response) => {
  try {
    const { folderName, description, date } = req.query;
    const data = await findByQuery(
      folderName?.toString() || "",
      description?.toString() || "",
      date ? new Date(date.toString()) : undefined
    );
    res
      .status(200)
      .json({ message: "Folders retrieved successfully", folders: data });
  } catch (error) {
    console.log("Error =>", error);
    res.status(500).json({ message: "Error retrieving folders", error });
  }
});

export {getRouter}