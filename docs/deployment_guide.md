# Deployment & Hosting Guide

This guide explains how to deploy the SmartLearn AI LMS to production using Aiven MySQL, Render (Backend), and Vercel (Frontend).

## 1. Database: Aiven MySQL

I have configured the project to use **MySQL via Prisma**. To use your Aiven database:

1. Log in to your [Aiven Console](https://console.aiven.io/).
2. Create or select your MySQL service.
3. Find the **Service URI** or the individual connection parameters (Host, Port, User, Password, DB Name).
4. Update your `DATABASE_URL` in the **Backend** environment variables (see below). It should look like this:
   `mysql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DB_NAME]?ssl-mode=REQUIRED`

---

## 2. Backend: Hosting on Render

Render is an excellent choice for Node.js Express apps.

1. Create a new **Web Service** on Render and connect your GitHub repository.
2. **Root Directory**: `backend`
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `npm start`
5. Add the following **Environment Variables**:
   - `DATABASE_URL`: Your Aiven MySQL connection string.
   - `JWT_SECRET`: A long random string.
   - `REFRESH_TOKEN_SECRET`: A different long random string.
   - `YOUTUBE_API_KEY`: Your Google Cloud Console API Key.
   - `FRONTEND_URL`: Your Vercel URL (e.g., `https://smartlearn-ai.vercel.app`).
   - `PORT`: `10000` (Render's default).
   - `NODE_ENV`: `production`

---

## 3. Frontend: Hosting on Vercel

Vercel is the natural choice for Next.js.

1. Go to [Vercel Dashboard](https://vercel.com/) and click **Add New** > **Project**.
2. **Import Repository**: Select your `SmartLearn-AI-LMS` repository.
3. **Configure Project**:
   - **Root Directory**: Click "Edit" and select the `frontend` folder. **(CRITICAL STEP)**
   - **Framework Preset**: Should automatically detect `Next.js`.
   - **Build & Output Settings**: Leave as default.
4. **Environment Variables**:
   - Add `NEXT_PUBLIC_API_BASE_URL`.
   - Value: `https://your-backend-url.onrender.com/api` (Wait until your Render deployment is finished to get this URL).
5. Click **Deploy**.

---

## 4. Post-Deployment Checklist

- [ ] Run `npx prisma db push` (or `npx prisma migrate deploy`) against your Aiven database once to set up the tables.
- [ ] Ensure `FRONTEND_URL` in the backend exactly matches the Vercel URL to avoid CORS issues.
- [ ] Ensure `NEXT_PUBLIC_API_BASE_URL` in the frontend ends with `/api`.
