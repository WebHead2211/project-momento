import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("Could not find local file path.");
      return null;
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("file has been uploaded on cloudinary. url: ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteFromCloudinary = async (file) => {
  let oldFile = file.split("/");
  let oldFileId = oldFile[oldFile.length - 1].split(".")[0];
  try {
    if (!oldFileId) {
      console.log("Could not find local file path.");
      return null;
    }
    const response = await cloudinary.uploader.destroy(
      oldFileId,
      function (result) {
        console.log("File deleted");
      }
    );
    return response;
  } catch (error) {
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
