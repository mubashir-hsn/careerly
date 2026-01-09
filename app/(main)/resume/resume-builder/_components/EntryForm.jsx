"use client"
import { entrySchema } from '@/app/lib/schema';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, PlusCircle, Sparkles, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import useFetch from '@/hooks/useFetch';
import { improveWithAI } from '@/actions/resume';
import { toast } from 'sonner';
import { format, parse } from 'date-fns';
import { Label } from '@/components/ui/label';

const uiText = {
    Project: {
        titleLabel: "Project Name",
        titlePlaceholder: "e.g. Final Year Project, Business System, Research Tool",
        orgLabel: "Tools or Technologies Used",
        orgPlaceholder: "e.g. Software, Equipment, Platforms, Methods",
        descriptionPlaceholder:
            "Purpose of the project, your role, process, and outcome",
        github: {
            label: "Reference or Profile Link",
            placeholder:
                "e.g. Portfolio, Research Page, GitHub, LinkedIn, Drive Folder"
        },
        live: {
            label: "Work or Resource Link",
            placeholder:
                "e.g. Live System, Published Work, Report, Demo Video"
        }
    },

    Experience: {
        titleLabel: "Role or Position",
        titlePlaceholder: "e.g. Intern, Assistant, Coordinator, Trainee",
        orgLabel: "Organization or Workplace",
        orgPlaceholder: "e.g. Company, Hospital, Lab, Office, Firm",
        descriptionPlaceholder:
            "What you did, what you learned, and your responsibilities"
    },

    Education: {
        titleLabel: "Degree or Program Name",
        titlePlaceholder:
            "e.g. BS Computer Science, MBBS, Pharm D, BBA, Diploma",
        orgLabel: "Institute or University",
        orgPlaceholder:
            "e.g. University, College, Medical Institute, Training Center",
        descriptionPlaceholder:
            "Main subjects, specialization, achievements, or academic work"
    }
};



const EntryForm = ({ type, entries, onChange }) => {

    const [isAdding, setIsAdding] = useState(true);
    const text = uiText[type];

    const {
        register,
        handleSubmit: handleValidation,
        watch,
        formState: { errors },
        reset,
        setValue
    } = useForm({
        resolver: zodResolver(entrySchema),
        defaultValues: {
            title: '',
            organization: '',
            startDate: '',
            endDate: '',
            description: '',
            liveLink: '',
            githubLink: '',
            current: false,
        }
    });
    const current = watch("current");

    const handleDelete = (index) => {
        const newEntries = entries.filter((_, i) => i !== index);
        onChange(newEntries);
    };



    const handleAdd = handleValidation((data) => {

        const formatDisplayDate = (dateString) => {
            if (!dateString) return "";
            const date = parse(dateString, "yyyy-MM", new Date());
            return format(date, "MMM yyyy");
        };

        const formattedEntry = {
            ...data,
            startDate: formatDisplayDate(data.startDate),
            endDate: data.current ? "" : formatDisplayDate(data.endDate),
        };

        onChange([...entries, formattedEntry]);

        reset();
        setIsAdding(false);
    });

    const {
        loading: isImproving,
        fn: improveWithAIFn,
        data: improvedContent,
        error: improveError
    } = useFetch(improveWithAI);

    // Add this effect to handle the improvement result
    useEffect(() => {
        if (improvedContent && !isImproving) {
            setValue("description", improvedContent);
            toast.success("Description improved successfully!");
        }
        if (improveError) {
            toast.error(improveError.message || "Failed to improve description");
        }
    }, [improvedContent, improveError, isImproving, setValue]);


    const handleImprovedDescription = async () => {
        const title = watch("title");
        const organization = watch("organization");
        const description = watch("description");

        if (!description) {
            toast.error('Please enter the description first.');
            return
        }

        const data = {
            title,
            organization,
            description
        }

        await improveWithAIFn({
            current: data,
            type: type.toLowerCase() // 'experience' , 'project' , or 'education'
        })
    }

    return (
        <div className='space-y-4'>

            <div className='space-y-4'>
                {entries.map((item, index) => (
                    <Card key={index} className={'bg-white'}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {item.title} @ {item.organization}
                            </CardTitle>
                            <Button
                                variant="outline"
                                size="icon"
                                type="button"
                                onClick={() => handleDelete(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                {item.current
                                    ? `${item.startDate} - Present`
                                    : `${item.startDate} - ${item.endDate}`}
                            </p>

                            {(item.liveLink || item.githubLink) && (
                                <p className='text-gray-600 text-sm py-2 space-x-4 flex'>
                                    {item.githubLink && (
                                        <span>Github Url: {item?.githubLink}</span>
                                    )}
                                    {item.liveLink && (
                                        <span>Live Url: {item?.liveLink}</span>
                                    )}
                                </p>
                            )}

                            <p className="mt-2 text-sm whitespace-pre-wrap">
                                {item.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {
                isAdding && (
                    <Card>
                        <CardHeader>
                            <CardTitle> Add {type}</CardTitle>
                        </CardHeader>
                        <CardContent className={'space-y-4'}>
                            <div className='grid grid-cols-2 gap-4'>
                                {/* Position/Title */}
                                <div className=' space-y-2'>
                                    <Label>{text.titleLabel}</Label>
                                    <Input
                                        {...register('title')}
                                        placeholder={text.titlePlaceholder}
                                        errors={errors?.title}
                                        className={'bg-slate-100 text-slate-500'}
                                    />

                                    {
                                        errors?.title && <div>
                                            <p className='text-sm text-red-500'>{errors?.title?.message}</p>
                                        </div>
                                    }
                                </div>

                                {/* Organization */}
                                <div className=' space-y-2'>
                                    <Label>{text.orgLabel}</Label>
                                    <Input
                                        {...register("organization")}
                                        placeholder={text.orgPlaceholder}
                                        className={"bg-slate-100 text-slate-500"}
                                    />

                                    {
                                        errors?.organization && <div>
                                            <p className='text-sm text-red-500'>{errors?.organization?.message}</p>
                                        </div>
                                    }
                                </div>
                            </div>

                            {
                                type === 'Project' && <div className=' grid grid-cols-1 md:grid-cols-2 gap-4 space-y-2'>
                                    {/* Links */}
                                    <div className='space-y-2'>
                                        <Label>{text.github.label}</Label>
                                        <Input
                                            {...register('githubLink')}
                                            placeholder={text.github.placeholder}
                                            className={'bg-slate-100 text-slate-500'}
                                        />
                                    </div>

                                    <div className='space-y-2'>
                                       <Label>{text.live.label}</Label>
                                        <Input
                                            {...register('liveLink')}
                                            placeholder={text.live.placeholder}
                                            className={'bg-slate-100 text-slate-500'}
                                        />
                                    </div>

                                </div>
                            }

                            <div className='grid grid-cols-2 gap-4'>
                                {/* Start Date */}
                                <div className=' space-y-2'>
                                    <Label>Start Date</Label>
                                    <Input
                                        {...register('startDate')}
                                        type={'month'}
                                        errors={errors?.startDate}
                                        className={'bg-slate-100 text-slate-500'}
                                    />

                                    {
                                        errors?.startDate && <div>
                                            <p className='text-sm text-red-500'>{errors?.startDate?.message}</p>
                                        </div>
                                    }
                                </div>

                                {/* End Date */}
                                <div className='space-y-2'>
                                    <Label>End Date</Label>
                                    <Input
                                        {...register('endDate')}
                                        type={'month'}
                                        disabled={current}
                                        errors={errors?.endDate}
                                        className={'bg-slate-100 text-slate-500'}
                                    />

                                    {
                                        errors?.endDate && <div>
                                            <p className='text-sm text-red-500'>{errors?.endDate?.message}</p>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="current"
                                    {...register("current")}
                                    onChange={(e) => {
                                        setValue("current", e.target.checked);
                                        if (e.target.checked) {
                                            setValue("endDate", "");
                                        }
                                    }}
                                    className={'bg-slate-100 text-slate-500'}
                                />
                                <label htmlFor="current">Current {type}</label>
                            </div>

                            {/* Description */}

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    placeholder={text.descriptionPlaceholder}
                                    className={'bg-slate-100 text-slate-500 h-32'}
                                    {...register("description")}
                                    error={errors?.description}
                                />
                                {errors?.description && (
                                    <p className="text-sm text-red-500">
                                        {errors?.description?.message}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleImprovedDescription}
                                disabled={isImproving || !watch("description")}
                                className={'hover:bg-slate-200'}
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
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    reset();
                                    setIsAdding(false);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="button" onClick={handleAdd}>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add Entry
                            </Button>
                        </CardFooter>
                    </Card>
                )
            }


            {
                !isAdding && (
                    <Button className={'w-full'} variant={'outline'} onClick={() => setIsAdding(true)}>
                        <PlusCircle className='w-4 h-4 mr-2' />
                        Add {type}
                    </Button>
                )
            }



        </div>
    )
}

export default EntryForm