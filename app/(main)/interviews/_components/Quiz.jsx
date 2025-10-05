'use client'

import useFetch from '@/hooks/useFetch';
import { generateQuiz, saveQuizResult } from '@/actions/interview';
import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from '@/components/ui/button';
import { BarLoader } from 'react-spinners';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import QuizResult from './QuizResult';
import { Input } from '@/components/ui/input';

const Quiz = () => {

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [showExplanation, setShowExplanation] = useState(false);
    const [quizQuestion, setQuizQuestion] = useState(5);
    const [difficultyLevel, setDifficultyLevel] = useState('beginner');
    const [error, setError] = useState("")


    const {
        loading: quizLoading,
        fn: generateQuizFn,
        data: quizData
    } = useFetch(generateQuiz);

    const {
        loading: savingResult,
        fn: saveQuizResultFn,
        data: resultData,
        setData: setResultData
    } = useFetch(saveQuizResult);

    console.log(resultData);

    useEffect(() => {
        if (quizData) {
            setAnswers(new Array(quizData.length).fill(null))
        }
    }, [quizData])

    const handleAnswer = (answer) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answer;
        setAnswers(newAnswers);
    }

    const handleNext = () => {
        if (currentQuestion < quizData.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setShowExplanation(false);
        } else {
            finishQuiz();
        }
    }

    const calculateScore = () => {

        let correct = 0;

        answers.forEach((answer, index) => {
            if (answer === quizData[index].correctAnswer) {
                correct++;
            }
        })

        return (correct / quizData.length) * 100;

    }

    const finishQuiz = async () => {
        const score = calculateScore();

        try {
            await saveQuizResultFn(quizData, answers, score);
            toast.success("Quiz Completed.");
        } catch (error) {
            toast.error(error.message || "Failed to save quiz results.")
        }
    }


    const handleStartQuiz = () => {
        // Validation
        if (!quizQuestion || quizQuestion <= 0) {
            setError("Please enter a valid number of questions greater than 0.")
            return
        }

        if (quizQuestion > 30) {
            setError("You can select a maximum of 30 questions.")
            return
          }
        setError("") // clear error if valid

        const data = {
            quizQuestion: Number(quizQuestion),
            difficultyLevel,
        }

        generateQuizFn(data)
    }

    const startNewQuiz = () => {
        setCurrentQuestion(0);
        setAnswers([]);
        setShowExplanation(false)
        handleStartQuiz();
        setResultData(null);
    }

    if (quizLoading) {
        return <BarLoader className='mt-4' width={'100%'} color='gray' />
    }

    if (!quizData) {
        return (
            <Card className="w-full md:w-[95%] mx-auto mt-8">
                <CardHeader>
                    <CardTitle>Ready to test your knowledge?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        Choose how many questions you want and your difficulty level to begin.
                    </p>

                    {/* Number of Questions Input */}
                    <div className="space-y-2">
                        <Label htmlFor="questions">Number of Questions</Label>
                        <Input
                            id="questions"
                            type="number"
                            min="5"
                            max="30"
                            value={quizQuestion}
                            onChange={(e) => setQuizQuestion(e.target.value)}
                            placeholder="Enter number of questions 1-30"
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>

                    {/* Difficulty Level Radio */}
                    <div className="space-y-2">
                        <Label>Difficulty Level</Label>
                        <RadioGroup
                            value={difficultyLevel}
                            onValueChange={setDifficultyLevel}
                            className="flex gap-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="beginner" id="beginner" />
                                <Label htmlFor="beginner">Beginner</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="intermediate" id="intermediate" />
                                <Label htmlFor="intermediate">Intermediate</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="advanced" id="advanced" />
                                <Label htmlFor="advanced">Advanced</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </CardContent>

                <CardFooter>
                    <Button className="w-full" onClick={handleStartQuiz}>
                        Start Quiz
                    </Button>
                </CardFooter>
            </Card>
        )
    }


    // show result if quiz is completed

    if (resultData) {
        return (
            <div className='mx-2'>
                <QuizResult result={resultData} onStartNew={startNewQuiz} />
            </div>
        )
    }

    const question = quizData[currentQuestion];


    return (
        <div>
            <Card className={'mx-2'}>
                <CardHeader>
                    <CardTitle>Question {currentQuestion + 1} of {quizData.length}</CardTitle>
                </CardHeader>
                <CardContent className={' space-y-4'}>
                    <p className='text-lg font-medium'>
                        {question.question}
                    </p>

                    <RadioGroup
                        onValueChange={handleAnswer}
                        value={answers[currentQuestion]}
                        className="space-y-2"
                    >
                        {question.options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`option-${index}`} />
                                <Label htmlFor={`option-${index}`}>{option}</Label>
                            </div>
                        ))}
                    </RadioGroup>

                    {
                        showExplanation && <div className='mt-4 p-4 bg-muted rounded-lg'>
                            <p className='font-medium'>Explanation:</p>
                            <p className='text-muted-foreground pl-4 pt-2'>{question.explanation}</p>
                        </div>
                    }

                </CardContent>
                <CardFooter>
                    {
                        !showExplanation && (
                            <Button
                                onClick={() => setShowExplanation(true)}
                                variant={'outline'}
                                disabled={!answers[currentQuestion]}
                            >
                                Show Explanation
                            </Button>
                        )
                    }

                    <Button
                        onClick={handleNext}
                        className={'ml-4'}
                        disabled={!answers[currentQuestion] || savingResult}
                    >
                        {
                            savingResult && <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                        }
                        {
                            currentQuestion < quizData.length - 1 ? 'Next Question' : 'Finish Quiz'
                        }
                    </Button>

                </CardFooter>
            </Card>
        </div>
    )
}

export default Quiz;
