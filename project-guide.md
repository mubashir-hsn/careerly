# CAREERLY: AI-Powered Career Coach Platform

## Project Overview
**Careerly** is a state-of-the-art AI-driven career coaching platform designed to empower professionals with personalized guidance, interview preparation, and advanced resume optimization tools. Built on a modern, high-performance tech stack, it provides a seamless bridge between raw talent and industry-leading career success.

---

## Technical Stack
| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 15+ (App Router) |
| **Database** | PostgreSQL (Hosted on Neon) |
| **ORM** | Prisma |
| **Authentication** | Clerk (Professional Auth & User Management) |
| **Styling** | Tailwind CSS & Shadcn UI |
| **Payments** | Stripe (Subscription & Token-based Revenue) |
| **AI Engine** | Google Gemini AI (via Direct API Integration) |
| **Monitoring** | Custom Admin Console & Real-time Notifications |

---

## System Architecture

### Route Isolation & Layouts
The platform utilizes Next.js Route Groups to achieve physical UI isolation between different application contexts:
- **`(main)` Shell**: Contains the public landing page, user dashboard, and AI tools. It includes the site-wide professional Header and Footer.
- **`admin` Console**: A dedicated, distraction-free environment for administrators. Resident at `/admin`, it features a specialized sidebar and system-status header.
- **`(auth)` Layer**: Managed by Clerk for secure sign-in and sign-up workflows.

### Core Architecture Principles
1. **Atomic Token Logic**: All AI operations are fueled by a token-based economy. Tokens are consumed per usage and can be recharged via Stripe.
2. **Infinite Accumulation**: Credits from subscription upgrades and recharges are **cumulative**, ensuring users never lose their previous balance.
3. **Event-Driven Notifications**: Administrative actions and user lifecycle events (new signups, payments) trigger real-time system alerts.

---

## Professional Feature Suite

### 1. AI Resume Builder & Analyzer
- **ATS Optimization**: Analyzes resumes against specific job descriptions to provide an ATS compatibility score.
- **AI Feedback**: Generates granular, actionable advice to improve resume impact and clarity.

### 2. AI Cover Letter Generator
- **Context-Aware Drafting**: Crafts professional cover letters by synthesizing user profile data with target job descriptions.
- **Format Variety**: Supports multiple professional tones and styles.

### 3. AI Interview Preparation
- **Dynamic Quizzes**: Generates industry-specific interview questions (Technical, Behavioral, Mixed).
- **AI Scoring**: Provides immediate feedback and improvement tips based on user responses.

### 4. Industry Insights
- **Market Trends**: Real-time analysis of industry growth scores and top-demanded skills.
- **Salary Benchmarking**: Provides data-driven salary ranges for various roles within a chosen industry.

### 5. AI Career Chatbot
- **24/7 Guidance**: A conversational interface for career advice, resume tips, and industry exploration.

### 6. Content Improver
- **Professional Polish**: Enhances the quality of existing professional text, bios, and descriptions for maximum impact.

---

## Administrative Infrastructure

### Admin Dashboard (`/admin`)
- **Key Metrics**: Real-time tracking of Total Users, Active Subscriptions, Total Revenue, and Token Consumption.
- **Notification Center**: A live-polling system that alerts admins of new registrations, successful payments, and configuration changes (Plan CRUD).

### Revenue & User Management
- **Transaction Ledger**: Detailed history of all Stripe payments, including transaction IDs and token credit logs.
- **User Audits**: Deep-dive profiles for every user, showing their full billing history, token usage logs, and AI activity.

---

## Subscription & Monetization Logic

### Pricing Tiers
- **Free**: 1,000 baseline tokens for initial exploration.
- **Pro Tiers**: Scalable recharge options (Starter to Ultimate) with priority AI processing.

### Payment Flow
1. User selects a tier and initiates a **Stripe Checkout**.
2. Upon success, the **Stripe Webhook** or **Manual Verification** action increments the user's `tokensRemaining` and upgrades their `planId`.
3. The dashboard revalidates automatically to show the new cumulative balance.

---

## Database Schema (Key Models)
- **`User`**: Core professional profile and credentials.
- **`UserSubscription`**: Tracks active tier, tokens used, and cumulative balance.
- **`SubscriptionPlan`**: Defines the metadata for all platform products.
- **`Payment`**: Records every financial transaction for auditability.
- **`Notification`**: Stores administrative alerts and system events.
- **`TokenUsageLog`**: Granular history of every AI feature consumption.


---

## User Dashboard Ecosystem (`/dashboard`)
The User Dashboard is the primary professional workspace, designed to provide high-feedback analytics and direct access to AI growth tools.

### 1. Cumulative Token Monitoring
- **Real-time Balance**: Displays the total accumulated tokens across all recharges and plans.
- **Consumption Meter**: A dynamic progress visualization comparing `tokensUsed` against the absolute total capacity.
- **Sync Logic**: Automatically revalidates upon payment or plan transition.

### 2. Professional Growth Metrics
- **Performance Cards**: Aggregated stats for:
  - **Resume Score**: Latest AI evaluation of the professional profile.
  - **Interviews Prep**: Number of quizzes completed and average readiness score.
  - **Industry Insights**: Count of sector reports generated.
- **Onboarding Alerts**: Dynamic banners that guide users to complete missing profile sections (Industry, Bio, Skills).

### 3. Usage & Activity Analytics
- **AI Consumption Chart**: A 7-day visual trend analysis showing which days saw the highest AI activity.
- **Recent Activity Feed**: A chronological ledger of the latest AI feature usages (e.g., "AI Resume Analysis -50 tokens"), synchronized with `TokenUsageLog`.

### 4. Navigation Hub
- **Growth Tools Menu**: Instant access to the full suite (Chatbot, Cover Letter, Prep).
- **Billing Shortcut**: Quick-link to the cumulative billing and payment history ledger.

---

## Data Architecture (Prisma Models)
| Model | Description |
| :--- | :--- |
| **User** | Central identity model (linked to Clerk). Stores professional profile data. |
| **AdminUser** | Flagging model that identifies users with administrative privileges. |
| **SubscriptionPlan** | Product definitions (token count, price, type, features). |
| **UserSubscription** | User-specific billing status, tokens remaining, and active tier. |
| **TokenUsageLog** | Immutable audit trail for every AI feature consumption. |
| **Payment** | Financial ledger entries synchronized with Stripe transactions. |
| **Notification** | Real-time administrative alerts (registrations, payments, etc.). |
| **Resume** | Markdown storage for user resumes with AI ATS scoring. |
| **CoverLetter** | Drafts and completed career correspondence. |
| **Assessment** | History of AI-generated career interview quizzes and scores. |
| **Chat** | Threaded AI career coaching conversations. |
| **IndustryInsight** | Cache for AI-generated sector trends and salary benchmarks. |

---

## Technical Manifest (Next.js Server Actions)

### Administrative Suite (`actions/admin.js`)
- `checkAdmin()`: Security middleware for administrative routes.
- `getPlatformStats()`: Aggregates system-wide analytics (Revenue, Users, Usage).
- `getAllUsers()`: Paginated list of professionals for auditing.
- `getUserAuditData(userId)`: Deep-dive into a specific user's billing and AI history.
- `getAllPayments()`: Full financial ledger of platform revenue.
- `createSubscriptionPlan(data)`: Create new recharge/membership products.
- `updateSubscriptionPlan(id, data)`: Modify existing product configurations.
- `deleteSubscriptionPlan(id)`: Safely remove inactive plans.

### Notifications Center (`actions/notifications.js`)
- `createNotification(data)`: Internal helper to broadcast system events.
- `getAdminNotifications()`: Fetches unread and historical alerts for the dropdown.
- `markNotificationRead(id)`: Acknowledge a specific alert.
- `markAllNotificationsRead()`: Bulk dismissal of pending notifications.

### Billing & Subscriptions (`actions/subscription.js`)
- `getPlans()`: Fetches all active products for the pricing page.
- `getCurrentPlan()`: Retrieves user's active tier and token balance.
- `createCheckoutSession(planId)`: Initiates the Stripe payment gateway.
- `verifyStripeSession(sessionId)`: Manual fallback for verifying recharges.
- `cancelSubscription()`: Seamless downgrade to the lifetime Free plan.

### User Dashboard Analytics (`actions/user-dashboard.js`)
- `getDashboardStats()`: Main entry point for user metrics.
- `getTokenUsageHistory()`: Data for the 7-day activity graph.
- `getRecentActivity()`: Latest AI usage logs for the dashboard feed.
- `getUserPaymentHistory()`: Full history of Stripe recharges.

---

## Specialized Administrative Features

### 1. Unified Analytics Engine
The Admin Dashboard provides a real-time "Command Center" view. It synthesizes data from multiple tables to show:
- **Financial Velocity**: Live PKR revenue tracking.
- **Conversion Metrics**: Active Pro subscriptions vs. Free users.
- **Resource Consumption**: Real-time monitoring of AI token usage.

### 2. Live Notification Ecosystem
A premium notification system that monitors:
- **User Growth**: Alerts for every new professional registration.
- **Closing Revenue**: Immediate notification of successful Stripe checkouts.
- **System Stability**: Alerts on plan creation or configuration edits.

### 3. Forensic User Auditing
Administrators can drill down into any user profile to see:
- **Billing Integrity**: Comparison of Stripe session IDs with DB payment records.
- **Usage Fairness**: Granular logs of exactly which AI features the user is spending tokens on.
- **Profile Mastery**: Tracking resume, cover letter, and assessment progress.

### 4. Dynamic Plan Management
Admins have full CRUD (Create, Read, Update, Delete) control over subscription products:
- **Price Sensitivity**: Update plan pricing based on market changes.
- **Feature Gating**: Toggle access to specific AI tools (e.g., enable Industry Insights for specific plans).
- **Token Control**: Adjust token yields to optimize platform monetization.

---

**CAREERLY: The AI-Driven Future of Professional Success.**
