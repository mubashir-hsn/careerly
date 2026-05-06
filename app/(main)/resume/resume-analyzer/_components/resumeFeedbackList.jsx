'use client'
import React from 'react'
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar, Eye, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import ScoreGauge from './score-guage';
import { toast } from 'sonner';
import { deleteResumeFeedback } from '@/actions/resume-analyzer';

const ResumeFeedbackList = ({ feedbacks }) => {
  const router = useRouter();

  const handleDelete = async (id) => {
    try {
      await deleteResumeFeedback(id);
      toast.success('Resume feedback deleted successfully.')
      router.refresh();
    } catch (error) {
      console.log('Error while deleting resume feedback: ', error)
      toast.error('Failed to delete resume feedback.')
    }
  }

  if (!feedbacks?.length) {
    return (
      <Card className={'bg-white'}>
        <CardHeader>
          <CardTitle>No Resume Feedback Yet</CardTitle>
          <CardDescription className={'text-muted-foreground'}>
            Analyze your resume to get professional feedback
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  return (
    <div className='space-y-4 mt-8'>
      <h1 className='border-b-2 pb-1.5 border-gray-500 text-gray-700 text-xl md:text-2xl font-semibold'>Resume Feedbacks</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {
          feedbacks.map((feedback) => (
            <Card key={feedback.id} className="group relative border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/20 rounded-3xl bg-white overflow-hidden transition-all duration-300">
              <CardHeader className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-5">
                    <ScoreGauge score={feedback.overallScore} />
                    <div className='space-y-0.5'>
                      <h3 className='text-lg font-black text-slate-900 tracking-tight leading-tight group-hover:text-primary transition-colors'>
                        {feedback?.jobTitle}
                      </h3>
                      <p className="text-sm font-bold text-slate-500">
                        {feedback?.companyName}
                      </p>
                      <div className='flex items-center gap-1.5 text-slate-400 mt-1'>
                        <Calendar className='w-3 h-3' /> 
                        <span className="text-[10px] font-bold uppercase tracking-wider">{format(new Date(feedback?.createdAt), "PPP")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => router.push(`/resume/resume-analyzer/${feedback.id}`)}
                      className="h-8 w-8 rounded-lg border-slate-200 text-slate-500 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg border-slate-200 text-slate-500 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-3xl border-none shadow-2xl p-8">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl font-black tracking-tight text-slate-900">Remove Analysis Report?</AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-500 font-medium mt-2">
                             This will permanently delete the AI evaluation for <span className="font-bold text-slate-900">{feedback.jobTitle}</span>. This action is irreversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-8 gap-3">
                          <AlertDialogCancel className="h-11 rounded-xl font-bold border-slate-200 bg-slate-50">Keep Report</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(feedback.id)}
                            className="h-11 rounded-xl font-black uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 pt-0">
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 group-hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="h-3 w-1 bg-primary/40 rounded-full" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Position Details</span>
                  </div>
                  <p className='text-xs text-slate-600 leading-relaxed line-clamp-2 font-medium italic'>
                    "{feedback?.jobDescription}"
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        }
      </div>
    </div>
  )
}

export default ResumeFeedbackList