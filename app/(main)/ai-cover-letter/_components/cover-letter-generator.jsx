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

            <div className='flex justify-between items-center p-2 md:px-5'>

                <div className="pb-6 space-y-2">
                    <Link href={'/ai-cover-letter'}>
                        <Button variant={'link'} className={'gap-2 pl-0'}>
                            <ArrowLeft className='w-4 h-4' />
                            Back to cover letter page
                        </Button>
                    </Link>
                    <h1 className="text-2xl pb-0 md:text-3xl font-bold gradient-subtitle">
                        Create Cover Letter
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Generate a tailored cover letter for your job application
                    </p>
                </div>

                {
                    generatedLetter && <>
                               <PdfButton
                                 data={formValues}
                                 activeStyle={'letter'}
                                 user={user?.fullName || ''}
                                 fileName={`${formValues?.name.replace(/\s+/g, "_")}_CoverLetter.pdf`}
                               />
                    </>
                }

            </div>

            <div className="grid md:grid-cols-3 gap-2">
                <div className="col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Job Details</CardTitle>
                            <CardDescription>
                                Provide information about the position you are applying for
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                {/* User Info */}
                                <div className="space-y-3">
                                    <h3 className="text-slate-600 font-semibold">User Info</h3>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Input
                                                placeholder="Name"
                                                {...register("name")}
                                                className="bg-slate-100 text-slate-500"
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-500">
                                                    {errors.name.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Input
                                                type="email"
                                                placeholder="Email"
                                                {...register("email")}
                                                className="bg-slate-100 text-slate-500"
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-500">
                                                    {errors.email.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <Input
                                            placeholder="Contact"
                                            {...register("contact")}
                                            className="bg-slate-100 text-slate-500"
                                        />
                                        {errors.contact && (
                                            <p className="text-sm text-red-500">
                                                {errors.contact.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                 {/* Company Info */}
                                <div className="space-y-3">
                                    <h3 className="text-slate-600 font-semibold">Company Info</h3>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Input
                                                placeholder="Company name"
                                                {...register("companyName")}
                                                className="bg-slate-100 text-slate-500"
                                            />
                                            {errors.companyName && (
                                                <p className="text-sm text-red-500">
                                                    {errors.companyName.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Input
                                                placeholder="Job title"
                                                {...register("jobTitle")}
                                                className="bg-slate-100 text-slate-500"
                                            />
                                            {errors.jobTitle && (
                                                <p className="text-sm text-red-500">
                                                    {errors.jobTitle.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {!generatedLetter && (
                                        <div>
                                            <Textarea
                                                placeholder="Paste job description here"
                                                className="h-32 bg-slate-100 text-slate-500"
                                                {...register("jobDescription")}
                                            />
                                            {errors.jobDescription && (
                                                <p className="text-sm text-red-500">
                                                    {errors.jobDescription.message}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {generatedLetter && (
                                        <div>
                                            <h3 className="text-slate-600 font-semibold pt-4 pb-2">
                                                Cover Letter
                                            </h3>
                                            <Textarea
                                                placeholder="Cover letter content"
                                                className="h-36 bg-slate-100 text-slate-500"
                                                {...register("content")}
                                            />
                                            {errors.content && (
                                                <p className="text-sm text-red-500">
                                                    {errors.content.message}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                                 {/* Buttons */}
                                <div className="flex justify-end">
                                    {!generatedLetter ? (
                                        <Button type="submit" disabled={generating}>
                                            {generating ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Generating
                                                </>
                                            ) : (
                                                "Generate Cover Letter"
                                            )}
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            onClick={handleSave}
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Saving
                                                </>
                                            ) : (
                                                "Save"
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
