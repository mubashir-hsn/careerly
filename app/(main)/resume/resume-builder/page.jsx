import React from 'react'
import ResumeBuilder from './_components/ResumeBuilder';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getResume } from '@/actions/resume';

const ResumeBuilderPage = async () => {
  const resume = await getResume();
  return (
    <div className='py-2 md:py-5 mx-auto container'>
      <ResumeBuilder initialContent={resume?.content} />
    </div>
  )
}

export default ResumeBuilderPage