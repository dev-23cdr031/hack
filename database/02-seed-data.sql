-- Insert sample users
INSERT INTO users (id, email, name, title, bio, skills, avatar_url) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'dev.dharrshan@example.com', 'Dev Dharrshan', 'Full Stack Developer', 'Passionate about building innovative solutions through code.', '["JavaScript", "React", "Node.js", "Python"]', 'https://xsgames.co/randomusers/avatar.php?g=male&id=dev'),
('550e8400-e29b-41d4-a716-446655440002', 'divya.dharshini@example.com', 'Divya Dharshini', 'UI/UX Designer & Frontend Developer', 'Creating beautiful and functional user experiences.', '["React", "TypeScript", "Figma", "CSS"]', 'https://xsgames.co/randomusers/avatar.php?g=female&id=divya'),
('550e8400-e29b-41d4-a716-446655440003', 'divakar@example.com', 'Divakar', 'Backend Developer & DevOps', 'Building scalable systems and infrastructure.', '["Python", "Docker", "AWS", "PostgreSQL"]', 'https://xsgames.co/randomusers/avatar.php?g=male&id=divakar'),
('550e8400-e29b-41d4-a716-446655440004', 'hemapriya@example.com', 'Hemapriya', 'Data Scientist', 'Turning data into insights and intelligent solutions.', '["Python", "TensorFlow", "Data Science", "Machine Learning"]', 'https://xsgames.co/randomusers/avatar.php?g=female&id=hemapriya'),
('550e8400-e29b-41d4-a716-446655440005', 'anusree@example.com', 'Anusree', 'Mobile Developer', 'Creating amazing mobile experiences.', '["React Native", "Flutter", "iOS", "Android"]', 'https://xsgames.co/randomusers/avatar.php?g=female&id=anusree'),
('550e8400-e29b-41d4-a716-446655440006', 'bharani@example.com', 'Bharani', 'Blockchain Developer', 'Building the future with Web3 technologies.', '["Solidity", "Web3.js", "Ethereum", "Smart Contracts"]', 'https://xsgames.co/randomusers/avatar.php?g=male&id=bharani');

-- Insert sample hackathons
INSERT INTO hackathons (id, title, description, image_url, start_date, end_date, location, type, themes, max_participants, current_participants, status) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Global AI Challenge', 'Build innovative AI solutions that can change the world. Focus on machine learning, computer vision, and natural language processing.', '/placeholder.svg?height=400&width=600', '2024-03-15 09:00:00+00', '2024-03-17 18:00:00+00', 'Online', 'online', '["Artificial Intelligence", "Machine Learning", "Computer Vision"]', 500, 124, 'upcoming'),
('660e8400-e29b-41d4-a716-446655440002', 'Web3 Buildathon', 'Create the next generation of decentralized applications. Build on blockchain, explore DeFi, and innovate with smart contracts.', '/placeholder.svg?height=400&width=600', '2024-04-05 10:00:00+00', '2024-04-07 20:00:00+00', 'San Francisco, CA', 'in-person', '["Blockchain", "Smart Contracts", "DeFi"]', 200, 89, 'upcoming'),
('660e8400-e29b-41d4-a716-446655440003', 'CodeFest 2024', 'The ultimate coding competition. Build web apps, mobile apps, and showcase your development skills.', '/placeholder.svg?height=400&width=600', '2024-05-10 08:00:00+00', '2024-05-12 22:00:00+00', 'New York + Online', 'hybrid', '["Web Development", "Mobile Apps", "Cloud"]', 300, 156, 'upcoming'),
('660e8400-e29b-41d4-a716-446655440004', 'Social Impact Hack', 'Use technology to solve real-world problems and create positive social impact.', '/placeholder.svg?height=400&width=600', '2024-02-20 09:00:00+00', '2024-02-22 18:00:00+00', 'Online', 'online', '["Social Good", "Education", "Healthcare"]', 400, 234, 'past');

-- Insert sample teams
INSERT INTO teams (id, name, description, hackathon_id, leader_id, max_members, current_members, skills_needed, status) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Quantum Coders', 'Building AI solutions for medical diagnosis', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 5, 4, '["Python", "TensorFlow", "Data Science"]', 'active'),
('770e8400-e29b-41d4-a716-446655440002', 'Blockchain Builders', 'Creating sustainable blockchain solutions', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440006', 4, 2, '["Solidity", "React", "Web3.js"]', 'forming'),
('770e8400-e29b-41d4-a716-446655440003', 'Code Warriors', 'Full-stack web application development', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 6, 3, '["React", "Node.js", "MongoDB"]', 'forming'),
('770e8400-e29b-41d4-a716-446655440004', 'AI Innovators', 'Completed project for Social Impact Hack', '660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 4, 4, '["Python", "Machine Learning", "React"]', 'completed');

-- Insert team members
INSERT INTO team_members (team_id, user_id, role) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'leader'),
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'member'),
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'member'),
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'member'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440006', 'leader'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'member'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'leader'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'member'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'member'),
-- AI Innovators team (completed)
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'leader'),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'member'),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', 'member'),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440007', 'member');

-- Insert hackathon participants
INSERT INTO hackathon_participants (hackathon_id, user_id, team_id) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440002'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440002');

-- Insert sample projects
INSERT INTO projects (id, title, description, image_url, github_url, demo_url, hackathon_id, team_id, user_id, technologies) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'MediScan AI', 'An AI-powered medical scan analyzer that helps detect abnormalities in X-ray images with 92% accuracy.', '/placeholder.svg?height=400&width=600', 'https://github.com/example/mediscan-ai', 'https://mediscan-ai.demo.com', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '["Python", "TensorFlow", "OpenCV", "React"]'),
('880e8400-e29b-41d4-a716-446655440002', 'EcoChain', 'Blockchain solution for carbon credit tracking and transparent sustainability reporting.', '/placeholder.svg?height=400&width=600', 'https://github.com/example/ecochain', 'https://ecochain.demo.com', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440006', '["Solidity", "React", "Web3.js", "Node.js"]'),
('880e8400-e29b-41d4-a716-446655440003', 'CodeMentor', 'Interactive platform connecting coding mentors with students in underserved communities.', '/placeholder.svg?height=400&width=600', 'https://github.com/example/codementor', 'https://codementor.demo.com', '660e8400-e29b-41d4-a716-446655440004', NULL, '550e8400-e29b-41d4-a716-446655440002', '["React", "Node.js", "PostgreSQL", "Socket.io"]');

-- Create calls table for audio/video calling
CREATE TABLE IF NOT EXISTS calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    caller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    call_type VARCHAR(10) NOT NULL CHECK (call_type IN ('audio', 'video')),
    status VARCHAR(20) NOT NULL DEFAULT 'initiated' CHECK (status IN ('initiated', 'ringing', 'answered', 'declined', 'ended', 'failed')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    answered_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversation_participants table for messaging
CREATE TABLE IF NOT EXISTS conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(conversation_id, user_id)
);

-- Insert sample messages
INSERT INTO messages (content, sender_id, team_id) VALUES
('Team, I''ve completed the API integration. Can you test the UI components with these endpoints?', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001'),
('Thanks Dev. I''ll verify the database connection and get back to you.', '550e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001'),
('Great work everyone! The AI model is showing promising results.', '550e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440001'),
('UI components are ready for testing. Let me know if you need any adjustments.', '550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001');

-- Insert sample calls
INSERT INTO calls (caller_id, receiver_id, team_id, call_type, status, started_at, ended_at, duration_seconds) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', 'audio', 'ended', '2024-02-15 10:00:00+00', '2024-02-15 10:05:30+00', 330),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'video', 'ended', '2024-02-15 11:30:00+00', '2024-02-15 11:45:15+00', 915),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440003', 'audio', 'declined', '2024-02-15 14:20:00+00', NULL, 0);

-- Insert conversation participants for team conversations
INSERT INTO conversation_participants (conversation_id, user_id) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'),
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003'),
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440006'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004');
