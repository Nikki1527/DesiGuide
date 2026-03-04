# DesiGuide Admin Dashboard - Setup Guide

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Then edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project or select an existing one
3. Go to Project Settings > API
4. Copy the following:
   - **Project URL** → Use for `VITE_SUPABASE_URL`
   - **anon/public key** → Use for `VITE_SUPABASE_ANON_KEY`

### 4. Set Up Database Tables

Run the SQL scripts in your Supabase SQL Editor to create the required tables:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  age INTEGER,
  location TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Destinations table
CREATE TABLE destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add other tables as per README.md database schema section
```

### 5. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5174`

## 🔧 Troubleshooting

### Error: "Missing Supabase environment variables"
- Make sure you've created the `.env` file
- Verify your credentials are correct
- Restart the development server after updating `.env`

### Error: "Failed to fetch" or connection errors
- Check your internet connection
- Verify Supabase project is active
- Check if your Supabase API keys are valid

### Page not loading or blank screen
- Open browser console (F12) to see detailed errors
- Clear browser cache and localStorage
- Check if all dependencies are installed (`npm install`)

## 📝 Test Credentials

Once your database is set up, you can create a test admin user:

```sql
INSERT INTO users (name, email, password, role, is_admin)
VALUES ('Admin User', 'admin@gmail.com', 'password', 'admin', true);
```

Then login with:
- Email: `admin@gmail.com`
- Password: `password`

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
