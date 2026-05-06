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
import { Loader2, Sparkles } from 'lucide-react';
import QuizResult from './QuizResult';
import { Input } from '@/components/ui/input';
import Loader from '@/components/Loader';

const Quiz = () => {

    // Quiz states
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [showExplanation, setShowExplanation] = useState(false);
    const [quizQuestion, setQuizQuestion] = useState(5);
    const [error, setError] = useState("")

    // User input states
    const [jobRole, setJobRole] = useState("");
    const [experienceLevel, setExperienceLevel] = useState("fresher");
    const [skills, setSkills] = useState("");
    const [interviewType, setInterviewType] = useState("technical");

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
        const quizDetail = {
            jobRole,
            interviewType,
            skills: skills.split(",").map(s => s.trim())
        }

        try {
            await saveQuizResultFn({
                questions: quizData,
                answers,
                score,
                quizDetail,
              });
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
        if (!jobRole || !experienceLevel || !skills || !interviewType) {
            setError("Please fill all interview details.")
            return
        }
        if(jobRole.length > 40){
            setError('Job role too long')
            return
        }
        if(skills.length > 150){
            setError('Skills too long')
            return
        }

        setError("");

        const data = {
            quizQuestion: Number(quizQuestion),
            interviewType,                       // technical | hr | behavioral | mixed
            jobRole,                             // e.g., Frontend Developer
            experienceLevel,                     // fresher | 1-3 | senior
            skills: skills.split(",").map(s => s.trim()) // convert comma-separated to array
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
        return <Loader className="mt-12" />
    }

    if (!quizData) {
        return (
            <Card className="w-full md:w-[95%] mx-auto mt-8 border-none shadow-2xl overflow-hidden rounded-[2rem] bg-white">
                <div className="bg-linear-to-br from-slate-900 to-slate-800 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                        <CardTitle className="text-3xl md:text-4xl font-black tracking-tight mb-2">
                            Ready to test your knowledge?
                        </CardTitle>
                        <p className="text-slate-400 text-lg font-medium">
                            Fill the form below to start your AI quiz.
                        </p>
                    </div>
                </div>

                <CardContent className="p-8 space-y-8">
                    <div className='grid md:grid-cols-2 gap-8'>
                        {/* Job Role */}
                        <div className="space-y-3">
                            <Label className="text-sm font-bold uppercase tracking-wider text-slate-500 ml-1">Target Role or Position</Label>
                            <Input
                                placeholder="e.g. Intern, Developer, Medical Officer"
                                value={jobRole}
                                onChange={(e) => setJobRole(e.target.value)}
                                className={'h-12 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all'}
                            />
                        </div>
                        {/* Technology Stack */}
                        <div className="space-y-3">
                            <Label className="text-sm font-bold uppercase tracking-wider text-slate-500 ml-1">Skills or Background</Label>
                            <Input
                                placeholder="e.g. Programming, Patient Care, Accounting"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                className={'h-12 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all'}
                            />
                            <p className='text-xs text-muted-foreground ps-2 italic'>Separate multiple skills with commas</p>
                        </div>
                    </div>

                    <div className='grid md:grid-cols-2 gap-8'>
                        {/* Number of Questions */}
                        <div className="space-y-3">
                            <Label htmlFor="questions" className="text-sm font-bold uppercase tracking-wider text-slate-500 ml-1">Number of Questions</Label>
                            <Input
                                id="questions"
                                type="number"
                                min="5"
                                max="30"
                                value={quizQuestion}
                                onChange={(e) => setQuizQuestion(e.target.value)}
                                className={'h-12 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all'}
                            />
                        </div>
                        {/* Experience Level */}
                        <div className="space-y-3">
                            <Label className="text-sm font-bold uppercase tracking-wider text-slate-500 ml-1">Experience Level</Label>
                            <RadioGroup
                                value={experienceLevel}
                                onValueChange={setExperienceLevel}
                                className="flex gap-4 p-2 bg-slate-50 rounded-xl border border-slate-100"
                            >
                                {["fresher", "1-3", "senior"].map((level) => (
                                    <div key={level} className="flex items-center space-x-2 px-3 py-1 bg-white rounded-lg border border-slate-100 shadow-sm hover:border-primary/30 transition-all cursor-pointer">
                                        <RadioGroupItem value={level} id={level} className="text-primary" />
                                        <Label htmlFor={level} className={'capitalize font-semibold text-slate-600 cursor-pointer'}>
                                            {level === "1-3" ? "1-3 Years" : level}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    </div>

                    {/* Interview Type */}
                    <div className="space-y-3">
                        <Label className="text-sm font-bold uppercase tracking-wider text-slate-500 ml-1">Interview Type</Label>
                        <RadioGroup
                            value={interviewType}
                            onValueChange={setInterviewType}
                            className="flex gap-3 flex-wrap p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner"
                        >
                            {["technical", "hr", "behavioral", "mixed"].map(type => (
                                <div key={type} className="flex items-center space-x-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group">
                                    <RadioGroupItem value={type} id={type} className="text-primary" />
                                    <Label htmlFor={type} className={'capitalize font-bold text-slate-700 cursor-pointer group-hover:text-primary transition-colors'}>{type}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    {error && <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg border border-red-100">⚠️ {error}</p>}
                </CardContent>

                <CardFooter className="p-8 pt-0">
                    <Button 
                        className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all bg-primary hover:bg-primary/90" 
                        onClick={handleStartQuiz}
                    >
                        Start AI Quiz
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
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
            <Card className="border-none shadow-2xl overflow-hidden rounded-[2.5rem] bg-white">
                <div className="bg-linear-to-br from-slate-900 to-slate-800 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles className="w-24 h-24" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <p className="text-indigo-400 font-black uppercase tracking-[0.2em] text-xs mb-2">Quiz Progress</p>
                            <CardTitle className="text-2xl font-black">
                                Question {currentQuestion + 1} <span className="text-slate-500 text-lg font-bold ml-1">of {quizData.length}</span>
                            </CardTitle>
                        </div>
                        <div className="bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/10 flex items-center gap-3">
                            <div className="h-2 w-32 bg-white/20 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-primary transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                                    style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
                                />
                            </div>
                            <span className="text-xs font-black">{Math.round(((currentQuestion + 1) / quizData.length) * 100)}%</span>
                        </div>
                    </div>
                </div>

                <CardContent className="p-8 md:p-10 space-y-8">
                    <div className="relative">
                        <div className="absolute -left-4 top-0 h-full w-1.5 bg-primary rounded-full opacity-20" />
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug pl-4">
                            {question.question}
                        </h2>
                    </div>

                    <RadioGroup
                        onValueChange={handleAnswer}
                        value={answers[currentQuestion]}
                        className="grid grid-cols-1 gap-4"
                    >
                        {question.options.map((option, index) => {
                            const isSelected = answers[currentQuestion] === option;
                            return (
                                <div key={index} className="relative">
                                    <RadioGroupItem 
                                        value={option} 
                                        id={`option-${index}`} 
                                        className="sr-only" 
                                    />
                                    <Label 
                                        htmlFor={`option-${index}`}
                                        className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer group hover:shadow-md ${
                                            isSelected 
                                            ? "border-primary bg-primary/5 shadow-inner" 
                                            : "border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-slate-100"
                                        }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                            isSelected ? "border-primary bg-primary" : "border-slate-300 bg-white"
                                        }`}>
                                            {isSelected && <div className="w-2 h-2 rounded-full bg-white animate-in zoom-in duration-300" />}
                                        </div>
                                        <span className={`text-[15px] font-bold transition-colors ${
                                            isSelected ? "text-primary" : "text-slate-600 group-hover:text-slate-900"
                                        }`}>
                                            {option}
                                        </span>
                                    </Label>
                                </div>
                            );
                        })}
                    </RadioGroup>

                    {showExplanation && (
                        <div className="mt-8 animate-in slide-in-from-top-4 duration-500">
                             <div className="bg-indigo-50/50 border border-indigo-100 rounded-[1.5rem] p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <Sparkles className="w-16 h-16 text-indigo-600" />
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="h-6 w-1 bg-indigo-500 rounded-full" />
                                    <p className="text-xs font-black uppercase tracking-widest text-indigo-600">AI Explanation</p>
                                </div>
                                <p className="text-slate-600 font-medium leading-relaxed pl-3">
                                    {question.explanation}
                                </p>
                             </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="p-8 md:p-10 bg-slate-50 flex flex-col sm:flex-row gap-4 border-t border-slate-100">
                    {!showExplanation && (
                        <Button
                            onClick={() => setShowExplanation(true)}
                            variant='outline'
                            disabled={!answers[currentQuestion]}
                            className="w-full sm:w-auto h-14 px-8 rounded-xl font-bold bg-white border-slate-200 text-slate-600 hover:bg-slate-100 transition-all border-b-4 border-slate-200 active:border-b-0 active:translate-y-1"
                        >
                            Review Explanation
                        </Button>
                    )}

                    <Button
                        onClick={handleNext}
                        disabled={!answers[currentQuestion] || savingResult}
                        className="w-full sm:w-auto ml-auto h-14 px-10 rounded-xl font-black text-lg bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] border-b-4 border-primary-dark"
                    >
                        {savingResult ? (
                            <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                        ) : (
                            currentQuestion < quizData.length - 1 ? 'Next Question' : 'Finish Quiz'
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )

}

export default Quiz;
