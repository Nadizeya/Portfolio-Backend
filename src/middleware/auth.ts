import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "./errorHandler";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        role: string;
      };
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(
        "No token provided. Please login to access this resource.",
        401,
      );
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as {
        id: string;
        username: string;
        role: string;
        exp?: number;
      };

      // Check if token is about to expire (within 5 minutes)
      if (decoded.exp) {
        const now = Math.floor(Date.now() / 1000);
        const timeToExpiry = decoded.exp - now;

        if (timeToExpiry < 300) {
          // Less than 5 minutes
          res.setHeader("X-Token-Expires-Soon", "true");
          res.setHeader("X-Token-Expires-In", timeToExpiry.toString());
        }
      }

      // Attach user info to request
      req.user = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      };

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError(
          "Token has expired. Please refresh your token or login again.",
          401,
        );
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError("Invalid token. Please login again.", 401);
      } else {
        throw new AppError("Authentication failed", 401);
      }
    }
  } catch (error) {
    next(error);
  }
};

// Optional: Admin-only middleware (for future use)
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }

  if (req.user.role !== "admin") {
    throw new AppError("Admin access required", 403);
  }

  next();
};
