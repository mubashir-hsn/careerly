"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, FileText, Upload, ArrowRight, Loader2 } from "lucide-react";
import { generateAIPortfolio } from "@/actions/portfolio";
import { toast } from "sonner";

const AIGenerator = ({ onGenerate, onStartScratch, hasResume }) => {
  const [careerGoals, setCareerGoals] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast.error("Only PDF files are supported.");
        return;
      }
      if (selectedFile.size > 2 * 1024 * 1024) {
        toast.error("File size must be under 2MB.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("careerGoals", careerGoals);
      if (file) {
        formData.append("additionalDoc", file);
      }

      const generatedData = await generateAIPortfolio(formData);
      toast.success("AI successfully extracted your profile and resume!");
      onGenerate(generatedData);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to generate portfolio with AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="text-center mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 text-xs font-black uppercase tracking-wider animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          AI Portfolio Engine
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Create a Premium Portfolio in Seconds
        </h1>
        <p className="text-slate-500 text-lg max-w-xl mx-auto font-medium">
          Our AI will review your Careerly profile, resume data, and custom documents to craft a stunning portfolio tailored to your goals.
        </p>
      </div>

      <Card className="border-none shadow-2xl rounded-3xl bg-white overflow-hidden">
        <CardContent className="p-8 space-y-6">
          {/* Career Goals */}
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">
              Career Goals & Target Roles
            </Label>
            <Textarea
              placeholder="e.g. Senior Fullstack Developer aiming to work in fintech. Passionate about Next.js, API design, and mentoring junior engineers."
              value={careerGoals}
              onChange={(e) => setCareerGoals(e.target.value)}
              className="min-h-[120px] bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all resize-none text-[15px] leading-relaxed"
            />
            <p className="text-[11px] text-slate-400 font-medium">
              Adding career goals helps the AI write highly persuasive summaries and project descriptions.
            </p>
          </div>

          {/* Document Upload */}
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">
              Upload Additional Documents (Optional)
            </Label>
            <div className="relative group border-2 border-dashed border-slate-200 hover:border-violet-400 bg-slate-50/50 hover:bg-violet-50/10 rounded-2xl p-6 transition-all text-center flex flex-col items-center justify-center cursor-pointer">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 shadow-md flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Upload className="w-5 h-5 text-slate-400 group-hover:text-violet-500 transition-colors" />
              </div>
              {file ? (
                <div>
                  <p className="text-sm font-bold text-slate-800">{file.name}</p>
                  <p className="text-[11px] text-slate-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Click to change
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-bold text-slate-700">
                    Upload transcripts, certificates, or projects
                  </p>
                  <p className="text-[11px] text-slate-400">
                    PDF files up to 2MB supported.
                  </p>
                </div>
              )}
            </div>
          </div>

          {hasResume && (
            <div className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-emerald-800 text-sm font-medium">
              <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>We detected your resume on Careerly! The AI will automatically extract and optimize its content.</span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full sm:flex-1 h-12 rounded-xl bg-violet-600 hover:bg-violet-500 font-bold shadow-lg shadow-violet-200 transition-all active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  AI is Analyzing & Improving...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate with AI
                </>
              )}
            </Button>
            <Button
              variant="outline"
              disabled={loading}
              onClick={onStartScratch}
              className="w-full sm:w-auto h-12 px-6 rounded-xl border-slate-200 hover:bg-slate-50 font-bold active:scale-95 transition-all"
            >
              Start from Scratch
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIGenerator;
