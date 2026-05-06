import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Sparkles, ShieldAlert, GraduationCap } from "lucide-react";

const MarketOverviewCards = ({ insights }) => {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Growth Score */}
                <Card className="border-0 shadow-2xl bg-white rounded-[2.5rem] overflow-hidden p-6 hover:-translate-y-1 transition-all duration-300">
                    <CardHeader className="p-0 flex flex-row items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100/50">
                            <TrendingUp size={28} className="font-black" />
                        </div>
                        <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            Growth Score
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-slate-900 tracking-tighter">{insights.growthScore}</span>
                            <span className="text-slate-300 font-bold text-sm tracking-widest">/ 100</span>
                        </div>
                        <div className="mt-6 w-full bg-slate-50 rounded-full h-3 overflow-hidden border border-slate-100">
                            <div
                                style={{
                                    width: `${insights.growthScore}%`,
                                    backgroundColor: insights.growthScore >= 70 ? "#10b981" : insights.growthScore >= 40 ? "#f59e0b" : "#ef4444",
                                }}
                                className="h-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(0,0,0,0.1)]"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Market Demand */}
                <Card className="border-0 shadow-2xl bg-white rounded-[2.5rem] overflow-hidden p-6 hover:-translate-y-1 transition-all duration-300">
                    <CardHeader className="p-0 flex flex-row items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100/50">
                            <Sparkles size={28} />
                        </div>
                        <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            Market Demand
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="mb-2">
                            <span
                                className={`text-3xl font-black tracking-tighter uppercase ${insights.marketOutlook.demandLevel === "High"
                                        ? "text-emerald-600"
                                        : insights.marketOutlook.demandLevel === "Medium"
                                            ? "text-amber-600"
                                            : "text-rose-600"
                                    }`}
                            >
                                {insights.marketOutlook.demandLevel}
                            </span>
                        </div>
                        <CardDescription className="text-xs text-slate-500 font-medium leading-relaxed mt-4">
                            Hiring signals and industry growth.
                        </CardDescription>
                    </CardContent>
                </Card>

                {/* Automation Risk */}
                <Card className="border-0 shadow-2xl bg-white rounded-[2.5rem] overflow-hidden p-6 hover:-translate-y-1 transition-all duration-300">
                    <CardHeader className="p-0 flex flex-row items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-100/50">
                            <ShieldAlert size={28} />
                        </div>
                        <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            Job Risk
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="mb-2">
                           <span
                                className={`text-3xl font-black tracking-tighter uppercase ${insights.marketOutlook.automationRisk === "High"
                                        ? "text-rose-600"
                                        : insights.marketOutlook.automationRisk === "Medium"
                                            ? "text-amber-500"
                                            : "text-emerald-600"
                                    }`}
                            >
                                {insights.marketOutlook.automationRisk}
                            </span>
                        </div>
                        <CardDescription className="text-xs text-slate-500 font-medium leading-relaxed mt-4">
                            Risk of core tasks being replaced by AI.
                        </CardDescription>
                    </CardContent>
                </Card>

                {/* Skill Match */}
                <Card className="border-0 shadow-2xl bg-white rounded-[2.5rem] overflow-hidden p-6 hover:-translate-y-1 transition-all duration-300">
                    <CardHeader className="p-0 flex flex-row items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100/50">
                            <GraduationCap size={28} />
                        </div>
                        <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            Skill Match
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="flex items-baseline gap-2">
                            <span
                                className={`text-5xl font-black tracking-tighter ${insights.skillGap.matchPercentage >= 90
                                        ? "text-emerald-600"
                                        : insights.skillGap.matchPercentage >= 40
                                            ? "text-blue-600"
                                            : "text-rose-600"
                                    }`}
                            >
                                {insights.skillGap.matchPercentage}%
                            </span>
                        </div>
                        <CardDescription className="text-xs text-slate-500 font-medium leading-relaxed mt-6">
                            Benchmarked against industry standards.
                        </CardDescription>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default MarketOverviewCards