import { GridFSBucket, MongoClient } from "mongodb";
import { DocumentTypeEnum, FileExtensionTypeEnum } from "../Enum";
import { IFolder } from "../Interface/IFolder.interface";
import { FileSchema, FolderSchema } from "../Model";
import stream from "stream";
import mongoose from "mongoose";

const client = new MongoClient(process.env.MONGO_URI as string);
const database = client.db();
const bucket = new GridFSBucket(database, { bucketName: "uploads" });


const createFolder = async (data: IFolder) => {
  const newFolder = new FolderSchema({
    ...data,
  });
  return await newFolder.save();
};

export {createFolder}