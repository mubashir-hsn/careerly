"use client";
import { entrySchema } from '@/app/lib/schema';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Loader2, PlusCircle, Sparkles, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
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
        descriptionPlaceholder: "Purpose of the project, your role, process, and outcome",
        github: {
            label: "Reference or Profile Link",
            placeholder: "e.g. Portfolio, Research Page, GitHub, LinkedIn, Drive Folder"
        },
        live: {
            label: "Work or Resource Link",
            placeholder: "e.g. Live System, Published Work, Report, Demo Video"
        }
    },
    Experience: {
        titleLabel: "Role or Position",
        titlePlaceholder: "e.g. Intern, Assistant, Coordinator, Trainee",
        orgLabel: "Organization or Workplace",
        orgPlaceholder: "e.g. Company, Hospital, Lab, Office, Firm",
        descriptionPlaceholder: "What you did, what you learned, and your responsibilities"
    },
    Education: {
        titleLabel: "Degree or Program Name",
        titlePlaceholder: "e.g. BS Computer Science, MBBS, Pharm D, BBA, Diploma",
        orgLabel: "Institute or University",
        orgPlaceholder: "e.g. University, College, Medical Institute, Training Center",
        descriptionPlaceholder: "Main subjects, specialization, achievements, or academic work"
    }
};

const EntryForm = ({ type, entries, onChange }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
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

    const handleEdit = (entry, index) => {
        const parseDisplayDate = (dateString) => {
            if (!dateString) return "";
            try {
                const date = parse(dateString, "MMM yyyy", new Date());
                return format(date, "yyyy-MM");
            } catch (e) { return ""; }
        };

        reset({
            ...entry,
            startDate: parseDisplayDate(entry.startDate),
            endDate: parseDisplayDate(entry.endDate),
        });

        setEditingId(index);
        setIsAdding(true);
    };

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

        if (editingId !== null) {
            const updatedEntries = [...entries];
            updatedEntries[editingId] = formattedEntry;
            onChange(updatedEntries);
        } else {
            onChange([...entries, formattedEntry]);
        }

        handleCancel();
    });

    const handleCancel = () => {
        reset({
            title: '',
            organization: '',
            startDate: '',
            endDate: '',
            description: '',
            liveLink: '',
            githubLink: '',
            current: false,
        });
        setEditingId(null);
        setIsAdding(false);
    };

    useEffect(() => {
        handleCancel();
    }, [type]);

    const {
        loading: isImproving,
        fn: improveWithAIFn,
        data: improvedContent,
        error: improveError
    } = useFetch(improveWithAI);

    useEffect(() => {
        if (improvedContent && !isImproving) {
            setValue("description", improvedContent);
            toast.success("Description improved!");
        }
        if (improveError) toast.error(improveError.message || "AI Error");
    }, [improvedContent, improveError, isImproving, setValue]);

    const handleImprovedDescription = async () => {
        const data = { title: watch("title"), organization: watch("organization"), description: watch("description") };
        if (!data.description) return toast.error('Please enter the description first.');
        await improveWithAIFn({ current: data, type: type.toLowerCase() });
    };

    return (
        <div className='space-y-4'>
            {/* Display Saved Entries */}
            <div className='space-y-4'>
                {entries.map((item, index) => {
                    if (editingId === index) return null;
                    return (
                        <Card key={index} className='bg-white border-slate-200 shadow-sm'>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-bold text-slate-800">
                                    {item.title} @ {item.organization}
                                </CardTitle>
                                <div className='flex gap-1'>
                                    <Button variant="ghost" size="icon" type="button" onClick={() => handleEdit(item, index)}>
                                        <Edit className="h-4 w-4 text-slate-600" />
                                    </Button>
                                    <Button variant="ghost" size="icon" type="button" onClick={() => handleDelete(index)}>
                                        <X className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="text-sm">
                                <p className="text-muted-foreground font-medium mb-2">
                                    {item.startDate} - {item.current ? "Present" : item.endDate}
                                </p>
                                {(item.liveLink || item.githubLink) && (
                                    <div className='flex gap-4 text-xs text-blue-800 mb-2'>
                                        {item.githubLink && <span>Ref: {item.githubLink}</span>}
                                        {item.liveLink && <span>Link: {item.liveLink}</span>}
                                    </div>
                                )}
                                <p className="whitespace-pre-wrap text-slate-600 leading-relaxed">{item.description}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* The Entry Form */}
            {isAdding && (
                <Card className=" shadow-md">
                    <CardHeader>
                        <CardTitle className="">
                            {editingId !== null ? `Edit ${type}` : `Add ${type}`}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label className="text-slate-700">{text.titleLabel}</Label>
                                <Input
                                    {...register('title')}
                                    placeholder={text.titlePlaceholder}
                                    className='bg-slate-100 text-slate-600 border-none placeholder:text-xs md:placeholder:text-sm text-sm'
                                />
                                {errors.title && <p className='text-xs text-red-500'>{errors.title.message}</p>}
                            </div>
                            <div className='space-y-2'>
                                <Label className="text-slate-700">{text.orgLabel}</Label>
                                <Input
                                    {...register("organization")}
                                    placeholder={text.orgPlaceholder}
                                    className='bg-slate-100 text-slate-600 border-none placeholder:text-xs md:placeholder:text-sm text-sm'
                                />
                                {errors.organization && <p className='text-xs text-red-500'>{errors.organization.message}</p>}
                            </div>
                        </div>

                        {type === 'Project' && (
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <Label className="text-slate-700">{text.github.label}</Label>
                                    <Input
                                        {...register('githubLink')}
                                        placeholder={text.github.placeholder}
                                        className='bg-slate-100 text-slate-600 border-none placeholder:text-xs md:placeholder:text-sm text-sm'
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label className="text-slate-700">{text.live.label}</Label>
                                    <Input
                                        {...register('liveLink')}
                                        placeholder={text.live.placeholder}
                                        className='bg-slate-100 text-slate-600 border-none placeholder:text-xs md:placeholder:text-sm text-sm'
                                    />
                                </div>
                            </div>
                        )}

                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label className="text-slate-700">Start Date</Label>
                                <Input
                                    {...register('startDate')}
                                    type='month'
                                    className='bg-slate-100 text-slate-600 border-none text-sm'
                                />
                                {errors.startDate && <p className='text-xs text-red-500'>{errors.startDate.message}</p>}
                            </div>
                            <div className='space-y-2'>
                                <Label className="text-slate-700">End Date</Label>
                                <Input
                                    {...register('endDate')}
                                    type='month'
                                    disabled={current}
                                    className='bg-slate-100 text-slate-600 border-none text-sm'
                                />
                                {errors.endDate && <p className='text-xs text-red-500'>{errors.endDate.message}</p>}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="current"
                                {...register("current")}
                                className="w-4 h-4"
                                onChange={(e) => {
                                    setValue("current", e.target.checked);
                                    if (e.target.checked) setValue("endDate", "");
                                }}
                            />
                            <Label htmlFor="current" className="text-sm text-slate-600 cursor-pointer">
                                Currently {type === 'Education' ? 'Enrolled' : 'Working'} here
                            </Label>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700">Description</Label>
                            <Textarea
                                {...register("description")}
                                placeholder={text.descriptionPlaceholder}
                                className='h-32 bg-slate-100 text-slate-600 border-none placeholder:text-xs md:placeholder:text-sm text-sm'
                            />
                            {errors.description && <p className='text-xs text-red-500'>{errors.description.message}</p>}

                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleImprovedDescription}
                                disabled={isImproving || !watch("description")}
                                className="mt-2"
                            >
                                {isImproving ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Sparkles className="h-4 w-4 mr-2" />
                                )}
                                Improve with AI
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 bg-slate-50 p-4 rounded-b-lg">
                        <Button variant="outline" type="button" onClick={handleCancel}>Cancel</Button>
                        <Button type="button" onClick={handleAdd}>
                            {editingId !== null ? "Update Entry" : `Add to ${type}`}
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {!isAdding && (
                <Button
                    className='w-full border-dashed border-2 py-6 text-slate-500'
                    variant='outline'
                    onClick={() => {
                        setEditingId(null);
                        reset({
                            title: '',
                            organization: '',
                            startDate: '',
                            endDate: '',
                            description: '',
                            liveLink: '',
                            githubLink: '',
                            current: false,
                        });
                        setIsAdding(true);
                    }}
                >
                    <PlusCircle className='w-4 h-4 mr-2' />
                    Add New {type}
                </Button>
            )}
        </div>
    );
};

export default EntryForm;