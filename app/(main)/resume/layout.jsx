import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners'

const ResumeLayout = ({children}) => {
    return (
      <div className='py-5 px-2 md:px-5 bg-slate-100'>
        <Suspense 
         fallback={<BarLoader className='mt-4' width={'100%'} color='gray'/>}
        >
          {children}
        </Suspense>
      </div>
    )
}

export default ResumeLayout

export async function generateMetadata() {
  return {
    title: "Resume | Careerly AI Career Coach",
    description: "View, edit, and manage your professional resume and feedbacks powered by AI career tools."
  }
}

