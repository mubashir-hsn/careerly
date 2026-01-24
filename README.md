# Careerly - AI Career Coach

[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## **Project Overview**

AI Career Assistant is a **full-stack, AI-powered platform** that helps professionals optimize their careers.  
It provides **resume analysis, AI-powered content improvement, cover letter generation, interview quizzes, industrial insights, and a career guidance chatbot**.  

This project demonstrates **production-ready web development skills** using **Next.js, Node.js, React, and AI integrations**.

---

## **Key Features**

### 1. Resume Analyzer
- Upload PDF resumes (validated, max 2MB)
- ATS analysis and scoring
- Skill matching with job descriptions
- Actionable improvement suggestions

### 2. AI Content Improvement
- Improve summaries, experience, and project descriptions
- Professional, result-oriented tone
- Personalized to user profile and industry

### 3. Cover Letter Generator
- Personalized letters based on profile + job description
- Professional tone, max 400 words
- Markdown formatting for easy export

### 4. Interview Quiz Generator
- Role-specific MCQs (Technical / HR / Behavioral / Mixed)
- Tailored to experience, skills, and difficulty level
- JSON format ready for UI

### 5. Industrial Insights
- Industry-neutral (works for tech, medical, business, etc.)
- Salary ranges, growth rate, top skills, market outlook
- Visualization-ready data for charts and tables

### 6. AI Career Chatbot
- Context-aware, session-based conversations
- Provides guidance on skills, roles, and industry trends
- Friendly and professional responses

---

## **Authentication & Forms**
- **Authentication:** Clerk for signup/signin
- **Forms & Validation:** React Hook Form + Zod for type-safe, validated user input

---

## **Tech Stack**
- **Frontend:** Next.js, React, TailwindCSS
- **Backend:** Node.js, Next.js API Routes
- **Database:** Prisma + PostgreSQL
- **AI Integration:** OpenAI / Google Gemini (Generative AI)
- **Form Validation:** Zod + React Hook Form
- **Authentication:** Clerk

---

## **Architecture Overview**

Frontend UI (Resume Builder, Quiz, Cover Letter, AI Chat)
│
▼
Next.js API Layer (Auth via Clerk, Validation via Zod)
│
▼
AI Feature Handlers (Resume Analyzer, Cover Letter, Quiz, Industrial Insights, Chatbot)
│
▼
AI Model Layer (OpenAI / Gemini)
│
▼
Database Layer (Users, Resumes, Cover Letters, Chat Messages)

---

## **Setup & Run**

### Prerequisites
- Node.js v20+
- PostgreSQL database
- Clerk account for auth
- AI API Key (OpenAI / Google Gemini)

### Install
```bash
git clone https://github.com/mubashir-hsn/careerly.git
cd ai-career-coach
npm install
npm run dev
```

