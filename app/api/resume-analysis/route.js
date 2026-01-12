import { generateResumeFeedback } from "@/actions/resume-analyzer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const result = await generateResumeFeedback(formData);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Resume analyze error:", err);
    return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 });
  }
}
