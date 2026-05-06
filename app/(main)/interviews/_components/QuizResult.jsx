import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BrainCircuit, CheckCircle2, FileText, Trophy, XCircle } from 'lucide-react';
import React from 'react'

const QuizResult = ({ result, onStartNew, hideStartNew = false }) => {
    if (!result) {
        return null;
    }
    return (
    <div className='w-full space-y-8 animate-in fade-in zoom-in duration-500'>
        {/* Header with Score */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 to-slate-800 p-8 shadow-2xl text-white">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <Trophy className="w-32 h-32" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                        Quiz Completed!
                    </h1>
                    <p className="text-slate-400 font-medium text-lg">Here's how you performed in your interview session.</p>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="58"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-slate-700"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="58"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={364.4}
                                strokeDashoffset={364.4 - (364.4 * result.quizScore) / 100}
                                className={`${result.quizScore >= 80 ? 'text-green-500' : result.quizScore >= 50 ? 'text-blue-500' : 'text-red-500'} transition-all duration-1000 ease-out`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="absolute text-3xl font-black tracking-tighter">
                            {result.quizScore.toFixed(0)}%
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* Improvement Tip Card */}
        {result.improvementTip && (
            <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-linear-to-r from-blue-50 to-indigo-50 p-6 shadow-sm transition-all hover:shadow-md">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-200">
                        <BrainCircuit className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-slate-900 mb-1">Growth Insight</h4>
                        <p className="text-slate-600 leading-relaxed font-medium capitalize italic">{result.improvementTip}</p>
                    </div>
                </div>
            </div>
        )}

        {/* Question Review Section */}
        <div className='space-y-6'>
            <div className="flex items-center justify-between px-2">
                <h2 className='text-2xl font-bold text-slate-900 flex items-center gap-2'>
                    <FileText className="w-6 h-6 text-primary" />
                    Detailed Analysis
                </h2>
                <Badge variant="outline" className="px-4 py-1 rounded-full border-slate-200 text-slate-600 font-semibold bg-white">
                    {result.questions.length} Questions
                </Badge>
            </div>

            <div className="grid gap-6">
                {result.questions.map((q, index) => (
                    <Card key={index} className="group relative overflow-hidden border-slate-200/60 shadow-xs transition-all hover:border-primary/20 hover:shadow-lg rounded-2xl bg-white">
                        <div className={`absolute top-0 left-0 h-full w-1.5 ${q.isCorrect ? 'bg-green-500' : 'bg-red-500'}`} />
                        
                        <CardHeader className="pb-4">
                            <div className='flex items-start justify-between gap-4'>
                                <div className="space-y-1">
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Question {index + 1}</span>
                                    <h3 className='text-lg font-bold text-slate-900 leading-tight'>{q.question}</h3>
                                </div>
                                {q.isCorrect ? (
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600 border border-green-100 shadow-sm">
                                        <CheckCircle2 className='w-6 h-6' />
                                    </div>
                                ) : (
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 border border-red-100 shadow-sm">
                                        <XCircle className='w-6 h-6' />
                                    </div>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-xl border transition-colors ${q.isCorrect ? 'bg-green-50/30 border-green-100' : 'bg-red-50/30 border-red-100'}`}>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Your Answer</p>
                                    <p className={`font-semibold ${q.isCorrect ? 'text-green-700' : 'text-red-700'}`}>{q.userAnswer}</p>
                                </div>
                                {!q.isCorrect && (
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 transition-colors">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Correct Solution</p>
                                        <p className="font-semibold text-slate-900">{q.answer}</p>
                                    </div>
                                )}
                            </div>

                            <div className='relative overflow-hidden rounded-xl bg-slate-50/50 p-5 ring-1 ring-slate-100 group-hover:bg-slate-50 transition-colors'>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-white shadow-sm border border-slate-200">
                                        <span className="text-[10px] font-black text-slate-500">i</span>
                                    </div>
                                    <div>
                                        <p className='text-xs font-bold text-slate-500 uppercase tracking-widest mb-1'>Explanation</p>
                                        <p className='text-[15px] font-medium text-slate-600 leading-relaxed'>{q.explanation}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

        {!hideStartNew && (
            <CardFooter className="pt-4 border-t border-slate-100">
                <Button 
                    onClick={onStartNew} 
                    className='w-full py-6 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all'
                >
                    Prepare for Next Round
                </Button>
            </CardFooter>
        )}
    </div>

    )
}

export default QuizResult