import React, { Suspense } from 'react';
import Loader from '@/components/Loader';

const ResumeBuilderLayout = ({children}) => {
  return (
    <div className='md:px-5 bg-slate-50/50 min-h-screen overflow-hidden'>
      <Suspense 
       fallback={<Loader className="mt-12" />}
      >{children}</Suspense>
    </div>
  )
}

export default ResumeBuilderLayout

export async function generateMetadata() {
  return {
    title: "AI Resume Builder for Modern Jobs | Careerly",
    description: "Build professional resumes using AI. Clean formats, role based content, and ATS friendly resumes."
  }
}
