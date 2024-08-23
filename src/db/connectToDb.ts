import mongoose from "mongoose";

export const connectToDb=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI as string)
    } catch (error) {
        throw new Error("Error while connecting to database")
    }
}