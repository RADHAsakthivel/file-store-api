import mongoose, { Document } from "mongoose";

export interface IFolder extends Document {
    name: string;
    description?: string;
    children: mongoose.Types.ObjectId[];
    files: mongoose.Types.ObjectId[];
    isExpanded: boolean;
    isSelectedFlag: boolean;
    isDisabled: boolean;
    isLeaf: boolean;
    isRoot: boolean;
    level: number;
    parent?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
