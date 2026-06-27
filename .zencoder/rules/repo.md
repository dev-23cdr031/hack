---
description: Repository Information Overview
alwaysApply: true
---

# HackConnect Platform Information

## Summary
HackConnect is a Next.js-based platform for hackathon team formation, collaboration, and project management. It features real-time messaging, user profiles, team matching, and an AI-powered chatbot assistant built with React and Supabase.

## Structure
- **app/**: Next.js application routes and pages using App Router
- **components/**: React components including UI elements and chatbot
- **lib/**: Core functionality including chat services and Supabase integration
- **public/**: Static assets like images and icons
- **scripts/**: Database setup and seed scripts for Supabase
- **styles/**: Global CSS and Tailwind styling
- **hooks/**: Custom React hooks for state management

## Language & Runtime
**Language**: TypeScript/JavaScript
**Version**: Node.js v18+
**Build System**: Next.js 14
**Package Manager**: npm/pnpm

## Dependencies
**Main Dependencies**:
- Next.js 14.0.4 (App Router)
- React 18+
- Supabase (authentication, database, real-time)
- Shadcn UI components (Radix UI)
- Lucide React icons
- Socket.io for real-time communication
- Express for signaling server

**Development Dependencies**:
- TypeScript 5+
- Tailwind CSS 3.4
- PostCSS 8.5

## Build & Installation
```bash
# Install dependencies
npm install

# Set up environment variables
# Copy .env.local.example to .env.local and fill in values
# Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run signaling server (for WebRTC)
npm run server
```

## Database
**Provider**: Supabase (PostgreSQL)
**Tables**: Users, Teams, Hackathons, Projects, Chat Messages, Events, Payments, Calls
**Setup**: Run scripts in the scripts/ directory to create tables
**Migrations**: Located in supabase/migrations directory

## Real-time Features
**Chat System**: 
- Implemented with Supabase real-time subscriptions
- Components: chatbot.tsx, chat-service.ts, chatbot-ai.ts
- API: app/api/chat/route.ts

**Video Calls**:
- WebRTC implementation with signaling server
- Files: lib/webrtc.ts, lib/meeting-rtc-service.ts
- Server: signaling-server.js, server-full.js

## Known Issues
**Client/Server Component Error**:
- Error passing event handlers to Server Components
- Fix: Convert components to Client Components with "use client" directive
- Affected files: components using onClick handlers with Server Components

## Testing
**Framework**: None specified
**Test Files**: Various test-*.js files in root directory