This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

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
