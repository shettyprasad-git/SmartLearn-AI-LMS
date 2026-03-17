# SmartLearn AI LMS Walkthrough

The SmartLearn AI LMS is a production-style Learning Management System that leverages the YouTube IFrame API and AI-powered features to provide a structured, interactive learning experience.

## 🏗️ Architecture Overview

The system follows a modern decoupled architecture:

- **Frontend**: Next.js 14 (App Router) with TailwindCSS for styling and Zustand for global state management.
- **Backend**: Node.js & Express.js REST API.
- **Database**: MySQL (hosted on Aiven) with Prisma ORM.
- **Authentication**: JWT-based authentication with Access and Refresh tokens (stored in DB/HTTP-only cookies).
- **Video Source**: YouTube Embedded Player with persistent progress tracking.

---

## 🌟 Key Features

### 1. Premium Glassmorphic UI
The entire frontend is built with a "Rich Aesthetics" philosophy, featuring:
- **Dark Mode by Default**: Tailored HSL color palette.
- **Glassmorphism**: Backdrop blur effects and subtle borders for a premium feel.
- **Micro-Animations**: Smooth transitions using `framer-motion` and `lucide-react` icons.

### 2. Mandatory Learning Sequence
The backend enforces a strict learning order. Users cannot skip videos; they must complete the current video before the next one is unlocked.

### 3. AI-Powered Study Tools
Each video lesson is accompanied by an AI Panel with three core modes:
- **🤖 AI Tutor**: Context-aware chat that answers questions based on the video transcript.
- **📝 Summary Generator**: Automatically extracts key points and important terms from the lesson.
- **❓ Quiz Master**: Generates practice multiple-choice questions to test comprehension.

### 4. Progress & Analytics
- **Granular Tracking**: Playback position is saved every 30 seconds and on pause.
- **Personal Dashboard**: Real-time stats on enrolled courses, learning hours, and completed videos.
- **Certificates**: Automatically generated verifiable credentials upon course completion.

---

## 📸 visual Walkthrough

### Dashboard & Analytics
The user dashboard provides a high-level overview of learning progress and recent achievements.

### Course Catalog
A premium grid of subjects, allowing users to explore and enroll in new courses.

### Learning Player
The core learning interface with the video player on the left and the interactive AI/Curriculum panel on the right.

### Certificate Verification
A public-facing page where employers can verify the authenticity of a student's certificate using a unique credential ID.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL Database
- YouTube Data API Key

### Backend Setup
1. `cd backend`
2. `npm install`
3. Configure `.env` (DATABASE_URL, JWT_SECRET, YOUTUBE_API_KEY)
4. `npx prisma db push`
5. `npm run dev`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Configure `.env.local` (NEXT_PUBLIC_API_BASE_URL)
4. `npm run dev`

---

## 🛠️ Deployment

For detailed hosting instructions on Vercel, Render, and Aiven MySQL, refer to the [deployment_guide.md](file:///C:/Users/prasa/.gemini/antigravity/brain/5724e652-b517-4105-bbbc-412e55d8580d/deployment_guide.md).
