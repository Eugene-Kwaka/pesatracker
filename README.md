# PesaTracker - Netlify Deployment

This project uses Supabase as the backend database.

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
