import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Summary from '../_components/summary'
import Ats from '../_components/ats'
import Details from '../_components/detail'
import { getResumeFeedback } from '@/actions/resume-analyzer'
import Previewbtn from '../_components/preview-btn'


const ResumeReviewPage = async ({ params }) => {
  const { id } = await params;

  const feedback = await getResumeFeedback(id);

  return (
    <>
      <div className='px-4 py-2 space-y-2'>
        <Link href={'/resume'}>
          <Button variant={'link'} className={'font-medium'}>
            <ArrowLeft className='w-4 h-4' /> Back to resume page
          </Button>
        </Link>
        <div className='flex justify-between p-1'>
          <h1 className='text-3xl font-bold text-gray-700'>
            Resume Review
          </h1>
          <Previewbtn resumeUrl={feedback.resumeUrl}/>
        </div>
      </div>

      <div className='max-w-6xl mx-auto flex flex-col gap-8 items-start justify-around mb-4 md:flex-row mt-3 p-2'>
        <Summary feedback={feedback} />
        <Ats score={feedback.atsScore || 0} suggestions={feedback.aiFeedback.ATS.tips || []} />
      </div>
      <div className='w-full max-w-5xl mx-auto p-2'>
        <Details feedback={feedback} />
      </div>
    </>
  )
}

export default ResumeReviewPage