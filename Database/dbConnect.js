import mongoose from "mongoose";

export const dbConnect = async () => {
    try {
        const mongodb_url = process.env.MONGODB_URL;
        await mongoose.connect(mongodb_url);
        console.log("Connected to MongoDB Atlas");

    } catch (error) {
        console.log(error);
    }
};