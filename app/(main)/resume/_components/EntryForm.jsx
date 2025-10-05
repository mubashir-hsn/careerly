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


const EntryForm = ({ type, entries, onChange }) => {

    const [isAdding, setIsAdding] = useState(false);

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
        const description = watch("description");
        if (!description) {
            toast.error('Please enter the description first.');
            return
        }

        await improveWithAIFn({
            current: description,
            type: type.toLowerCase() // 'experience' , 'project' , or 'education'
        })
    }

    return (
        <div className='space-y-4'>

            <div className='space-y-4'>
                {entries.map((item, index) => (
                    <Card key={index} className={'bg-muted'}>
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
                                    <Input
                                        {...register('title')}
                                        placeholder="Title/Position"
                                        errors={errors?.title}
                                    />

                                    {
                                        errors?.title && <div>
                                            <p className='text-sm text-red-500'>{errors?.title?.message}</p>
                                        </div>
                                    }
                                </div>

                                {/* Organization */}
                                <div className=' space-y-2'>
                                    <Input
                                        {...register('organization')}
                                        placeholder="organization"
                                        errors={errors?.organization}
                                    />

                                    {
                                        errors?.organization && <div>
                                            <p className='text-sm text-red-500'>{errors?.organization?.message}</p>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                {/* Start Date */}
                                <div className=' space-y-2'>
                                    <Input
                                        {...register('startDate')}
                                        type={'month'}
                                        errors={errors?.startDate}
                                    />

                                    {
                                        errors?.startDate && <div>
                                            <p className='text-sm text-red-500'>{errors?.startDate?.message}</p>
                                        </div>
                                    }
                                </div>

                                {/* End Date */}
                                <div className=' space-y-2'>
                                    <Input
                                        {...register('endDate')}
                                        type={'month'}
                                        disabled={current}
                                        errors={errors?.endDate}
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
                                />
                                <label htmlFor="current">Current {type}</label>
                            </div>

                            {/* Description */}

                            <div className="space-y-2">
                                <Textarea
                                    placeholder={`Description of your ${type.toLowerCase()}`}
                                    className="h-32"
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