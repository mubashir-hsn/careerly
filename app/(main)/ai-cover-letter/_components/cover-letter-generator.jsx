"use client"
import { generateCoverLetter } from '@/actions/cover-letter';
import { coverLetterSchema } from '@/app/lib/schema';
import useFetch from '@/hooks/useFetch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';


const CoverLetterGenerator = () => {

    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(coverLetterSchema)
    });


    const {
        loading: generating,
        fn: generateCoverLetterFn,
        data: generatedLetter
    } = useFetch(generateCoverLetter)

    useEffect(() => {
        if (generatedLetter) {
            toast.success('Cover letter generated.');
            router.push(`/ai-cover-letter/${generatedLetter.id}`);
            reset();
        }
    }, [generatedLetter])

    const onSubmit = async (data) => {
        try {
            await generateCoverLetterFn(data);
        } catch (error) {
            toast.error(error.message || "Failed to generate cover letter");
            console.log("Failed to generate cover letter: " + error.message)
        }
    }


    return (
        <div className='space-y-5'>

            <Card>
                <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                    <CardDescription>Provide information about the position you're applying for</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <label htmlFor="CompanyName">Company Name</label>
                                <Input
                                    id="CompanyName"
                                    placeholder="Enter company name"
                                    {...register("companyName")}
                                />

                                {
                                    errors?.companyName && (
                                        <p className="text-sm text-red-500">{errors.companyName.message}</p>
                                    )
                                }
                            </div>

                            <div className='space-y-2'>
                                <label htmlFor="jobtitle">Job Title</label>
                                <Input
                                    id="jobtitle"
                                    placeholder="Enter job title"
                                    {...register("jobTitle")}
                                />

                                {
                                    errors?.jobTitle && (
                                        <p className="text-sm text-red-500">{errors.jobTitle.message}</p>
                                    )
                                }
                            </div>

                        </div>

                        <div className='space-y-2'>
                            <label htmlFor="jobdesc">Job Description</label>
                            <Textarea
                                id="jobdesc"
                                placeholder="Paste the job description here"
                                className={'h-32'}
                                {...register("jobDescription")}
                            />

                            {errors?.jobDescription && (
                                <p className="text-sm text-red-500">
                                    {errors?.jobDescription?.message}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={generating}>
                                {
                                    generating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        "Generate Cover Letter"
                                    )
                                }
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

        </div>
    )
}

export default CoverLetterGenerator