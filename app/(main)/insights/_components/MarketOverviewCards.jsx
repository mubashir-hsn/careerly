import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Sparkles, ShieldAlert, GraduationCap } from "lucide-react";

const MarketOverviewCards = ({ insights }) => {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Growth Score */}
                <Card className="glass p-3 md:px-0 md:py-6 rounded-xl shadow-none border-0">
                    <CardHeader className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                            <TrendingUp size={25} />
                        </div>
                        <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Growth Score
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-extrabold text-slate-900">{insights.growthScore}</span>
                            <span className="text-slate-400 font-medium mb-1">/ 100</span>
                        </div>
                        <div className="mt-4 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                                style={{
                                    width: `${insights.growthScore}%`,
                                    backgroundColor: insights.growthScore >= 70 ? "#4ade80" : insights.growthScore >= 40 ? "#facc15" : "#f87171",
                                }}
                                className="h-full transition-all duration-1000 ease-out"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Market Demand */}
                <Card className="glass p-3 md:px-0 md:py-6 rounded-xl shadow-none border-0">
                    <CardHeader className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                            <Sparkles size={25} />
                        </div>
                        <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Market Demand
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span
                            className={`text-2xl font-bold ${insights.marketOutlook.demandLevel === "High"
                                    ? "text-emerald-500"
                                    : insights.marketOutlook.demandLevel === "Medium"
                                        ? "text-amber-500"
                                        : "text-rose-500"
                                }`}
                        >
                            {insights.marketOutlook.demandLevel}
                        </span>
                        <CardDescription className="text-xs text-slate-500 mt-2 leading-relaxed">
                            Based on hiring trends and industry trajectory.
                        </CardDescription>
                    </CardContent>
                </Card>

                {/* Automation Risk */}
                <Card className="glass p-3 md:px-0 md:py-6 rounded-xl shadow-none border-0">
                    <CardHeader className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
                            <ShieldAlert size={25} />
                        </div>
                        <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Automation Risk
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span
                            className={`text-2xl font-bold ${insights.marketOutlook.automationRisk === "High"
                                    ? "text-rose-600"
                                    : insights.marketOutlook.automationRisk === "Medium"
                                        ? "text-amber-500"
                                        : "text-emerald-500"
                                }`}
                        >
                            {insights.marketOutlook.automationRisk}
                        </span>
                        <CardDescription className="text-xs text-slate-500 mt-2 leading-relaxed">
                            Risk of core tasks being replaced by AI.
                        </CardDescription>
                    </CardContent>
                </Card>

                {/* Skill Match */}
                <Card className="glass p-3 md:px-0 md:py-6 rounded-xl shadow-none border-0">
                    <CardHeader className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                            <GraduationCap size={25} />
                        </div>
                        <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Skill Match
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span
                            className={`text-4xl font-extrabold ${insights.skillGap.matchPercentage >= 90
                                    ? "text-emerald-600"
                                    : insights.skillGap.matchPercentage >= 40
                                        ? "text-blue-500"
                                        : "text-rose-600"
                                }`}
                        >
                            {insights.skillGap.matchPercentage}%
                        </span>
                        <CardDescription className="text-xs text-slate-500 mt-2 leading-relaxed">
                            Match against top-tier industry standards.
                        </CardDescription>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default MarketOverviewCards