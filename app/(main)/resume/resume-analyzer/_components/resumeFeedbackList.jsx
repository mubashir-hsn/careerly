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

const ResumeFeedbackList = ({ feedbacks }) => {
  const router = useRouter();

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
      <div className='grid md:grid-cols-2 gap-5'>
      {
        feedbacks.map((feedback) => (
          <Card key={feedback.id} className="group relative">
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start justify-start gap-4 md:justify-between">
                <div>
                  <CardTitle className=" flex items-center gap-5">
                    <ScoreGauge score={feedback.overallScore} />
                    <div className='flex flex-col justify-start'>
                      <h1 className='text-lg gradient-subtitle'>{feedback?.jobTitle} at {feedback?.companyName}</h1>
                      <p className={'flex items-center text-slate-400 text-xs'}>
                        <Calendar className='w-4 h-4 mr-2' /> {format(new Date(feedback?.createdAt), "PPP")}
                      </p>
                    </div>
                  </CardTitle>
                </div>

                <div className="flex space-x-2">
                  <AlertDialog>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => router.push(`/resume/resume-analyzer/${feedback.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Resume Feedback?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your resume feedback for {feedback.jobTitle} at{" "}
                          {feedback.companyName}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          // onClick={() => handleDelete(feedback.id)}
                          className="bg-destructive text-white hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardDescription>

            </CardDescription>

            <CardContent>
              <div className="line-clamp-3 bg-slate-100 text-slate-500 border-l-2 border-blue-500 rounded-lg p-4">
                <p className='font-bold'>Requirements:</p>
                <p className='text-sm'>{feedback?.jobDescription}</p>
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