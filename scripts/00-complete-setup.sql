-- Complete Database Setup for HackConnect Platform
-- Run this script in your Supabase SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  bio TEXT,
  avatar_url TEXT,
  skills JSONB DEFAULT '[]',
  github_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hackathons table
CREATE TABLE IF NOT EXISTS hackathons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255),
  type VARCHAR(50) DEFAULT 'online', -- online, in-person, hybrid
  themes JSONB DEFAULT '[]',
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'upcoming', -- upcoming, ongoing, past
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
  leader_id UUID REFERENCES users(id) ON DELETE CASCADE,
  max_members INTEGER DEFAULT 5,
  current_members INTEGER DEFAULT 1,
  skills_needed JSONB DEFAULT '[]',
  status VARCHAR(50) DEFAULT 'forming', -- forming, active, completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member', -- leader, member
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Create hackathon_participants table
CREATE TABLE IF NOT EXISTS hackathon_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(hackathon_id, user_id)
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  github_url TEXT,
  demo_url TEXT,
  hackathon_id UUID REFERENCES hackathons(id) ON DELETE SET NULL,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  technologies JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create connection_requests table (CRITICAL for public access page)
CREATE TABLE IF NOT EXISTS connection_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending','accepted','ignored')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (sender_id, receiver_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hackathons_status ON hackathons(status);
CREATE INDEX IF NOT EXISTS idx_hackathons_start_date ON hackathons(start_date);
CREATE INDEX IF NOT EXISTS idx_teams_hackathon_id ON teams(hackathon_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_team_id ON messages(team_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_connection_requests_receiver ON connection_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_connection_requests_sender ON connection_requests(sender_id);

-- Insert sample users for public access page
INSERT INTO users (name, email, title, bio, skills, avatar_url, github_url, linkedin_url) VALUES
('Alex Johnson', 'alex@example.com', 'Full Stack Developer', 'Passionate about building scalable web applications and contributing to open source projects.', '["JavaScript", "React", "Node.js", "Python", "PostgreSQL"]', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'https://github.com/alexjohnson', 'https://linkedin.com/in/alexjohnson'),
('Sarah Chen', 'sarah@example.com', 'UI/UX Designer', 'Creating beautiful and intuitive user experiences. Love working on design systems and user research.', '["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems"]', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 'https://github.com/sarahchen', 'https://linkedin.com/in/sarahchen'),
('Mike Rodriguez', 'mike@example.com', 'Data Scientist', 'Machine learning enthusiast with expertise in predictive modeling and data visualization.', '["Python", "TensorFlow", "Pandas", "SQL", "Machine Learning"]', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'https://github.com/mikerodriguez', 'https://linkedin.com/in/mikerodriguez'),
('Emily Davis', 'emily@example.com', 'DevOps Engineer', 'Cloud infrastructure specialist focused on automation, monitoring, and scalable deployments.', '["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"]', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 'https://github.com/emilydavis', 'https://linkedin.com/in/emilydavis'),
('David Kim', 'david@example.com', 'Mobile Developer', 'Building cross-platform mobile apps with React Native and Flutter. Always exploring new mobile technologies.', '["React Native", "Flutter", "iOS", "Android", "Firebase"]', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', 'https://github.com/davidkim', 'https://linkedin.com/in/davidkim'),
('Lisa Wang', 'lisa@example.com', 'Product Manager', 'Bridging the gap between technical teams and business objectives. Passionate about user-centered product development.', '["Product Strategy", "Agile", "User Stories", "Analytics", "Roadmapping"]', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face', 'https://github.com/lisawang', 'https://linkedin.com/in/lisawang');

-- Insert sample hackathons
INSERT INTO hackathons (title, description, start_date, end_date, type, themes, max_participants, current_participants, status) VALUES
('AI Innovation Challenge 2024', 'Build innovative AI solutions for real-world problems', '2024-03-15 09:00:00+00', '2024-03-17 18:00:00+00', 'hybrid', '["Artificial Intelligence", "Machine Learning", "Innovation"]', 200, 45, 'upcoming'),
('Green Tech Hackathon', 'Develop sustainable technology solutions for environmental challenges', '2024-04-01 10:00:00+00', '2024-04-03 20:00:00+00', 'online', '["Sustainability", "Climate Tech", "Green Energy"]', 150, 32, 'upcoming'),
('FinTech Revolution', 'Create the next generation of financial technology', '2024-02-10 08:00:00+00', '2024-02-12 22:00:00+00', 'in-person', '["FinTech", "Blockchain", "Digital Payments"]', 100, 89, 'past');

-- Enable Row Level Security (RLS) for better security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE connection_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access to users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public read access to hackathons" ON hackathons FOR SELECT USING (true);
CREATE POLICY "Allow public read access to teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage connection requests" ON connection_requests FOR ALL USING (true);
