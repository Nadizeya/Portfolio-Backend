import { Router, Request, Response } from "express";
import { supabase } from "../config/supabase";
import { asyncHandler, AppError, authenticate } from "../middleware";
import { upload } from "../middleware/upload";
import { createSkillSchema, updateSkillSchema } from "../validations";
import { Skill } from "../types";
import path from "path";
import fs from "fs";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

const router = Router();

// GET /api/skills - Get all skills (with optional filters)
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { category, is_published } = req.query;

    let query = supabase
      .from("skills")
      .select("*")
      .order("order_index", { ascending: true });

    if (category) {
      query = query.eq("category", category);
    }

    if (is_published !== undefined) {
      query = query.eq("is_published", is_published === "true");
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

// GET /api/skills/:id - Get single skill by ID
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new AppError("Skill not found", 404);
    }

    res.status(200).json({
      status: "success",
      data: data,
    });
  }),
);

// POST /api/skills - Create new skill (Protected)
router.post(
  "/",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createSkillSchema.parse(req.body);

    const { data, error } = await supabase
      .from("skills")
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      throw new AppError(error.message, 400);
    }

    res.status(201).json({
      status: "success",
      message: "Skill created successfully",
      data: data,
    });
  }),
);

// POST /api/skills/with-icon - Create skill with icon upload (Protected)
router.post(
  "/with-icon",
  authenticate,
  upload.single("icon"),
  asyncHandler(async (req: Request, res: Response) => {
    console.log("[Skills] Creating skill with icon", {
      body: req.body,
      file: req.file
        ? { name: req.file.originalname, size: req.file.size }
        : null,
    });

    // Parse the skill data from form fields
    const skillData = {
      name: req.body.name,
      level: parseInt(req.body.level),
      category: req.body.category,
      order_index: req.body.order_index ? parseInt(req.body.order_index) : 0,
      is_published:
        req.body.is_published === "true" || req.body.is_published === true,
    };

    // Validate the skill data without icon
    const baseSchema = createSkillSchema.omit({ icon: true });
    const validatedData = baseSchema.parse(skillData);

    let iconUrl: string | undefined;

    // Save icon to local public folder if provided
    if (req.file) {
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

      // Generate URL path (relative to server)
      iconUrl = `/public/icons/${filename}`;
    }

    // Insert skill with icon URL
    const { data, error } = await supabase
      .from("skills")
      .insert([{ ...validatedData, icon: iconUrl }])
      .select()
      .single();

    if (error) {
      throw new AppError(error.message, 400);
    }

    res.status(201).json({
      status: "success",
      message: "Skill created successfully with icon",
      data: data,
    });
  }),
);

// PUT /api/skills/:id - Update skill by ID (Protected)
router.put(
  "/:id",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const validatedData = updateSkillSchema.parse(req.body);

    if (Object.keys(validatedData).length === 0) {
      throw new AppError("No data provided for update", 400);
    }

    const { data, error } = await supabase
      .from("skills")
      .update(validatedData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new AppError("Skill not found or update failed", 404);
    }

    res.status(200).json({
      status: "success",
      message: "Skill updated successfully",
      data: data,
    });
  }),
);

// PUT /api/skills/:id/with-icon - Update skill with icon upload (Protected)
router.put(
  "/:id/with-icon",
  authenticate,
  upload.single("icon"),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    console.log("[Skills] Updating skill with icon", {
      id,
      body: req.body,
      file: req.file
        ? { name: req.file.originalname, size: req.file.size }
        : null,
    });

    // Parse the skill data from form fields
    const skillData: any = {};

    if (req.body.name) skillData.name = req.body.name;
    if (req.body.level) skillData.level = parseInt(req.body.level);
    if (req.body.category) skillData.category = req.body.category;
    if (req.body.order_index !== undefined)
      skillData.order_index = parseInt(req.body.order_index);
    if (req.body.is_published !== undefined) {
      skillData.is_published =
        req.body.is_published === "true" || req.body.is_published === true;
    }

    // Validate the skill data
    const validatedData: any = updateSkillSchema
      .omit({ icon: true })
      .parse(skillData);

    // Upload new icon to local folder if provided
    if (req.file) {
      // Get the old icon first to potentially delete it
      const { data: oldSkill } = await supabase
        .from("skills")
        .select("icon")
        .eq("id", id)
        .single();

      // Save new icon
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
      validatedData.icon = `/public/icons/${filename}`;

      // Delete old icon file if it exists
      if (oldSkill?.icon && oldSkill.icon.startsWith("/public/icons/")) {
        try {
          const oldFilePath = path.join(__dirname, "../..", oldSkill.icon);
          if (fs.existsSync(oldFilePath)) {
            await unlink(oldFilePath);
          }
        } catch (err) {
          // Ignore deletion errors
          console.error("Failed to delete old icon:", err);
        }
      }
    }

    if (Object.keys(validatedData).length === 0) {
      throw new AppError("No data provided for update", 400);
    }

    const { data, error } = await supabase
      .from("skills")
      .update(validatedData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new AppError("Skill not found or update failed", 404);
    }

    res.status(200).json({
      status: "success",
      message: "Skill updated successfully",
      data: data,
    });
  }),
);

// DELETE /api/skills/:id - Delete skill by ID (Protected)
router.delete(
  "/:id",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const { error } = await supabase.from("skills").delete().eq("id", id);

    if (error) {
      throw new AppError("Skill not found or delete failed", 404);
    }

    res.status(200).json({
      status: "success",
      message: "Skill deleted successfully",
    });
  }),
);

// PATCH /api/skills/:id/toggle-publish - Toggle publish status (Protected)
router.patch(
  "/:id/toggle-publish",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // First get the current status
    const { data: current, error: fetchError } = await supabase
      .from("skills")
      .select("is_published")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw new AppError("Skill not found", 404);
    }

    // Toggle the status
    const { data, error } = await supabase
      .from("skills")
      .update({ is_published: !current.is_published })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new AppError("Failed to toggle publish status", 500);
    }

    res.status(200).json({
      status: "success",
      message: `Skill ${data.is_published ? "published" : "unpublished"} successfully`,
      data: data,
    });
  }),
);

export default router;
