# Project Notes - Supabase Auth & Chat App

## Date: 2026-02-27

## Overview
Built a React + Vite application with Supabase authentication and real-time group chat functionality.

## Features Implemented

### 1. Authentication System
- **AuthContext** (`src/context/AuthContext.jsx`)
  - Manages user session state globally
  - Uses `supabase.auth.onAuthStateChange()` for real-time session updates
  - Provides `useAuth()` hook for accessing auth state throughout the app

- **Login Component** (`src/components/Login.jsx`)
  - Email and password authentication
  - Toggle between Sign In and Sign Up modes
  - Uses `supabase.auth.signUp()` for registration
  - Uses `supabase.auth.signInWithPassword()` for login
  - Error handling and display

- **App Flow**
  - App checks for active session on load
  - Shows loading state while checking authentication
  - Redirects to Login if no session
  - Shows Chat component when authenticated

### 2. Real-time Chat Component
- **Chat Component** (`src/components/Chat.jsx`)
  - Loads all messages from Supabase `messages` table
  - Displays scrollable message thread with:
    - Sender email
    - Message body
    - Formatted timestamps (relative: "just now", "5m ago", etc.)
  - Text input for sending new messages
  - Real-time subscriptions using `supabase.channel()` with Postgres changes listener
  - Auto-scrolls to newest messages
  - Visual distinction for own vs. other users' messages
  - Sign out button

### 3. Database Schema
- **messages table** (`supabase/migrations.sql`)
  - `id` - UUID primary key with auto-generated random UUID
  - `user_id` - UUID foreign key to `auth.users` (not null)
  - `email` - Text field for user's email (not null)
  - `body` - Text field for message content (not null)
  - `created_at` - Timestamp with timezone, defaults to now()

- **Row Level Security (RLS)**
  - Enabled on messages table
  - SELECT policy: Authenticated users can view all messages
  - INSERT policy: Authenticated users can only insert messages where `user_id` matches their `auth.uid()`

## File Structure

```
src/
├── components/
│   ├── Chat.jsx          # Real-time chat component
│   └── Login.jsx         # Authentication form
├── context/
│   └── AuthContext.jsx   # Auth state management
├── lib/
│   └── supabase.js       # Supabase client initialization
├── App.jsx               # Main app with auth routing
├── main.jsx              # Entry point with AuthProvider
└── index.css             # Styles for entire app

supabase/
└── migrations.sql        # Database schema and RLS policies
```

## Environment Variables Required

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Known Issues

### ⚠️ Email Confirmation Not Sending
**Issue**: Email confirmation messages are not being sent when users sign up.

**Expected Behavior**:
- When a user signs up with `supabase.auth.signUp()`, they should receive an email confirmation link
- The app shows message: "Check your email for the confirmation link!"

**Actual Behavior**:
- No confirmation email is received by the user
- Users cannot complete registration without email confirmation

**Possible Causes**:
1. Supabase email service not configured in project settings
2. Email confirmation disabled in Supabase Auth settings
3. SMTP settings not configured
4. Email provider blocking/rate limiting
5. Email going to spam folder

**Troubleshooting Steps**:
1. Check Supabase Dashboard → Authentication → Email Templates
2. Verify Email Auth is enabled in Authentication → Providers
3. Check Authentication → Settings → "Confirm email" setting
4. Review Supabase Dashboard → Authentication → Email Templates → Confirm signup
5. Check SMTP configuration in Project Settings → Auth → SMTP Settings
6. Test with different email addresses/providers
7. Check spam/junk folders

**Workaround**:
- For development: Disable email confirmation requirement in Supabase Auth settings
- For production: Configure custom SMTP or use Supabase's email service (paid plans have higher limits)

## Git Commits

1. **Commit a300dd5**: "Add Supabase authentication with AuthContext and Login component"
   - Added authentication system
   - Created Login, AuthContext, and Supabase client

2. **Commit 879fa4c**: "feat: add auth and group chat"
   - Added Chat component with real-time messaging
   - Added database migration file
   - Simplified App.jsx to use Chat

## Build Status

✅ Build successful (npm run build)
- JavaScript: 145.61 kB (47.03 kB gzipped)
- CSS: 6.37 kB (1.63 kB gzipped)
- Build time: 445ms
- No compilation errors

## Testing Checklist

- [ ] Set up Supabase project
- [ ] Configure environment variables
- [ ] Run database migrations (`supabase/migrations.sql`)
- [ ] Enable Row Level Security policies
- [ ] Configure email authentication in Supabase Dashboard
- [ ] Fix email confirmation sending issue
- [ ] Test user sign up flow
- [ ] Test user sign in flow
- [ ] Test real-time message sending
- [ ] Test real-time message receiving (multiple users)
- [ ] Test sign out functionality
- [ ] Test RLS policies (users can only insert their own messages)

## Next Steps

1. **Fix Email Confirmation Issue** (HIGH PRIORITY)
   - Configure SMTP or enable Supabase email service
   - Test email delivery

2. **Enhancements**
   - Add message editing/deletion
   - Add typing indicators
   - Add online/offline user status
   - Add message reactions
   - Add file/image sharing
   - Add user profiles
   - Add private messaging
   - Add message search
   - Add pagination for old messages

3. **Deployment**
   - Deploy to Coolify or other hosting platform
   - Configure production environment variables
   - Set up CI/CD pipeline
   - Monitor error logs

## Repository

- GitHub: https://github.com/carywoods/ctest5
- Branch: main
- Status: Up to date with remote
