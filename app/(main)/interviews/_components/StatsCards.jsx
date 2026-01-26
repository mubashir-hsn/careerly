import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Target, Trophy } from 'lucide-react';
import React from 'react'

const StatsCards = ({ assessments }) => {

    const getAverageScore = () => {
        if (!assessments?.length) return 0;
        const total = assessments.reduce(
            (sum, assessment) => sum + assessment.quizScore,
            0
        );
        return (total / assessments.length).toFixed(1);
    };

    const getLatestAssessment = () => {
        if (!assessments?.length) return null;
        return assessments[assessments.length - 1];
    };
    
    const getTotalQuestions = () => {
        if (!assessments?.length) return 0;
        return assessments.reduce(
            (sum, assessment) => sum + assessment.questions.length,
            0
        );
    };

    return (
        <div className='grid gap-4 md:grid-cols-3'>
            <Card>
                <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
                    <span className='bg-blue-100 p-2 rounded-lg'><Trophy className={`h-5 w-5 text-blue-500`} /></span>
                    <CardTitle className="font-medium uppercase tracking-tight text-sm text-slate-500">
                        Average Score
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-500">{getAverageScore()}%</div>
                    <p className="text-sm text-slate-600 capitalize">
                        Across all assessments
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
                    <span className='bg-purple-100 p-2 rounded-lg'><Brain className="h-5 w-5 text-purple-500" /></span>
                    <CardTitle className="font-medium uppercase tracking-tight text-sm text-slate-500">
                        Questions Practiced
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-purple-500">{getTotalQuestions()}</div>
                    <p className="text-sm text-slate-600 capitalize">Total Questions</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
                    <span className='bg-green-100 p-2 rounded-lg'><Target className="h-5 w-5 text-green-500" /></span>
                    <CardTitle className="font-medium uppercase tracking-tight text-sm text-slate-500">Latest Score</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-500">
                        {getLatestAssessment()?.quizScore.toFixed(1) || 0}%
                    </div>
                    <p className="text-sm capitalize text-slate-600">Most recent quiz</p>
                </CardContent>
            </Card>

        </div>
    )
}

export default StatsCards