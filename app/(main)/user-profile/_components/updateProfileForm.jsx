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
    (sub) => sub.toLowerCase() === subIndustry?.toLowerCase()
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
    <Card>
      <CardContent>
        <form className="space-y-6 my-4" onSubmit={handleSubmit(onSubmit)}>
          
          {/* Industry Select */}
          <div className="space-y-2">
            <Label>Industry</Label>
            <Select
              value={watchIndustry}
              onValueChange={(value) => {
                setValue("industry", value);
                setValue("subIndustry", "");
              }}
            >
              <SelectTrigger className={'bg-slate-100 text-slate-600'}>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((ind) => (
                  <SelectItem key={ind.id} value={ind.id}>
                    {ind.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.industry && (
              <p className="text-sm text-red-600">{errors.industry.message}</p>
            )}
          </div>

          {/* Sub Industry Select */}
          {watchIndustry && (
            <div className="space-y-2">
              <Label>Sub Industry</Label>
              <Select
                value={watchSubIndustry}
                onValueChange={(value) => setValue("subIndustry", value)}
              >
                <SelectTrigger className={'bg-slate-100 text-slate-600'}>
                  <SelectValue placeholder="Specialization"/>
                </SelectTrigger>
                <SelectContent>
                  {selectedIndustry?.subIndustries.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subIndustry && (
                <p className="text-sm text-red-600">
                  {errors.subIndustry.message}
                </p>
              )}
            </div>
          )}

          {/* Experience */}
          <div className="space-y-2">
            <Label>Years of Experience</Label>
            <Input
              type="text"
              inputMode="numeric"
              {...register("experience")}
              className={'bg-slate-100 text-slate-600'}
            />
            {errors.experience && (
              <p className="text-sm text-red-600">{errors.experience.message}</p>
            )}
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label>Skills</Label>
            <Input
              placeholder="e.g Python, JavaScript, C++"
              {...register("skills")}
              className={'bg-slate-100 text-slate-600'}
            />
            {errors.skills && (
              <p className="text-sm text-red-600">{errors.skills.message}</p>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label>Professional Bio</Label>
            <Textarea className={'bg-slate-100 text-slate-600 h-28'} {...register("bio")} />
            {errors.bio && (
              <p className="text-sm text-red-600">{errors.bio.message}</p>
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={updateLoading}>
              {updateLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating
                </>
              ) : (
                "Update Profile"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdateProfileForm;