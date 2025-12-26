import mongoose from "mongoose";

const connectDB = async ()=>{
    await mongoose.connect(`mongodb+srv://namaste_db:${process.env.DB_PASSWORD}@cluster0.ukdleft.mongodb.net/devTinder`);
}

export default connectDB;