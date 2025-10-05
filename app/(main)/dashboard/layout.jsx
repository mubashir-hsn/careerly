import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners'

const DashboardLayout = ({children}) => {
  return (
    <div className='px-5'>
      <div className='flex justify-between items-center mb-5'>
        <h1 className='text-4xl gradient-subtitle'>Industry Insights</h1>
      </div>
      <Suspense 
       fallback={<BarLoader className='mt-4' width={'100%'} color='gray'/>}
      >{children}</Suspense>
    </div>
  )
}

export default DashboardLayout