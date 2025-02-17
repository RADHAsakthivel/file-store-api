import { deleleteFileById, deleleteFolderById } from "../service";
import express, { Request, Response, Router } from "express";

const deleteRouter  = express.Router();

deleteRouter.delete("/delete/folder/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log("req delete folder =>", req.params);
    try {
      deleleteFolderById(id);
      res.status(200).json({ message: "Folder deleted successfully" });
    } catch (ex) {
      console.log("Error while deleting folder => ", ex);
      res.status(500).json({ message: "Error while deleting folder" });
    }
  });
  
  deleteRouter.delete("/delete/file/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      deleleteFileById(id);
      res.status(200).json({ message: "File deleted successfully" });
    } catch (ex) {
      console.log("Error while deleting file => ", ex);
      res.status(500).json({ message: "Error while deleting file" });
    }
  });

  export {deleteRouter}