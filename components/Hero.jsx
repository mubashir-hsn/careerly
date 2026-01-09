"use client"

import {
    FileText,
    BarChart2,
    BookOpen,
    FileCheck,
    MessageCircle,
    TrendingUp,
} from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeroSection() {

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % features.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const features = [
        { icon: MessageCircle, color: "text-pink-500", label: "AI Chatbot" },
        { icon: TrendingUp, color: "text-blue-500", label: "Industry Insights" },
        { icon: BookOpen, color: "text-blue-500", label: "Interview Prep" },
        { icon: BarChart2, color: "text-pink-500", label: "Resume Analyzer" },
        { icon: FileCheck, color: "text-purple-500", label: "AI Cover Letter" },
        { icon: FileText, color: "text-purple-500", label: "Resume Builder" },
    ];


    return (
        <section className="relative py-36 p-10 overflow-hidden w-full mx-auto">
            {/* Background blobs */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-20 -left-20 w-64 sm:w-72 h-64 sm:h-72 bg-purple-100 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl sm:blur-3xl opacity-60 animate-blob"></div>
                <div className="absolute top-20 -right-20 w-56 sm:w-64 h-56 sm:h-64 bg-pink-100 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl sm:blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
            </div>

            {/* Main content */}
            <div className="flex flex-col md:flex-row gap-6 px-2 md:px-6 w-full mx-auto md:max-w-6xl relative z-10 items-center md:items-start">
                {/* Left text */}
                <div className="flex-1 pr-0 md:pr-6 pt-2 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-purple-50 rounded-full border border-purple-100 justify-center md:justify-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse"></span>
                        <span className="text-[12px] font-bold uppercase tracking-wider text-purple-700">
                            AI Powered Coach
                        </span>
                    </div>

                    <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-3 leading-tight">
                        Grow your <br />
                        <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                            Professional
                        </span>{" "}
                        path
                    </h1>

                    <p className="text-text-muted-light md:text-lg pb-5 leading-relaxed max-w-xs sm:max-w-sm md:max-w-md mx-auto md:mx-0">
                        Advance your career with personalized guidance, interview prep and AI-powered tools for job success
                    </p>

                    <Link href={'/dashboard'}>
                        <button className="bg-gray-800 mx-auto md:m-0 text-white px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-xl shadow-purple-900/10 hover:shadow-purple-900/20 active:scale-[0.98] transition-all flex items-center gap-2 group mt-3 sm:mt-0">
                            Start Free
                            <ArrowRight />
                        </button>
                    </Link>
                </div>

                {/* Right animated circle with features */}
                <div className="relative hidden flex-shrink-0 w-56 md:w-72 h-56 md:h-72 md:flex items-center justify-center mt-6 md:mt-0">
                    {/* Outer spinning circle */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full animate-spin-slow">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-4 h-4 bg-purple-400 rounded-full"></div>
                        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 -translate-y-1 w-4 h-4 bg-pink-400 rounded-full"></div>
                    </div>

                    {/* Inner box */}
                    <div className="relative w-44 md:w-56 h-44 md:h-56 bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center overflow-hidden">
                        <div className="relative w-full h-full overflow-hidden">

                            {/* Sliding Container */}
                            <div
                                className="flex flex-col transition-transform duration-700 ease-in-out w-full h-full"
                                style={{ transform: `translateY(-${index * 100}%)` }}
                            >
                                {features.map((feat, idx) => {
                                    const Icon = feat.icon;
                                    return (
                                        <div
                                            key={idx}
                                            className="flex flex-col items-center justify-center min-w-full h-full flex-shrink-0"
                                        >
                                            <Icon className={`w-16 h-16 ${feat.color}`} />
                                            <span className="text-xl font-bold text-gray-500 mt-2 text-center">
                                                {feat.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
