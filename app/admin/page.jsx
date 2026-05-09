import { getPlatformStats } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, Zap, TrendingUp } from "lucide-react";
import Link from "next/link";
import DashboardCharts from "./_components/DashboardCharts";

export const metadata = {
  title: "Admin Overview - Careerly",
};

export default async function AdminDashboardPage() {
  const stats = await getPlatformStats();

  const overviewCards = [
    {
      title: "Total Revenue",
      value: `PKR ${stats.totalRevenue.toLocaleString()}`,
      sub: "Lifetime platform income",
      icon: <TrendingUp className="w-6 h-6 text-emerald-600" />,
      bg: "bg-emerald-50",
      link: "/admin/revenue",
    },
    {
      title: "Active Pro Subs",
      value: stats.activeSubscriptions,
      sub: "Paying customers",
      icon: <CreditCard className="w-6 h-6 text-indigo-600" />,
      bg: "bg-indigo-50",
      link: "/admin/subscriptions",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      sub: "Platform-wide registered",
      icon: <Users className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-50",
      link: "/admin/users",
    },
    {
      title: "Tokens Consumed",
      value: stats.totalTokensUsed.toLocaleString(),
      sub: "Lifetime AI consumption",
      icon: <Zap className="w-6 h-6 text-amber-600" />,
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-gray-500 mt-1">Real-time statistics across all users and features.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((card) => {
          const CardWrapper = card.link ? Link : "div";
          const wrapperProps = card.link ? { href: card.link, className: "block h-full group" } : { className: "h-full" };

          return (
            <CardWrapper key={card.title} {...wrapperProps}>
              <Card className={`border-0 shadow-lg bg-white overflow-hidden h-full transition-all ${card.link ? "hover:scale-[1.02] hover:shadow-xl cursor-pointer" : ""}`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-left">
                  <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${card.bg}`}>
                    {card.icon}
                  </div>
                </CardHeader>
                <CardContent className="text-left">
                  <div className="text-2xl font-extrabold text-gray-900">{card.value}</div>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{card.sub}</p>
                </CardContent>
              </Card>
            </CardWrapper>
          );
        })}
      </div>

      {/* Analytics Chart */}
      <DashboardCharts data={stats.monthlyStats} />

      {/* Feature Usage Section */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle>AI Feature Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.featureUsage.map((f) => (
                <div key={f.feature} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-8 rounded-full bg-indigo-500" />
                    <div>
                      <p className="font-bold text-gray-800 uppercase tracking-tight text-sm">
                        {f.feature.replace("_", " ")}
                      </p>
                      <p className="text-xs text-gray-400">{f.count} total usages</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-indigo-600">{f.tokens.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Tokens</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
