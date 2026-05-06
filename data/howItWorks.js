import {
  Users,
  FileText,
  Mic,
  TrendingUp,
} from "lucide-react"

 export  const steps = [
    {
      step: "1",
      icon: Users,
      title: "Set up your profile",
      description:
        "Tell us about your career goals so we can give you better advice.",
      color: "bg-indigo-500/10 text-indigo-600",
      dot: "bg-indigo-500",
    },
    {
      step: "2",
      icon: FileText,
      title: "Build your resume",
      description:
        "Create resumes and cover letters that stand out to top recruiters.",
      color: "bg-pink-500/10 text-pink-600",
      dot: "border-indigo-500",
    },
    {
      step: "3",
      icon: Mic,
      title: "Practice Interviews",
      description:
        "Practice with AI interviews tailored to your role and get instant tips.",
      color: "bg-blue-500/10 text-blue-600",
      dot: "border-indigo-500",
    },
    {
      step: "4",
      icon: TrendingUp,
      title: "See your growth",
      description:
        "See how you're doing and get better with detailed stats.",
      color: "bg-emerald-500/10 text-emerald-600",
      dot: "border-indigo-500",
    },
  ]