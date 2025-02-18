import mongoose from "mongoose";
import { DocumentTypeEnum, FileExtensionTypeEnum } from "../Enum";
import { FileSchema, FolderSchema } from "../Model";
import stream from "stream";
import { GridFSBucket, MongoClient } from "mongodb";


const client = new MongoClient(process.env.MONGO_URI as string);
const database = client.db();
const bucket = new GridFSBucket(database, { bucketName: "uploads" });

const uploadFile = async (
    file: Express.Multer.File | undefined,
    fileMetaData: any,
    createdBy: string,
    parentId?: string
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
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
  
          const savedFile = await newFile.save();
          resolve(savedFile);
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  export {uploadFile}