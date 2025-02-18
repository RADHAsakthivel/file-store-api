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
        extension: { type: String, required: true },
        parentId: { type: Schema.Types.ObjectId, ref: "Folder" }
    },
    { timestamps: true }
);

export default mongoose.model<IFile>("File", FileSchema);