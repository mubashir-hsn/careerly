"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { submitFeedback } from "@/actions/feedback";
import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

const feedbackSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Please provide more details (at least 20 chars)"),
});

export default function SupportForm() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(feedbackSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await submitFeedback(data);
      toast.success("Support request submitted successfully!");
      reset();
    } catch (error) {
      toast.error(error.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
      <CardHeader className="bg-slate-900 text-white p-8">
        <CardTitle className="text-2xl font-black flex items-center gap-2">
            <Send className="w-6 h-6 text-indigo-400" />
            New Request
        </CardTitle>
        <CardDescription className="text-slate-400 font-medium">
          Whether it&apos;s a bug report or a feature idea, we want to hear it.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Subject</label>
            <Input 
              {...register("subject")}
              placeholder="e.g., Issue with Resume Analyzer"
              className={`rounded-xl border-slate-100 focus:ring-indigo-500 h-12 font-medium ${errors.subject ? "border-rose-500" : ""}`}
            />
            {errors.subject && <p className="text-rose-500 text-[10px] font-bold uppercase pl-1">{errors.subject.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Message</label>
            <Textarea 
              {...register("message")}
              rows={6}
              placeholder="Tell us exactly how we can help..."
              className={`rounded-xl border-slate-100 focus:ring-indigo-500 font-medium resize-none ${errors.message ? "border-rose-500" : ""}`}
            />
            {errors.message && <p className="text-rose-500 text-[10px] font-bold uppercase pl-1">{errors.message.message}</p>}
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg transition-all active:scale-[0.98] shadow-xl shadow-indigo-100"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </span>
            ) : (
              <span className="flex items-center gap-2 uppercase tracking-widest">
                Submit Request
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
