import React from 'react'
import ResumeBuilder from './_components/ResumeBuilder';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getResume } from '@/actions/resume';

const ResumeBuilderPage = async() => {
  const resume = await getResume();
  return (
    <div className='py-2 md:py-5 mx-auto container'>
      <Link href={'/resume'}>
          <Button variant={'link'} className={'font-medium'}>
            <ArrowLeft className='w-4 h-4' /> Back to resume page
          </Button>
      </Link>

      <ResumeBuilder initialContent={resume?.content}/>
    </div>
  )
}

export default ResumeBuilderPage