import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Quiz from '../_components/Quiz'

const MockInterviewPage = () => {
  return (
    <div className=' container py-6 space-y-4 mx-auto'>
      <div className=' flex flex-col space-y-2 mx-2'>
        <Link href={'/interviews'}>
          <Button variant={'link'} className={'gap-2 pl-0'}>
            <ArrowLeft className='w-4 h-4' />
            Back to Interview Preparation
          </Button>
        </Link>

        <div>
          <h1 className='gradient-subtitle text-5xl font-bold'>Mock Interview</h1>
          <p className='text-muted-foreground'>
            Test your knowledge with industry-specific questions
          </p>
        </div>

        <Quiz/>
      </div>
    </div>
  )
}

export default MockInterviewPage