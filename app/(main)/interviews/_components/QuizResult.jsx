import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Trophy, XCircle } from 'lucide-react';
import React from 'react'

const QuizResult = ({ result, onStartNew, hideStartNew = false }) => {
    if (!result) {
        return null;
    }
    return (
        <div className='mx-auto bg-gray-100'>
            <h1 className='flex items-center gap-2 text-3xl gradient-subtitle p-3'>
                <Trophy className='w-6 h-6 text-yellow-500' />
                Quiz Result
            </h1>
            {/* Score overview */}
            <div className={` text-center space-y-2 ${result.quizScore == 100 ? 'text-green-500' : result.quizScore >= 50 ? 'text-blue-500' : 'text-red-500'}`}>
                <h3 className='text-2xl font-bold'>{result.quizScore.toFixed(1)}%</h3>
                <Progress value={result.quizScore} />
            </div>
            {/* Improvement Tip */}
            {
                result.improvementTip && (
                    <div className="border-l-2 border-blue-500 bg-white my-4 text-slate-500 p-5 rounded-lg">
                        <p className='font-bold text-slate-800 md:text-lg'>Improvement Tip:</p>
                        <p className='text-slate-500 font-medium'>{result.improvementTip}</p>
                    </div>
                )
            }

            {/* Attemted Questions */}

            <div className='space-y-4 md:px-2'>
                <h1 className='font-medium pt-2 text-xl'>Question Review:</h1>
                {
                    result.questions.map((q, index) => (
                        <Card key={index} className='border rounded-lg p-4'>
                            <div className='flex items-start justify-between gap-2'>
                                <p className='font-medium'>Q{index+1}. {q.question}</p>
                                {
                                    q.isCorrect ? (
                                        <CheckCircle2 className='w-5 h-5 text-green-500 flex-shrink-0' />
                                    ) : (
                                        <XCircle className='w-5 h-5 text-red-500 flex-shrink-0' />
                                    )
                                }
                            </div>

                            <div className='text-[15px] text-slate-500'>
                                <p><b className='text-gray-800'>Your Answer:</b> {q.userAnswer}</p>
                                {!q.isCorrect && <p><b className='text-gray-800'>Correct Answer:</b> {q.answer}</p>}
                            </div>

                            <div className='text-sm max-w-4xl border-l-2 border-green-500 bg-slate-100 text-slate-500 p-3 rounded'>
                                <p className='font-bold'>Explanation:</p>
                                <p className='text-sm'>{q.explanation}</p>
                            </div>
                        </Card>
                    ))
                }
            </div>

            {
                !hideStartNew && (
                    <CardFooter>
                        <Button onClick={onStartNew} className={'w-full'}>
                            Start New Quiz
                        </Button>
                    </CardFooter>
                )
            }
        </div>
    )
}

export default QuizResult