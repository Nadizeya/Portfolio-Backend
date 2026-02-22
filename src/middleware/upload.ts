import multer from "multer";
import path from "path";
import { AppError } from "./errorHandler";

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype =
    allowedTypes.test(file.mimetype) || file.mimetype === "image/svg+xml";

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      new AppError(
        "Only image files are allowed (jpeg, jpg, png, gif, webp, svg)",
        400,
      ),
    );
  }
};

// Multer upload configuration
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
