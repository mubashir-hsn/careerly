import { getIndustryInsight } from '@/actions/dashboard.js';
import { userOnboardingStatus } from '@/actions/user.js';
import { redirect } from 'next/navigation';
import React from 'react'
import DashboardView from './_components/DashboardView';

const IndustryInsightsPage = async () => {
  const { isOnboarded } = await userOnboardingStatus();
  if (!isOnboarded) {
    redirect('/onboarding')
  }

  const insights = await getIndustryInsight();

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl min-h-screen">
      <div className="mb-2">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
          Industry <span className="text-primary italic">Trends</span>
        </h1>
        <p className="text-slate-500 mt-3 text-lg font-medium opacity-80">
          Real-time market analytics and skill guide.
        </p>
      </div>

      <DashboardView insights={insights} />
    </div>
  )
}

export default IndustryInsightsPage