import { Router, Request, Response } from "express";
import { cloudinary, testCloudinaryConnection } from "../config/cloudinary";
import { upload } from "../middleware/upload";
import { asyncHandler, AppError } from "../middleware";
import path from "path";
import fs from "fs";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);

const router = Router();

// Test Cloudinary connection
router.get(
  "/test/cloudinary",
  asyncHandler(async (req: Request, res: Response) => {
    const result = await testCloudinaryConnection();

    res.status(result.success ? 200 : 500).json({
      status: result.success ? "success" : "error",
      ...result,
    });
  }),
);

// Upload single image
router.post(
  "/upload",
  upload.single("image"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError("Please upload an image", 400);
    }

    // Upload to Cloudinary using buffer
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "portfolio",
          resource_type: "image",
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      uploadStream.end(req.file!.buffer);
    });

    res.status(200).json({
      status: "success",
      message: "Image uploaded successfully",
      data: {
        url: (result as any).secure_url,
        publicId: (result as any).public_id,
        width: (result as any).width,
        height: (result as any).height,
        format: (result as any).format,
        size: req.file.size,
      },
    });
  }),
);

// Upload multiple images
router.post(
  "/upload/multiple",
  upload.array("images", 10),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      throw new AppError("Please upload at least one image", 400);
    }

    const files = req.files as Express.Multer.File[];

    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "portfolio",
            resource_type: "image",
            use_filename: true,
            unique_filename: true,
          },
          (error, result) => {
            if (error) reject(error);
            else
              resolve({
                url: result!.secure_url,
                publicId: result!.public_id,
                width: result!.width,
                height: result!.height,
                format: result!.format,
                size: file.size,
              });
          },
        );

        uploadStream.end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      status: "success",
      message: `${results.length} image(s) uploaded successfully`,
      data: results,
    });
  }),
);

// Upload skill icon (smaller size, dedicated folder)
router.post(
  "/upload/skill-icon",
  upload.single("icon"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError("Please upload an icon", 400);
    }

    // Save icon to local public/icons folder
    const timestamp = Date.now();
    const filename = `${timestamp}-${req.file.originalname.replace(/\s+/g, "-")}`;
    const filePath = path.join(__dirname, "../../public/icons", filename);

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Save file
    await writeFile(filePath, req.file.buffer);

    // Generate URL path
    const url = `/public/icons/${filename}`;

    res.status(200).json({
      status: "success",
      message: "Skill icon uploaded successfully",
      data: {
        url: url,
        filename: filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  }),
);

// Upload project image - saved to local disk in public/uploads
router.post(
  "/upload/project-image",
  upload.single("image"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError("Please upload an image", 400);
    }

    const timestamp = Date.now();
    const filename = `${timestamp}-${req.file.originalname.replace(/\s+/g, "-")}`;
    const uploadsDir = path.join(__dirname, "../../public/uploads");
    const filePath = path.join(uploadsDir, filename);

    // Ensure directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    await writeFile(filePath, req.file.buffer);

    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const url = `${baseUrl}/public/uploads/${filename}`;

    res.status(200).json({
      status: "success",
      message: "Project image uploaded successfully",
      data: {
        url,
        filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  }),
);

export default router;
