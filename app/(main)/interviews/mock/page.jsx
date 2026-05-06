import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Quiz from '../_components/Quiz'

const MockInterviewPage = () => {
  return (
    <div className='container pt-2 pb-6 space-y-4 mx-auto'>
      <div className=' flex flex-col mx-2'>
        <Link
          href="/interviews"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="font-bold text-sm uppercase tracking-widest">Back to Interview Preparation</span>
        </Link>


        <div>
          <h1 className='text-4xl md:text-5xl font-black text-slate-900 tracking-tighter'>Mock Interview</h1>
          <p className='text-slate-500 mt-1 text-lg font-medium opacity-80'>
            Test your knowledge with industry-specific questions
          </p>
        </div>

        <Quiz />
      </div>
    </div>
  )
}

export default MockInterviewPage