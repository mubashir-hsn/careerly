import React, { Suspense } from 'react';
import Loader from '@/components/Loader';

const ResumeAnalyzer = ({children}) => {
  return (
    <div className='px-4 md:px-8 py-8 min-h-screen bg-slate-50/50'>
      <Suspense 
         fallback={<Loader className="mt-12" />}
        >
          {children}
        </Suspense>
    </div>
  )
}

export default ResumeAnalyzer

export async function generateMetadata() {
  return {
    title: "AI Resume Analyzer for Jobs | Careerly",
    description: "Analyze your resume with AI. Get instant feedback, improvements, and job match suggestions."
  }
}
