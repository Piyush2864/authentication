import mongoose from "mongoose";

const MongoURI = process.env.MONGO_URI;

export const connectToDB = async() => {
    if (!MongoURI) {
        throw new Error("MONGO_URI environment variable is not defined");
    }
    try {
        await mongoose.connect(MongoURI);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
    }
}