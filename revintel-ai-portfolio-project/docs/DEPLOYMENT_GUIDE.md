# Deployment Guide

## Frontend on Vercel

1. Import the `client` folder as a Vercel project.
2. Set the build command to `npm run build`.
3. Set the output directory to `dist`.
4. Add environment variable:
   - `VITE_API_URL=https://your-backend-domain/api`
5. Deploy.

The included `client/vercel.json` handles SPA rewrites.

## Backend on Render

1. Create a new web service.
2. Point it to the `server` directory.
3. Use:
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Deploy.

You can also use the included `render.yaml`.

## Notes

- This project stores scenario history in SQLite by default.
- For a public deployment, persistent disk/storage is recommended.
- Update `VITE_API_URL` on the frontend after backend deployment.
