import { z } from "zod";

// Skill Validation Schemas
export const createSkillSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  level: z.number().min(0).max(100, "Level must be between 0 and 100"),
  category: z.string().min(1, "Category is required").max(50),
  icon: z.string().max(500).optional(), // Can be URL or react-icon name (e.g., 'FaReact')
  order_index: z.number().int().default(0),
  is_published: z.boolean().default(true),
});

export const updateSkillSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  level: z.number().min(0).max(100).optional(),
  category: z.string().min(1).max(50).optional(),
  icon: z.string().max(500).optional(), // Can be URL or react-icon name
  order_index: z.number().int().optional(),
  is_published: z.boolean().optional(),
});

// Experience Validation Schemas
export const createExperienceSchema = z.object({
  role: z.string().min(1, "Role is required").max(255),
  company: z.string().min(1, "Company is required").max(255),
  period: z.string().min(1, "Period is required").max(100),
  description: z
    .array(z.string())
    .min(1, "At least one description is required"),
  company_logo: z.string().url("Company logo must be a valid URL").optional(),
  location: z.string().max(255).optional(),
  order_index: z.number().int().default(0),
  is_published: z.boolean().default(true),
});

export const updateExperienceSchema = z.object({
  role: z.string().min(1).max(255).optional(),
  company: z.string().min(1).max(255).optional(),
  period: z.string().min(1).max(100).optional(),
  description: z.array(z.string()).optional(),
  company_logo: z.string().url().optional(),
  location: z.string().max(255).optional(),
  order_index: z.number().int().optional(),
  is_published: z.boolean().optional(),
});

// Project Validation Schemas
export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Description is required"),
  full_description: z.string().min(1, "Full description is required"),
  my_role: z.string().min(1, "My role is required"),
  image: z.string().url("Image must be a valid URL"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  link: z.string().url("Link must be a valid URL").optional(),
  github: z.string().url("GitHub must be a valid URL").optional(),
  demo_video: z.string().url("Demo video must be a valid URL").optional(),
  status: z.enum(["completed", "in-progress", "planned"]).default("completed"),
  featured: z.boolean().default(false),
  order_index: z.number().int().default(0),
  is_published: z.boolean().default(true),
});

export const updateProjectSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  full_description: z.string().min(1).optional(),
  my_role: z.string().min(1).optional(),
  image: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  link: z.string().url().optional(),
  github: z.string().url().optional(),
  demo_video: z.string().url().optional(),
  status: z.enum(["completed", "in-progress", "planned"]).optional(),
  featured: z.boolean().optional(),
  order_index: z.number().int().optional(),
  is_published: z.boolean().optional(),
});

// Contact Message Validation Schema
export const createContactMessageSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email address").max(255),
  subject: z.string().max(255).optional(),
  message: z.string().min(1, "Message is required"),
});

// Authentication Validation Schemas
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(100),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
