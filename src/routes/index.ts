import { Router } from "express";
import { authenticate } from "../middleware";
import healthRoutes from "./health.routes";
import testRoutes from "./test.routes";
import uploadRoutes from "./upload.routes";
import skillsRoutes from "./skills.routes";
import experiencesRoutes from "./experiences.routes";
import projectsRoutes from "./projects.routes";
import contactRoutes from "./contact.routes";
import authRoutes from "./auth.routes";

const router = Router();

// Public routes - No authentication required
router.use("/api", healthRoutes);
router.use("/api", testRoutes);

// Auth routes - Login endpoint (public)
router.use("/api/auth", authRoutes);

// Protected routes - Authentication required for CUD operations
// Note: GET requests are public, POST/PUT/PATCH/DELETE require authentication
router.use("/api", uploadRoutes); // Protect upload
router.use("/api/skills", skillsRoutes); 
router.use("/api/experiences", experiencesRoutes);
router.use("/api/projects", projectsRoutes);
router.use("/api/contact", contactRoutes);

export default router;
