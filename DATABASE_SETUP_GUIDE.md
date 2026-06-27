# HackConnect Database Setup Guide

## Issue Identified
Your public access page is showing an error because the database tables haven't been created yet in your Supabase project. The API endpoints are returning 500 errors due to missing tables.

## Quick Fix Steps

### 1. Access Supabase Dashboard
Go to: https://supabase.com/dashboard/project/sdvymgpugilsreqhovwt/sql

### 2. Run the Complete Setup Script
Copy and paste the contents of `scripts/00-complete-setup.sql` into the SQL editor and run it. This script includes:
- All required tables (users, hackathons, teams, etc.)
- The missing `connection_requests` table (critical for the public access page)
- Sample data with 6 users for testing
- Proper indexes and security policies

### 3. Verify Environment Variables
Make sure your `.env.local` file contains:
```
NEXT_PUBLIC_SUPABASE_URL=https://sdvymgpugilsreqhovwt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkdnltZ3B1Z2lsc3JlcWhvdnd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NzI0MjksImV4cCI6MjA3MDI0ODQyOX0.YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkdnltZ3B1Z2lsc3JlcWhvdnd0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDY3MjQyOSwiZXhwIjoyMDcwMjQ4NDI5fQ.VQBtl62lpq1frvgeASr7BJs6kb-7Q9PkB2cxmVy7ZJk
```

### 4. Restart Development Server
```bash
npm run dev
```

### 5. Test the Public Access Page
Visit: http://localhost:3000/public

## What Was Wrong

1. **Missing Tables**: The `connection_requests` table was not created, causing the `/api/requests` endpoint to fail
2. **No Sample Data**: The `users` table was empty, so the public access page had no profiles to display
3. **Database Connection**: The API was trying to query non-existent tables

## Expected Result After Fix

- Public access page will load successfully
- You'll see 6 sample user profiles with avatars, skills, and bios
- Connect buttons will work (though they require login)
- No more 500 errors in the browser console

## Alternative: Quick Test Command
Run this to verify database connection:
```bash
node setup-database.js
```

If it shows "✅ Database connection successful!", your setup is complete!

## Troubleshooting

If you still see errors:
1. Check browser console (F12) for specific error messages
2. Verify all SQL scripts ran without errors in Supabase
3. Ensure environment variables are correctly set
4. Restart the development server

The public access page should now display user profiles correctly with no errors.
