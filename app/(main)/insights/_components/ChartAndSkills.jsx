import React from 'react';
import { Wallet } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const ChartAndSkills = ({ insights }) => {

    // Transform salary data for the chart
    const salaryData = insights.salaryRanges.map((range) => ({
        role: range.role,
        min: range.min / 1000,
        median: range.median / 1000,
        max: range.max / 1000,
    }));

    return (
        <div className="space-y-8">
           
            {/* Summary Section */}
            <Card className="glass p-4 md:py-6 md:px-12 border-0 shadow-none rounded-xl">
                <div className='w-full'>
                    <h3 className="text-xl uppercase py-4 font-bold text-slate-600">Summary</h3>
                    <p className="text-slate-500 text-sm text-justify md:text-[15px] leading-relaxed mb-6">
                        {insights.marketOutlook.summary}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left: In-Demand Skills */}
                    <div className="md:w-1/2">
                        <h4 className="pb-2 font-bold border-b border-slate-100 text-slate-600 uppercase tracking-widest mb-4">
                            In-Demand Skills
                        </h4>
                        <div className="flex flex-col gap-2">
                            {insights.topSkills.map((s, i) => (
                                <div
                                    key={i}
                                    className="px-3 capitalize py-1.5 w-fit border border-green-100 bg-emerald-50 text-emerald-700 rounded text-xs font-semibold flex items-center gap-2"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    {s.skill}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Skill Gap Analysis */}
                    <div className="md:w-1/2">
                        <h4 className="pb-2 font-bold border-b border-slate-100 text-slate-600 uppercase tracking-widest mb-4">
                            Skill Gap Analysis
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <div className="text-[10px] font-bold text-emerald-600 mb-2 uppercase">Your Strengths</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {insights.skillGap.matched.map((s) => (
                                        <span
                                            key={s}
                                            className="px-2 py-1 bg-white capitalize border border-slate-100 rounded text-[11px] text-slate-500 font-medium"
                                        >
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-rose-500 mb-2 uppercase">Growth Areas</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {insights.skillGap.missing.map((s) => (
                                        <span
                                            key={s}
                                            className="px-2 py-1 bg-rose-50 capitalize border border-rose-100 rounded text-[11px] text-rose-600 font-medium"
                                        >
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Salary Ranges Chart */}
            <Card className="glass p-2 py-4 md:p-6 rounded-xl shadow-none border-0 overflow-hidden">
                <CardHeader className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Wallet size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-600">Salary Outlook by Role</h3>
                </CardHeader>
                <CardContent className="h-87.5 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salaryData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="role"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: "#64748b" }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: "#64748b" }}
                            />
                            <Tooltip
                                cursor={{ fill: "#f8fafc" }}
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-background capitalize border rounded-lg p-2 shadow-md">
                                                <p className="font-medium">{label}</p>
                                                {payload.map((item) => (
                                                    <p key={item.name} className="text-sm text-slate-600">
                                                        {item.name}: Rs. {item.value}K
                                                    </p>
                                                ))}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="min" fill="#C7D2FE" name="Min Salary (K)" />
                            <Bar dataKey="median" fill="#A5B4FC" name="Median Salary (K)" />
                            <Bar dataKey="max" fill="#818CF8" name="Max Salary (K)" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

        </div>
    );
};

export default ChartAndSkills;
