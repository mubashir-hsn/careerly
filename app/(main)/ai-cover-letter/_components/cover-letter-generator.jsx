"use client"

import { generateCoverLetter, saveCoverLetter } from "@/actions/cover-letter"
import { coverLetterSchema } from "@/app/lib/schema"
import useFetch from "@/hooks/useFetch"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import Template from "@/components/Templates"
import Link from "next/link"
import PdfButton from "@/components/PdfButton"

const initialData = {
    name: "",
    email: "",
    contact: "",
    companyName: "",
    jobTitle: "",
    jobDescription: "",
    content: "",
}

const CoverLetterGenerator = () => {
    const { user } = useUser()

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(coverLetterSchema),
        defaultValues: initialData,
    })

    const formValues = useWatch({ control })

    useEffect(() => {
        if (!user) return

        setValue("name", user.fullName || "")
        setValue("email", user.emailAddresses?.[0]?.emailAddress || "")
    }, [user, setValue])

    const {
        loading: generating,
        fn: generateCoverLetterFn,
        data: generatedLetter,
    } = useFetch(generateCoverLetter)

    const {
        loading: saving,
        fn: saveCoverLetterFn,
        data: updatedCoverLetter,
    } = useFetch(saveCoverLetter)

    // after generate
    useEffect(() => {
        if (!generatedLetter) return

        toast.success("Cover letter generated.")

        reset({
            ...formValues,
            content: generatedLetter.content,
        })
    }, [generatedLetter, reset])

    // after save
    useEffect(() => {
        if (!updatedCoverLetter) return

        toast.success("Cover letter saved successfully.")

    }, [updatedCoverLetter, reset])

    const onSubmit = async (data) => {
        try {
            await generateCoverLetterFn(data)
        } catch (error) {
            toast.error(error.message || "Failed to generate cover letter")
        }
    }

    const handleSave = async () => {
        if (!generatedLetter?.id) {
            toast.error("Generate cover letter first")
            return
        }

        const payload = {
            ...formValues,
            id: generatedLetter.id,
        }

        try {
            await saveCoverLetterFn(payload)
        } catch (error) {
            toast.error(error.message || "Failed to save cover letter")
        }
    }

    return (
        <>

            <div className="flex flex-col gap-4 mb-8 px-2 md:px-0">
                <Link 
                    href="/ai-cover-letter" 
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    <span className="font-bold text-sm uppercase tracking-widest">Back to Cover Letters</span>
                </Link>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                            Create Cover Letter
                        </h1>
                        <p className="text-slate-500 font-medium">
                            Generate a tailored cover letter for your job application.
                        </p>
                    </div>
                    
                    {generatedLetter && (
                        <PdfButton
                            data={formValues}
                            activeStyle={'letter'}
                            user={user?.fullName || ''}
                            fileName={`${formValues?.name.replace(/\s+/g, "_")}_CoverLetter.pdf`}
                        />
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="col-span-1">
                    <Card className="border-none shadow-2xl overflow-hidden rounded-[2rem] bg-white h-fit">
                        <div className="bg-linear-to-br from-slate-900 to-slate-800 p-6 text-white relative">
                             <CardTitle className="text-2xl font-black tracking-tight">Job Details</CardTitle>
                             <CardDescription className="text-slate-400 font-medium">
                                 Provide information about the position you are applying for
                             </CardDescription>
                        </div>

                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* User Info Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                                        <div className="h-4 w-1 bg-primary rounded-full" />
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">User Information</h3>
                                    </div>

                                    <div className="space-y-3">
                                        <Input
                                            placeholder="Your Full Name"
                                            {...register("name")}
                                            className="h-11 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all"
                                        />
                                        {errors.name && (
                                            <p className="text-xs font-bold text-red-500 px-1">
                                                {errors.name.message}
                                            </p>
                                        )}

                                        <Input
                                            type="email"
                                            placeholder="Professional Email Address"
                                            {...register("email")}
                                            className="h-11 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all"
                                        />
                                        {errors.email && (
                                            <p className="text-xs font-bold text-red-500 px-1">
                                                {errors.email.message}
                                            </p>
                                        )}

                                        <Input
                                            placeholder="Contact Number (e.g. +1 234 567 890)"
                                            {...register("contact")}
                                            className="h-11 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all"
                                        />
                                        {errors.contact && (
                                            <p className="text-xs font-bold text-red-500 px-1">
                                                {errors.contact.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Company Info Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                                        <div className="h-4 w-1 bg-primary rounded-full" />
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Target Company</h3>
                                    </div>

                                    <div className="space-y-3">
                                        <Input
                                            placeholder="Company Name"
                                            {...register("companyName")}
                                            className="h-11 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all"
                                        />
                                        {errors.companyName && (
                                            <p className="text-xs font-bold text-red-500 px-1">
                                                {errors.companyName.message}
                                            </p>
                                        )}

                                        <Input
                                            placeholder="Target Job Title"
                                            {...register("jobTitle")}
                                            className="h-11 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all"
                                        />
                                        {errors.jobTitle && (
                                            <p className="text-xs font-bold text-red-500 px-1">
                                                {errors.jobTitle.message}
                                            </p>
                                        )}

                                        {!generatedLetter && (
                                            <>
                                                <Textarea
                                                    placeholder="Paste the job description here..."
                                                    className="min-h-[120px] bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all resize-none"
                                                    {...register("jobDescription")}
                                                />
                                                {errors.jobDescription && (
                                                    <p className="text-xs font-bold text-red-500 px-1">
                                                        {errors.jobDescription.message}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                {generatedLetter && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                                            <div className="h-4 w-1 bg-primary rounded-full" />
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Edit content</h3>
                                        </div>
                                        <Textarea
                                            placeholder="Customize your generated content..."
                                            className="min-h-[160px] bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all resize-none"
                                            {...register("content")}
                                        />
                                        {errors.content && (
                                            <p className="text-xs font-bold text-red-500 px-1">
                                                {errors.content.message}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="pt-2">
                                    {!generatedLetter ? (
                                        <Button 
                                            type="submit" 
                                            disabled={generating}
                                            className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all bg-primary hover:bg-primary/90"
                                        >
                                            {generating ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Generating...
                                                </>
                                            ) : (
                                                "Generate with AI"
                                            )}
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all bg-primary hover:bg-primary/90"
                                        >
                                            {saving ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                "Finalize & Save"
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>


                <div className="md:col-span-2 max-h-[42%] p-4 md:p-8 rounded-xl bg-gray-700 border-4 border-slate-300 overflow-y-auto">
                    <Template letterData={formValues} mode="letter" />
                </div>
            </div>
        </>
    )
}

export default CoverLetterGenerator
