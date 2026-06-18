import {
  getDashboardStats,
  getTokenUsageHistory,
  getRecentActivity,
} from "@/actions/user-dashboard";
import { getUserFeedbacks } from "@/actions/feedback";
import DashboardOverview from "./_components/DashboardOverview";
import StatsCards from "./_components/StatsCards";
import UsageChart from "./_components/UsageChart";
import RecentActivity from "./_components/RecentActivity";
import UserFeedbackTable from "./_components/UserFeedbackTable";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Student Dashboard - Careerly",
  description: "Monitor your AI usage, tokens, and career progress.",
};

import { currentUser } from "@clerk/nextjs/server";
import { verifyStripeSession } from "@/actions/subscription";
import { checkAuth } from "@/services/authCheck";
import { redirect } from "next/navigation";

export default async function DashboardPage({ searchParams }) {
  const { success, session_id } = await searchParams;
  const user = await currentUser();
  const dbUser = await checkAuth();

  if (dbUser?.adminUser) {
    redirect("/");
  }

  // Handle successful payment verification if session_id is present
  if (success && session_id) {
    try {
      await verifyStripeSession(session_id);
    } catch (error) {
      console.error(
        "Payment verification failed on dashboard load:",
        error.message,
      );
    }
  }

  const [dashboardData, usageHistory, recentActivity, feedbacks] =
    await Promise.all([
      getDashboardStats(),
      getTokenUsageHistory(),
      getRecentActivity(),
      getUserFeedbacks(),
    ]);

  const { subscription, stats } = dashboardData;

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Welcome Header */}
      <div className="mb-12">
        <h1 className="text-4xl capitalize md:text-5xl font-black text-slate-900 tracking-tighter">
          Welcome, {user?.firstName}!
        </h1>
        <p className="text-slate-500 mt-3 text-lg font-medium opacity-80">
          Track your AI usage and career progress.
        </p>
      </div>

      {/* Main Overview Section */}
      <DashboardOverview subscription={subscription} />

      {/* Stats Section */}
      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Usage Chart */}
        <div className="lg:col-span-2">
          <UsageChart data={usageHistory} />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivity activities={recentActivity} />
        </div>
      </div>

      {/* User Feedback Table */}
      <UserFeedbackTable feedbacks={feedbacks} />
    </div>
  );
}
