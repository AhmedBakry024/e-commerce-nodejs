import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true,
    versionKey: false
 });

export const categoryModel = mongoose.model("Category", categorySchema);