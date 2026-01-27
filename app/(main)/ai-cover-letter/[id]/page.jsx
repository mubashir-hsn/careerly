import { getCoverLetter } from '@/actions/cover-letter';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import CoverLetterPreview from '../_components/cover-letter-preview';

const CoverLetterPage = async ({ params }) => {
  const {id} = await params;
  const coverLetter = await getCoverLetter(id);


  return (
    <div className='py-5 container mx-auto md:px-4'>
      <div className='pb-2'>
        <Link href={'/ai-cover-letter'}>
          <Button variant={'link'} className={'gap-2 pl-0'}>
            <ArrowLeft className='w-4 h-4' />
            Back to Cover Letters
          </Button>
        </Link>
      </div>

      <CoverLetterPreview coverLetter={coverLetter}/>
    </div>
  )
}

export default CoverLetterPage