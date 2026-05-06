import { getCoverLetters } from '@/actions/cover-letter'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import CoverLetterList from './_components/cover-leter-list'

const AICoverLetterPage = async () => {

  const coverLetters = await getCoverLetters();

  return (
    <div className='space-y-4 container mx-auto min-h-screen'>
      <div className='flex flex-col items-start justify-start md:flex-row md:justify-between md:items-center md:gap-2 pt-4'>
        <h1 className='text-4xl font-black text-slate-900 tracking-tighter'>My Cover Letter</h1>
        <Link href={'/ai-cover-letter/new'}>
          <Button>Create New</Button>
        </Link>
      </div>

      <CoverLetterList coverLetters={coverLetters} />

    </div>
  )
}

export default AICoverLetterPage