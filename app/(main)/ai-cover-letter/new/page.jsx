import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import CoverLetterGenerator from '../_components/cover-letter-generator'

const NewCoverLetterPage = () => {
    return (
        <div className='pb-5 container mx-auto px-4 bg-slate-100'>
            <div className='flex flex-col'>
                <Link href={'/ai-cover-letter'}>
                    <Button variant={'link'} className={'gap-2 pl-0'}>
                        <ArrowLeft className='w-4 h-4' />
                        Back to cover letter page
                    </Button>
                </Link>

                <div className="pb-6">
                    <h1 className="text-3xl font-bold gradient-subtitle">
                        Create Cover Letter
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Generate a tailored cover letter for your job application
                    </p>
                </div>

                <CoverLetterGenerator/>
            </div>
        </div>
    )
}

export default NewCoverLetterPage