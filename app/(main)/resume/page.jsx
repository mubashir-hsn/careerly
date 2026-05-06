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
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 px-2 md:px-0">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        Resume Management
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Create, analyze, and manage your ATS-friendly professional resumes.
                    </p>
                </div>
                <div className='flex gap-4'>
                    <Link href={'/resume/resume-builder'}>
                        <Button className="rounded-xl font-bold bg-slate-900">
                            <FileText className="w-4 h-4 mr-2" />
                            Build Resume
                        </Button>
                    </Link>

                    <Link href={'/resume/resume-analyzer'}>
                        <Button variant="outline" className="rounded-xl font-bold border-slate-200">
                            <FileScan className="w-4 h-4 mr-2" />
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