import mongoose, { Schema } from "mongoose";
import { DocumentTypeEnum } from "../Enum/documentType.enum";
import { FileExtensionTypeEnum } from "../Enum/fileExtensionType.enum";
import { IFile } from "../Interface/IFile.interface";

const FileSchema = new Schema<IFile>(
    {
        name: { type: String, required: true },
        description: { type: String },
        size: { type: Number, required: true },
        type: { type: String, enum: Object.values(DocumentTypeEnum), required: true },
        extension: { type: String, enum: Object.values(FileExtensionTypeEnum), required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date },
        createdBy: { type: String},
        updatedBy: { type: String},
        deletedBy: { type: String },
        parentId: { type: Schema.Types.ObjectId, ref: "Folder" }
    },
    { timestamps: true }
);

export default mongoose.model<IFile>("File", FileSchema);