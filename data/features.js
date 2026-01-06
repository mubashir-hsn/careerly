import { BrainCircuit, Briefcase, FileScan, LineChart, ScrollText } from "lucide-react";

export const features = [
  {
    icon: <BrainCircuit className="w-10 h-10 mb-4 text-primary" />,
    title: "AI Powered Career Guidance",
    link:"/ai-chatbot",
    description: "Get personal career advice and insights powered by AI.",
  },
  {
    icon: <Briefcase className="w-10 h-10 mb-4 text-primary" />,
    title: "Interview Preparation",
    link:"/interviews",
    description: "Practice role based questions and get instant feedback.",
  },
  {
    icon: <LineChart className="w-10 h-10 mb-4 text-primary" />,
    title: "Industry Insights",
    link:"/dashboard",
    description: "See current market trends, salaries, and related data.",
  },
  {
    icon: <ScrollText className="w-10 h-10 mb-4 text-primary" />,
    title: "Smart Resume Creation",
    link:"/resume/resume-builder",
    description: "Create a clean and ATS friendly resume with guided steps.",
  },
  {
    icon: <FileScan className="w-10 h-10 mb-4 text-primary" />,
    title: "Resume Analyzer",
    link:"/resume/resume-analyzer",
    description: "Upload your resume to get clear feedback on structure, skills, tone & style and areas that need improvement.",
  },
];
