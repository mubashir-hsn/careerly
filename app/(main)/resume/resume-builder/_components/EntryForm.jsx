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
                <Card className="border-none shadow-2xl overflow-hidden rounded-[2rem] bg-white">
                    <div className="bg-linear-to-br from-slate-900 to-slate-800 p-6 text-white relative">
                        <CardTitle className="text-2xl font-black tracking-tight">
                            {editingId !== null ? `Edit ${type}` : `Add New ${type}`}
                        </CardTitle>
                        <p className="text-slate-400 font-medium text-sm mt-1">
                            {editingId !== null ? `Update your ${type.toLowerCase()} details` : `Provide information about your ${type.toLowerCase()}`}
                        </p>
                    </div>
                    
                    <CardContent className='p-8 space-y-6'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='space-y-2'>
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">{text.titleLabel}</label>
                                <Input
                                    {...register('title')}
                                    placeholder={text.titlePlaceholder}
                                    className='h-12 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all font-semibold'
                                />
                                {errors.title && <p className='text-xs font-bold text-red-500 px-1'>{errors.title.message}</p>}
                            </div>
                            <div className='space-y-2'>
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">{text.orgLabel}</label>
                                <Input
                                    {...register("organization")}
                                    placeholder={text.orgPlaceholder}
                                    className='h-12 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all font-semibold'
                                />
                                {errors.organization && <p className='text-xs font-bold text-red-500 px-1'>{errors.organization.message}</p>}
                            </div>
                        </div>

                        {type === 'Project' && (
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className='space-y-2'>
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">{text.github.label}</label>
                                    <Input
                                        {...register('githubLink')}
                                        placeholder={text.github.placeholder}
                                        className='h-12 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all font-semibold'
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">{text.live.label}</label>
                                    <Input
                                        {...register('liveLink')}
                                        placeholder={text.live.placeholder}
                                        className='h-12 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all font-semibold'
                                    />
                                </div>
                            </div>
                        )}

                        <div className='grid grid-cols-2 gap-6'>
                            <div className='space-y-2'>
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Start Date</label>
                                <Input
                                    {...register('startDate')}
                                    type='month'
                                    className='h-12 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all font-semibold'
                                />
                                {errors.startDate && <p className='text-xs font-bold text-red-500 px-1'>{errors.startDate.message}</p>}
                            </div>
                            <div className='space-y-2'>
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">End Date</label>
                                <Input
                                    {...register('endDate')}
                                    type='month'
                                    disabled={current}
                                    className='h-12 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all font-semibold disabled:opacity-50'
                                />
                                {errors.endDate && <p className='text-xs font-bold text-red-500 px-1'>{errors.endDate.message}</p>}
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <input
                                type="checkbox"
                                id="current"
                                {...register("current")}
                                className="w-5 h-5 rounded-md border-slate-300 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                                onChange={(e) => {
                                    setValue("current", e.target.checked);
                                    if (e.target.checked) setValue("endDate", "");
                                }}
                            />
                            <Label htmlFor="current" className="text-sm font-bold text-slate-600 cursor-pointer select-none">
                                Currently {type === 'Education' ? 'Enrolled' : 'Working'} here
                            </Label>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleImprovedDescription}
                                    disabled={isImproving || !watch("description")}
                                    className="h-8 bg-primary/5 text-primary hover:bg-primary/10 rounded-full px-3 font-bold transition-all text-xs"
                                >
                                    {isImproving ? (
                                        <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                                    ) : (
                                        <Sparkles className="h-3 w-3 mr-1.5" />
                                    )}
                                    AI Assist
                                </Button>
                            </div>
                            <Textarea
                                {...register("description")}
                                placeholder={text.descriptionPlaceholder}
                                className='min-h-[140px] bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all resize-none text-[15px] leading-relaxed'
                            />
                            {errors.description && <p className='text-xs font-bold text-red-500 px-1'>{errors.description.message}</p>}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <Button 
                                variant="outline" 
                                type="button" 
                                onClick={handleCancel}
                                className="h-12 px-6 rounded-xl font-bold border-slate-200 hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="button" 
                                onClick={handleAdd}
                                className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all bg-primary hover:bg-primary/90"
                            >
                                {editingId !== null ? "Update Entry" : `Add to ${type}`}
                            </Button>
                        </div>
                    </CardContent>
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