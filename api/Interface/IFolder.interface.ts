import mongoose, { Document } from "mongoose";

export interface IFolder extends Document {
    name: string;
    description?: string;
    children: mongoose.Types.ObjectId[];
    files: mongoose.Types.ObjectId[];
    parent?: mongoose.Types.ObjectId;
}