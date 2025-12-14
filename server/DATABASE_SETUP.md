# Database Setup Guide

## Quick Start

Follow these steps to set up your PesaTracker database with proper authentication and RLS policies:

### Step 1: Access Supabase SQL Editor

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your PesaTracker project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run Migration Script

1. Open the file `server/migration.sql` in your code editor
2. Copy the entire contents
3. Paste into the Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)

### Step 3: Verify Setup

Run these verification queries in the SQL Editor:

```sql
-- Check if transactions table exists with correct columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'transactions'
ORDER BY ordinal_position;

-- Verify RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'transactions';

-- Check RLS policies
SELECT *
FROM pg_policies
WHERE tablename = 'transactions';

-- Verify indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'transactions';
```

### Step 4: Test User Creation

1. Go to your app (running locally or deployed)
2. Sign up with a test email
3. Create a few transactions
4. Verify they appear in the database

### Step 5: Test User Deletion

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Find your test user
3. Click the three dots → **Delete user**
4. Confirm deletion
5. Go to **Table Editor** → **transactions**
6. Verify that the user's transactions were automatically deleted (CASCADE)

## What This Migration Does

✅ **Drops old table** - Removes existing transactions table (if any)  
✅ **Creates new table** - With `user_id` column linked to auth.users  
✅ **CASCADE delete** - Deleting a user automatically deletes their transactions  
✅ **Indexes** - Adds performance indexes on user_id, date, and type  
✅ **RLS enabled** - Turns on Row Level Security  
✅ **RLS policies** - Creates 4 policies (SELECT, INSERT, UPDATE, DELETE)  
✅ **Auto timestamps** - Automatically updates `updated_at` on changes  

## Troubleshooting

### Error: "relation auth.users does not exist"
- Make sure you're running this in Supabase, not a local PostgreSQL
- Supabase provides the `auth.users` table automatically

### Error: "permission denied for schema auth"
- You need to run this as the Supabase service role
- Make sure you're using the SQL Editor in Supabase Dashboard

### RLS policies not working
- Verify RLS is enabled: `SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'transactions';`
- Check policies exist: `SELECT * FROM pg_policies WHERE tablename = 'transactions';`
- Make sure you're authenticated when testing

### Can't see transactions after migration
- This migration drops the old table, so all old data is lost
- Create new transactions after running the migration

## Next Steps

After successful setup:

1. ✅ Delete any test users from Authentication tab
2. ✅ Create a fresh user account
3. ✅ Start using the app with proper data isolation
4. ✅ Each user will only see their own transactions
