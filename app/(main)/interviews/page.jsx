import { getAssessments } from '@/actions/interview'
import React from 'react'
import StatsCards from './_components/StatsCards';
import PerformanceChart from './_components/PerformanceChart';
import QuizList from './_components/QuizList';

const InterviewPage = async() => {

  const assessments = await getAssessments();
  return (
      
      <div className='space-y-4'>
          <StatsCards assessments={assessments}/>
          <PerformanceChart assessments={assessments}/>
          <QuizList assessments={assessments}/>
      </div>
  )
}

export default InterviewPage