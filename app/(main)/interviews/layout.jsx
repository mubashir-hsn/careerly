import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners'

const InterviewLayout = ({children}) => {
  return (
    <div className='px-5 py-4 bg-slate-100'>
      <Suspense 
       fallback={<BarLoader className='mt-4' width={'100%'} color='gray'/>}
      >{children}</Suspense>
    </div>
  )
}

export default InterviewLayout