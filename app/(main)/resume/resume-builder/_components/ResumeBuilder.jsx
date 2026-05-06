"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Loader2, Save, Sparkles } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resumeSchema } from '@/app/lib/schema'
import useFetch from '@/hooks/useFetch'
import { improveWithAI, saveResume } from '@/actions/resume'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import EntryForm from './EntryForm'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import Template from '@/components/Templates'
import PdfButton from '@/components/PdfButton'

const initialData = {
    contactInfo: {
        name: '',
        email: '',
        mobile: '',
        linkedin: '',
        portfolio: '',
        twitter: '',
        profession: ''
    },
    summary: '',
    skills: '',
    experience: [],
    education: [],
    projects: []
}

const ResumeBuilder = ({ initialContent }) => {
    const [activeTab, setActiveTab] = useState('edit');
    const [activeStyle, setActiveStyle] = useState('ats');
    const { user } = useUser();


    const {
        control,
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resumeSchema),
        defaultValues: initialData
    });

    const {
        loading: isSaving,
        fn: saveResumeFn,
        data: saveResult,
        error: saveError
    } = useFetch(saveResume);

    const formValues = watch();

    useEffect(() => {
        if (initialContent) setActiveTab("preview");
    }, [initialContent]);

    useEffect(() => {
        if (initialContent) {
            const savedData = JSON.parse(initialContent);
            reset(savedData);
        }
    }, [initialContent, reset]);

    // Handle save result
    useEffect(() => {
        if (saveResult && !isSaving) {
            toast.success("Resume saved successfully!");
        }
        if (saveError) {
            toast.error(saveError?.message || "Failed to save resume");
        }
    }, [saveResult, saveError, isSaving]);

    const onSubmit = async (formValues) => {
        try {
            const content = JSON.stringify(formValues);
            await saveResumeFn(content);
        } catch (error) {
            console.error("Resume Saving error:", error);
        }
    };


    const {
        loading: isImproving,
        fn: improveWithAIFn,
        data: improvedContent,
        error: improveError
    } = useFetch(improveWithAI);

    useEffect(() => {
      if (!user) return;

      const currentName = watch("contactInfo.name");

      if (!currentName && user.fullName) {
        setValue("contactInfo.name", user.fullName, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        });
      }
    }, [user, setValue, watch]);
    
    useEffect(() => {
        if (improvedContent && !isImproving) {
            setValue("summary", improvedContent);
            toast.success("Summary improved!");
        }
        if (improveError) {
            toast.error(improveError.message || "Failed to improve summary");
        }
    }, [improvedContent, improveError, isImproving, setValue]);

    const handleImprovedSummary = async () => {
        const summary = watch("summary");
        if (!summary) return;

        await improveWithAIFn({
            current: summary,
            type: 'summary'
        });
    }

    return (
        <>
        <div className="flex flex-col gap-4 mb-8 px-2 md:px-0">
            <Link 
                href="/resume" 
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
            >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span className="font-bold text-sm uppercase tracking-widest">Back to Resumes</span>
            </Link>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        Resume Builder
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Build your professional profile and generate a high-quality resume.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button
                        variant="destructive"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSaving}
                        className="rounded-xl font-bold"
                    >
                        {isSaving ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                        ) : (
                            <><Save className="mr-2 h-4 w-4" />Save Content</>
                        )}
                    </Button>
                    <PdfButton
                        data={formValues}
                        user={user}
                        activeStyle={activeStyle}
                        fileName={`${user?.firstName || "resume"}.pdf`}
                    />
                </div>
            </div>
        </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className={'bg-slate-200'}>
                    <TabsTrigger value="edit">Form</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="edit">
                    <form className='space-y-10' onSubmit={handleSubmit(onSubmit)}>
                        {/* Contact Information */}
                        <div className="space-y-6 mt-6 w-full">
                            <div className="flex items-center gap-3 pb-2 border-b-2 border-slate-100">
                                <div className="h-6 w-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.4)]" />
                                <h3 className="text-xl font-black tracking-tight text-slate-800">Contact Information</h3>
                            </div>
                            
                            <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                        <Input
                                            className={'h-12 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all font-semibold'}
                                            {...register("contactInfo.name")}
                                            type="text"
                                            placeholder="e.g. John Doe"
                                            error={errors.contactInfo?.name}
                                        />
                                        {errors.contactInfo?.name && (
                                            <p className="text-xs font-bold text-red-500 px-1">
                                                {errors.contactInfo?.name.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                        <Input
                                            className={'h-12 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all font-semibold'}
                                            {...register("contactInfo.email")}
                                            type="email"
                                            placeholder="john@example.com"
                                            error={errors.contactInfo?.email}
                                        />
                                        {errors.contactInfo?.email && (
                                            <p className="text-xs font-bold text-red-500 px-1">
                                                {errors.contactInfo.email.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Mobile Number</label>
                                        <Input
                                            className={'h-12 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all font-semibold'}
                                            {...register("contactInfo.mobile")}
                                            type="tel"
                                            placeholder="+1 234 567 890"
                                        />
                                        {errors.contactInfo?.mobile && (
                                            <p className="text-xs font-bold text-red-500 px-1">
                                                {errors.contactInfo.mobile.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Target Profession</label>
                                        <Input
                                            className={'h-12 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all font-semibold'}
                                            {...register("contactInfo.profession")}
                                            type="text"
                                            placeholder="e.g. Software Engineer"
                                        />
                                        {errors.contactInfo?.profession && (
                                            <p className="text-xs font-bold text-red-500 px-1">
                                                {errors.contactInfo.profession.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">LinkedIn Profile</label>
                                        <Input
                                            className={'h-12 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all font-semibold'}
                                            {...register("contactInfo.linkedin")}
                                            type="url"
                                            placeholder="https://linkedin.com/in/username"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Twitter/X Profile</label>
                                        <Input
                                            className={'h-12 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all font-semibold'}
                                            {...register("contactInfo.twitter")}
                                            type="url"
                                            placeholder="https://twitter.com/username"
                                        />
                                    </div>
                                    <div className="col-span-full space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Portfolio Website</label>
                                        <Input
                                            className={'h-12 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all font-semibold'}
                                            {...register("contactInfo.portfolio")}
                                            type="url"
                                            placeholder="https://yourportfolio.com"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>


                        {/* Summary */}
                        <div className='space-y-4'>
                            <div className="flex items-center justify-between pb-2 border-b-2 border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="h-6 w-1.5 bg-primary rounded-full" />
                                    <h3 className="text-xl font-black tracking-tight text-slate-800">Professional Summary</h3>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className={'bg-primary/5 text-primary hover:bg-primary/10 rounded-full px-4 font-bold transition-all'}
                                    onClick={handleImprovedSummary}
                                    disabled={isImproving || !watch("summary")}
                                >
                                    {isImproving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Polishing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            AI Polish
                                        </>
                                    )}
                                </Button>
                            </div>

                            <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
                                <CardContent className="p-8">
                                    <Controller
                                        name={"summary"}
                                        control={control}
                                        render={({ field }) => (
                                            <Textarea
                                                {...field}
                                                placeholder="Write a compelling professional summary that highlights your key achievements..."
                                                className={'min-h-[160px] bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all resize-none text-[15px] leading-relaxed'}
                                                error={errors?.summary}
                                            />
                                        )}
                                    />
                                    {errors?.summary && (
                                        <p className="text-xs font-bold text-red-500 mt-2 px-1">
                                            {errors?.summary?.message}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Skills */}
                        <div className='space-y-4'>
                            <div className="flex items-center gap-3 pb-2 border-b-2 border-slate-100">
                                <div className="h-6 w-1.5 bg-primary rounded-full" />
                                <h3 className="text-xl font-black tracking-tight text-slate-800">Core Competencies</h3>
                            </div>
                            
                            <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
                                <CardContent className="p-8">
                                    <Controller
                                        name={"skills"}
                                        control={control}
                                        render={({ field }) => (
                                            <Textarea
                                                {...field}
                                                placeholder="e.g. React.js, Python, Project Management, Strategic Planning..."
                                                className={'min-h-[100px] bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all resize-none text-[15px]'}
                                                error={errors?.skills}
                                            />
                                        )}
                                    />
                                    <p className="text-xs text-slate-400 mt-3 font-medium italic">Pro tip: Separate multiple skills with commas to make them stand out.</p>
                                    {errors?.skills && (
                                        <p className="text-xs font-bold text-red-500 mt-2 px-1">
                                            {errors?.skills?.message}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Experience */}
                        <div className='space-y-6'>
                            <div className="flex items-center gap-3 pb-2 border-b-2 border-slate-100">
                                <div className="h-6 w-1.5 bg-primary rounded-full" />
                                <h3 className="text-xl font-black tracking-tight text-slate-800">Work History</h3>
                            </div>
                            
                            <Controller
                                name={"experience"}
                                control={control}
                                render={({ field }) => (
                                    <EntryForm
                                        type={'Experience'}
                                        entries={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            {errors?.experience && (
                                <p className="text-xs font-bold text-red-500 px-1">
                                    {errors?.experience?.message}
                                </p>
                            )}
                        </div>

                        {/* Education */}
                        <div className='space-y-6'>
                            <div className="flex items-center gap-3 pb-2 border-b-2 border-slate-100">
                                <div className="h-6 w-1.5 bg-primary rounded-full" />
                                <h3 className="text-xl font-black tracking-tight text-slate-800">Educational Background</h3>
                            </div>
                            
                            <Controller
                                name={"education"}
                                control={control}
                                render={({ field }) => (
                                    <EntryForm
                                        type={'Education'}
                                        entries={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            {errors?.education && (
                                <p className="text-xs font-bold text-red-500 px-1">
                                    {errors?.education?.message}
                                </p>
                            )}
                        </div>

                        {/* Projects */}
                        <div className='space-y-6'>
                            <div className="flex items-center gap-3 pb-2 border-b-2 border-slate-100">
                                <div className="h-6 w-1.5 bg-primary rounded-full" />
                                <h3 className="text-xl font-black tracking-tight text-slate-800">Key Projects</h3>
                            </div>
                            
                            <Controller
                                name={"projects"}
                                control={control}
                                render={({ field }) => (
                                    <EntryForm
                                        type={'Project'}
                                        entries={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            {errors?.projects && (
                                <p className="text-xs font-bold text-red-500 px-1">
                                    {errors?.projects?.message}
                                </p>
                            )}
                        </div>
                    </form>

                </TabsContent>

                <TabsContent value="preview">
                    <div className='rounded-lg bg-slate-700 py-5 border-2 '>
                        <div className="w-full md:max-w-[210mm] mx-auto bg-white p-2 md:p-4 rounded-md md:rounded-xl shadow-lg flex flex-wrap justify-center gap-3 no-print">
                            {['ats', 'academic', 'corporate', 'executive'].map((style) => (
                                <button
                                    key={style}
                                    onClick={() => setActiveStyle(style)}
                                    className={`px-5 py-2 text-sm rounded-full font-semibold uppercase tracking-wider transition ${activeStyle === style ? 'bg-blue-500 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                        <Template data={formValues} activeStyle={activeStyle} />
                    </div>
                </TabsContent>
            </Tabs>
        </>
    )
}

export default ResumeBuilder