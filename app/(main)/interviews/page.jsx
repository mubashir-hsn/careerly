import { getAssessments } from '@/actions/interview'
import React from 'react'
import StatsCards from './_components/StatsCards';
import PerformanceChart from './_components/PerformanceChart';
import QuizList from './_components/QuizList';

const InterviewPage = async () => {

  const assessments = await getAssessments();
  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 px-2 md:px-0">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Interview Preparation
          </h1>
          <p className="text-slate-500 font-medium">
            Track your progress and practice with AI-powered mock interviews.
          </p>
        </div>
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