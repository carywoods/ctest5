# React + Vite + Supabase App

A single-page React application with Supabase integration for inserting records into a database.

## Project Structure

```
ctest5/
├── Dockerfile              # Multi-stage Docker build
├── nginx.conf             # Nginx configuration for production
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── index.html             # HTML entry point
├── .env.example           # Environment variable template
├── .dockerignore          # Docker build exclusions
└── src/
    ├── main.jsx           # React entry point
    ├── App.jsx            # Main app component with Supabase integration
    └── index.css          # Dark theme styles
```

## Features

- Text input form for submitting messages
- Inserts records into Supabase `test_records` table
- Shows success message with returned record ID
- Error handling with user-friendly messages
- Warning banner if environment variables are missing
- Clean dark theme UI with gradient effects
- Form validation and loading states

## Environment Variables

Required environment variables:

```env
VITE_SUPABASE_URL=http://supabasekong-vg4c80kwgsow8888og08ks8s.100.127.122.121.sslip.io
VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc3MjIxMDA0MCwiZXhwIjo0OTI3ODgzNjQwLCJyb2xlIjoiYW5vbiJ9.ja1zIGGkW5Jnt1hvXkrZz0IQH6HpwN0cQxSG2gP5X6s
```

## Database Schema

Create the following table in your Supabase database:

```sql
CREATE TABLE test_records (
  id BIGSERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Development

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your Supabase credentials to `.env`

4. Run development server:
```bash
npm run dev
```

5. Open http://localhost:5173

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` folder.

## Docker Deployment

### Build the Docker Image

```bash
docker build \
  --build-arg VITE_SUPABASE_URL=http://supabasekong-vg4c80kwgsow8888og08ks8s.100.127.122.121.sslip.io \
  --build-arg VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc3MjIxMDA0MCwiZXhwIjo0OTI3ODgzNjQwLCJyb2xlIjoiYW5vbiJ9.ja1zIGGkW5Jnt1hvXkrZz0IQH6HpwN0cQxSG2gP5X6s \
  -t ctest5 .
```

### Run the Container

```bash
docker run -p 8080:80 ctest5
```

Then visit http://localhost:8080

### Docker Troubleshooting

If you get a permission denied error with Docker:

1. Add your user to the docker group:
```bash
sudo usermod -aG docker cary
```

2. Apply the changes:
```bash
newgrp docker
```

Or log out and log back in.

3. Verify docker group membership:
```bash
groups
```

## Docker Architecture

### Multi-Stage Build

**Stage 1 (Builder):**
- Base: `node:20-alpine`
- Installs dependencies
- Runs `npm run build`
- Passes Supabase credentials as build args

**Stage 2 (Production):**
- Base: `nginx:alpine`
- Copies built files from stage 1
- Uses custom nginx.conf
- Serves on port 80

### Nginx Configuration

- Handles React client-side routing with `try_files` fallback
- Enables gzip compression
- Adds security headers
- Caches static assets for 1 year
- Custom 404 handling

## Dependencies

### Production
- `@supabase/supabase-js` (^2.39.7)
- `react` (^18.2.0)
- `react-dom` (^18.2.0)

### Development
- `@vitejs/plugin-react` (^4.2.1)
- `vite` (^5.1.0)

## Tech Stack

- **Frontend:** React 18
- **Build Tool:** Vite 5
- **Backend:** Supabase
- **Styling:** Pure CSS with dark theme
- **Server:** Nginx (production)
- **Container:** Docker multi-stage build
