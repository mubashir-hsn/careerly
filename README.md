# 🚀 CAREERLY: Your Personal AI Career Coach

CAREERLY is a **Next.js (App Router)** powered platform that helps users advance their careers with AI-driven tools — including industrial insights, an AI assistant chatbot, resume and cover letter generators, and interview preparation support.  

> **Empowering your career journey through intelligent automation.**

---

## 🧠 Features

### 🔹 AI Industrial Insights
Get real-time industry insights and job trends powered by **Gemini AI**, helping you stay ahead in your field.

### 💬 AI Assistant Chatbot
Chat with an intelligent career assistant that provides guidance, answers questions, and supports decision-making.

### 📝 AI Resume Builder
Generate professional resumes tailored to your skills, roles, and industry using AI suggestions.

### ✉️ AI Cover Letter Generator
Create personalized, high-quality cover letters aligned with your job applications in seconds.

### 🎯 AI Interview Coach
Practice interviews with AI feedback on your answers, tone, and confidence — built to help you ace real interviews.

---

## ⚙️ Tech Stack

| Layer | Technologies Used |
|-------|--------------------|
| **Frontend** | [Next.js (App Router)](https://nextjs.org/docs/app), React, Tailwind CSS |
| **AI Engine** | [Gemini API (Google AI)](https://ai.google.dev/gemini-api) |
| **Database** | [Neon (PostgreSQL)](https://neon.tech) with [Prisma ORM](https://www.prisma.io) |
| **Backend** | [Inngest](https://www.inngest.com) for background jobs and event-driven workflows |
| **Authentication** | JWT / NextAuth (optional) |
| **Deployment** | Vercel / Railway / Render |

---

## 🛠️ Installation & Setup

Follow these steps to run the project locally:

```bash
# 1️⃣ Clone the repository
git clone https://github.com/mubashir-hsn/careerly

# 2️⃣ Move into the project directory
cd Careerly-AI

# 3️⃣ Install dependencies
npm install

# 4️⃣ Set up environment variables
# Create a .env file and add:
# GEMINI_API_KEY=your_gemini_api_key
# DATABASE_URL=your_neon_database_url
# INNGEST_API_KEY=your_inngest_api_key

# 5️⃣ Run Prisma migrations
npx prisma migrate dev

# 6️⃣ Start the development server
npm run dev
