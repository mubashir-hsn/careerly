import { getAssessments } from '@/actions/interview'
import React from 'react'
import StatsCards from './_components/StatsCards';
import PerformanceChart from './_components/PerformanceChart';
import QuizList from './_components/QuizList';

const InterviewPage = async () => {

  const assessments = await getAssessments();
  return (
    <>
      <div className='py-8 px-2 md:px-0'>
        <h1 className='text-4xl font-bold gradient-subtitle'>Interview Preparation</h1>
        <p className='text-slate-500 text-sm -mt-1 font-medium'>Track your progress and practical skills.</p>
      </div>
      <div className='space-y-4'>
        <StatsCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
      </div>
    </>
  )
}

export default InterviewPage