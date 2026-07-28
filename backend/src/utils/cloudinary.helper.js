import fs from "fs-extra";
import cloudinary from "../config/cloudinary.js";

/**
 * Upload image to Cloudinary
 * @param {string} filePath - Local temp file path
 * @param {string} folder - Cloudinary folder
 * @returns {{url:string, publicId:string}} 
 */
export const uploadToCloudinary = async (
  filePath,
  folder
) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "image",
    });

    // Remove temporary local file
    await fs.remove(filePath);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    // Clean temp file even if upload fails
    if (filePath) {
      await fs.remove(filePath).catch(() => {});
    }

    throw error;
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId
 */
export const deleteFromCloudinary = async (
  publicId
) => {
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId);
};