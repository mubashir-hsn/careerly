import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners'

const ResumeBuilderLayout = ({children}) => {
  return (
    <div className='md:px-5 bg-slate-100 overflow-hidden'>
      <Suspense 
       fallback={<BarLoader className='mt-4' width={'100%'} color='gray'/>}
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
