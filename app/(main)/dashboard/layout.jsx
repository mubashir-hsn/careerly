import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners'

const DashboardLayout = ({children}) => {
  return (
    <div className='md:px-5 px-2 bg-slate-100 pb-5'>
      <div className='mb-4 pt-8'>
        <h1 className='text-3xl md:text-4xl gradient-subtitle'>Industry Insights</h1>
        <p className="text-slate-500">Real-time career intelligence tailored to your profile</p>
      </div>
      <Suspense 
       fallback={<BarLoader className='mt-4' width={'100%'} color='gray'/>}
      >{children}</Suspense>
    </div>
  )
}

export default DashboardLayout

export async function generateMetadata() {
  return {
    title: "AI Industry Insights for Jobs and Careers | Careerly",
    description: "Latest AI industry insights, job trends, skills demand, and career guidance to help you grow faster in tech."
  }
}

