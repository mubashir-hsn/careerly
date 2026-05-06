import React, { Suspense } from 'react';
import Loader from '@/components/Loader';

const ResumeLayout = ({children}) => {
    return (
      <div className='py-8 px-4 md:px-8 bg-slate-50/50 min-h-screen'>
        <Suspense 
         fallback={<Loader className="mt-12" />}
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

