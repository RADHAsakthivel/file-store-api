import mongoose, { Document } from "mongoose";
import { DocumentTypeEnum } from "../Enum/documentType.enum";
import { FileExtensionTypeEnum } from "../Enum/fileExtensionType.enum";

export interface IFile extends Document {
    name: string;
    description?: string;
    size: number;
    type: DocumentTypeEnum;
    extension: FileExtensionTypeEnum;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    deletedAt?: Date;
    createdBy: string;
    updatedBy: string;
    deletedBy?: string;
    parentId?: mongoose.Types.ObjectId;
}