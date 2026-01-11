"use client"

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardingSchema } from '@/app/lib/schema';
import { useRouter } from 'next/navigation';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/useFetch';
import { updateUser } from '@/actions/user';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const OnBoardingForm = ({ industries }) => {

    const [industry, setIndustry] = useState(null);
    const router = useRouter();
    const {
        loading: updateLoading,
        fn: updateUserFn,
        data: updateResult
    } = useFetch(updateUser);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm({
        resolver: zodResolver(onboardingSchema)
    });

    const watchIndustry = watch('industry');
    const onSubmit = async (values) => {
        try {
            const formattedIndustry = `${values.industry}-${values.subIndustry
                .toLowerCase()
                .replace(/ /g, "-")}`;

            await updateUserFn({
                ...values,
                industry: formattedIndustry,
            });
        } catch (error) {
            console.error("Onboarding error:", error);
        }
    };

    useEffect(() => {
        if (updateResult?.success && !updateLoading) {
            toast.success("Profile completed successfully!");
            router.push("/dashboard");
            router.refresh();
        }
    }, [updateResult, updateLoading]);


    return (
        <div className='flex items-center justify-center'>

            <Card className={'w-full max-w-lg mt-10 mx-2 bg-white'}>

                <CardHeader>
                    <CardTitle className={'pb-1 gradient-subtitle text-3xl'}>Complete Your Profile</CardTitle>
                    <CardDescription className={'border-b pb-3 pl-2'}>
                        Select your industry to get personalized career insights and
                        recommendations.
                    </CardDescription>
                </CardHeader>
                <CardContent>

                    <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
                        {/* Industry */}
                        <div className='space-y-2'>
                            <Label htmlFor='industry'>Industry</Label>
                            <Select
                                onValueChange={(value) => {
                                    setValue("industry", value);
                                    setIndustry(
                                        industries.find((ind) => ind.id === value)
                                    );
                                    setValue("subIndustry", "");
                                }}
                            >
                                <SelectTrigger id={'industry'} className="w-[180px] bg-slate-100 text-slate-600">
                                    <SelectValue placeholder="Select an industry" />
                                </SelectTrigger>
                                <SelectContent>

                                    {industries.map((ind) => (
                                        <SelectItem value={ind.id} key={ind.id}>
                                            {ind.name}
                                        </SelectItem>
                                    ))}

                                </SelectContent>
                            </Select>

                            {
                                errors.industry && (
                                    <p className='text-sm text-red-600'>{errors.industry.message}</p>
                                )
                            }
                        </div>
                        {/* SubIndustry */}
                        {watchIndustry &&
                            <div className='space-y-2'>
                                <Label htmlFor='subIndustry'>Sub Industry</Label>
                                <Select
                                    onValueChange={(value) => {
                                        setValue("subIndustry", value);
                                    }}
                                >
                                    <SelectTrigger id={'subIndustry'} className="w-[180px] bg-slate-100 text-slate-600">
                                        <SelectValue placeholder="Specialization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {industry?.subIndustries?.map((sub) => (
                                            <SelectItem key={sub} value={sub}>
                                                {sub}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>

                                </Select>

                                {
                                    errors.subIndustry && (
                                        <p className='text-sm text-red-600'>{errors.subIndustry.message}</p>
                                    )
                                }
                            </div>
                        }
                        {/* Expetience */}
                        <div className='space-y-2'>
                            <Label htmlFor='experience'>Years Of Experience</Label>
                            <Input
                                type={'number'}
                                min={0}
                                max={50}
                                placeholder="Enter years of experience "
                                {...register('experience')}
                                className={'bg-slate-100 text-slate-600'}
                            />

                            {
                                errors.experience && (
                                    <p className='text-sm text-red-600'>{errors.experience.message}</p>
                                )
                            }
                        </div>
                        {/* Skills */}
                        <div className='space-y-2'>
                            <Label htmlFor='skills'>Skills</Label>
                            <Input
                                id='skills'
                                placeholder="e.g Python, javascript, C++"
                                {...register('skills')}
                                className={'bg-slate-100 text-slate-600'}
                            />
                            <p className=' text-sm text-muted-foreground ps-2'>Separate multiple skills with commas</p>

                            {
                                errors.skills && (
                                    <p className='text-sm text-red-600'>{errors.skills.message}</p>
                                )
                            }
                        </div>

                        {/* Bio */}
                        <div className='space-y-2'>
                            <Label htmlFor='bio'>Professional Bio</Label>
                            <Textarea
                                id='bio'
                                placeholder="Tell us about your professional background"
                                {...register('bio')}
                                className={'bg-slate-100 text-slate-600 h-32'}
                            />

                            {
                                errors.bio && (
                                    <p className='text-sm text-red-600'>{errors.bio.message}</p>
                                )
                            }
                        </div>

                        <Button type="submit" className="w-full" disabled={updateLoading}>
                            {updateLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Complete Profile"
                            )}
                        </Button>                    
                    </form>

                </CardContent>

            </Card>

        </div>
    )
}

export default OnBoardingForm