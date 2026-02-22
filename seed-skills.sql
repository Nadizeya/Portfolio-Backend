-- ================================================
-- Sample Skills Data with React Icons
-- ================================================
-- This file inserts 16 sample skills (4 per category)
-- using React Icons for consistent styling
-- Run this in your Supabase SQL Editor

-- ================================================
-- FRONTEND SKILLS (4)
-- ================================================

INSERT INTO skills (name, level, category, icon, order_index, is_published) VALUES
  ('React', 95, 'Frontend', 'FaReact', 1, true),
  ('TypeScript', 90, 'Frontend', 'SiTypescript', 2, true),
  ('Next.js', 85, 'Frontend', 'SiNextdotjs', 3, true),
  ('Tailwind CSS', 88, 'Frontend', 'SiTailwindcss', 4, true);

-- ================================================
-- BACKEND SKILLS (4)
-- ================================================

INSERT INTO skills (name, level, category, icon, order_index, is_published) VALUES
  ('Node.js', 92, 'Backend', 'FaNodeJs', 5, true),
  ('PostgreSQL', 85, 'Backend', 'SiPostgresql', 6, true),
  ('Express', 88, 'Backend', 'SiExpress', 7, true),
  ('Python', 80, 'Backend', 'FaPython', 8, true);

-- ================================================
-- TOOLS (4)
-- ================================================

INSERT INTO skills (name, level, category, icon, order_index, is_published) VALUES
  ('Git', 90, 'Tools', 'FaGitAlt', 9, true),
  ('Docker', 75, 'Tools', 'FaDocker', 10, true),
  ('VS Code', 95, 'Tools', 'SiVisualstudiocode', 11, true),
  ('GitHub', 88, 'Tools', 'FaGithub', 12, true);

-- ================================================
-- AI SKILLS (4)
-- ================================================

INSERT INTO skills (name, level, category, icon, order_index, is_published) VALUES
  ('OpenAI', 85, 'AI', 'SiOpenai', 13, true),
  ('TensorFlow', 70, 'AI', 'SiTensorflow', 14, true),
  ('Gemini API', 82, 'AI', 'SiGooglegemini', 15, true),
  ('PyTorch', 75, 'AI', 'SiPytorch', 16, true);

-- ================================================
-- VERIFY YOUR DATA
-- ================================================
-- Run this to check your skills:

-- SELECT 
--   name,
--   category,
--   level,
--   icon,
--   is_published,
--   order_index
-- FROM skills
-- ORDER BY order_index;

-- ================================================
-- CLEANUP (Optional)
-- ================================================
-- If you want to remove all skills and start fresh:

-- DELETE FROM skills;

-- ================================================
-- DONE! 🎉
-- ================================================
-- You now have 16 skills across 4 categories
-- All use React Icons for consistent display
-- Visit your portfolio to see them in action!
