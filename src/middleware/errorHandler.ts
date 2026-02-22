import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import multer from "multer";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // ✅ Handle multer errors
  if (err instanceof multer.MulterError) {
    let message = "File upload error";

    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File size is too large. Maximum size is 5MB";
    } else if (err.code === "LIMIT_FILE_COUNT") {
      message = "Too many files uploaded";
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      message = "Unexpected file field";
    } else {
      message = err.message;
    }

    return res.status(400).json({
      status: "error",
      message,
    });
  }

  // ✅ Handle Zod validation errors safely
  if (err instanceof ZodError) {
    const errors = Array.isArray(err.issues)
      ? err.issues.map((error) => ({
          field: error.path?.map(String).join(".") || "",
          message: error.message,
        }))
      : [];

    return res.status(400).json({
      status: "error",
      message: "Validation failed. Please check your input.",
      errors,
    });
  }

  // ✅ Handle custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // ✅ Handle unexpected errors safely
  console.error("ERROR 💥", err);

  const message = err instanceof Error ? err.message : "Something went wrong!";

  return res.status(500).json({
    status: "error",
    message,
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
