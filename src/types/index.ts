// Database Models
export interface User {
  id: string;
  username: string;
  password_hash: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  icon?: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
  company_logo?: string;
  location?: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  full_description: string;
  my_role: string;
  image: string;
  tags: string[];
  link?: string;
  github?: string;
  demo_video?: string;
  status: "completed" | "in-progress" | "planned";
  featured: boolean;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// API Request Types
export interface CreateSkillRequest {
  name: string;
  level: number;
  category: string;
  icon?: string;
  order_index?: number;
  is_published?: boolean;
}

export interface UpdateSkillRequest {
  name?: string;
  level?: number;
  category?: string;
  icon?: string;
  order_index?: number;
  is_published?: boolean;
}

export interface CreateExperienceRequest {
  role: string;
  company: string;
  period: string;
  description: string[];
  company_logo?: string;
  location?: string;
  order_index?: number;
  is_published?: boolean;
}

export interface UpdateExperienceRequest {
  role?: string;
  company?: string;
  period?: string;
  description?: string[];
  company_logo?: string;
  location?: string;
  order_index?: number;
  is_published?: boolean;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  full_description: string;
  my_role: string;
  image: string;
  tags: string[];
  link?: string;
  github?: string;
  demo_video?: string;
  status?: "completed" | "in-progress" | "planned";
  featured?: boolean;
  order_index?: number;
  is_published?: boolean;
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
  full_description?: string;
  my_role?: string;
  image?: string;
  tags?: string[];
  link?: string;
  github?: string;
  demo_video?: string;
  status?: "completed" | "in-progress" | "planned";
  featured?: boolean;
  order_index?: number;
  is_published?: boolean;
}

export interface CreateContactMessageRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
}
