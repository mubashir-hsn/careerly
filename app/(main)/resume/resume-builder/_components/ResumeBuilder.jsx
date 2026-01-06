"use client"
import { Button } from '@/components/ui/button'
import { AlertTriangle, Download, Edit, Loader2, Monitor, Save } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resumeSchema } from '@/app/lib/schema'
import useFetch from '@/hooks/useFetch'
import { saveResume } from '@/actions/resume'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import EntryForm from './EntryForm'
import { entriesToMarkdown } from '@/app/lib/helper'
import { useUser } from '@clerk/nextjs'
// import html2pdf from 'html2pdf.js'
import MDEditor from '@uiw/react-md-editor'
import { toast } from 'sonner'
import RenderTemplate from './renderTemplate'

const data = {

    contactInfo: {
        email: 'mubazi80@gmail.com',
        mobile: '03212321342',
        linkedin: 'linkedin/in/mubashir',
        twitter: 'twitter/mubashir'
    },
    summary: 'I’m Mubashar Hassan, a Passionate Software Engineer skilled in building full-stack web applications using the MERN and Next.js stacks. Experienced in developing secure authentication systems, AI-powered platforms, and responsive user interfaces.',
    skills: 'React,Next,MySQL,MongoDB,JWT,Git & GitHub,Node,Express,AI Integration.',
    experience: [
        {
            title: "Event Coordinator",
            organization: 'Arid University',
            description: 'Organized technical and literary events, enhancing teamwork and communication skills',
            startDate: 'Feb 2022',
            endDate: 'May 2023'
        },
        {
            title: "Backend Developer",
            organization: 'Appexify Solutions',
            description: 'Built responsive web modules using the MERN stack and Tailwind CSS.Implemented JWT-based authentication and CRUD functionalities.',
            startDate: 'Jun 2024',
            endDate: 'Oct 2024'
        }
    ],
    education: [
        {
            title: "BS Software Engineering",
            organization: 'Arid University Sahiwal',
            startDate: 'Nov 2022',
            endDate: 'Jun 2026'
        }
    ],
    projects: [
        {
            title: "Careerly - AI Career Coach",
            organization: 'Next.js',
            githubLink: 'abc.com',
            liveLink: 'abc.com',
            description: 'Built responsive web modules using the MERN stack and Tailwind CSS.Implemented JWT-based authentication and CRUD functionalities.',
        },
        {
            title: "LiteFit - EComerce Website",
            organization: 'MERN STACK',
            githubLink: 'abc.com',
            liveLink: 'abc.com',
            description: 'Built responsive web modules using the MERN stack and Tailwind CSS.Implemented JWT-based authentication and CRUD functionalities.',
        }
    ]

}

const ResumeBuilder = ({ initialContent }) => {
    const [activeTab, setActiveTab] = useState('edit');
    const [resumeMode, setResumeMode] = useState("preview");
    const [previewContent, setPreviewContent] = useState(initialContent);
    const [template, setTemplate] = useState('minimalist')
    const [html2pdfLib, setHtml2pdfLib] = useState(null)
    const { user } = useUser();

    const templates = ['minimalist', 'executive', 'academic', 'classic', 'technical'];


    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resumeSchema),
        defaultValues: {
            contactInfo: {},
            summary: '',
            skills: '',
            education: [],
            experience: [],
            projects: [],
        }
    });

    const {
        loading: isSaving,
        fn: saveResumeFn,
        data: saveResult,
        error: saveError
    } = useFetch(saveResume);

    // Watch form fields for preview updates
    const formValues = watch();

    useEffect(() => {
        import("html2pdf.js").then((mod) => setHtml2pdfLib(() => mod.default))
    }, [])

    useEffect(() => {
        if (initialContent) setActiveTab("preview");
    }, [initialContent]);

    // Update preview content when form values change
    useEffect(() => {
        if (activeTab === "edit") {
            const newContent = getCombinedContent();
            setPreviewContent(newContent ? newContent : initialContent);
        }
    }, [formValues, activeTab]);

    // Handle save result
    useEffect(() => {
        if (saveResult && !isSaving) {
            toast.success("Resume saved successfully!");
        }
        if (saveError) {
            toast.error(saveError.message || "Failed to save resume");
        }
    }, [saveResult, saveError, isSaving]);

    const getContactMarkdown = () => {
        const { contactInfo } = formValues;
        const parts = [];
        if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
        if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
        if (contactInfo.linkedin)
            parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
        if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

        return parts.length > 0
            ? `## <div align="center">${user.fullName}</div>
        \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
            : "";
    };

    const getCombinedContent = () => {
        const { summary, skills, experience, education, projects } = formValues;
        return [
            getContactMarkdown(),
            summary && `### Professional Summary\n\n${summary}`,
            skills && `### Skills\n\n${skills}`,
            entriesToMarkdown(experience, "Work Experience"),
            entriesToMarkdown(education, "Education"),
            entriesToMarkdown(projects, "Projects"),
        ]
            .filter(Boolean)
            .join("\n\n");
    };

    const [isGenerating, setIsGenerating] = useState(false);


    const generatePDF = async () => {
        if (!html2pdfLib) return
        setIsGenerating(true)
        try {
            const element = document.getElementById("resume-pdf")
            const opt = {
                margin: [10, 10],
                filename: `resume_${user?.firstName}`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: {
                    scale: 1.5,
                    useCORS: true,
                    backgroundColor: "#ffffff",
                },
                jsPDF: {
                    unit: "mm",
                    format: "a4",
                    orientation: "portrait",
                },
            }
            await html2pdfLib().set(opt).from(element).save()
        } catch (error) {
            console.error("PDF generation error:", error)
        } finally {
            setIsGenerating(false)
        }
    }

    const onSubmit = async () => {
        try {
            const formattedContent = previewContent
                .replace(/\n/g, "\n") // Normalize newlines
                .replace(/\n\s*\n/g, "\n\n") // Normalize multiple newlines to double newlines
                .trim();

            // console.log(previewContent, formattedContent);
            await saveResumeFn(previewContent);
        } catch (error) {
            console.error("Save error:", error);
        }
    };

    const handleGeneratePDF = async () => {
        setIsGenerating(true);
    
        try {
          const response = await fetch("/api/generate-resume-pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                 data,
                 template, 
                 user 
            }),
          });
    
          if (!response.ok) throw new Error("PDF generation failed");
    
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
    
          const a = document.createElement("a");
          a.href = url;
          a.download = `${user?.firstName || "resume"}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        } catch (err) {
          console.error(err);
          alert("Failed to generate PDF. Try again!");
        } finally {
          setIsGenerating(false);
        }
      };
      

    return (

        <div className='space-y-4'>
            <div className='flex flex-col md:flex-row justify-between items-center gap-2'>
                <h1 className='text-4xl gradient-subtitle font-bold'>Resume Builder</h1>

                <div className="space-x-2">
                    <Button
                        variant="destructive"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Save
                            </>
                        )}
                    </Button>
                    <Button onClick={handleGeneratePDF} disabled={isGenerating}>
                        {isGenerating ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Generating PDF...
                            </>
                        ) : (
                            <>
                                <Download className="h-4 w-4" />
                                Download PDF
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="edit">Form</TabsTrigger>
                    <TabsTrigger value="preview">Markdown</TabsTrigger>
                </TabsList>

                <TabsContent value="edit">
                    <form className='space-y-8' onSubmit={handleSubmit(onSubmit)}>
                        {/* Contact Information */}
                        <div className="space-y-4 mt-4 w-full">
                            <h3 className="text-lg font-medium">Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input
                                        className={'bg-white'}
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
                                        className={'bg-white'}
                                        {...register("contactInfo.mobile")}
                                        type="tel"
                                        placeholder="+1 234 567 8900"
                                    />
                                    {errors.contactInfo?.mobile && (
                                        <p className="text-sm text-red-500">
                                            {errors.contactInfo.mobile.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">LinkedIn URL</label>
                                    <Input
                                        className={'bg-white'}
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
                                        className={'bg-white'}
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
                            </div>
                        </div>

                        {/* Summary */}
                        <div className='space-y-4 mt-4'>
                            <h3 className="text-lg font-medium">Professional Summary</h3>
                            <Controller
                                name={"summary"}
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        placeholder="Writing a compelling professional summary"
                                        className={'h-32 bg-muted'}
                                        error={errors?.summary}
                                    />
                                )}

                            />

                            {errors?.summary && (
                                <p className="text-sm text-red-500">
                                    {errors?.summary?.message}
                                </p>
                            )}
                        </div>

                        {/* Skills */}
                        <div className='space-y-4 mt-4'>
                            <h3 className="text-lg font-medium">Skills</h3>
                            <Controller
                                name={"skills"}
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        placeholder="List your key skills....."
                                        className={'h-24 bg-muted'}
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

                    {activeTab === "preview" && (
                        <Button
                            variant="link"
                            type="button"
                            className="mb-2"
                            onClick={() =>
                                setResumeMode(resumeMode === "preview" ? "edit" : "preview")
                            }
                        >
                            {resumeMode === "preview" ? (
                                <>
                                    <Edit className="h-4 w-4" />
                                    Edit Resume
                                </>
                            ) : (
                                <>
                                    <Monitor className="h-4 w-4" />
                                    Show Preview
                                </>
                            )}
                        </Button>
                    )}

                    {activeTab === "preview" && resumeMode !== "preview" && (
                        <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
                            <AlertTriangle className="h-5 w-5" />
                            <span className="text-sm">
                                You will lose editied markdown if you update the form data.
                            </span>
                        </div>
                    )}

                    <div className='rounded-lg space-y-8 bg-slate-800 py-10 border-2 border-slate-400'>
                        {/* <MDEditor
                            value={previewContent}
                            onChange={setPreviewContent}
                            height={800}
                            preview={resumeMode}
                        /> */}

                        <div className='space-x-2 space-y-2 px-4 py-2'>
                            {
                                templates.map((temp, idx) => (
                                    <Button variant={`${temp == template ? 'default' : 'outline'}`} key={idx} onClick={() => setTemplate(temp)}>{temp}</Button>
                                ))
                            }
                        </div>


                        <RenderTemplate data={data} user={user} template={template} />
                    </div>

                    {/* <div className="hidden">
                        <div id="resume-pdf">
                            <RenderTemplate data={data} user={user} template={template} />
                            {/* <MDEditor.Markdown
                                source={previewContent}
                                style={{
                                    background: "white",
                                    color: "black",
                                }}
                            /> */}

                        {/* </div> */}
                    {/* </div> } */}

                </TabsContent>
            </Tabs>

        </div>
    )
}

export default ResumeBuilder
