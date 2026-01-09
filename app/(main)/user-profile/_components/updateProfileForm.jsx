'use client'

import { useEffect, useState } from "react";
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
  SelectValue
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { industries } from "@/data/industries";
import useFetch from "@/hooks/useFetch";
import { updateUser } from "@/actions/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema } from "@/app/lib/schema";
import { toast } from "sonner";

const UpdateProfileForm = ({ user, setIsEditing }) => {
  const [industryObj, setIndustryObj] = useState(null);

  const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult
  } = useFetch(updateUser);

  const [defaultIndustry, defaultSubIndustry] = user.industry.split('-');

  const formattedSubIndustry = defaultSubIndustry
    ?.replace(/-/g, " ")
    ?.toLowerCase();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      industry: defaultIndustry,
      subIndustry: formattedSubIndustry,
      experience: user.experience,
      skills: user.skills.join(", "),
      bio: user.bio
    }
  });

  const watchIndustry = watch("industry");
  const watchSubIndustry = watch("subIndustry");

  useEffect(() => {
    const selectedIndustry = industries.find(
      (ind) => ind.id === defaultIndustry
    );

    if (selectedIndustry) {
      setIndustryObj(selectedIndustry);
      setValue("industry", defaultIndustry);
      setValue("subIndustry", formattedSubIndustry);
    }
  }, []);

  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success("Profile updated successfully");
      setIsEditing(false);
    }
  }, [updateResult, updateLoading]);

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

          {/* Industry */}
          <div className="space-y-2">
            <Label>Industry</Label>
            <Select
              value={watchIndustry}
              onValueChange={(value) => {
                setValue("industry", value);
                const selected = industries.find((i) => i.id === value);
                setIndustryObj(selected);
                setValue("subIndustry", "");
              }}
            >
              <SelectTrigger>
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

          {/* Sub Industry */}
          {watchIndustry && (
            <div className="space-y-2">
              <Label>Sub Industry</Label>
              <Select
                value={watchSubIndustry}
                onValueChange={(value) => setValue("subIndustry", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Specialization" />
                </SelectTrigger>
                <SelectContent>
                  {industryObj?.subIndustries?.map((sub) => (
                    <SelectItem
                      key={sub}
                      value={sub.toLowerCase()}
                    >
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
              type="number"
              min={0}
              max={50}
              {...register("experience")}
            />
            {errors.experience && (
              <p className="text-sm text-red-600">
                {errors.experience.message}
              </p>
            )}
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label>Skills</Label>
            <Input
              placeholder="e.g Python, JavaScript, C++"
              {...register("skills")}
            />
            <p className="text-sm text-muted-foreground">
              Separate skills with commas
            </p>
            {errors.skills && (
              <p className="text-sm text-red-600">{errors.skills.message}</p>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label>Professional Bio</Label>
            <Textarea
              className="h-32"
              {...register("bio")}
            />
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
