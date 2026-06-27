# HackConnect - Hackathon Discovery & Team Collaboration Platform

A full-stack Next.js application that connects developers for hackathons, team formation, and project collaboration.

## Features

- 🔍 **Hackathon Discovery**: Browse and filter hackathons by status, type, and themes
- 👥 **Team Formation**: Create teams, find teammates, and join existing teams
- 💬 **Real-time Messaging**: Team communication and collaboration
- 📱 **User Profiles**: Showcase skills, projects, and hackathon participation
- 🏆 **Project Showcase**: Display hackathon projects with links to code and demos
- 🎯 **Smart Filtering**: Find hackathons and teams based on preferences

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- A Supabase account

### 1. Clone and Install

\`\`\`bash
git clone <your-repo-url>
cd hackconnect-platform
npm install
\`\`\`

### 2. Database Setup

1. Create a new project in [Supabase](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL scripts in order:
   - First run `scripts/01-create-tables.sql`
   - Then run `scripts/02-seed-data.sql`

### 3. Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
\`\`\`

You can find these values in your Supabase project settings under "API".

### 4. Run the Application

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Troubleshooting

### "Failed to execute 'json' on 'Response'" Error

This error occurs when the API returns HTML instead of JSON, usually due to:

1. **Missing Environment Variables**
   - Ensure `.env.local` exists in your project root
   - Check that all required variables are set:
     \`\`\`env
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
     \`\`\`

2. **Database Not Set Up**
   - Run the SQL scripts in your Supabase dashboard
   - Ensure tables are created successfully

3. **Debug Steps**
   - Visit `/debug` page to check system health
   - Check browser console for detailed error messages
   - Verify Supabase project is active and accessible

### Common Issues

- **500 Internal Server Error**: Usually environment variables or database connection
- **404 Not Found**: Check that API routes are properly deployed
- **CORS Errors**: Ensure Supabase project allows your domain

### Getting Help

1. Check the `/debug` page for system status
2. Look at browser console for detailed errors
3. Verify Supabase dashboard shows your project is active
4. Ensure you've run both SQL scripts in order

## API Endpoints

### Hackathons
- `GET /api/hackathons` - List hackathons with filtering
- `GET /api/hackathons/[id]` - Get hackathon details
- `POST /api/hackathons/[id]/join` - Join a hackathon

### Teams
- `GET /api/teams` - List teams with filtering
- `POST /api/teams` - Create a new team
- `POST /api/teams/[id]/join` - Join a team

### Messages
- `GET /api/messages?team_id=...` - Get team messages
- `POST /api/messages` - Send a message

### Users
- `GET /api/users` - List users
- `GET /api/users/[id]` - Get user profile
- `POST /api/users` - Create user
- `PUT /api/users/[id]` - Update user

### Projects
- `GET /api/projects` - List projects with filtering
- `POST /api/projects` - Create a project

## Database Schema

### Core Tables
- **users**: User profiles and authentication
- **hackathons**: Hackathon events and details
- **teams**: Team information and metadata
- **team_members**: Team membership relationships
- **hackathon_participants**: Hackathon participation tracking
- **projects**: User/team projects and submissions
- **messages**: Team communication

## Key Features Explained

### Hackathon Discovery
- Filter by status (upcoming, ongoing, past)
- Filter by type (online, in-person, hybrid)
- View participant counts and themes
- One-click joining

### Team Formation
- Create teams for specific hackathons
- Set required skills and team size
- Browse available teams
- Join teams with available spots

### Messaging System
- Team-based chat rooms
- Real-time message display
- User identification in messages

### User Profiles
- Skill showcase with visual indicators
- Project portfolio with hackathon links
- Hackathon participation history
- Editable profile information

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Demo Users

The seeded database includes these demo users:
- Dev Dharrshan (dev.dharrshan@example.com)
- Divya Dharshini (divya.dharshini@example.com)
- Divakar (divakar@example.com)
- Hemapriya (hemapriya@example.com)
- Anusree (anusree@example.com)
- Bharani (bharani@example.com)

## License

MIT License - see LICENSE file for details.
