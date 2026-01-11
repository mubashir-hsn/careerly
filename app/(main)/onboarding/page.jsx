import React from 'react'
import OnBoardingForm from './_components/OnBoardingForm'
import { industries } from '@/data/industries'
import { userOnboardingStatus } from '@/actions/user'
import { redirect } from 'next/navigation'

const onBoardingPage = async() => {
  const { isOnboarded } = await userOnboardingStatus();

  if (isOnboarded) {
    redirect('/dashboard')
  }
  return (
    <div className='bg-slate-100 min-h-screen pb-10'>
      <OnBoardingForm industries={industries}/>
    </div>
  )
}


export default onBoardingPage