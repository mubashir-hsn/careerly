import React, { Suspense } from 'react';
import Loader from '@/components/Loader';

const CoverLetter = ({ children }) => {
  return (
    <div className='py-8 px-4 md:px-8 min-h-screen'>
      <Suspense
        fallback={<Loader className="mt-12" />}
      >
        {children}
      </Suspense>
    </div>
  )
}

export default CoverLetter

export async function generateMetadata() {
  return {
    title: "AI Cover Letter Generator for Jobs | Careerly",
    description: "Create job ready cover letters using AI. Personalized, role based cover letters that help you stand out."
  }
}
