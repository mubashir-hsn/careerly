import { getResume } from '@/actions/resume'
import React from 'react'
import ResumeBuilder from './_components/ResumeBuilder';

const ResumePage = async() => {
  const resume = await getResume();
  return (
    <div className='py-5 mx-auto container'>
      <ResumeBuilder initialContent={resume?.content}/>
    </div>
  )
}

export default ResumePage