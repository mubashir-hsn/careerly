import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Trophy, XCircle } from 'lucide-react';
import React from 'react'

const QuizResult = ({result,onStartNew, hideStartNew=false}) => {
    if (!result) {
        return null;
    }
  return (
    <div className='mx-auto'>
        <h1 className='flex items-center gap-2 text-3xl gradient-subtitle'>
          <Trophy className='w-6 h-6 text-yellow-500'/>
          Quiz Result
        </h1>

        <CardContent className={'space-y-6'}>
            {/* Score overview */}
            <div className='text-center space-y-2'>
               <h3 className='text-2xl font-bold'>{result.quizScore.toFixed(1)}%</h3>
               <Progress value={result.quizScore} className={'w-full'}/>
            </div>

            {/* Improvement Tip */}

            {
                result.improvementTip && (
                    <div className=' bg-muted p-4 rounded-lg'>
                       <p className='font-medium'>Improvement Tip:</p>
                       <p className='text-muted-foreground'>{result.improvementTip}</p>
                    </div>
                )
            }

            <div className=' space-y-4'>
              <h1 className='font-medium'>Question Review</h1>
              {
                result.questions.map((q,index)=>(
                    <div key={index} className='border rounded-lg space-y-2 p-4'>
                        <div className='flex items-start justify-between gap-2'>
                            <p className='font-medium'>{q.question}</p>
                            {
                                q.isCorrect ? (
                                   <CheckCircle2 className='w-5 h-5 text-green-500 flex-shrink-0'/>
                                ) : (
                                   <XCircle className='w-5 h-5 text-red-500 flex-shrink-0'/>
                                ) 
                            }
                        </div>

                        <div className='text-sm text-muted-foreground'>
                           <p>Your Answer: {q.userAnswer}</p>
                           {!q.isCorrect && <p>Correct Answer: {q.answer}</p>}
                        </div>

                        <div className='bg-muted p-2 rounded text-sm'>
                           <p className='font-medium'>Explanation:</p>
                           <p>{q.explanation}</p>
                        </div>
                    </div>
                ))
              }
            </div>
        </CardContent>

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