import multer from "multer";
import { MongoClient, GridFSBucket, ObjectId } from "mongodb";
import mongoose from "mongoose";
import dotenv from "dotenv";
import stream from "stream";
import { FileSchema, FolderSchema } from "./Model";
import { DocumentTypeEnum, FileExtensionTypeEnum } from "./Enum";
import { IFolder } from "./Interface/IFolder interface";

dotenv.config();

// Initialize MongoDB connection
const client = new MongoClient(process.env.MONGO_URI as string);
const database = client.db();
const bucket = new GridFSBucket(database, { bucketName: "uploads" });

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Function to upload file to GridFS & save metadata in MongoDB
const uploadFile = async (
  file: Express.Multer.File | undefined,
  fileMetaData: any,
  createdBy: string,
  parentId?: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("file from upload2 =>", file);

      const fileExtension = (
        file?.originalname.split(".").pop() ||
        fileMetaData.name.split(".").pop() ||
        "UNKNOWN"
      ).toUpperCase() as FileExtensionTypeEnum;

      const fileType = Object.values(DocumentTypeEnum).includes(
        fileExtension.toUpperCase() as any
      )
        ? (fileExtension.toUpperCase() as DocumentTypeEnum)
        : DocumentTypeEnum.UNKNOWN;

      const uploadStream = bucket.openUploadStream(
        file?.originalname || fileMetaData.name
      );
      const bufferStream = new stream.PassThrough();
      bufferStream.end(file?.buffer);
      bufferStream.pipe(uploadStream);

      uploadStream.on("error", (error) => reject(error));

      uploadStream.on("finish", async () => {
        const newFile = new FileSchema({
          name: file?.originalname || fileMetaData.name,
          size: file?.size,
          type: fileType,
          extension: fileExtension,
          createdBy,
          parentId: parentId ? new mongoose.Types.ObjectId(parentId) : null,
        });

        if (parentId !== "root" || !parentId) {
          await FolderSchema.findByIdAndUpdate(
            newFile.parentId,
            { $push: { files: newFile._id } },
            { new: true, useFindAndModify: false }
          );
        }

        console.log("newFile =>", newFile);

        const savedFile = await newFile.save();
        resolve(savedFile);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getFile = async (filename: string, res: any) => {
  const files = await bucket.find({ filename }).toArray();
  if (!files || files.length === 0) {
    return res.status(404).json({ message: "File not found" });
  }
  bucket.openDownloadStreamByName(filename).pipe(res);
};

const createFolder = async (
  name: string,
  createdBy: string,
  parentId?: string
) => {
  const newFolder = new FolderSchema({
    name,
    createdBy,
    parent: parentId ? new mongoose.Types.ObjectId(parentId) : null,
    level: parentId ? 1 : 0,
  });
  return await newFolder.save();
};

const getFolderHierarchy = async (parentId: mongoose.Types.ObjectId | null) => {
  // const folders = await FolderSchema.find({ parent: parentId }).lean();
  // console.log("folders start =>",folders);
  // for (let folder of folders) {
  //   // Convert _id to ObjectId explicitly
  //   const folderId = new mongoose.Types.ObjectId(folder.id);

  //   // Recursively fetch child folders (Ensure `children` is an array of full folder objects)
  //   folder.children = (await getFolderHierarchy(folderId)) as any;

  //   // Fetch files inside this folder
  //   folder.files = (await FileSchema.find({
  //     parentId: folderId,
  //   }).lean()) as any;
  // }

  // console.log("folders end =>",folders);
  // return folders;
  getFolder(parentId);
};

const getChildAndFiles = async (parentId:mongoose.Types.ObjectId | null) => {
  const folders = await FolderSchema.find({ parent: parentId }).lean();
  console.log("folders start =>",folders);
  for (let folder of folders) {
    // Convert _id to ObjectId explicitly
    const folderId = new mongoose.Types.ObjectId(folder.id);

    // Recursively fetch child folders (Ensure `children` is an array of full folder objects)
    folder.children = (await getFolderHierarchy(folderId)) as any;

    // Fetch files inside this folder
    console.log(folderId)
    console.log("folder.files =>",(await FileSchema.find({
      parentId: folderId,
    }).lean()) as any)
    folder.files = (await FileSchema.find({
      parentId: folderId,
    }).lean()) as any;
  }

  // console.log("folders end =>",folders);
  return folders;
};

const getFolder = async (parentId: mongoose.Types.ObjectId | null) => {
  // const folders = await FolderSchema.find({ parent: parentId }).lean();
  await getChildAndFiles(parentId);
  // console.log("getFolder =>",await getChildAndFiles(parentId));
};

export { upload, uploadFile, getFile, createFolder, getFolderHierarchy };
