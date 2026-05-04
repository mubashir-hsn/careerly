import { getDashboardStats, getTokenUsageHistory, getRecentActivity } from "@/actions/user-dashboard";
import DashboardOverview from "./_components/DashboardOverview";
import StatsCards from "./_components/StatsCards";
import UsageChart from "./_components/UsageChart";
import RecentActivity from "./_components/RecentActivity";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Student Dashboard - Careerly",
  description: "Monitor your AI usage, tokens, and career progress.",
};

import { verifyStripeSession } from "@/actions/subscription";

export default async function DashboardPage({ searchParams }) {
  const { success, session_id } = await searchParams;

  // Handle successful payment verification if session_id is present
  if (success && session_id) {
    try {
      await verifyStripeSession(session_id);
    } catch (error) {
      console.error("Payment verification failed on dashboard load:", error.message);
    }
  }

  const [dashboardData, usageHistory, recentActivity] = await Promise.all([
    getDashboardStats(),
    getTokenUsageHistory(),
    getRecentActivity(),
  ]);

  const { subscription, stats } = dashboardData;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Welcome Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Welcome back!
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Here's what's happening with your AI usage and career progress.
        </p>
      </div>

      {/* Main Overview Section */}
      <DashboardOverview subscription={subscription} />

      {/* Stats Section */}
      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Usage Chart */}
        <div className="lg:col-span-2">
          <UsageChart data={usageHistory} />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivity activities={recentActivity} />
        </div>
      </div>
    </div>
  );
}
