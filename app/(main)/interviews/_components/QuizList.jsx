"use client"
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import QuizResult from './QuizResult';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const QuizList = ({ assessments }) => {
    const router = useRouter();



    const [selectedQuiz, setSelectedQuiz] = useState(null)
    return (
        <>
            <div className='space-y-5 max-w-6xl mx-auto mt-5'>
                <div className={'flex flex-row items-center justify-between pt-5'}>
                    <div>
                        <h1 className={'text-3xl gradient-subtitle'}>Recent Quiz's</h1>
                        <p className='text-sm text-slate-500 font-normal -mt-2'>Review your past quiz performance.</p>
                    </div>

                    <Button onClick={() => router.push('/interviews/mock')}>
                        Start New Quiz
                    </Button>
                </div>

                <div className="space-y-4 grid md:grid-cols-2 gap-5">
                    {assessments?.map((assessment, i) => (
                        <Card
                            key={assessment.id}
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => setSelectedQuiz(assessment)}
                        >
                            <CardHeader>
                                <CardTitle className="gradient-subtitle text-xl capitalize flex flex-col gap-2">
                                    <Badge className={'bg-purple-100 text-purple-500 text-xs'}>{assessment.category}</Badge>
                                    {i + 1}. {assessment?.title}
                                </CardTitle>
                                <CardDescription className="flex justify-between w-full">
                                    <div className={` font-medium ${assessment.quizScore === 100 ? 'text-green-500' : assessment.quizScore >= 50 ? 'text-blue-500' : 'text-red-500'}`}>
                                        Score: {assessment.quizScore.toFixed(1)}%
                                    </div>
                                    <div className='text-slate-500'>
                                        {format(
                                            new Date(assessment.createdAt),
                                            "MMMM dd, yyyy HH:mm"
                                        )}
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            {assessment.improvementTip && (
                                <CardContent>
                                    <p className="text-[12px] border-l-2 border-blue-500 bg-slate-100 text-slate-500 p-3 rounded">
                                        <span className='font-bold text-slate-600'>Improvement Tip</span> <br />
                                        {assessment.improvementTip}
                                    </p>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            </div>

            {/* Dialog Section */}

            {
                selectedQuiz && <div className="w-full min-h-screen flex justify-center items-center fixed bg-slate-500/40 top-0 left-0 z-100 mx-auto">
                    <div className='max-w-6xl h-[90vh] rounded-lg overflow-y-auto relative md:px-3 py-4 bg-slate-100'>
                        <QuizResult
                            result={selectedQuiz}
                            onStartNew={() => router.push('/interviews/mock')}
                            hideStartNew
                        />
                        <button onClick={()=> setSelectedQuiz(null)} className='absolute top-3 right-5 bg-slate-800 text-white p-2 cursor-pointer rounded-full text-center'>
                            <X className='w-5 h-5'/>
                        </button>
                    </div>
                </div>
            }

        </>
    )
}

export default QuizList