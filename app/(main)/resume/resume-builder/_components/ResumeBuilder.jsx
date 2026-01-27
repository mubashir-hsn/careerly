"use client"
import { Button } from '@/components/ui/button'
import { Loader2, Save, Sparkles } from 'lucide-react'
import React, { useEffect, useState } from 'react'
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
        <div className='space-y-4'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center md:gap-2 px-2 md:px-0'>
                <h1 className='text-2xl sm:text-3xl md:text-4xl gradient-subtitle font-bold'>Resume Builder</h1>
                <div className="space-x-2">
                    <Button
                        variant="destructive"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <><Loader2 className="mr-1 h-4 w-4 animate-spin" />Saving...</>
                        ) : (
                            <><Save className="mr-1 h-4 w-4" />Save</>
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

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className={'bg-slate-200'}>
                    <TabsTrigger value="edit">Form</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="edit">
                    <form className='space-y-8' onSubmit={handleSubmit(onSubmit)}>
                        {/* Contact Information */}
                        <div className="space-y-4 mt-4 w-full">
                            <h3 className="text-lg font-medium">Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-white">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input
                                        className={'bg-slate-100 text-slate-500'}
                                        {...register("contactInfo.email")}
                                        type="email"
                                        placeholder="your@email.com"
                                        error={errors.contactInfo?.email}
                                    />
                                    {errors.contactInfo?.email && (
                                        <p className="text-sm text-red-500">
                                            {errors.contactInfo.email.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Mobile Number</label>
                                    <Input
                                        className={'bg-slate-100 text-slate-500'}
                                        {...register("contactInfo.mobile")}
                                        type="tel"
                                        placeholder="+92 3045678900"
                                    />
                                    {errors.contactInfo?.mobile && (
                                        <p className="text-sm text-red-500">
                                            {errors.contactInfo.mobile.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Profession</label>
                                    <Input
                                        className={'bg-slate-100 text-slate-500'}
                                        {...register("contactInfo.profession")}
                                        type="tel"
                                        placeholder="e.g. Intern, Developer ,Assistant, Coordinator"
                                    />
                                    {errors.contactInfo?.profession && (
                                        <p className="text-sm text-red-500">
                                            {errors.contactInfo.profession.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">LinkedIn URL</label>
                                    <Input
                                        className={'bg-slate-100 text-slate-500'}
                                        {...register("contactInfo.linkedin")}
                                        type="url"
                                        placeholder="https://linkedin.com/in/your-profile"
                                    />
                                    {errors.contactInfo?.linkedin && (
                                        <p className="text-sm text-red-500">
                                            {errors.contactInfo.linkedin.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Twitter/X Profile
                                    </label>
                                    <Input
                                        className={'bg-slate-100 text-slate-500'}
                                        {...register("contactInfo.twitter")}
                                        type="url"
                                        placeholder="https://twitter.com/your-handle"
                                    />
                                    {errors.contactInfo?.twitter && (
                                        <p className="text-sm text-red-500">
                                            {errors.contactInfo.twitter.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Portfolio
                                    </label>
                                    <Input
                                        className={'bg-slate-100 text-slate-500'}
                                        {...register("contactInfo.portfolio")}
                                        type="url"
                                        placeholder="https://portfolio.com"
                                    />
                                    {errors.contactInfo?.portfolio && (
                                        <p className="text-sm text-red-500">
                                            {errors.contactInfo.portfolio.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className='space-y-3 mt-4'>
                            <h3 className="text-lg font-medium">Professional Summary</h3>
                            <Controller
                                name={"summary"}
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        placeholder="Writing a compelling professional summary"
                                        className={'h-32 bg-white text-sm text-slate-500 placeholder:text-xs md:placeholder:text-sm'}
                                        error={errors?.summary}
                                    />
                                )}

                            />

                            {errors?.summary && (
                                <p className="text-sm text-red-500">
                                    {errors?.summary?.message}
                                </p>
                            )}
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className={'hover:bg-slate-200'}
                                onClick={handleImprovedSummary}
                                disabled={isImproving || !watch("summary")}
                            >
                                {isImproving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Improving...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Improve with AI
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Skills */}
                        <div className='space-y-3 mt-4'>
                            <h3 className="text-lg font-medium">Skills</h3>
                            <Controller
                                name={"skills"}
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        placeholder="e.g. Programming, Data Analysis, Patient Care, Research, Management, Communication"
                                        className={'h-24 text-sm bg-white text-slate-500 placeholder:text-xs md:placeholder:text-sm'}
                                        error={errors?.skills}
                                    />
                                )}

                            />

                            {errors?.skills && (
                                <p className="text-sm text-red-500">
                                    {errors?.skills?.message}
                                </p>
                            )}
                        </div>

                        {/* Experience */}
                        <div className='space-y-4 mt-4'>
                            <h3 className="text-lg font-medium">Work Experience</h3>
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
                                <p className="text-sm text-red-500">
                                    {errors?.experience?.message}
                                </p>
                            )}
                        </div>

                        {/* Education */}
                        <div className='space-y-4 mt-4'>
                            <h3 className="text-lg font-medium">Education</h3>
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
                                <p className="text-sm text-red-500">
                                    {errors?.education?.message}
                                </p>
                            )}
                        </div>

                        {/* Projects */}
                        <div className='space-y-4 mt-4'>
                            <h3 className="text-lg font-medium">Projects</h3>
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
                                <p className="text-sm text-red-500">
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
                        <Template data={formValues} user={user} activeStyle={activeStyle} />
                    </div>
                </TabsContent>
            </Tabs>


        </div>
    )
}

export default ResumeBuilder