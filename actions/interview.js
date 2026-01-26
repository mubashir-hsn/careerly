"use server";

import { db } from "@/lib/prisma";
import { checkAuth } from "@/services/authCheck";
import { generateAIResponse } from "@/services/geminiService";

const modelName = process.env.GEMINI_MODEL_B;

export async function generateQuiz(data) {
  const user = await checkAuth();

  const prompt = `
  You are a senior interviewer who designs real interview questions.
  Questions must be realistic and job focused.
  Do not generate trivial or irrelevant questions.
  Questions must reflect real interview scenarios

  Generate ${data.quizQuestion} ${data.interviewType} ${data.difficultyLevel} level interview questions for a ${data.jobRole} with ${data.experienceLevel} experience${
    data.skills?.length ? ` and expertise in ${data.skills.join(", ")}` : ""
  }.
  
  Technology Stack: ${data.skills?.length ? data.skills.join(", ") : "Not specified"}  
  Interview Type: ${data.interviewType} (Technical / HR / Behavioral / Mixed)  
  Experience Level: ${data.experienceLevel}  
  
  Generate questions based on the **difficulty level** as follows:
  - **Beginner:** Mostly simple and conceptual questions, with 1-2 basic scenario questions.  
  - **Intermediate:** Balanced mix of simple, conceptual, and scenario/problem-solving questions.  
  - **Advanced:** Mostly scenario/problem-solving questions, with few conceptual questions for depth.
  
  For **Mixed Interview Type**, ensure the questions include:
  - Scenario-based questions
  - Conceptual questions
  - Simple practical questions
  - Problem-solving based questions
  
  All questions must strictly match:
  - Selected Job Role
  - Experience Level
  - Technology Stack
  - Interview Type

  
  Each question should be multiple choice with exactly **4 options**.
  
  Return the response in this JSON format only, no additional text:
  {
    "questions": [
      {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correctAnswer": "string",
        "explanation": "string"
      }
    ]
  }
  
  
  `;

  try {
    const result = await generateAIResponse(prompt,modelName)
    const cleanedText = result.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);

    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions");
  }
}

export async function saveQuizResult({questions, answers, score, quizDetail}) {
  const user = await checkAuth();
  
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
  
        const improvementPrompt = `
        The user got the following ${quizDetail.interviewType} questions for the role of ${quizDetail.jobRole} wrong:
    
        ${wrongQuestionsText}
    
        Based on these mistakes, provide a concise, specific improvement tip.
        Focus on the knowledge gaps revealed by these wrong answers.
        Keep the response under 2 sentences and make it encouraging.
        You can suggest practicing topics related to these skills: ${quizDetail.skills.join(", ")}.
        Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;
    
  
      try {
        const tipResult = await generateAIResponse(improvementPrompt,modelName);
  
        improvementTip = tipResult.response.text().trim();
        console.log(improvementTip);
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
      throw new Error("Failed to save quiz result");
    }
  }
 
export async function getAssessments() {
  const user = await checkAuth();
  
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
      throw new Error("Failed to fetch assessments");
    }
  }
