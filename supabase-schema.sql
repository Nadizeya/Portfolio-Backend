-- ================================================
-- Portfolio Backend - Supabase Schema
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- USERS TABLE (Admin Authentication)
-- ================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- SKILLS TABLE
-- ================================================
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  level INTEGER NOT NULL CHECK (level >= 0 AND level <= 100),
  category VARCHAR(50) NOT NULL,
  icon VARCHAR(255), -- Optional: for skill icon URLs
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- EXPERIENCES TABLE
-- ================================================
CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  period VARCHAR(100) NOT NULL,
  description TEXT[] NOT NULL, -- Array of strings
  company_logo VARCHAR(255), -- Optional: company logo URL
  location VARCHAR(255), -- Optional: job location
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- PROJECTS TABLE
-- ================================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  my_role TEXT NOT NULL,
  image VARCHAR(500) NOT NULL,
  tags TEXT[] NOT NULL, -- Array of strings
  link VARCHAR(500),
  github VARCHAR(500),
  demo_video VARCHAR(500), -- Optional: demo video URL
  status VARCHAR(50) DEFAULT 'completed', -- completed, in-progress, planned
  featured BOOLEAN DEFAULT false, -- For highlighting special projects
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- CONTACT MESSAGES TABLE (Bonus: for contact form)
-- ================================================
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- INDEXES for better query performance
-- ================================================
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_published ON skills(is_published);
CREATE INDEX idx_experiences_published ON experiences(is_published);
CREATE INDEX idx_projects_published ON projects(is_published);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_contact_messages_read ON contact_messages(is_read);

-- ================================================
-- FUNCTIONS: Auto-update updated_at timestamp
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- TRIGGERS: Apply auto-update to all tables
-- ================================================
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- SEED DATA: Insert your existing data
-- ================================================

-- Insert Skills
INSERT INTO skills (name, level, category, order_index) VALUES
  ('React', 95, 'Frontend', 1),
  ('TypeScript', 90, 'Frontend', 2),
  ('Next.js', 85, 'Frontend', 3),
  ('Tailwind CSS', 95, 'Frontend', 4),
  ('Node.js', 80, 'Backend', 5),
  ('PostgreSQL', 75, 'Backend', 6),
  ('GraphQL', 80, 'Backend', 7),
  ('Docker', 70, 'Tools', 8),
  ('AWS', 65, 'Tools', 9),
  ('Gemini API', 85, 'AI', 10),
  ('Python', 75, 'Backend', 11);

-- Insert Experiences
INSERT INTO experiences (role, company, period, description, order_index) VALUES
  (
    'Senior Frontend Engineer',
    'TechFlow Systems',
    '2022 - Present',
    ARRAY[
      'Architected and led the development of a next-gen dashboard using React 18 and Vite.',
      'Reduced initial bundle size by 40% through code splitting and asset optimization.',
      'Mentored 5 junior developers and implemented standardized code review processes.'
    ],
    1
  ),
  (
    'Full Stack Developer',
    'Creative Pixel Agency',
    '2020 - 2022',
    ARRAY[
      'Delivered 15+ custom web applications for high-profile clients.',
      'Integrated real-time features using WebSockets for a collaborative workspace tool.',
      'Optimized database queries in PostgreSQL, improving API response times by 30%.'
    ],
    2
  );

-- Insert Projects
INSERT INTO projects (title, description, full_description, my_role, image, tags, link, github, featured, order_index) VALUES
  (
    'AI Productivity Suite',
    'A comprehensive task management tool powered by Gemini for smart scheduling.',
    'This suite serves as a centralized hub for teams to manage tasks while leveraging Large Language Models to automatically categorize, summarize, and prioritize workloads based on natural language input.',
    'I was the lead architect for the AI integration layer. I implemented the real-time streaming response UI and optimized the prompt engineering for task decomposition.',
    'https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=2070&auto=format&fit=crop',
    ARRAY['React', 'Gemini API', 'Tailwind'],
    '#',
    '#',
    true,
    1
  ),
  (
    'Fintech Analytics Dash',
    'Real-time financial monitoring platform with high-performance data visualizations.',
    'A complex dashboard capable of handling thousands of data points per second, providing institutional investors with real-time market sentiment and trade execution metrics.',
    'I developed the custom charting engine using Recharts and D3.js, ensuring 60fps performance even under heavy data loads through advanced memoization techniques.',
    'https://images.unsplash.com/photo-1551288049-bbbda5366391?q=80&w=2070&auto=format&fit=crop',
    ARRAY['TypeScript', 'Recharts', 'Next.js'],
    '#',
    '#',
    true,
    2
  ),
  (
    'EcoSphere E-commerce',
    'Sustainable product marketplace with a custom built-in carbon footprint calculator.',
    'A specialized commerce platform that emphasizes sustainability by showing customers the direct environmental impact of their purchases.',
    'I built the core checkout flow and the carbon footprint calculation engine, integrating with third-party environmental data APIs.',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop',
    ARRAY['Shopify', 'React', 'Node.js'],
    '#',
    '#',
    false,
    3
  );

-- ================================================
-- ROW LEVEL SECURITY (RLS) - Optional but recommended
-- ================================================
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Users table: allow read/write via service role (backend handles auth)
CREATE POLICY "Allow all access to users for service"
  ON users FOR ALL
  USING (true)
  WITH CHECK (true);

-- Public read access to published content
CREATE POLICY "Public read access for published skills"
  ON skills FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public read access for published experiences"
  ON experiences FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public read access for published projects"
  ON projects FOR SELECT
  USING (is_published = true);

-- Anyone can insert contact messages
CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- Note: For admin/authenticated operations (UPDATE, DELETE, INSERT for other tables),
-- you'll need to add policies based on auth.uid() when you implement authentication.

-- ================================================
-- VIEWS: Useful pre-joined queries (optional)
-- ================================================

-- View for frontend: only published items
CREATE VIEW public_portfolio AS
SELECT 
  json_build_object(
    'skills', (SELECT json_agg(row_to_json(s.*)) FROM (SELECT * FROM skills WHERE is_published = true ORDER BY order_index) s),
    'experiences', (SELECT json_agg(row_to_json(e.*)) FROM (SELECT * FROM experiences WHERE is_published = true ORDER BY order_index) e),
    'projects', (SELECT json_agg(row_to_json(p.*)) FROM (SELECT * FROM projects WHERE is_published = true ORDER BY order_index) p)
  ) as portfolio_data;

-- ================================================
-- DONE! 🎉
-- ================================================
-- You can now query your tables like:
-- SELECT * FROM skills;
-- SELECT * FROM experiences;
-- SELECT * FROM projects;
-- SELECT * FROM contact_messages;
