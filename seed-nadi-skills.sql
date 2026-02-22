-- ================================================
-- Nadi.dev Skills Data - Complete Tech Stack
-- ================================================
-- This file inserts all skills from resume
-- Using React Icons for consistent styling
-- Run this in your Supabase SQL Editor
-- ================================================

-- CLEANUP: Remove existing skills (optional - uncomment if needed)
-- DELETE FROM skills;

-- ================================================
-- FRONTEND SKILLS (9)
-- ================================================

INSERT INTO skills (name, level, category, icon, order_index, is_published) VALUES
  ('React.js', 95, 'Frontend', 'FaReact', 1, true),
  ('React Native', 88, 'Frontend', 'FaReact', 2, true),
  ('Next.js', 92, 'Frontend', 'SiNextdotjs', 3, true),
  ('Phoenix LiveView', 80, 'Frontend', 'SiPhoenixframework', 4, true),
  ('TypeScript', 93, 'Frontend', 'SiTypescript', 5, true),
  ('Redux', 87, 'Frontend', 'SiRedux', 6, true),
  ('TanStack', 85, 'Frontend', 'SiReactquery', 7, true),
  ('Tailwind CSS', 95, 'Frontend', 'SiTailwindcss', 8, true),
  ('ShadCN', 90, 'Frontend', 'SiShadcnui', 9, true);

-- ================================================
-- BACKEND SKILLS (10 - Will display in 2 columns)
-- ================================================

INSERT INTO skills (name, level, category, icon, order_index, is_published) VALUES
  ('Java', 85, 'Backend', 'FaJava', 10, true),
  ('Spring Boot', 83, 'Backend', 'SiSpringboot', 11, true),
  ('Java SE', 85, 'Backend', 'FaJava', 12, true),
  ('Node.js', 95, 'Backend', 'FaNodeJs', 13, true),
  ('Express', 93, 'Backend', 'SiExpress', 14, true),
  ('NestJS', 88, 'Backend', 'SiNestjs', 15, true),
  ('Elixir', 82, 'Backend', 'SiElixir', 16, true),
  ('Phoenix', 80, 'Backend', 'SiPhoenixframework', 17, true),
  ('Python', 87, 'Backend', 'FaPython', 18, true),
  ('FastAPI', 85, 'Backend', 'SiFastapi', 19, true);

-- ================================================
-- DATABASE SKILLS (7)
-- ================================================

INSERT INTO skills (name, level, category, icon, order_index, is_published) VALUES
  ('MySQL', 88, 'Database', 'SiMysql', 20, true),
  ('PostgreSQL', 92, 'Database', 'SiPostgresql', 21, true),
  ('Supabase', 90, 'Database', 'SiSupabase', 22, true),
  ('Firebase', 87, 'Database', 'SiFirebase', 23, true),
  ('MongoDB', 85, 'Database', 'SiMongodb', 24, true),
  ('Prisma', 88, 'Database', 'SiPrisma', 25, true),
  ('Drizzle ORM', 83, 'Database', 'SiDrizzle', 26, true);

-- ================================================
-- TOOLS & DEVOPS (7)
-- ================================================

INSERT INTO skills (name, level, category, icon, order_index, is_published) VALUES
  ('Git', 95, 'Tools', 'FaGitAlt', 27, true),
  ('Docker', 85, 'Tools', 'FaDocker', 28, true),
  ('Postman', 90, 'Tools', 'SiPostman', 29, true),
  ('RESTful API', 93, 'Tools', 'SiOpenapiinitiative', 30, true),
  ('Google Cloud', 82, 'Tools', 'SiGooglecloud', 31, true),
  ('Digital Ocean', 80, 'Tools', 'SiDigitalocean', 32, true),
  ('Gemini API', 88, 'Tools', 'SiGooglegemini', 33, true);

-- ================================================
-- VERIFY YOUR DATA
-- ================================================
-- Run this to check your skills grouped by category:

SELECT 
  category,
  COUNT(*) as skill_count,
  ROUND(AVG(level), 2) as avg_level
FROM skills
GROUP BY category
ORDER BY category;

-- To see all skills in order:
SELECT 
  name,
  category,
  level,
  icon,
  order_index
FROM skills
ORDER BY order_index;

-- ================================================
-- STATISTICS
-- ================================================
-- Total Skills: 33
-- Frontend: 9 skills
-- Backend: 10 skills (displays in 2 columns)
-- Database: 7 skills
-- Tools: 7 skills
-- ================================================
-- DONE! 🎉
-- ================================================
-- All skills from Nadi.dev's resume have been added!
-- They will appear in your portfolio automatically.
