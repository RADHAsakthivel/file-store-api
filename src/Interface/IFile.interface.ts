import mongoose, { Document } from "mongoose";
import { DocumentTypeEnum } from "../Enum/documentType.enum";
import { FileExtensionTypeEnum } from "../Enum/fileExtensionType.enum";

export interface IFile extends Document {
    name: string;
    description?: string;
    size: number;
    type: DocumentTypeEnum;
    extension: FileExtensionTypeEnum;
    parentId?: mongoose.Types.ObjectId;
}