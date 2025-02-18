import { FileSchema, FolderSchema } from "../Model";


const deleleteFolderById = async (id: string) => {
  const folder = await FolderSchema.findById(id);
  if (!folder) {
    throw new Error("Folder not found");
  }
  return await FolderSchema.deleteOne({ _id: id });
};

const deleleteFileById = async (id: string) => {
  const folder = await FileSchema.findById(id);
  if (!folder) {
    throw new Error("File not found");
  }
  return await FileSchema.deleteOne({ _id: id });
};

export {
    deleleteFileById,
    deleleteFolderById
}