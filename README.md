# Careerly - AI-Powered Career Coach

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-orange?logo=google)](https://ai.google.dev)
[![Prisma](https://img.shields.io/badge/Prisma-PostgreSQL-brightgreen?logo=prisma)](https://prisma.io)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-purple?logo=clerk)](https://clerk.com)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue?logo=tailwind)](https://tailwindcss.com)
[![MIT License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 📖 Table of Contents

- [Overview](#-overview)
- [✨ Features](#-features)
- [🏗️ Project Structure](#️-project-structure)
- [🛠️ Tech Stack](#️-tech-stack)

- [🚀 Setup & Run](#-setup--run)
- [🏗️ Architecture](#️-architecture)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🎯 Overview

**Careerly** is a full-stack AI-powered career coaching platform designed to help professionals advance their careers. Key capabilities include:

- AI-driven resume analysis and optimization (ATS scoring)
- Personalized cover letter generation
- Role-specific interview quiz preparation
- Industry insights (salaries, trends, skills)
- Intelligent career guidance chatbot

Built with production-grade tools, Careerly demonstrates modern web development best practices.

[GitHub Repo](https://github.com/mubashir-hsn/careerly)

## ✨ Features

| Feature                    | Description                                                      | Tech                    |
| -------------------------- | ---------------------------------------------------------------- | ----------------------- |
| **Resume Analyzer**        | PDF upload, ATS scoring, skill matching, improvement suggestions | PDF.js, Google Gemini   |
| **Content Improver**       | Optimize experience bullets, summaries for impact                | AI Prompt Engineering   |
| **Cover Letter Generator** | Personalized for job desc/company, exportable Markdown/PDF       | Gemini AI               |
| **Interview Quizzes**      | Technical/Behavioral MCQs by role & experience level             | Dynamic JSON Generation |
| **Industry Insights**      | Salary data, trends, top skills, learning paths                  | Cached DB + AI          |
| **Career Chatbot**         | Session-based, context-aware career advice                       | Streaming Chat API      |

## 🏗️ Project Structure

```
d:/careerly/
├── app/                  # Next.js 15 App Router
│   ├── (auth)/           # Auth pages
│   ├── (main)/           # Main app pages
│   ├── api/              # API Routes (chat, resume-analysis, pdf-gen)
│   ├── lib/              # App-specific utils
│   └── globals.css
├── actions/              # Server Actions (resume.js, cover-letter.js, etc.)
├── components/           # React Components
│   └── ui/               # shadcn/ui Components
├── lib/                  # Shared utils, Prisma client, Inngest
├── prisma/               # Schema & migrations (PostgreSQL)
├── public/               # Assets, uploads/
├── data/                 # Static data (industries.js, features.js)
├── services/             # GeminiService.js, authCheck.js
├── diagrams/             # Mermaid diagrams (ERD, sequences)
└── package.json          # Dependencies
```

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** (App Router, Turbopack)
- **React 19** + React Hook Form + Zod
- **shadcn/ui** + Tailwind CSS 4 + Lucide Icons
- **Recharts** for data visualization

### Backend & AI

- **Next.js API Routes** + Server Actions
- **Prisma ORM** + PostgreSQL
- **Google Gemini AI** (generative-ai)
- **Inngest** for background jobs

### Tools & Utils

- **Clerk** Authentication
- **Puppeteer + html2pdf** for PDF generation
- **PDF.js + pdf-parse** for resume parsing

## 🚀 Setup & Run

### Prerequisites

- Node.js ≥20
- PostgreSQL (local or cloud)
- [Clerk Account](https://clerk.com) (free tier)
- [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Environment Variables

Create `.env.local`:

```
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
GEMINI_API_KEY="your-gemini-key"
NEXT_PUBLIC_GEMINI_API_KEY="your-public-key"
```

### Installation

```bash
git clone https://github.com/mubashir-hsn/careerly.git
cd careerly
npm install

# Database setup
npx prisma generate
npx prisma db push  # or migrate dev
npx prisma studio   # Optional: view DB

npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

```
User (Clerk Auth) → Next.js UI → API Routes/Actions
                          ↓
Prisma DB Models: User, Resume, CoverLetter, Assessment, Chat, IndustryInsight
                          ↓
AI Layer: GeminiService.js (analysis, generation)
Background: Inngest functions
Export: Puppeteer PDF
```

See [diagrams/erd.mmd](diagrams/erd.mmd) for full ERD.

## 🤝 Contributing

1. Fork & clone
2. Create feature branch
3. `npm run lint`
4. Submit PR

## 📄 License

MIT - See [LICENSE](LICENSE)
