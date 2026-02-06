import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners'

const ProfileLayout = ({children}) => {
  return (
    <div className='px-2 md:px-5 py-4 bg-slate-100'>
      <Suspense 
       fallback={<BarLoader className='mt-4' width={'100%'} color='gray'/>}
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
