import React, { Suspense } from 'react';
import Loader from '@/components/Loader';

const InterviewLayout = ({children}) => {
  return (
    <div className='px-4 md:px-8 py-8 bg-slate-50/50 min-h-screen'>
      <Suspense 
       fallback={<Loader className="mt-12" />}
      >{children}</Suspense>
    </div>
  )
}

export default InterviewLayout

export async function generateMetadata() {
  return {
    title: "AI Mock Interview Practice | Careerly",
    description: "Practice real job interviews with AI. Improve answers, confidence, and interview performance."
  }
}

