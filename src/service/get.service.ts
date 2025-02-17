import mongoose from "mongoose";
import { FileSchema, FolderSchema } from "../Model";
import { GridFSBucket, MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI as string);
const database = client.db();
const bucket = new GridFSBucket(database, { bucketName: "uploads" });

const getFolderHierarchy = async (parentId: mongoose.Types.ObjectId | null) => {
  const folders = await FolderSchema.find({ parent: parentId }).lean();
  for (let folder of folders) {
    const folderId = new mongoose.Types.ObjectId(folder._id.toString());
    folder.children = (await getFolderHierarchy(folderId)) as any;
    folder.files = (await FileSchema.find({
      parentId: folderId,
    }).lean()) as any;
  }
  return folders;
};

const getFile = async (filename: string, res: any) => {
  const files = await bucket.find({ filename }).toArray();
  if (!files || files.length === 0) {
    return res.status(404).json({ message: "File not found" });
  }
  bucket.openDownloadStreamByName(filename).pipe(res);
};


const findByQuery = async (fileName: string, description: string, date?: Date) => {
  
    let query: any = {};
  
    if (fileName) query.name = { $regex: fileName, $options: "i" };
    if (description) query.description = { $regex: description, $options: "i" };
  
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
  
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
  
      query.$or = [
        { createdAt: { $gte: startOfDay, $lte: endOfDay } },
        { updatedAt: { $gte: startOfDay, $lte: endOfDay } },
      ];
    }
  
    // Aggregation with lookup
    let folderData = await FolderSchema.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "files",
          let: { files: "$files" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$files"] },
              },
            },
          ],
          as: "files",
        }
      },
    ]).exec();
  
    // Parallel execution of `getFolderHierarchy`
    folderData = await Promise.all(
      folderData.map(async (folder) => ({
        ...folder,
        children: await getFolderHierarchy(new mongoose.Types.ObjectId(folder._id.toString())),
      }))
    );
  
    return folderData;
  };
  

export { getFolderHierarchy, getFile, findByQuery };
