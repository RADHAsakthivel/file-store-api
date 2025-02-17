import mongoose, { Schema } from "mongoose";
import { IFolder } from "../Interface/IFolder interface";

const FolderSchema = new Schema<IFolder>(
    {
        name: { type: String, required: true },
        description: { type: String },
        children: [{ type: Schema.Types.ObjectId, ref: "Folder" }],
        files: [{ type: Schema.Types.ObjectId, ref: "File" }],
        isExpanded: { type: Boolean, default: false },
        isSelectedFlag: { type: Boolean, default: false },
        isDisabled: { type: Boolean, default: false },
        isLeaf: { type: Boolean, default: false },
        isRoot: { type: Boolean, default: false },
        level: { type: Number, required: true },
        parent: { type: Schema.Types.ObjectId, ref: "Folder", default: null },
    },
    { timestamps: true }
);

export default mongoose.model<IFolder>("Folder", FolderSchema);