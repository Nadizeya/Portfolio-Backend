import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { supabase } from "../config/supabase";
import { asyncHandler, AppError } from "../middleware";
import { loginSchema, registerSchema } from "../validations";

const router = Router();

// POST /api/auth/register - Register a new admin user
router.post(
  "/register",
  asyncHandler(async (req: Request, res: Response) => {
    const validatedData = registerSchema.parse(req.body);
    const { username, password } = validatedData;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .single();

    if (existingUser) {
      throw new AppError("Username already taken", 409);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user into database
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({ username, password_hash: passwordHash, role: "admin" })
      .select("id, username, role, created_at")
      .single();

    if (error) {
      throw new AppError("Failed to create user", 500);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, role: newUser.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as string } as jwt.SignOptions,
    );

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          role: newUser.role,
        },
      },
    });
  }),
);

// POST /api/auth/login - Login with username & password
router.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    const validatedData = loginSchema.parse(req.body);
    const { username, password } = validatedData;

    // Find user in database
    const { data: user, error } = await supabase
      .from("users")
      .select("id, username, password_hash, role")
      .eq("username", username)
      .single();

    if (error || !user) {
      throw new AppError("Invalid username or password", 401);
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new AppError("Invalid username or password", 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as string } as jwt.SignOptions,
    );

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      },
    });
  }),
);

// GET /api/auth/verify - Verify token
router.get(
  "/verify",
  asyncHandler(async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("No token provided", 401);
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as {
        id: string;
        username: string;
        role: string;
        iat: number;
        exp: number;
      };

      res.status(200).json({
        status: "success",
        message: "Token is valid",
        data: {
          id: decoded.id,
          username: decoded.username,
          role: decoded.role,
          expiresAt: new Date(decoded.exp * 1000).toISOString(),
        },
      });
    } catch (error) {
      throw new AppError("Invalid or expired token", 401);
    }
  }),
);

// POST /api/auth/refresh - Refresh token (allows expired tokens within grace period)
router.post(
  "/refresh",
  asyncHandler(async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("No token provided", 401);
    }

    const token = authHeader.split(" ")[1];

    try {
      // Try to verify with ignoreExpiration to allow recently expired tokens
      const decoded = jwt.verify(token, env.JWT_SECRET, {
        ignoreExpiration: true,
      }) as {
        id: string;
        username: string;
        role: string;
        exp?: number;
      };

      // Check if token is expired and by how much (grace period: 7 days)
      if (decoded.exp) {
        const now = Math.floor(Date.now() / 1000);
        const expiredTime = now - decoded.exp;
        const gracePeriod = 7 * 24 * 60 * 60; // 7 days in seconds

        if (expiredTime > gracePeriod) {
          throw new AppError(
            "Token expired beyond grace period. Please login again.",
            401,
          );
        }
      }

      // Verify user still exists in database
      const { data: user, error } = await supabase
        .from("users")
        .select("id, username, role")
        .eq("id", decoded.id)
        .single();

      if (error || !user) {
        throw new AppError("User not found. Please login again.", 401);
      }

      // Generate new token
      const newToken = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN as string } as jwt.SignOptions,
      );

      res.status(200).json({
        status: "success",
        message: "Token refreshed successfully",
        data: {
          token: newToken,
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
          },
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Invalid token. Please login again.", 401);
    }
  }),
);

export default router;
