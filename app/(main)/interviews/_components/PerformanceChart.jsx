"use client"
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const PerformanceChart = ({ assessments }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (assessments) {
            const formatedData = assessments.map((assessment) => (
                {
                    date: format(new Date(assessment.createdAt), "MMM dd"),
                    score: assessment.quizScore
                }
            ))

            setChartData(formatedData)
        }


    }, [assessments])

    return (
        <Card>
            <CardHeader>
                <CardTitle className={'gradient-subtitle text-3xl'}>
                    Performance Trend
                    <p className='text-sm text-slate-500 font-normal'>Your quiz score over time.</p>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload?.length) {
                                        return (
                                            <div className="bg-background border rounded-lg p-2 shadow-md">
                                                <p className="text-sm font-medium">
                                                    Score: {payload[0].value}%
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {payload[0].payload.date}
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="score"
                                stroke="black"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default PerformanceChart