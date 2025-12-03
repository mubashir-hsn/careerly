import { getIndustryInsight } from '@/actions/dashboard.js';
import { userOnboardingStatus } from '@/actions/user.js';
import { redirect } from 'next/navigation';
import React from 'react'
import DashboardView from './_components/DashboardView';

const IndustryInsightsPage = async() => {
  const { isOnboarded } = await userOnboardingStatus();
 console.log(isOnboarded)
  if (!isOnboarded) {
    redirect('/onboarding')
  }

  const insights = await getIndustryInsight();

  return (
    <div className='container mx-auto'>
      <DashboardView insights={insights}/>
    </div>
  )
}

export default IndustryInsightsPage