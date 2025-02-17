import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import dotenv from "dotenv";

dotenv.config();

const storage = new GridFsStorage({
  url: process.env.MONGO_URI as string,
  options: { useNewUrlParser: true, useUnifiedTopology: true }, // Ensure proper connection settings
  file: (req: any, file: any) => {
    console.log("file =>",file);
    return new Promise((resolve, reject) => {
      if (!file) {
        return reject(new Error("File not found"));
      }
      resolve({
        filename: `${Date.now()}-${file.originalname}`,
        bucketName: "uploads",
      });
    });
  },
});

const upload = multer({ storage : storage as unknown as multer.StorageEngine  });

export default upload;
