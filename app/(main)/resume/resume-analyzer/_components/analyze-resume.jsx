'use client'

import { resumeAnalysisSchema } from '@/app/lib/schema'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2, FileScan } from 'lucide-react'
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
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 mb-12">
        <Link
          href="/resume"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="font-bold text-sm uppercase tracking-widest">Back to Resumes</span>
        </Link>

        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Master Your Career Path
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Get AI-powered feedback on your resume tailored for specific job roles and increase your ATS score.
          </p>
        </div>
      </div>

      <Card className="border-none shadow-2xl overflow-hidden rounded-[2rem] bg-white">
        <div className="bg-linear-to-br from-slate-900 to-slate-800 p-8 text-white relative">
          <div className="relative z-10">
            <CardTitle className="text-3xl font-black tracking-tight">Resume Analysis</CardTitle>
            <p className="text-slate-400 font-medium mt-2">
              Upload your details and let our AI evaluate your profile against the job requirements.
            </p>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <FileScan className="w-24 h-24" />
          </div>
        </div>

        <CardContent className="p-8">
          {isProcessing ? (
            <div className='flex flex-col items-center justify-center py-12 space-y-6'>
              <div className="relative">
                <div className="w-24 h-24 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileScan className="w-10 h-10 text-primary/40" />
                </div>
              </div>
              <div className="text-center">
                <h2 className='text-2xl font-black text-slate-800'>Analyzing your Profile</h2>
                <p className='text-slate-500 font-medium mt-1'>We're matching your skills with the job requirements...</p>
              </div>
            </div>
          ) : (
            <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                    <div className="h-4 w-1 bg-primary rounded-full" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Target Role</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Company Name</label>
                      <Input
                        type="text"
                        className='h-12 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all font-semibold'
                        placeholder="e.g. Google, Microsoft, Startup Inc."
                        {...register("companyName")}
                      />
                      {errors.companyName && <p className="text-red-500 text-xs font-bold px-1">{errors.companyName.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Job Title</label>
                      <Input
                        type="text"
                        className='h-12 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all font-semibold'
                        placeholder="e.g. Senior Frontend Developer"
                        {...register("jobTitle")}
                      />
                      {errors.jobTitle && <p className="text-red-500 text-xs font-bold px-1">{errors.jobTitle.message}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                    <div className="h-4 w-1 bg-primary rounded-full" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Job Description</h3>
                  </div>
                  <Textarea
                    className='min-h-[200px] bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all resize-none text-[15px] leading-relaxed'
                    placeholder="Paste the job description here to analyze the match..."
                    {...register("jobDescription")}
                  />
                  {errors.jobDescription && <p className="text-red-500 text-xs font-bold px-1">{errors.jobDescription.message}</p>}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                    <div className="h-4 w-1 bg-primary rounded-full" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Upload Resume</h3>
                  </div>

                  {file ? (
                    <div className='relative group p-8 rounded-[2rem] bg-linear-to-br from-primary/5 to-primary/10 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center transition-all hover:bg-primary/10'>
                      <div className='bg-white p-4 rounded-2xl shadow-xl mb-4 group-hover:scale-110 transition-transform'>
                        <img src="/pdf.png" className='w-12 h-12' alt="pdf" />
                      </div>
                      <p className='font-black text-primary text-lg'>{file.name}</p>
                      <p className='text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest'>PDF Ready for analysis</p>

                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="absolute top-4 right-4 p-2 bg-white text-red-500 rounded-xl shadow-lg hover:bg-red-50 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                      </button>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center hover:border-primary/50 hover:bg-slate-50 transition-all cursor-pointer group">
                      <label className="cursor-pointer">
                        <div className="flex flex-col items-center gap-4">
                          <div className="bg-slate-100 p-6 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-all">
                            <FileScan className="w-10 h-10" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-lg font-black text-slate-800">Drop your resume here</p>
                            <p className="text-sm text-slate-500 font-medium">Supported format: PDF only (Max 5MB)</p>
                          </div>
                          <div className="mt-2 text-primary font-bold text-sm bg-primary/10 px-4 py-2 rounded-full">
                            Select File from Device
                          </div>
                        </div>
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e) => setFile(e.target.files[0])}
                        />
                      </label>
                    </div>
                  )}
                </div>

                <div className="pt-6">
                  <Button
                    className="w-full h-16 rounded-[1.5rem] text-lg font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all bg-primary hover:bg-primary/90"
                    type="submit"
                    disabled={isProcessing}
                  >
                    Analyze Resume Profile
                  </Button>
                  <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-4">
                    AI Analysis takes approximately 10-15 seconds
                  </p>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>

  )
}

export default AnalyzeResume
