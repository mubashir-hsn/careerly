import { generateAIInsightFn } from "@/actions/dashboard.js";
import { inngest } from "@/lib/inngest/client";
import { serve } from "inngest/next";

// Create an API that serves functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    generateAIInsightFn,
  ],
});