# SmartLearn AI - Neural Learning Ecosystem 🚀🧠

SmartLearn AI is a next-generation Learning Management System (LMS) that bridges the gap between fragmented YouTube educational content and structured, AI-enhanced learning. It intelligently orchestrates millions of lessons into coherent curriculums, provides real-time AI assistance, and tracks your evolution with professional-grade analytics.

### 🌐 [Live Demo: https://smart-learn-ai-lms.vercel.app/](https://smart-learn-ai-lms.vercel.app/)

---

## ✨ Key Features

### 🌐 Global YouTube Course Discovery
Search across the entire YouTube ecosystem to find high-quality educational content. SmartLearn automatically filters, classifies, and structures long-form videos or playlists into professional courses with one click.

### 🤖 Floating AI Learning Assistant
A persistent, neural learning partner powered by Hugging Face (Mistral-7B). It generates real-time notes from videos, creates instant quizzes to test your knowledge, and provides a 24/7 learning chat.

### 🗺️ AI-Generated Learning Roadmaps
Want to master a field from scratch? Enter any topic, and the AI generates a comprehensive, step-by-step interactive roadmap with recommended milestones and resources.

### 📊 Professional Analytics Vault
Track your journey with high-fidelity charts. Monitor your global progress, learning hours, quiz scores, and course completion rates through a stunning glassmorphic interface.

---

## 🛠️ Tech Stack & Infrastructure

### 🚀 Deployment & Hosting
- **Frontend**: Hosted on [Vercel](https://vercel.com) for edge-optimized delivery.
- **Backend API**: Hosted on [Render](https://render.com) for robust performance.
- **Database**: Managed [MySQL](https://mysql.com) instance on [Aiven](https://aiven.io) for high availability and scale.

### 💻 Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Custom Glassmorphism System
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand (Auth & UI States)

### ⚙️ Backend
- **Core**: Node.js + Express (TypeScript)
- **ORM**: Prisma
- **AI Integration**: Hugging Face Inference API + YouTube Data API v3
- **Auth**: JWT with Secure Refresh Token Rotation

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MySQL
- YouTube Data API Key
- Hugging Face API Token

### 1. Clone the Repository
```bash
git clone https://github.com/shettyprasad-git/SmartLearn-AI-LMS.git
cd SmartLearn-AI-LMS
```

### 2. Backend Setup
```bash
cd backend
npm install
# Configure .env with DATABASE_URL, YOUTUBE_API_KEY, and HF_TOKEN
npx prisma db push
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
# Configure .env.local with NEXT_PUBLIC_API_BASE_URL
npm run dev
```

---

## 🎨 Design Philosophy
SmartLearn uses a **Premium Glassmorphic UI** designed to feel immersive and futuristic. With subtle blurs, vibrant glow effects, and micro-animations, the platform provides an environment that encourages deep focus and intellectual evolution.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by the SmartLearn Engineering Team.
