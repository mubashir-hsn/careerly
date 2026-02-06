import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners'

const ResumeAnalyzer = ({children}) => {
  return (
    <div className='px-2 md:px-5 py-5'>
      <Suspense 
         fallback={<BarLoader className='mt-4' width={'100%'} color='gray'/>}
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
