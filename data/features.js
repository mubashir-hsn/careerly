import { BrainCircuit, Briefcase, FileScan, LineChart, ScrollText } from "lucide-react";


export const features = [
  {
    icon: <BrainCircuit className="w-10 h-10 mb-4 text-purple-500" />,
    title: "AI Powered Career Guidance",
    link:"/ai-chatbot",
    description: "Get personal career advice and insights powered by AI.",
    bg: "bg-purple-100",
  },
  {
    icon: <Briefcase className="w-10 h-10 mb-4 text-blue-500" />,
    title: "Interview Preparation",
    link:"/interviews",
    description: "Practice role based questions and get instant feedback.",
    bg: "bg-blue-100",
  },
  {
    icon: <LineChart className="w-10 h-10 mb-4 text-green-500" />,
    title: "Industry Insights",
    link:"/dashboard",
    description: "See current market trends, salaries, and related data.",
    bg: "bg-green-100",
  },
  {
    icon: <ScrollText className="w-10 h-10 mb-4 text-orange-500" />,
    title: "Smart Resume Creation",
    link:"/resume/resume-builder",
    description: "Create a clean and ATS friendly resume with guided steps.",
    bg: "bg-orange-100",
  },
  {
    icon: <FileScan className="w-10 h-10 mb-4 text-pink-500" />,
    title: "Resume Analyzer",
    link:"/resume/resume-analyzer",
    description: "Upload your resume to get clear feedback on structure, skills, tone & style and areas that need improvement.",
    bg: "bg-pink-100",
  },
];
