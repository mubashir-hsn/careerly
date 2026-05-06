import React, { Suspense } from 'react';
import Loader from '@/components/Loader';

const DashboardLayout = ({ children }) => {
  return (
    <div className='md:px-8 px-4 min-h-screen pb-12'>
      <Suspense
        fallback={<Loader className="mt-12" />}
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

