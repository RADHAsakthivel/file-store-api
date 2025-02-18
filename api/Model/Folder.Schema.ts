import mongoose, { Schema } from "mongoose";
import  {IFolder}  from "../Interface/IFolder.interface";

const FolderSchema = new Schema<IFolder>(
    {
        name: { type: String, required: true },
        description: { type: String },
        children: [{ type: Schema.Types.ObjectId, ref: "Folder" }],
        files: [{ type: Schema.Types.ObjectId, ref: "File" }],
        parent: { type: Schema.Types.ObjectId, ref: "Folder", default: null },
    },
    { timestamps: true }
);
FolderSchema.index({ parent: 1 });
export default mongoose.model<IFolder>("Folder", FolderSchema);