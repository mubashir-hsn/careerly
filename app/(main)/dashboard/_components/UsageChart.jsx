"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { TrendingUp } from "lucide-react";

export default function UsageChart({ data }) {
  const hasData = data.some((item) => item.tokens > 0);

  // Format the data for better display
  const chartData = data.map((item) => ({
    name: new Date(item.date + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
    }),
    tokens: item.tokens,
  }));

  return (
    <Card className="border-0 shadow-2xl bg-white mb-8 overflow-hidden group">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Consumption Trend
          </CardTitle>
          <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">7-Day AI Activity Log</CardDescription>
        </div>
        <div className="text-right">
           <span className="text-[10px] font-black text-indigo-100 bg-indigo-600 px-2 py-1 rounded-full uppercase tracking-tighter">Live Monitor</span>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[320px] w-full flex items-center justify-center">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: "bold" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: "bold" }}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    padding: "12px"
                  }}
                  itemStyle={{ color: "#4f46e5", fontWeight: "bold", fontSize: "12px" }}
                  labelStyle={{ color: "#94a3b8", fontSize: "10px", fontWeight: "black", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}
                  cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Area
                  type="monotone"
                  dataKey="tokens"
                  stroke="#6366f1"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#usageGradient)"
                  animationDuration={1500}
                  dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0, fill: '#4f46e5' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 italic font-black text-slate-200 text-3xl">!</div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No Recent Activity</p>
              <p className="text-xs text-slate-400 mt-1">Start optimizing your career to see data here.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
