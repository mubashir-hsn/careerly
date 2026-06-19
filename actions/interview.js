"use server";
import { db } from "@/lib/prisma";
import { checkAuth } from "@/services/authCheck";
import { generateAIResponse } from "@/services/geminiService";
import { checkTokenBalance, deductTokens, estimateTokens } from "@/services/subscriptionService";

const modelName = process.env.GEMINI_MODEL_B;

export async function generateQuiz(data) {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  const prompt = `Generate ${data.quizQuestion} ${data.interviewType} questions for a ${data.jobRole} (${data.experienceLevel} exp) at ${data.difficultyLevel} level.
Stack: ${data.skills?.join(", ") || "General"}

Difficulty Rules:
- Beginner: Conceptual + basic scenarios
- Intermediate: Balanced mix
- Advanced: High-level scenario/problem solving

Output: Return ONLY valid JSON with 4 options per question.
{
  "questions": [
    { "question": "", "options": ["", "", "", ""], "correctAnswer": "", "explanation": "" }
  ]
}`;

  try {
    // Check token balance before AI call
    await checkTokenBalance(user.id);

    const result = await generateAIResponse(prompt, modelName)
    const cleanedText = result.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);

    // Deduct tokens after successful AI call
    const tokensUsed = await estimateTokens(prompt + cleanedText);
    await deductTokens(user.id, "INTERVIEW", tokensUsed);

    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error(error.message || "Failed to generate quiz questions. AI service might be busy.");
  }
}

export async function saveQuizResult({ questions, answers, score, quizDetail }) {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  // Get wrong answers
  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

  // Only generate improvement tips if there are wrong answers
  let improvementTip = null;
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const improvementPrompt = `User failed these ${quizDetail.interviewType} questions for ${quizDetail.jobRole}:
${wrongQuestionsText}

Provide 1-2 encouraging sentences on what to learn/practice next. No mention of mistakes.`;


    try {
      const tipResult = await generateAIResponse(improvementPrompt, modelName);

      // Deduct tokens for improvement tip
      const tipTokens = await estimateTokens(improvementPrompt + (tipResult?.response || tipResult));
      await deductTokens(user.id, "INTERVIEW", tipTokens);

      improvementTip = tipResult.response.trim();
    } catch (error) {
      console.error("Error generating improvement tip:", error);
      // Continue without improvement tip if generation fails
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: quizDetail.interviewType.toLowerCase() === 'mixed' ? 'Mixed(technical.hr,behavioral)' : quizDetail?.interviewType,
        improvementTip,
        title: quizDetail?.jobRole
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result. Please check your connection.");
  }
}

export async function getAssessments() {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  try {
    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessment history.");
  }
}
export async function deleteAssessment(assessmentId) {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  try {
    await db.assessment.delete({
      where: {
        id: assessmentId,
        userId: user.id, // Ensure user can only delete their own
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting assessment:", error);
    throw new Error("Failed to delete assessment");
  }
}
