"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Sparkles, Save, Eye, CheckCircle2, AlertCircle, Plus, Trash2, Edit3,
  Linkedin, Github, Globe, Loader2, Image as ImageIcon, MapPin, Phone, Mail,
  Globe2, Check, Copy, Settings, Layout, Layers, User, Briefcase, Award,
  ExternalLink
} from "lucide-react";
import { checkUsernameAvailability, savePortfolio, improvePortfolioText } from "@/actions/portfolio";
import { toast } from "sonner";

const PortfolioForm = ({ initialData = {}, defaultUser = {} }) => {
  const [formData, setFormData] = useState({
    username: initialData.username || "",
    aboutMe: initialData.aboutMe || "",
    skills: initialData.skills || [],
    education: initialData.education || [],
    experience: initialData.experience || [],
    projects: initialData.projects || [],
    certifications: initialData.certifications || [],
    achievements: initialData.achievements || [],
    customSections: initialData.customSections || [],
    theme: initialData.theme || "modern",
    layout: initialData.layout || "standard",
    profileImage: initialData.profileImage || defaultUser.imageUrl || "",
    sectionVisibility: initialData.sectionVisibility || {},
    contactEmail: initialData.contactEmail || defaultUser.email || "",
    contactPhone: initialData.contactPhone || "",
    location: initialData.location || "",
    linkedinUrl: initialData.linkedinUrl || "",
    githubUrl: initialData.githubUrl || "",
    websiteUrl: initialData.websiteUrl || "",
    resumeUrl: initialData.resumeUrl || "",
    isPublished: initialData.isPublished || false,
    // Premium fields mapped inside sectionVisibility
    field: initialData.sectionVisibility?.field || defaultUser.industry || "",
    heroDescription: initialData.sectionVisibility?.heroDescription || "",
    aboutMeImage: initialData.sectionVisibility?.aboutMeImage || "",
    aboutMeImageSide: initialData.sectionVisibility?.aboutMeImageSide || "right",
  });

  const [activeTab, setActiveTab] = useState("basics");
  const [isSaving, setIsSaving] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState({ loading: false, available: null, error: "" });
  const [copied, setCopied] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  // AI polishing state
  const [isPolishing, setIsPolishing] = useState({ aboutMe: false });

  // List edit modals / temporary states
  const [currentExp, setCurrentExp] = useState({ company: "", position: "", startDate: "", endDate: "", description: "", current: false, index: -1 });
  const [currentEdu, setCurrentEdu] = useState({ school: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", description: "", index: -1 });
  const [currentProj, setCurrentProj] = useState({ title: "", description: "", technologies: "", link: "", images: [], index: -1 });
  const [currentCert, setCurrentCert] = useState({ name: "", issuer: "", date: "", link: "", index: -1 });
  const [currentAch, setCurrentAch] = useState({ title: "", description: "", date: "", index: -1 });
  const [currentCustom, setCurrentCustom] = useState({ title: "", content: "", index: -1 });

  // Sync username status
  useEffect(() => {
    if (!formData.username) return;
    const timeout = setTimeout(async () => {
      setUsernameStatus({ loading: true, available: null, error: "" });
      try {
        const res = await checkUsernameAvailability(formData.username);
        if (res.available) {
          setUsernameStatus({ loading: false, available: true, error: "" });
          // Update username to the cleaned slug returned by backend
          setFormData(prev => ({ ...prev, username: res.cleanUsername }));
        } else {
          setUsernameStatus({ loading: false, available: false, error: res.error || "Username is already taken." });
        }
      } catch (err) {
        setUsernameStatus({ loading: false, available: false, error: "Failed to check availability." });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [formData.username]);

  const handleCopyLink = () => {
    if (!formData.username) return;
    const url = `${window.location.origin}/portfolio/${formData.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Public link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (publishOverride) => {
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        isPublished: publishOverride !== undefined ? publishOverride : formData.isPublished,
        sectionVisibility: {
          ...formData.sectionVisibility,
          field: formData.field,
          heroDescription: formData.heroDescription,
          aboutMeImage: formData.aboutMeImage,
          aboutMeImageSide: formData.aboutMeImageSide,
        }
      };

      const res = await savePortfolio(payload);
      if (res.success) {
        setFormData(prev => ({ ...prev, isPublished: payload.isPublished }));
        toast.success(payload.isPublished ? "Portfolio published successfully!" : "Portfolio saved successfully!");
      }
    } catch (err) {
      toast.error(err.message || "Failed to save portfolio.");
    } finally {
      setIsSaving(false);
    }
  };

  // Section Visibility toggle
  const toggleVisibility = (section) => {
    setFormData(prev => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [section]: prev.sectionVisibility[section] === false ? true : false
      }
    }));
  };

  // Add Skill chip
  const handleAddSkill = () => {
    const skill = skillInput.trim();
    if (!skill) return;
    if (formData.skills.includes(skill)) {
      setSkillInput("");
      return;
    }
    setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    setSkillInput("");
  };

  const handleRemoveSkill = (skill) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  // Experience Handlers
  const saveExperience = () => {
    if (!currentExp.company || !currentExp.position) {
      toast.error("Company and Position are required.");
      return;
    }
    setFormData(prev => {
      const list = [...prev.experience];
      if (currentExp.index > -1) {
        list[currentExp.index] = { ...currentExp };
      } else {
        list.push({ ...currentExp });
      }
      return { ...prev, experience: list };
    });
    // Reset modal state
    setCurrentExp({ company: "", position: "", startDate: "", endDate: "", description: "", current: false, index: -1 });
    toast.success("Work history entry saved!");
  };

  const deleteExperience = (index) => {
    setFormData(prev => ({ ...prev, experience: prev.experience.filter((_, idx) => idx !== index) }));
    toast.success("Entry removed.");
  };

  // Education Handlers
  const saveEducation = () => {
    if (!currentEdu.school || !currentEdu.degree) {
      toast.error("School and Degree are required.");
      return;
    }
    setFormData(prev => {
      const list = [...prev.education];
      if (currentEdu.index > -1) {
        list[currentEdu.index] = { ...currentEdu };
      } else {
        list.push({ ...currentEdu });
      }
      return { ...prev, education: list };
    });
    setCurrentEdu({ school: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", description: "", index: -1 });
    toast.success("Education entry saved!");
  };

  const deleteEducation = (index) => {
    setFormData(prev => ({ ...prev, education: prev.education.filter((_, idx) => idx !== index) }));
    toast.success("Entry removed.");
  };

  // Projects Handlers
  const saveProject = () => {
    if (!currentProj.title) {
      toast.error("Project Title is required.");
      return;
    }
    const techArray = typeof currentProj.technologies === 'string'
      ? currentProj.technologies.split(",").map(t => t.trim()).filter(Boolean)
      : currentProj.technologies || [];

    setFormData(prev => {
      const list = [...prev.projects];
      const entry = {
        title: currentProj.title,
        description: currentProj.description,
        technologies: techArray,
        link: currentProj.link,
        images: currentProj.images || []
      };
      if (currentProj.index > -1) {
        list[currentProj.index] = entry;
      } else {
        list.push(entry);
      }
      return { ...prev, projects: list };
    });
    setCurrentProj({ title: "", description: "", technologies: "", link: "", images: [], index: -1 });
    toast.success("Project entry saved!");
  };

  const deleteProject = (index) => {
    setFormData(prev => ({ ...prev, projects: prev.projects.filter((_, idx) => idx !== index) }));
    toast.success("Entry removed.");
  };

  // Certifications Handlers
  const saveCertification = () => {
    if (!currentCert.name || !currentCert.issuer) {
      toast.error("Certification Name and Issuer are required.");
      return;
    }
    setFormData(prev => {
      const list = [...prev.certifications];
      if (currentCert.index > -1) {
        list[currentCert.index] = { ...currentCert };
      } else {
        list.push({ ...currentCert });
      }
      return { ...prev, certifications: list };
    });
    setCurrentCert({ name: "", issuer: "", date: "", link: "", index: -1 });
    toast.success("Certification entry saved!");
  };

  const deleteCertification = (index) => {
    setFormData(prev => ({ ...prev, certifications: prev.certifications.filter((_, idx) => idx !== index) }));
    toast.success("Entry removed.");
  };

  // Achievements Handlers
  const saveAchievement = () => {
    if (!currentAch.title || !currentAch.description) {
      toast.error("Title and Description are required.");
      return;
    }
    setFormData(prev => {
      const list = [...prev.achievements];
      if (currentAch.index > -1) {
        list[currentAch.index] = { ...currentAch };
      } else {
        list.push({ ...currentAch });
      }
      return { ...prev, achievements: list };
    });
    setCurrentAch({ title: "", description: "", date: "", index: -1 });
    toast.success("Achievement saved!");
  };

  const deleteAchievement = (index) => {
    setFormData(prev => ({ ...prev, achievements: prev.achievements.filter((_, idx) => idx !== index) }));
    toast.success("Entry removed.");
  };

  // Custom Sections Handlers
  const saveCustomSection = () => {
    if (!currentCustom.title || !currentCustom.content) {
      toast.error("Section Title and Content are required.");
      return;
    }
    setFormData(prev => {
      const list = [...prev.customSections];
      if (currentCustom.index > -1) {
        list[currentCustom.index] = { ...currentCustom };
      } else {
        list.push({ ...currentCustom });
      }
      return { ...prev, customSections: list };
    });
    setCurrentCustom({ title: "", content: "", index: -1 });
    toast.success("Custom section saved!");
  };

  const deleteCustomSection = (index) => {
    setFormData(prev => ({ ...prev, customSections: prev.customSections.filter((_, idx) => idx !== index) }));
    toast.success("Custom section removed.");
  };

  // AI Content Improver trigger
  const handleAIImprove = async (type, currentText, updateCallback, loadingKey) => {
    if (!currentText.trim()) {
      toast.error("Please enter some text first for the AI to polish.");
      return;
    }
    setIsPolishing(prev => ({ ...prev, [loadingKey]: true }));
    try {
      const improved = await improvePortfolioText({
        type,
        currentText,
        careerGoals: "Senior role, professional branding, recruiter-optimized"
      });
      updateCallback(improved);
      toast.success("Content improved with AI!");
    } catch (err) {
      toast.error(err.message || "Failed to polish text.");
    } finally {
      setIsPolishing(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 md:px-0">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 p-6 bg-slate-900 text-white rounded-3xl shadow-xl">
        <div>
          <h1 className="text-3xl font-black tracking-tight">AI Portfolio Builder</h1>
          <p className="text-slate-400 text-sm font-medium mt-1">
            Review, edit, and style your dynamic public portfolio.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="rounded-xl border-slate-700 bg-slate-800 text-white hover:bg-slate-700 hover:text-white font-bold"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>

          {formData.isPublished ? (
            <Button
              variant="destructive"
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="rounded-xl font-bold"
            >
              Unpublish Portfolio
            </Button>
          ) : (
            <Button
              onClick={() => handleSave(true)}
              disabled={isSaving || !formData.username || usernameStatus.available === false}
              className="rounded-xl font-black bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg"
            >
              <Globe className="w-4 h-4 mr-2" />
              Publish Portfolio
            </Button>
          )}
        </div>
      </div>

      {/* Public Link Card if published */}
      {formData.isPublished && formData.username && (
        <Card className="border-emerald-500/20 bg-emerald-500/5 mb-8 rounded-2xl">
          <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-900">Your portfolio is live online!</p>
                <a
                  href={`/portfolio/${formData.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1.5"
                >
                  careerly.co/portfolio/{formData.username}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyLink}
                className="flex-1 sm:flex-initial h-9 rounded-lg border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-800 font-bold"
              >
                {copied ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
                {copied ? "Copied!" : "Copy Link"}
              </Button>
              <a href={`/portfolio/${formData.username}`} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-initial">
                <Button size="sm" className="w-full h-9 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                  <Eye className="w-4 h-4 mr-1.5" />
                  View Live
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Tabs Workspace */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <TabsList className="lg:col-span-3 flex lg:flex-col items-stretch justify-start bg-slate-100 p-2.5 rounded-2xl h-fit gap-1 overflow-x-auto lg:overflow-x-visible">
          <TabsTrigger value="basics" className="justify-start gap-2.5 px-4 py-3 rounded-xl font-bold text-slate-600 data-[state=active]:bg-white data-[state=active]:shadow-md">
            <User className="w-4 h-4" />
            Profile Basics
          </TabsTrigger>
          <TabsTrigger value="about" className="justify-start gap-2.5 px-4 py-3 rounded-xl font-bold text-slate-600 data-[state=active]:bg-white data-[state=active]:shadow-md">
            <Briefcase className="w-4 h-4" />
            Intro & Skills
          </TabsTrigger>
          <TabsTrigger value="experience" className="justify-start gap-2.5 px-4 py-3 rounded-xl font-bold text-slate-600 data-[state=active]:bg-white data-[state=active]:shadow-md">
            <Briefcase className="w-4 h-4" />
            Work History
          </TabsTrigger>
          <TabsTrigger value="projects" className="justify-start gap-2.5 px-4 py-3 rounded-xl font-bold text-slate-600 data-[state=active]:bg-white data-[state=active]:shadow-md">
            <Layers className="w-4 h-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="achievements" className="justify-start gap-2.5 px-4 py-3 rounded-xl font-bold text-slate-600 data-[state=active]:bg-white data-[state=active]:shadow-md">
            <Award className="w-4 h-4" />
            Awards & Custom
          </TabsTrigger>
          <TabsTrigger value="design" className="justify-start gap-2.5 px-4 py-3 rounded-xl font-bold text-slate-600 data-[state=active]:bg-white data-[state=active]:shadow-md">
            <Settings className="w-4 h-4" />
            Theme & Publish
          </TabsTrigger>
        </TabsList>

        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: BASICS */}
          <TabsContent value="basics">
            <Card className="border-none shadow-xl rounded-3xl bg-white">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-xl font-black text-slate-800 pb-2 border-b border-slate-100">Personal Details</h3>

                {/* Username / URL Link */}
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Choose Public Username</Label>
                  <div className="flex gap-2 max-w-md">
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 text-slate-500 font-semibold text-sm shrink-0">
                      careerly.com/portfolio/
                    </div>
                    <Input
                      id="portfolio-username-input"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="username"
                      className="h-11 bg-slate-50 border-slate-200 rounded-xl font-semibold"
                    />
                  </div>
                  {/* Status Indicator */}
                  {formData.username && (
                    <div className="flex items-center gap-1.5 text-xs font-bold mt-1 px-1">
                      {usernameStatus.loading && (
                        <span className="text-slate-500 flex items-center gap-1">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking availability...
                        </span>
                      )}
                      {usernameStatus.available === true && (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Username is available!
                        </span>
                      )}
                      {usernameStatus.available === false && (
                        <span className="text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {usernameStatus.error}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Custom Image URL / Upload */}
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Profile Image</Label>
                    <div className="flex gap-2">
                      <Input
                        value={formData.profileImage}
                        onChange={(e) => setFormData(prev => ({ ...prev, profileImage: e.target.value }))}
                        placeholder="https://example.com/photo.jpg or Base64"
                        className="h-11 bg-slate-50 border-slate-200 rounded-xl font-semibold flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setFormData(prev => ({ ...prev, profileImage: defaultUser.imageUrl }))}
                        className="h-11 rounded-xl border-slate-200"
                        title="Use default Clerk photo"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              toast.error("Image must be under 2MB.");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData(prev => ({ ...prev, profileImage: reader.result }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="h-9 text-xs bg-slate-50 border-slate-200 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Professional Field / Headline */}
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Professional Field / Title</Label>
                    <Input
                      value={formData.field}
                      onChange={(e) => setFormData(prev => ({ ...prev, field: e.target.value }))}
                      placeholder="e.g. Senior Full Stack Developer"
                      className="h-11 bg-slate-50 border-slate-200 rounded-xl font-semibold"
                    />
                  </div>

                  {/* Hero Description */}
                  <div className="space-y-2 col-span-full">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Hero Catchy Tagline / Short Description</Label>
                    <Textarea
                      value={formData.heroDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, heroDescription: e.target.value }))}
                      placeholder="e.g. Building high-performance React & Node applications that solve real-world problems and drive growth."
                      className="min-h-[60px] bg-slate-50 border-slate-200 rounded-xl resize-none text-[14px] leading-relaxed"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Location</Label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. San Francisco, CA"
                      className="h-11 bg-slate-50 border-slate-200 rounded-xl font-semibold"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Contact Email</Label>
                    <Input
                      value={formData.contactEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="john@example.com"
                      type="email"
                      className="h-11 bg-slate-50 border-slate-200 rounded-xl font-semibold"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Contact Phone</Label>
                    <Input
                      value={formData.contactPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                      placeholder="+1 234 567 890"
                      className="h-11 bg-slate-50 border-slate-200 rounded-xl font-semibold"
                    />
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-800 pt-4 pb-2 border-b border-slate-100">Socials & Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* LinkedIn */}
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      <Linkedin className="w-3.5 h-3.5 text-blue-600" /> LinkedIn URL
                    </Label>
                    <Input
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                      placeholder="https://linkedin.com/in/username"
                      className="h-11 bg-slate-50 border-slate-200 rounded-xl font-semibold"
                    />
                  </div>

                  {/* GitHub */}
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      <Github className="w-3.5 h-3.5 text-slate-800" /> GitHub URL
                    </Label>
                    <Input
                      value={formData.githubUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                      placeholder="https://github.com/username"
                      className="h-11 bg-slate-50 border-slate-200 rounded-xl font-semibold"
                    />
                  </div>

                  {/* Personal Website */}
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-emerald-600" /> Personal Website URL
                    </Label>
                    <Input
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                      placeholder="https://yourwebsite.com"
                      className="h-11 bg-slate-50 border-slate-200 rounded-xl font-semibold"
                    />
                  </div>

                  {/* Custom Resume URL */}
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">
                      External Resume URL (Optional)
                    </Label>
                    <Input
                      value={formData.resumeUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, resumeUrl: e.target.value }))}
                      placeholder="e.g. Drive, Dropbox PDF link"
                      className="h-11 bg-slate-50 border-slate-200 rounded-xl font-semibold"
                    />
                    <p className="text-[10px] text-slate-400 font-medium">
                      If left empty, recruiters will download your Careerly-built resume dynamically!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: ABOUT & SKILLS */}
          <TabsContent value="about">
            <Card className="border-none shadow-xl rounded-3xl bg-white">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-xl font-black text-slate-800">Professional Introduction</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="bg-primary/5 text-primary hover:bg-primary/10 rounded-full px-4 font-bold transition-all"
                    onClick={() => handleAIImprove("aboutMe", formData.aboutMe, (val) => setFormData(prev => ({ ...prev, aboutMe: val })), "aboutMe")}
                    disabled={isPolishing.aboutMe || !formData.aboutMe}
                  >
                    {isPolishing.aboutMe ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Polishing...</>
                    ) : (
                      <><Sparkles className="h-4 w-4 mr-2" /> AI Improve</>
                    )}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400">About Me Summary</Label>
                  <Textarea
                    value={formData.aboutMe}
                    onChange={(e) => setFormData(prev => ({ ...prev, aboutMe: e.target.value }))}
                    placeholder="Write a captivating introduction. Focus on your expertise, tech stack, achievements, and career aspirations..."
                    className="min-h-[160px] bg-slate-50 border-slate-200 rounded-2xl resize-none text-[15px] leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">About Me Image (Optional)</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              toast.error("Image must be under 2MB.");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData(prev => ({ ...prev, aboutMeImage: reader.result }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="h-11 bg-slate-50 border-slate-200 rounded-xl cursor-pointer"
                      />
                      {formData.aboutMeImage && (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => setFormData(prev => ({ ...prev, aboutMeImage: "" }))}
                          className="h-11 rounded-xl"
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                    {formData.aboutMeImage && (
                      <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 mt-2">
                        <img src={formData.aboutMeImage} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">About Image Position</Label>
                    <div className="flex gap-4 pt-2">
                      <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="aboutMeImageSide"
                          value="left"
                          checked={formData.aboutMeImageSide === "left"}
                          onChange={() => setFormData(prev => ({ ...prev, aboutMeImageSide: "left" }))}
                          className="w-4 h-4 text-violet-600 focus:ring-violet-500 border-slate-300"
                        />
                        <span>Left Side</span>
                      </label>
                      <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="aboutMeImageSide"
                          value="right"
                          checked={formData.aboutMeImageSide === "right"}
                          onChange={() => setFormData(prev => ({ ...prev, aboutMeImageSide: "right" }))}
                          className="w-4 h-4 text-violet-600 focus:ring-violet-500 border-slate-300"
                        />
                        <span>Right Side</span>
                      </label>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-800 pt-4 pb-2 border-b border-slate-100">Skills</h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      id="portfolio-skill-input"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                      placeholder="Add a skill chip (e.g. React)"
                      className="h-11 bg-slate-50 border-slate-200 rounded-xl font-semibold"
                    />
                    <Button onClick={handleAddSkill} className="h-11 bg-slate-900 text-white rounded-xl">
                      Add
                    </Button>
                  </div>

                  {formData.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      {formData.skills.map(skill => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white text-slate-700 rounded-lg border border-slate-200 shadow-sm"
                        >
                          {skill}
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full w-4 h-4 inline-flex items-center justify-center text-[10px]"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No skills added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: WORK HISTORY */}
          <TabsContent value="experience">
            <Card className="border-none shadow-xl rounded-3xl bg-white">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-xl font-black text-slate-800 pb-2 border-b border-slate-100">Work Experience</h3>

                {/* Current Experience List */}
                <div className="space-y-4">
                  {formData.experience.map((exp, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:border-slate-200 bg-slate-50/50">
                      <div>
                        <h4 className="font-bold text-slate-800">{exp.position}</h4>
                        <p className="text-xs text-slate-500 font-medium">
                          {exp.company} • {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setCurrentExp({ ...exp, index: idx })}
                          className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900 rounded-lg"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteExperience(idx)}
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Entry / Editor Subform */}
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4 mt-6">
                  <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider">
                    {currentExp.index > -1 ? "Edit Experience Entry" : "Add Experience Entry"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Company</Label>
                      <Input
                        value={currentExp.company}
                        onChange={(e) => setCurrentExp(prev => ({ ...prev, company: e.target.value }))}
                        placeholder="e.g. Google"
                        className="bg-white border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Position</Label>
                      <Input
                        value={currentExp.position}
                        onChange={(e) => setCurrentExp(prev => ({ ...prev, position: e.target.value }))}
                        placeholder="e.g. Frontend Engineer"
                        className="bg-white border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Start Date</Label>
                      <Input
                        value={currentExp.startDate}
                        onChange={(e) => setCurrentExp(prev => ({ ...prev, startDate: e.target.value }))}
                        placeholder="YYYY-MM (e.g. 2022-01)"
                        className="bg-white border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">End Date</Label>
                      <Input
                        value={currentExp.endDate}
                        onChange={(e) => setCurrentExp(prev => ({ ...prev, endDate: e.target.value }))}
                        placeholder="YYYY-MM"
                        disabled={currentExp.current}
                        className="bg-white border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="col-span-full flex items-center gap-2 py-1">
                      <Switch
                        id="current-switch"
                        checked={currentExp.current}
                        onCheckedChange={(checked) => setCurrentExp(prev => ({ ...prev, current: checked, endDate: checked ? "" : prev.endDate }))}
                      />
                      <Label htmlFor="current-switch" className="text-xs font-bold text-slate-600">Currently work here</Label>
                    </div>
                    <div className="col-span-full space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Description</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="bg-primary/5 text-primary hover:bg-primary/10 rounded-full px-4 font-bold text-xs"
                          onClick={() => handleAIImprove("experience description", currentExp.description, (val) => setCurrentExp(prev => ({ ...prev, description: val })), "currentExpDesc")}
                          disabled={isPolishing.currentExpDesc || !currentExp.description}
                        >
                          {isPolishing.currentExpDesc ? <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Polishing...</> : <><Sparkles className="h-3 w-3 mr-1" /> AI Improve</>}
                        </Button>
                      </div>
                      <Textarea
                        value={currentExp.description}
                        onChange={(e) => setCurrentExp(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Responsibilities and achievements. Use bullets or plain paragraphs..."
                        className="min-h-[100px] bg-white border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button onClick={saveExperience} className="bg-slate-900 text-white rounded-xl">
                      {currentExp.index > -1 ? "Update Entry" : "Add Entry"}
                    </Button>
                    {currentExp.index > -1 && (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentExp({ company: "", position: "", startDate: "", endDate: "", description: "", current: false, index: -1 })}
                        className="rounded-xl border-slate-200"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-800 pt-8 pb-2 border-b border-slate-100">Education</h3>

                {/* Current Education List */}
                <div className="space-y-4">
                  {formData.education.map((edu, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:border-slate-200 bg-slate-50/50">
                      <div>
                        <h4 className="font-bold text-slate-800">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}</h4>
                        <p className="text-xs text-slate-500 font-medium">
                          {edu.school} • {edu.startDate} - {edu.endDate}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setCurrentEdu({ ...edu, index: idx })}
                          className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900 rounded-lg"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteEducation(idx)}
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Education subform */}
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4 mt-6">
                  <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider">
                    {currentEdu.index > -1 ? "Edit Education Entry" : "Add Education Entry"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">School/University</Label>
                      <Input
                        value={currentEdu.school}
                        onChange={(e) => setCurrentEdu(prev => ({ ...prev, school: e.target.value }))}
                        placeholder="e.g. Stanford University"
                        className="bg-white border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Degree</Label>
                      <Input
                        value={currentEdu.degree}
                        onChange={(e) => setCurrentEdu(prev => ({ ...prev, degree: e.target.value }))}
                        placeholder="e.g. Bachelor of Science"
                        className="bg-white border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Field of Study</Label>
                      <Input
                        value={currentEdu.fieldOfStudy}
                        onChange={(e) => setCurrentEdu(prev => ({ ...prev, fieldOfStudy: e.target.value }))}
                        placeholder="e.g. Computer Science"
                        className="bg-white border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Start Date</Label>
                        <Input
                          value={currentEdu.startDate}
                          onChange={(e) => setCurrentEdu(prev => ({ ...prev, startDate: e.target.value }))}
                          placeholder="e.g. 2018"
                          className="bg-white border-slate-200 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">End Date</Label>
                        <Input
                          value={currentEdu.endDate}
                          onChange={(e) => setCurrentEdu(prev => ({ ...prev, endDate: e.target.value }))}
                          placeholder="e.g. 2022"
                          className="bg-white border-slate-200 rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="col-span-full space-y-2">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Description (Optional)</Label>
                      <Textarea
                        value={currentEdu.description}
                        onChange={(e) => setCurrentEdu(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Key courses, GPA, societies..."
                        className="min-h-[80px] bg-white border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button onClick={saveEducation} className="bg-slate-900 text-white rounded-xl">
                      {currentEdu.index > -1 ? "Update Entry" : "Add Entry"}
                    </Button>
                    {currentEdu.index > -1 && (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentEdu({ school: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", description: "", index: -1 })}
                        className="rounded-xl border-slate-200"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: PROJECTS */}
          <TabsContent value="projects">
            <Card className="border-none shadow-xl rounded-3xl bg-white">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-xl font-black text-slate-800 pb-2 border-b border-slate-100">Projects</h3>

                {/* List Projects */}
                <div className="space-y-4">
                  {formData.projects.map((proj, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:border-slate-200 bg-slate-50/50">
                      <div>
                        <h4 className="font-bold text-slate-800">{proj.title}</h4>
                        {proj.technologies && proj.technologies.length > 0 && (
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Tech: {proj.technologies.join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setCurrentProj({ ...proj, technologies: proj.technologies.join(", "), images: proj.images || [], index: idx })}
                          className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900 rounded-lg"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteProject(idx)}
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subform Project */}
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4 mt-6">
                  <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider">
                    {currentProj.index > -1 ? "Edit Project" : "Add Project"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-full">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Project Title</Label>
                      <Input
                        value={currentProj.title}
                        onChange={(e) => setCurrentProj(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. AI-powered Chatbot"
                        className="bg-white border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Technologies Used</Label>
                      <Input
                        value={currentProj.technologies}
                        onChange={(e) => setCurrentProj(prev => ({ ...prev, technologies: e.target.value }))}
                        placeholder="e.g. React, Next.js, Node (comma separated)"
                        className="bg-white border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Project Link URL</Label>
                      <Input
                        value={currentProj.link}
                        onChange={(e) => setCurrentProj(prev => ({ ...prev, link: e.target.value }))}
                        placeholder="e.g. GitHub URL or Live website link"
                        className="bg-white border-slate-200 rounded-xl"
                      />
                    </div>
                    
                    {/* Project images upload */}
                    <div className="space-y-2 col-span-full">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Project Screen Shots / Images</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          files.forEach(file => {
                            if (file.size > 2 * 1024 * 1024) {
                              toast.error(`${file.name} is too large. Image must be under 2MB.`);
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setCurrentProj(prev => ({
                                ...prev,
                                images: [...(prev.images || []), reader.result]
                              }));
                            };
                            reader.readAsDataURL(file);
                          });
                        }}
                        className="h-11 bg-white border-slate-200 rounded-xl cursor-pointer"
                      />
                      {currentProj.images && currentProj.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-2 bg-white border border-slate-100 rounded-xl mt-2">
                          {currentProj.images.map((img, i) => (
                            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                              <img src={img} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => {
                                  setCurrentProj(prev => ({
                                    ...prev,
                                    images: prev.images.filter((_, idx) => idx !== i)
                                  }));
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="col-span-full space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Project Description</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="bg-primary/5 text-primary hover:bg-primary/10 rounded-full px-4 font-bold text-xs"
                          onClick={() => handleAIImprove("project description", currentProj.description, (val) => setCurrentProj(prev => ({ ...prev, description: val })), "currentProjDesc")}
                          disabled={isPolishing.currentProjDesc || !currentProj.description}
                        >
                          {isPolishing.currentProjDesc ? <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Polishing...</> : <><Sparkles className="h-3 w-3 mr-1" /> AI Improve</>}
                        </Button>
                      </div>
                      <Textarea
                        value={currentProj.description}
                        onChange={(e) => setCurrentProj(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the project objective, key features, and outcomes..."
                        className="min-h-[100px] bg-white border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button onClick={saveProject} className="bg-slate-900 text-white rounded-xl">
                      {currentProj.index > -1 ? "Update Project" : "Add Project"}
                    </Button>
                    {currentProj.index > -1 && (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentProj({ title: "", description: "", technologies: "", link: "", images: [], index: -1 })}
                        className="rounded-xl border-slate-200"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 5: AWARDS, CERTS & CUSTOM */}
          <TabsContent value="achievements">
            <Card className="border-none shadow-xl rounded-3xl bg-white">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-xl font-black text-slate-800 pb-2 border-b border-slate-100">Certifications</h3>

                {/* List Certs */}
                <div className="space-y-4">
                  {formData.certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:border-slate-200 bg-slate-50/50">
                      <div>
                        <h4 className="font-bold text-slate-800">{cert.name}</h4>
                        <p className="text-xs text-slate-500 font-medium">
                          {cert.issuer} {cert.date ? `• ${cert.date}` : ""}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setCurrentCert({ ...cert, index: idx })}
                          className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900 rounded-lg"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteCertification(idx)}
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subform Cert */}
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4 mt-6">
                  <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider">
                    {currentCert.index > -1 ? "Edit Certification" : "Add Certification"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-full">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Certification Name</Label>
                      <Input
                        value={currentCert.name}
                        onChange={(e) => setCurrentCert(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. AWS Certified Solutions Architect"
                        className="bg-white border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Issuer</Label>
                      <Input
                        value={currentCert.issuer}
                        onChange={(e) => setCurrentCert(prev => ({ ...prev, issuer: e.target.value }))}
                        placeholder="e.g. Amazon Web Services"
                        className="bg-white border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Date Earned</Label>
                      <Input
                        value={currentCert.date}
                        onChange={(e) => setCurrentCert(prev => ({ ...prev, date: e.target.value }))}
                        placeholder="e.g. 2023-05"
                        className="bg-white border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2 col-span-full">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Verification Link URL</Label>
                      <Input
                        value={currentCert.link}
                        onChange={(e) => setCurrentCert(prev => ({ ...prev, link: e.target.value }))}
                        placeholder="e.g. Credly or Certificate URL"
                        className="bg-white border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button onClick={saveCertification} className="bg-slate-900 text-white rounded-xl">
                      {currentCert.index > -1 ? "Update Certification" : "Add Certification"}
                    </Button>
                    {currentCert.index > -1 && (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentCert({ name: "", issuer: "", date: "", link: "", index: -1 })}
                        className="rounded-xl border-slate-200"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-800 pt-8 pb-2 border-b border-slate-100">Achievements</h3>

                {/* List achievements */}
                <div className="space-y-4">
                  {formData.achievements.map((ach, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:border-slate-200 bg-slate-50/50">
                      <div>
                        <h4 className="font-bold text-slate-800">{ach.title}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{ach.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setCurrentAch({ ...ach, index: idx })}
                          className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900 rounded-lg"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteAchievement(idx)}
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subform Achievement */}
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4 mt-6">
                  <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider">
                    {currentAch.index > -1 ? "Edit Achievement" : "Add Achievement"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-full">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Title</Label>
                      <Input
                        value={currentAch.title}
                        onChange={(e) => setCurrentAch(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Careerly Hackathon First Place"
                        className="bg-white border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2 col-span-full">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Description</Label>
                      <Textarea
                        value={currentAch.description}
                        onChange={(e) => setCurrentAch(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief summary of the recognition, key details..."
                        className="bg-white border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Date Received</Label>
                      <Input
                        value={currentAch.date}
                        onChange={(e) => setCurrentAch(prev => ({ ...prev, date: e.target.value }))}
                        placeholder="e.g. 2024-03"
                        className="bg-white border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button onClick={saveAchievement} className="bg-slate-900 text-white rounded-xl">
                      {currentAch.index > -1 ? "Update Entry" : "Add Entry"}
                    </Button>
                    {currentAch.index > -1 && (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentAch({ title: "", description: "", date: "", index: -1 })}
                        className="rounded-xl border-slate-200"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-800 pt-8 pb-2 border-b border-slate-100">Custom Sections</h3>

                {/* List Custom Sections */}
                <div className="space-y-4">
                  {formData.customSections.map((sec, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:border-slate-200 bg-slate-50/50">
                      <div>
                        <h4 className="font-bold text-slate-800">{sec.title}</h4>
                        <p className="text-xs text-slate-500 font-medium truncate max-w-[400px]">{sec.content}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setCurrentCustom({ ...sec, index: idx })}
                          className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900 rounded-lg"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteCustomSection(idx)}
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subform Custom Section */}
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4 mt-6">
                  <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider">
                    {currentCustom.index > -1 ? "Edit Custom Section" : "Add Custom Section"}
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Section Title</Label>
                      <Input
                        value={currentCustom.title}
                        onChange={(e) => setCurrentCustom(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Publications, Volunteer Work, or Languages"
                        className="bg-white border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Content</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="bg-primary/5 text-primary hover:bg-primary/10 rounded-full px-4 font-bold text-xs"
                          onClick={() => handleAIImprove("custom section content", currentCustom.content, (val) => setCurrentCustom(prev => ({ ...prev, content: val })), "currentCustomContent")}
                          disabled={isPolishing.currentCustomContent || !currentCustom.content}
                        >
                          {isPolishing.currentCustomContent ? <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Polishing...</> : <><Sparkles className="h-3 w-3 mr-1" /> AI Improve</>}
                        </Button>
                      </div>
                      <Textarea
                        value={currentCustom.content}
                        onChange={(e) => setCurrentCustom(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Write content for this custom section..."
                        className="min-h-[120px] bg-white border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button onClick={saveCustomSection} className="bg-slate-900 text-white rounded-xl">
                      {currentCustom.index > -1 ? "Update Section" : "Add Section"}
                    </Button>
                    {currentCustom.index > -1 && (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentCustom({ title: "", content: "", index: -1 })}
                        className="rounded-xl border-slate-200"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 6: DESIGN & VISIBILITY & SETTINGS */}
          <TabsContent value="design">
            <Card className="border-none shadow-xl rounded-3xl bg-white">
              <CardContent className="p-8 space-y-8">
                {/* Theme Selector */}
                <div className="space-y-3">
                  <h3 className="text-xl font-black text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-violet-500" /> Choose Theme Style
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                    {/* Modern */}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, theme: "modern" }))}
                      className={`flex flex-col items-center p-4 border rounded-2xl hover:border-violet-400 hover:bg-slate-50 transition-all ${formData.theme === "modern" ? "border-violet-500 ring-2 ring-violet-500/20 bg-slate-50" : "border-slate-100"}`}
                    >
                      <span className="font-extrabold text-sm uppercase tracking-wider text-slate-800 mb-1">Modern</span>
                      <span className="text-[10px] text-slate-400 font-medium">Indigo/Fuchsia Gradients</span>
                    </button>
                    {/* Sleek */}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, theme: "sleek" }))}
                      className={`flex flex-col items-center p-4 border rounded-2xl hover:border-emerald-400 hover:bg-slate-50 transition-all ${formData.theme === "sleek" ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-slate-50" : "border-slate-100"}`}
                    >
                      <span className="font-bold text-sm uppercase tracking-wider text-slate-800 mb-1">Sleek</span>
                      <span className="text-[10px] text-slate-400 font-medium">Emerald & Slate Mono</span>
                    </button>
                    {/* Creative */}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, theme: "creative" }))}
                      className={`flex flex-col items-center p-4 border rounded-2xl hover:border-rose-400 hover:bg-slate-50 transition-all ${formData.theme === "creative" ? "border-rose-500 ring-2 ring-rose-500/20 bg-slate-50" : "border-slate-100"}`}
                    >
                      <span className="font-bold text-sm uppercase tracking-wider text-slate-800 mb-1">Creative</span>
                      <span className="text-[10px] text-slate-400 font-medium">Rose/Orange soft cards</span>
                    </button>
                    {/* Minimalist */}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, theme: "minimalist" }))}
                      className={`flex flex-col items-center p-4 border rounded-2xl hover:border-stone-400 hover:bg-slate-50 transition-all ${formData.theme === "minimalist" ? "border-stone-900 ring-2 ring-stone-900/20 bg-slate-50" : "border-slate-100"}`}
                    >
                      <span className="font-serif font-black text-sm text-stone-900 mb-1">Minimalist</span>
                      <span className="text-[10px] text-stone-400 font-medium">Clean layout, Serif font</span>
                    </button>
                  </div>
                </div>

                {/* Layout Selector */}
                <div className="space-y-3">
                  <h3 className="text-xl font-black text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <Layout className="w-5 h-5 text-blue-500" /> Choose Layout Structure
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {/* Standard */}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, layout: "standard" }))}
                      className={`flex items-start gap-4 p-4 border rounded-2xl text-left hover:border-blue-400 hover:bg-slate-50 transition-all ${formData.layout === "standard" ? "border-blue-500 ring-2 ring-blue-500/20 bg-slate-50" : "border-slate-100"}`}
                    >
                      <div className="w-12 h-12 bg-slate-200 border border-slate-300 rounded flex flex-col p-1 gap-1 shrink-0">
                        <div className="h-2 bg-slate-400 rounded-sm w-full" />
                        <div className="h-4 bg-slate-300 rounded-sm w-full" />
                        <div className="h-3 bg-slate-300 rounded-sm w-full" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-800 uppercase tracking-wide block">Standard Stack</span>
                        <span className="text-[11px] text-slate-400 font-medium leading-tight">One simple column of sections</span>
                      </div>
                    </button>

                    {/* Sidebar */}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, layout: "sidebar" }))}
                      className={`flex items-start gap-4 p-4 border rounded-2xl text-left hover:border-blue-400 hover:bg-slate-50 transition-all ${formData.layout === "sidebar" ? "border-blue-500 ring-2 ring-blue-500/20 bg-slate-50" : "border-slate-100"}`}
                    >
                      <div className="w-12 h-12 bg-slate-200 border border-slate-300 rounded flex p-1 gap-1 shrink-0">
                        <div className="w-1/3 bg-slate-400 rounded-sm h-full" />
                        <div className="w-2/3 flex flex-col gap-1">
                          <div className="h-2 bg-slate-300 rounded-sm w-full" />
                          <div className="h-4 bg-slate-300 rounded-sm w-full" />
                        </div>
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-800 uppercase tracking-wide block">Split Sidebar</span>
                        <span className="text-[11px] text-slate-400 font-medium leading-tight">Profile & skills left, details right</span>
                      </div>
                    </button>

                    {/* Grid Layout */}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, layout: "grid" }))}
                      className={`flex items-start gap-4 p-4 border rounded-2xl text-left hover:border-blue-400 hover:bg-slate-50 transition-all ${formData.layout === "grid" ? "border-blue-500 ring-2 ring-blue-500/20 bg-slate-50" : "border-slate-100"}`}
                    >
                      <div className="w-12 h-12 bg-slate-200 border border-slate-300 rounded flex flex-col p-1 gap-1 shrink-0">
                        <div className="h-2 bg-slate-400 rounded-sm w-full" />
                        <div className="grid grid-cols-2 gap-1 flex-1">
                          <div className="bg-slate-300 rounded-sm h-full" />
                          <div className="bg-slate-300 rounded-sm h-full" />
                        </div>
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-800 uppercase tracking-wide block">Dashboard Grid</span>
                        <span className="text-[11px] text-slate-400 font-medium leading-tight">Sections displayed in structured grid</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Section Visibility */}
                <div className="space-y-3">
                  <h3 className="text-xl font-black text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-emerald-500" /> Section Visibility
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Toggle which sections are visible to recruiters on your public portfolio page.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {[
                      { key: "aboutMe", label: "About Me Summary" },
                      { key: "skills", label: "Skills Chip List" },
                      { key: "experience", label: "Work History" },
                      { key: "projects", label: "Projects" },
                      { key: "education", label: "Education" },
                      { key: "certifications", label: "Certifications" },
                      { key: "achievements", label: "Achievements" },
                    ].map(sec => (
                      <div key={sec.key} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl">
                        <span className="text-sm font-bold text-slate-700">{sec.label}</span>
                        <Switch
                          checked={formData.sectionVisibility[sec.key] !== false}
                          onCheckedChange={() => toggleVisibility(sec.key)}
                        />
                      </div>
                    ))}
                    {formData.customSections.map((sec, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl">
                        <span className="text-sm font-bold text-slate-700">Custom: {sec.title}</span>
                        <Switch
                          checked={formData.sectionVisibility[`custom_${idx}`] !== false}
                          onCheckedChange={() => toggleVisibility(`custom_${idx}`)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default PortfolioForm;
