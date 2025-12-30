import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// console.log("Cloudinary Config Object:", cloudinary.config());

const uploadOnCloudinary = async (localFilePath) => {
  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // console.log(response);
    return response;
  } catch (error) {
    // console.error("CLOUDINARY UPLOAD FAILED :: ", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export default uploadOnCloudinary;
