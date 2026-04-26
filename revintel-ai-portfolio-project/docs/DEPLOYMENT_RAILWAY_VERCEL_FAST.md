# Fast Deployment: Railway Backend + Vercel Frontend

## Backend on Railway

1. Push this clean repository to GitHub.
2. Open Railway → New Project → Deploy from GitHub repo.
3. Select the repo and set the service root directory to `server`.
4. Railway should use these backend settings automatically from `server/railway.json`:
   - Build: Nixpacks
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port ${PORT}`
5. Add these Railway variables:

```env
REVINTEL_DB_PATH=/app/data/revintel.db
REVINTEL_UPLOAD_DIR=/app/data/uploads
REVINTEL_ALLOWED_ORIGIN=*
```

6. After deploy, open the Railway public domain. The root should show:

```json
{"message":"RevIntel AI API is running","version":"2.0.0"}
```

7. Copy the Railway backend URL, for example:

```text
https://revintel-ai-api-production.up.railway.app
```

## Frontend on Vercel

1. Open Vercel → Add New Project → Import same GitHub repo.
2. Set Root Directory to `client`.
3. Use:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add this Vercel environment variable:

```env
VITE_API_URL=https://YOUR-RAILWAY-BACKEND-DOMAIN/api
```

5. Deploy.

## Final CORS tightening

After Vercel is deployed, copy your Vercel frontend URL and update Railway:

```env
REVINTEL_ALLOWED_ORIGIN=https://YOUR-VERCEL-FRONTEND.vercel.app
```

Then redeploy Railway. This is safer than leaving `*` permanently.
