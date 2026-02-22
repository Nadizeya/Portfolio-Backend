import { Router, Request, Response } from "express";
import { supabase } from "../config/supabase";
import { asyncHandler, AppError, authenticate } from "../middleware";
import { createProjectSchema, updateProjectSchema } from "../validations";

const router = Router();

// GET /api/projects - Get all projects (with optional filters)
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { is_published, featured, status } = req.query;

    let query = supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true });

    if (is_published !== undefined) {
      query = query.eq("is_published", is_published === "true");
    }

    if (featured !== undefined) {
      query = query.eq("featured", featured === "true");
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      throw new AppError(error.message, 500);
    }

    res.status(200).json({
      status: "success",
      count: data?.length || 0,
      data: data,
    });
  }),
);

// GET /api/projects/:id - Get single project by ID
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new AppError("Project not found", 404);
    }

    res.status(200).json({
      status: "success",
      data: data,
    });
  }),
);

// POST /api/projects - Create new project (Protected)
router.post(
  "/",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createProjectSchema.parse(req.body);

    const { data, error } = await supabase
      .from("projects")
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      throw new AppError(error.message, 400);
    }

    res.status(201).json({
      status: "success",
      message: "Project created successfully",
      data: data,
    });
  }),
);

// PUT /api/projects/:id - Update project by ID (Protected)
router.put(
  "/:id",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const validatedData = updateProjectSchema.parse(req.body);

    if (Object.keys(validatedData).length === 0) {
      throw new AppError("No data provided for update", 400);
    }

    const { data, error } = await supabase
      .from("projects")
      .update(validatedData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new AppError("Project not found or update failed", 404);
    }

    res.status(200).json({
      status: "success",
      message: "Project updated successfully",
      data: data,
    });
  }),
);

// DELETE /api/projects/:id - Delete project by ID (Protected)
router.delete(
  "/:id",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      throw new AppError("Project not found or delete failed", 404);
    }

    res.status(200).json({
      status: "success",
      message: "Project deleted successfully",
    });
  }),
);

// PATCH /api/projects/:id/toggle-publish - Toggle publish status (Protected)
router.patch(
  "/:id/toggle-publish",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const { data: current, error: fetchError } = await supabase
      .from("projects")
      .select("is_published")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw new AppError("Project not found", 404);
    }

    const { data, error } = await supabase
      .from("projects")
      .update({ is_published: !current.is_published })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new AppError("Failed to toggle publish status", 500);
    }

    res.status(200).json({
      status: "success",
      message: `Project ${data.is_published ? "published" : "unpublished"} successfully`,
      data: data,
    });
  }),
);

// PATCH /api/projects/:id/toggle-featured - Toggle featured status (Protected)
router.patch(
  "/:id/toggle-featured",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const { data: current, error: fetchError } = await supabase
      .from("projects")
      .select("featured")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw new AppError("Project not found", 404);
    }

    const { data, error } = await supabase
      .from("projects")
      .update({ featured: !current.featured })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new AppError("Failed to toggle featured status", 500);
    }

    res.status(200).json({
      status: "success",
      message: `Project ${data.featured ? "featured" : "unfeatured"} successfully`,
      data: data,
    });
  }),
);

export default router;
