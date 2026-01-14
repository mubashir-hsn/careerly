import { getAllResumeFeedbacks } from '@/actions/resume-analyzer'
import React from 'react'
import ResumeFeedbackList from './resume-analyzer/_components/resumeFeedbackList';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileScan, FileText } from 'lucide-react';

const ResumePage = async () => {
    const feedbacks = await getAllResumeFeedbacks();
    return (
        <>
            <div className='space-y-3 md:text-center bg-white rounded-lg flex flex-col justify-start items-start md:justify-center md:items-center py-6 w-full h-75'>
                <div className='px-2 space-y-3'>
                    <h1 className='text-2xl md:text-4xl font-extrabold bg-linear-to-b from-gray-700 via-gray-600 to-gray-700 text-transparent bg-clip-text'>Smart Resume Creation And Analyzer</h1>
                    <p className='text-muted-foreground'>Generate ATS-optimized resume and analyze with AI assistance.</p>
                </div>

                <div className='flex justify-start items-center gap-4 mt-4 pl-4'>
                    <Link href={'/resume/resume-builder'}>
                        <Button>
                            <FileText className="w-4 h-4" />
                            Build Resume
                        </Button>
                    </Link>

                    <Link href={'/resume/resume-analyzer'}>
                        <Button variant="outline">
                            <FileScan className="w-4 h-4" />
                            Analyze Resume
                        </Button>
                    </Link>
                </div>

            </div>

            <div className='container mx-auto mt-5 md:px-5 pb-5'>
                <ResumeFeedbackList feedbacks={feedbacks} />
            </div>

        </>
    )
}

export default ResumePage