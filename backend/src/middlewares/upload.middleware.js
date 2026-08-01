import fs from "fs";
import path from "path";
import multer from "multer";

export const createUpload = (folder, allowedTypes) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(process.cwd(), "uploads", folder);

      // Create folder automatically if it doesn't exist
      fs.mkdirSync(uploadPath, { recursive: true });

      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
      const timestamp = Date.now();

      // Remove spaces and special characters from filename
      const sanitizedName = file.originalname
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9.-]/g, "");

      cb(null, `${timestamp}-${sanitizedName}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
        ),
        false,
      );
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 2 * 1024 * 1024, // 2 MB
    },
  });
};