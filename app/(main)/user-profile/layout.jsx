import React, { Suspense } from 'react';
import Loader from '@/components/Loader';

const ProfileLayout = ({children}) => {
  return (
    <div className='px-4 md:px-8 py-8 bg-slate-50/50 min-h-screen'>
      <Suspense 
       fallback={<Loader className="mt-12" />}
      >{children}</Suspense>
    </div>
  )
}

export default ProfileLayout

export async function generateMetadata() {
  return {
    title: "User Profile and Career Details | Careerly",
    description: "Manage your career profile, skills, experience, and preferences in one place."
  }
}
