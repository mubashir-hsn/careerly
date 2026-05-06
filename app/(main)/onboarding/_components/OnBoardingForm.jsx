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
            router.push("/insights");
            router.refresh();
        }
    }, [updateResult, updateLoading]);


    return (
        <div className='flex items-center justify-center py-12 px-4 bg-slate-50/50 min-h-[calc(100vh-64px)]'>
            <Card className="w-full max-w-2xl border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="bg-slate-900 text-white p-10 pb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full -ml-24 -mb-24 blur-2xl" />
                    
                    <CardTitle className="text-3xl md:text-4xl font-black tracking-tight mb-2">
                        Complete Your Profile
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-base font-medium max-w-md">
                        Complete your profile to get personalized AI advice and tools for your career.
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="p-8 md:p-12 -mt-6 rounded-t-[3rem] bg-white relative z-10">
                    <form className='space-y-10' onSubmit={handleSubmit(onSubmit)}>
                        {/* Industry Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-2 border-b-2 border-slate-100">
                                <div className="h-6 w-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.4)]" />
                                <h3 className="text-xl font-black tracking-tight text-slate-800">Your Industry</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Industry */}
                                <div className='space-y-2'>
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Core Industry</label>
                                    <Select
                                        onValueChange={(value) => {
                                            setValue("industry", value);
                                            setIndustry(industries.find((ind) => ind.id === value));
                                            setValue("subIndustry", "");
                                        }}
                                    >
                                        <SelectTrigger id={'industry'} className="h-12 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all font-semibold">
                                            <SelectValue placeholder="Select Industry" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                                            {industries.map((ind) => (
                                                <SelectItem value={ind.id} key={ind.id} className="focus:bg-primary/5 rounded-lg">
                                                    {ind.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.industry && <p className='text-xs font-bold text-red-500 px-1'>{errors.industry.message}</p>}
                                </div>

                                {/* SubIndustry */}
                                <div className='space-y-2'>
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Specialization</label>
                                    <Select
                                        disabled={!watchIndustry}
                                        onValueChange={(value) => setValue("subIndustry", value)}
                                    >
                                        <SelectTrigger id={'subIndustry'} className="h-12 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all font-semibold">
                                            <SelectValue placeholder={watchIndustry ? "Select Specialization" : "Choose Industry First"} />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                                            {industry?.subIndustries?.map((sub) => (
                                                <SelectItem key={sub} value={sub} className="focus:bg-primary/5 rounded-lg">
                                                    {sub}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.subIndustry && <p className='text-xs font-bold text-red-500 px-1'>{errors.subIndustry.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Experience & Skills */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-2 border-b-2 border-slate-100">
                                <div className="h-6 w-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.4)]" />
                                <h3 className="text-xl font-black tracking-tight text-slate-800">Experience & Skills</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className='space-y-2 col-span-1'>
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Years of Exp</label>
                                    <Input
                                        type={'number'}
                                        min={0}
                                        max={50}
                                        placeholder="0"
                                        {...register('experience')}
                                        className="h-12 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all font-semibold"
                                    />
                                    {errors.experience && <p className='text-xs font-bold text-red-500 px-1'>{errors.experience.message}</p>}
                                </div>

                                <div className='space-y-2 col-span-2'>
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Key Skills</label>
                                    <Input
                                        id='skills'
                                        placeholder="e.g. React, Docker, Python"
                                        {...register('skills')}
                                        className="h-12 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all font-semibold"
                                    />
                                    <p className='text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1 ml-1'>Separate with commas</p>
                                    {errors.skills && <p className='text-xs font-bold text-red-500 px-1'>{errors.skills.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Bio Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 pb-2 border-b-2 border-slate-100">
                                <div className="h-6 w-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.4)]" />
                                <h3 className="text-xl font-black tracking-tight text-slate-800">About You</h3>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Your Bio</label>
                                <Textarea
                                    id='bio'
                                    placeholder="Briefly describe your journey, achievements, and career goals..."
                                    {...register('bio')}
                                    className="min-h-[140px] bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all resize-none text-[15px] leading-relaxed font-medium"
                                />
                                {errors.bio && <p className='text-xs font-bold text-red-500 mt-1 px-1'>{errors.bio.message}</p>}
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full h-14 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]" 
                            disabled={updateLoading}
                        >
                            {updateLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Saving Profile...
                                </>
                            ) : (
                                "Finish Profile"
                            )}
                        </Button>                    
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default OnBoardingForm