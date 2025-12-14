# PesaTracker - Netlify Deployment

This project uses Supabase as the backend database.

## Database Setup

**IMPORTANT**: Run this setup in Supabase before creating any users.

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor**
4. Copy the contents of `server/migration.sql`
5. Paste and run the SQL script
6. Verify the setup:
   - Check that the `transactions` table exists with `user_id` column
   - Verify RLS is enabled: `SELECT * FROM pg_policies WHERE tablename = 'transactions';`

This will:
- Create the `transactions` table with proper user authentication
- Set up Row Level Security (RLS) policies for data isolation
- Configure CASCADE delete (deleting a user removes their transactions)
- Add performance indexes

## Environment Variables

Create a `.env` file with:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Netlify Deployment

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com) and create a new site
3. Connect your GitHub repository
4. Add environment variables in Netlify:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Deploy!

## Local Development

```bash
npm install
npm run dev
```

The app will run on `http://localhost:5173`
