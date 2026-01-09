import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners'

const InterviewLayout = ({children}) => {
  return (
    <div className='px-5 pb-5 bg-slate-100'>
      <div className='py-8'>
        <h1 className='text-4xl font-bold gradient-subtitle'>Interview Preparation</h1>
        <p className='text-slate-500 text-sm -mt-1 font-medium'>Track your progress and practical skills.</p>
      </div>
      <Suspense 
       fallback={<BarLoader className='mt-4' width={'100%'} color='gray'/>}
      >{children}</Suspense>
    </div>
  )
}

export default InterviewLayout