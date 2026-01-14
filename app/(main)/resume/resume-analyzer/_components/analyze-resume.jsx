'use client'

import { resumeAnalysisSchema } from '@/app/lib/schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const AnalyzeResume = () => {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(resumeAnalysisSchema),
  });

  useEffect(() => {
    if (feedback) {
      router.push(`/resume/resume-analyzer/${feedback.id}`);
      reset();
      setFile(null);
      setIsProcessing(false);
    }
  }, [feedback]);

  const onSubmit = async (data) => {
    if (!file) {
      toast.error("Please upload a PDF resume");
      return;
    }

    setIsProcessing(true);

    const formData = new FormData();
    formData.append("companyName", data.companyName);
    formData.append("jobTitle", data.jobTitle);
    formData.append("jobDescription", data.jobDescription);
    formData.append("resumeFile", file);

    try {
      const res = await fetch("/api/resume-analysis", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to analyze resume");
      }

      setFeedback(json);

    } catch (error) {
      toast.error(error.message || "Failed to analyze resume");
      console.error("Resume analysis error:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full md:max-w-3xl bg-white rounded-lg mx-auto p-2 py-4 md:p-4 flex flex-col items-center">
      <Link href={'/resume'} className='md:mb-2'>
        <Button variant={'link'} className={'font-medium'}>
          <ArrowLeft className='w-4 h-4' /> Back to resume page
        </Button>
      </Link>

      <div className="text-center p-2 space-y-2 md:space-y-4">
        <h1 className="text-2xl md:text-5xl font-extrabold bg-linear-to-b from-gray-700 via-gray-500 to-gray-700 text-transparent bg-clip-text">
          Smart feedback for your dream job
        </h1>

        {isProcessing ? (
          <div className='inline space-y-2'>
            <h2 className='text-sm font-medium text-muted-foreground py-2'>Analyzing your resume.....</h2>
            <img src="/resume-scan.gif" className='w-full h-150 drop-shadow-2xl -mt-28' alt="resume-scan" />
          </div>
        ) : (
          <p className="text-sm md:text-lg text-muted-foreground">
            Upload your resume for an ATS score and improvement tips.
          </p>
        )}

      </div>

      {!isProcessing && (
        <div className="mt-6 md:mt-12 w-full">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input type="text" placeholder="Company Name" {...register("companyName")} />
            {errors.companyName && <p className="text-red-500 text-sm pl-3">{errors.companyName.message}</p>}

            <Input type="text" placeholder="Job Title" {...register("jobTitle")} />
            {errors.jobTitle && <p className="text-red-500 text-sm pl-3">{errors.jobTitle.message}</p>}

            <Textarea placeholder="Job Description" className="h-28" {...register("jobDescription")} />
            {errors.jobDescription && <p className="text-red-500 text-sm pl-3">{errors.jobDescription.message}</p>}

            {file ? (
              <div className='py-4 px-5 rounded-md bg-gray-100 flex justify-between items-center'>
                <div className='flex gap-3 justify-center items-center'>
                  <div className='p-2 inset-3 shadow-md rounded-md bg-white text-center'>
                    <img src="/pdf.png" className='w-6 h-6' alt="pdf-img" />
                  </div>
                  <p className='font-medium text-primary'>{file.name}</p>
                </div>
                <div onClick={() => setFile(null)}>
                  <img src="/icons/cross.svg" className='w-5 h-5 cursor-pointer' alt="cross-icon" />
                </div>
              </div>
            ) : (
              <div className="border border-gray-300 border-dashed rounded-lg p-4 cursor-pointer hover:bg-muted transition">
                <label className="block text-sm font-medium pb-3">Upload Resume (PDF)</label>
                <input
                  type="file"
                  accept=".pdf"
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4
                             file:rounded-md file:border-0
                             file:text-sm file:font-semibold
                             file:bg-primary file:text-primary-foreground
                             hover:file:opacity-90"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
            )}

            <Button className="w-full mt-3 cursor-pointer" type="submit" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing.....
                </>
              ) : "Analyze Resume"}
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}

export default AnalyzeResume
