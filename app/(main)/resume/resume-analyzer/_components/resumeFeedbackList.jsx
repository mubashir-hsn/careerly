'use client'
import React from 'react'
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Eye, Trash2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ResumeFeedbackList = ({ feedbacks }) => {
    const router = useRouter();

    if (!feedbacks?.length) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No Resume Feedback Yet</CardTitle>
                    <CardDescription>
                        Analyze your resume to get professional feedback
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }
    return (
        <div className='space-y-4 mt-8'>
            <h1 className='border-b-2 pb-1.5 border-gray-500 text-gray-700 text-xl md:text-2xl font-semibold'>Resume Feedbacks</h1>
            {
                feedbacks.map((feedback) => (
                    <Card key={feedback.id} className="group relative">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-lg md:text-xl gradient-subtitle">
                                        {feedback?.jobTitle} at {feedback?.companyName}
                                    </CardTitle>
                                    <CardDescription>
                                        Created: {format(new Date(feedback?.createdAt), "PPP")}
                                    </CardDescription>
                                </div>

                                <div className='flex space-x-2'>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => router.push(`/resume/resume-analyzer/${feedback.id}`)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="text-sm line-clamp-3">
                                {feedback?.jobDescription}
                            </div>
                        </CardContent>
                    </Card>
                ))
            }
        </div>
    )
}

export default ResumeFeedbackList