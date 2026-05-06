"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { industries } from "@/data/industries";
import useFetch from "@/hooks/useFetch";
import { updateUser } from "@/actions/user";
import { onboardingSchema } from "@/app/lib/schema";
import { useRouter } from "next/navigation";

const UpdateProfileForm = ({ user, setIsEditing, industry, subIndustry }) => {

  const initialIndustry = industries.find((ind) => ind.id === industry);
  
  const initialSubIndustry = initialIndustry?.subIndustries.find(
    (sub) => sub.toLowerCase() === subIndustry?.toString().toLowerCase()
  );

  const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult,
  } = useFetch(updateUser);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      industry: initialIndustry?.id || "",
      subIndustry: initialSubIndustry || "",
      experience: user?.experience || 0,
      skills: user?.skills?.join(", ") || "",
      bio: user?.bio || "",
    },
  });

  const watchIndustry = watch("industry");
  const watchSubIndustry = watch("subIndustry");
  const router = useRouter();
  const selectedIndustry = industries.find((ind) => ind.id === watchIndustry);

 
  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success("Profile updated successfully");
      router.refresh();
      setIsEditing(false);
    }
  }, [updateResult, updateLoading, setIsEditing]);

  const onSubmit = async (values) => {
    const formattedIndustry = `${values.industry}-${values.subIndustry
      .toLowerCase()
      .replace(/ /g, "-")}`;

    await updateUserFn({
      ...values,
      industry: formattedIndustry,
    });
  };

  return (
    <div className="space-y-10">
      <form className="space-y-10" onSubmit={handleSubmit(onSubmit)}>
        
        {/* Professional Identity Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b-2 border-slate-100">
            <div className="h-6 w-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.4)]" />
            <h3 className="text-xl font-black tracking-tight text-slate-800">Professional Identity</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Industry Select */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Core Industry</label>
              <Select
                value={watchIndustry}
                onValueChange={(value) => {
                  setValue("industry", value);
                  setValue("subIndustry", "");
                }}
              >
                <SelectTrigger className="h-12 bg-white border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all font-semibold">
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                  {industries.map((ind) => (
                    <SelectItem key={ind.id} value={ind.id} className="focus:bg-primary/5 rounded-lg">
                      {ind.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-xs font-bold text-red-500 px-1">{errors.industry.message}</p>
              )}
            </div>

            {/* Sub Industry Select */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Specialization</label>
              <Select
                disabled={!watchIndustry}
                value={watchSubIndustry}
                onValueChange={(value) => setValue("subIndustry", value)}
              >
                <SelectTrigger className="h-12 bg-white border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all font-semibold">
                  <SelectValue placeholder="Select Specialization"/>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                  {selectedIndustry?.subIndustries.map((sub) => (
                    <SelectItem key={sub} value={sub} className="focus:bg-primary/5 rounded-lg">
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subIndustry && (
                <p className="text-xs font-bold text-red-500 px-1">
                  {errors.subIndustry.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Expertise Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b-2 border-slate-100">
            <div className="h-6 w-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.4)]" />
            <h3 className="text-xl font-black tracking-tight text-slate-800">Expertise & Experience</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Experience */}
            <div className="space-y-2 col-span-1">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Years of Exp</label>
              <Input
                type="text"
                inputMode="numeric"
                {...register("experience")}
                className="h-12 bg-white border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all font-semibold"
              />
              {errors.experience && (
                <p className="text-xs font-bold text-red-500 px-1">{errors.experience.message}</p>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-2 col-span-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Core Skills</label>
              <Input
                placeholder="e.g. React, Docker, Python"
                {...register("skills")}
                className="h-12 bg-white border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all font-semibold"
              />
              <p className='text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1 ml-1'>Separate with commas</p>
              {errors.skills && (
                <p className="text-xs font-bold text-red-500 px-1">{errors.skills.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Narrative Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-2 border-b-2 border-slate-100">
            <div className="h-6 w-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.4)]" />
            <h3 className="text-xl font-black tracking-tight text-slate-800">Professional Narrative</h3>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Your Bio</label>
            <Textarea 
              className="min-h-[140px] bg-white border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all resize-none text-[15px] leading-relaxed font-medium" 
              placeholder="Tell your professional story..."
              {...register("bio")} 
            />
            {errors.bio && (
              <p className="text-xs font-bold text-red-500 mt-1 px-1">{errors.bio.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            type="submit" 
            className="flex-1 h-14 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]" 
            disabled={updateLoading}
          >
            {updateLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Saving Changes...
              </>
            ) : (
              "Update Profile"
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-14 px-8 rounded-2xl text-lg font-bold border-slate-200 hover:bg-slate-50 transition-all"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfileForm;