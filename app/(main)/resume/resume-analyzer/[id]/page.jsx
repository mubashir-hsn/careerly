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
      <div className="flex flex-col gap-4 mb-8 px-2 md:px-0">
        <Link 
          href="/resume" 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="font-bold text-sm uppercase tracking-widest">Back to Resumes</span>
        </Link>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Resume Review
            </h1>
            <p className="text-slate-500 font-medium">
              Analyze your resume to get professional feedback and ATS optimization.
            </p>
          </div>
          <Previewbtn resumeUrl={feedback.resumeUrl}/>
        </div>
      </div>

      <div className='w-full md:max-w-6xl mx-auto flex flex-col gap-8 items-start justify-around mb-4 md:flex-row mt-3 p-2'>
        <Summary feedback={feedback} />
        <Ats score={feedback.atsScore || 0} suggestions={feedback.aiFeedback.ATS.tips || []} />
      </div>
      <div className='w-full md:max-w-5xl mx-auto p-2'>
        <Details feedback={feedback} />
      </div>
    </>
  )
}

export default ResumeReviewPage