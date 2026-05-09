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
import { TrendingUp, Users, Zap, Wallet } from "lucide-react";

export default function DashboardCharts({ data }) {
  // Check if we have any data to show
  const hasData = data && data.length > 0;

  return (
    <Card className="border-0 shadow-2xl bg-white mb-8 overflow-hidden group">
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 gap-4">
        <div>
          <CardTitle className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            Performance Matrix
          </CardTitle>
          <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
            6-Month Growth & Consumption Analytics
          </CardDescription>
        </div>
        <div className="flex flex-wrap gap-2">
           <span className="flex items-center gap-1.5 text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-sm">
             <Users className="w-3 h-3" /> Users
           </span>
           <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-sm">
             <Wallet className="w-3 h-3" /> Revenue
           </span>
           <span className="flex items-center gap-1.5 text-[10px] font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-sm">
             <Zap className="w-3 h-3" /> AI Usage
           </span>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[400px] w-full flex items-center justify-center">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: "black" }}
                  dy={10}
                />
                <YAxis
                  yId="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: "black" }}
                  width={40}
                />
                <YAxis
                  yId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#10b981", fontWeight: "black" }}
                  tickFormatter={(value) => `₨${value > 1000 ? value / 1000 + "k" : value}`}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    padding: "16px"
                  }}
                  itemStyle={{ fontWeight: "black", fontSize: "12px", padding: "2px 0" }}
                  labelStyle={{ color: "#94a3b8", fontSize: "10px", fontWeight: "black", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.1em" }}
                  cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }}
                  formatter={(value, name) => [
                    name === "Revenue" ? `PKR ${value.toLocaleString()}` : value.toLocaleString(),
                    name
                  ]}
                />
                <Area
                  yId="left"
                  type="monotone"
                  dataKey="users"
                  name="New Users"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#userGradient)"
                  animationDuration={1500}
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, strokeWidth: 0, fill: '#1d4ed8' }}
                />
                <Area
                  yId="right"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#10b981"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                  animationDuration={1500}
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, strokeWidth: 0, fill: '#047857' }}
                />
                <Area
                  yId="left"
                  type="monotone"
                  dataKey="usage"
                  name="AI Usage"
                  stroke="#6366f1"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#usageGradient)"
                  animationDuration={1500}
                  dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, strokeWidth: 0, fill: '#4338ca' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 italic font-black text-slate-200 text-3xl">!</div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No Historical Data</p>
              <p className="text-xs text-slate-400 mt-1">Platform analytics will appear here as transactions occur.</p>
            </div>
          )}
        </div>
      </CardContent>
      <div className="bg-slate-50/50 border-t border-slate-100 p-4 flex flex-wrap justify-between gap-4 px-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Activity Tracking Active</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Data Integrity</p>
              <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">Verified 100%</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Sync Interval</p>
              <p className="text-xs font-black text-indigo-600 uppercase tracking-tighter">Real-Time</p>
            </div>
          </div>
      </div>
    </Card>
  );
}
