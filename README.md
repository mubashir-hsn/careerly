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

**Careerly** is a state-of-the-art AI-driven career coaching platform designed to empower professionals with personalized guidance, interview preparation, and advanced resume optimization tools. Built on a modern, high-performance tech stack, it provides a seamless bridge between raw talent and industry-leading career success.

### Route Isolation & Layouts
The platform utilizes Next.js Route Groups to achieve physical UI isolation between different application contexts:
- **`(main)` Shell**: Contains the public landing page, user dashboard, and AI tools. It includes the site-wide professional Header and Footer.
- **`admin` Console**: A dedicated, distraction-free environment for administrators resident at `/admin`, featuring a specialized sidebar and system-status header.
- **`(auth)` Layer**: Managed by Clerk for secure sign-in and sign-up workflows.

### Core Architecture Principles
1. **Atomic Token Logic**: All AI operations are fueled by a token-based economy. Tokens are consumed per usage and can be recharged via Stripe.
2. **Infinite Accumulation**: Credits from subscription upgrades and recharges are **cumulative**, ensuring users never lose their previous balance.
3. **Event-Driven Notifications**: Administrative actions and user lifecycle events (new signups, payments) trigger real-time system alerts.

[GitHub Repo](https://github.com/mubashir-hsn/careerly)

---

## ✨ Features

### Professional Feature Suite
* **AI Resume Builder & Analyzer**: PDF upload, ATS compatibility scoring against job descriptions, and granular AI feedback.
* **Content Improver**: Optimize experience bullet points and summaries for maximum impact using AI prompt engineering.
* **AI Cover Letter Generator**: Synthesize user profile data with target job descriptions for context-aware drafts in multiple tones.
* **Interview Quizzes**: Dynamically generate role-specific quizzes (Technical, Behavioral, Mixed) with instant AI feedback and scoring.
* **Industry Insights**: Benchmarks market trends, growth scores, top skills, and salary data across 50+ sectors.
* **Career Chatbot**: Context-aware, session-based streaming chatbot for 24/7 career advice.
* **AI Portfolio Builder**: Build custom professional portfolio websites with multiple premium themes and AI-assisted content polishing.

### Administrative Infrastructure
* **Unified Analytics Command Center (`/admin`)**: Real-time tracking of platform revenue, active subscriptions, and system-wide token consumption.
* **Live Notification Ecosystem**: Instant alerts for new registrations, successful checkouts, and configuration edits.
* **Forensic User Auditing**: In-depth profile reviews verifying transaction logs, billing integrity, and user token consumption patterns.
* **Dynamic Plan Management**: Full CRUD controls over pricing, token yields, and feature access permissions.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 15+ (App Router, Turbopack) & React 19 |
| **Database** | PostgreSQL (Hosted on Neon) |
| **ORM** | Prisma ORM |
| **Authentication** | Clerk (Auth & User Management) |
| **Styling** | Tailwind CSS & Shadcn UI (Lucide Icons) |
| **Payments** | Stripe (Subscription & Token-based Revenue) |
| **AI Engine** | Google Gemini AI (via Direct API Integration) |
| **Background Jobs** | Inngest Event-Driven Orchestration |
| **Analytics & Data** | Recharts (Usage and payment trends visualization) |
| **File Parsing & PDF** | PDF.js & pdf-parse (parsing), Puppeteer & html2pdf (generation) |

---

## 🏗️ Project Structure

```
d:/careerly/
├── app/                  # Next.js 15 App Router
│   ├── (auth)/           # Auth pages
│   ├── (main)/           # Main app pages (landing, dashboard, AI tools)
│   ├── admin/            # Dedicated admin routes & console
│   ├── api/              # API Routes (chat, resume-analysis, pdf-gen, Stripe webhooks)
│   ├── lib/              # App-specific utils & schemas
│   └── globals.css
├── actions/              # Next.js Server Actions
│   ├── admin.js          # Admin dashboard metrics and user auditing
│   ├── notifications.js  # Live notifications logic
│   ├── subscription.js   # Stripe checkout sessions & checkout verification
│   ├── user-dashboard.js # User analytics & activity charts
│   └── portfolio.js      # Portfolio updates & details
├── components/           # Shared React Components & UI widgets
├── lib/                  # Shared database client, Inngest handler
├── prisma/               # Database Schema (PostgreSQL/Neon) & migrations
├── public/               # Static assets & public uploads
├── data/                 # System static data (industries, features, faqs)
├── services/             # AI core services (GeminiService.js)
└── package.json          # Dependencies & build scripts
```

---

## 📊 Database Models (Key Schema)
* **`User`**: Central identity model (linked to Clerk). Stores professional profile data.
* **`AdminUser`**: Flagging model that identifies users with administrative privileges.
* **`SubscriptionPlan`**: Product definitions (token count, price, type, features).
* **`UserSubscription`**: User-specific billing status, tokens remaining, and active tier.
* **`TokenUsageLog`**: Immutable audit trail for every AI feature consumption.
* **`Payment`**: Financial ledger entries synchronized with Stripe transactions.
* **`Notification`**: Real-time administrative alerts (registrations, payments, etc.).
* **`Resume`**: Markdown storage for user resumes with AI ATS scoring.
* **`CoverLetter`**: Drafts and completed career correspondence.
* **`Assessment`**: History of AI-generated career interview quizzes and scores.
* **`Chat`**: Threaded AI career coaching conversations.
* **`IndustryInsight`**: Cache for AI-generated sector trends and salary benchmarks.

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
