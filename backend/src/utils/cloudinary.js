import fs from "fs/promises";
import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "image",
    });

    // Delete local temp file
    await fs.unlink(filePath);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    // Delete temp file even if upload fails
    try {
      await fs.unlink(filePath);
    } catch {}

    throw error;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId);
};
