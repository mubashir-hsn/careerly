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
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import QuizResult from './QuizResult';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trash2, X } from 'lucide-react';
import { deleteAssessment } from '@/actions/interview';
import useFetch from '@/hooks/useFetch';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const QuizList = ({ assessments }) => {
    const router = useRouter();
    const [selectedQuiz, setSelectedQuiz] = useState(null)
    const [localAssessments, setLocalAssessments] = useState(assessments);

    const { loading: deletingId, fn: deleteFn, data: deleteResult } = useFetch(deleteAssessment);

    const handleDelete = async (id) => {
        await deleteFn(id);
        setLocalAssessments((prev) => prev.filter((a) => a.id !== id));
        toast.success("Quiz deleted successfully");
    };

    return (
        <>
            <div className='space-y-5 max-w-6xl mx-auto mt-5'>
                <div className={'flex flex-col items-start justify-start gap-2 px-2 md:flex-row md:items-center md:justify-between pt-5 md:px-4'}>
                    <div>
                        <h1 className={'text-2xl md:text-3xl font-bold tracking-tight'}>Recent Quiz Sessions</h1>
                        <p className='text-sm text-slate-500 font-normal'>Review and manage your past interview performance.</p>
                    </div>

                    <Button onClick={() => router.push('/interviews/mock')} className="shadow-lg hover:scale-105 transition-all">
                        Start New Quiz
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 md:px-4">
                    {localAssessments?.map((assessment, i) => (
                        <Card
                            key={assessment.id}
                            className="group relative w-full h-fit cursor-pointer hover:border-primary/20 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white"
                            onClick={() => setSelectedQuiz(assessment)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="secondary" className={'bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider px-2'}>
                                        {assessment.category}
                                    </Badge>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                                onClick={(e) => e.stopPropagation()}
                                                disabled={deletingId}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Quiz Result?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete your
                                                    quiz results for "{assessment.title}".
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDelete(assessment.id)}
                                                    className="bg-destructive text-white hover:bg-destructive/90"
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                                <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                                    {assessment?.title}
                                </CardTitle>
                                <CardDescription className="flex justify-between items-center w-full mt-2">
                                    <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${assessment.quizScore === 100 ? 'bg-green-100 text-green-700' : assessment.quizScore >= 50 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                        Score: {assessment.quizScore.toFixed(0)}%
                                    </div>
                                    <div className='text-slate-400 text-xs font-medium flex items-center'>
                                        <Calendar className='w-3 h-3 mr-1.5'/>
                                        {format(new Date(assessment.createdAt), "MMM dd, yyyy")}
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            {assessment.improvementTip && (
                                <CardContent className="pt-0">
                                    <div className="group/tip relative flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100/50 transition-colors hover:bg-blue-50/50 hover:border-blue-100">
                                        <div className="mt-0.5"><div className="h-1.5 w-1.5 rounded-full bg-blue-500" /></div>
                                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                            <span className='font-bold text-slate-700'>Tip:</span> {assessment.improvementTip}
                                        </p>
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    ))}

                    {localAssessments?.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-400 font-medium">No quiz results found. Start your first quiz today!</p>
                        </div>
                    )}
                </div>
            </div>


            {
                selectedQuiz && <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className='w-full max-w-4xl max-h-[90vh] bg-white rounded-[2rem] overflow-hidden shadow-2xl relative flex flex-col'>
                         <div className="sticky top-0 right-0 p-4 flex justify-end z-10">
                            <Button 
                                variant="outline"
                                size="icon"
                                onClick={()=> setSelectedQuiz(null)} 
                                className='bg-white/80 backdrop-blur-md rounded-full border-slate-200 shadow-sm hover:bg-slate-100'
                            >
                                <X className='w-5 h-5'/>
                            </Button>
                        </div>
                        <div className="overflow-y-auto px-6 pb-8 md:px-10">
                            <QuizResult
                                result={selectedQuiz}
                                onStartNew={() => router.push('/interviews/mock')}
                                hideStartNew
                            />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}


export default QuizList