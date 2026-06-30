"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  BadgeAlert,
  Download,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  X,
  Upload,
  ArrowLeft,
  Sparkles,
  Camera
} from "lucide-react";
import { savePortfolio } from "@/actions/portfolio";
import { toast } from "sonner";

export default function PremiumPortfolioClient({ portfolio, isOwner, username, hasCareerlyResume }) {
  const [activeProject, setActiveProject] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [localPortfolio, setLocalPortfolio] = useState(portfolio);

  const {
    aboutMe,
    skills = [],
    education = [],
    experience = [],
    projects = [],
    certifications = [],
    achievements = [],
    customSections = [],
    theme = "modern",
    layout = "standard",
    profileImage,
    sectionVisibility = {},
    contactEmail,
    contactPhone,
    location,
    linkedinUrl,
    githubUrl,
    websiteUrl,
    resumeUrl
  } = localPortfolio;

  // Retrieve premium fields saved in sectionVisibility JSON
  const field = sectionVisibility?.field || portfolio.user?.industry || "Professional";
  const heroDescription = sectionVisibility?.heroDescription || aboutMe?.slice(0, 160) || "Welcome to my professional portfolio.";
  const aboutMeImage = sectionVisibility?.aboutMeImage || "";
  const aboutMeImageSide = sectionVisibility?.aboutMeImageSide || "right";

  // Section visibility check
  const isVisible = (sectionName) => {
    return sectionVisibility[sectionName] !== false;
  };

  // Merge and sort education and experience chronologically for the zig-zag timeline
  const timelineItems = [];
  if (isVisible("experience") && experience.length > 0) {
    experience.forEach((exp) => {
      timelineItems.push({
        type: "experience",
        date: `${exp.startDate} - ${exp.current ? "Present" : exp.endDate}`,
        title: exp.position,
        subtitle: exp.company,
        description: exp.description,
        startDate: exp.startDate,
      });
    });
  }
  if (isVisible("education") && education.length > 0) {
    education.forEach((edu) => {
      timelineItems.push({
        type: "education",
        date: `${edu.startDate} - ${edu.endDate}`,
        title: `${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}`,
        subtitle: edu.school,
        description: edu.description,
        startDate: edu.startDate,
      });
    });
  }

  const parseYear = (dateStr) => {
    if (!dateStr) return 0;
    const match = dateStr.match(/\d{4}/);
    return match ? parseInt(match[0], 10) : 0;
  };
  
  timelineItems.sort((a, b) => parseYear(b.startDate) - parseYear(a.startDate));

  // Slider controls
  const sliderRef = useRef(null);

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Profile default image
  const defaultProfileImg = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256";
  const userImageUrl = profileImage || defaultProfileImg;

  // Colors & themes configurations
  const themeConfig = {
    modern: {
      bg: "bg-slate-950 text-slate-100",
      accent: "text-violet-400",
      accentBg: "bg-violet-500/10 text-violet-300 border-violet-500/20",
      card: "bg-slate-900/60 border border-slate-800 backdrop-blur-md hover:border-violet-500/30 transition-all",
      navBg: "bg-slate-900/80 border-b border-slate-800",
      textMuted: "text-slate-400",
      button: "bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-900/25",
      border: "border-slate-800",
      font: "font-sans",
      gradientText: "bg-linear-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent",
      titleText: "text-slate-100",
      modalBg: "bg-slate-900",
      modalBorder: "border-slate-800",
      modalFooterBg: "bg-slate-950",
      modalCloseBtn: "bg-slate-800 hover:bg-slate-700 text-slate-300",
      modalLinkBtn: "bg-violet-600 hover:bg-violet-500 text-white",
      galleryBg: "bg-slate-950",
      timelineCard: "bg-slate-900/60 border border-slate-800 text-slate-100",
      timelineLine: "from-violet-500 via-indigo-500 to-transparent",
      timelineExpDot: "bg-violet-600 border-violet-400 text-white",
      timelineEduDot: "bg-indigo-600 border-indigo-400 text-white",
      expBadge: "bg-violet-500/10 text-violet-300 border-violet-500/20",
      eduBadge: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
      typeBadgeExp: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
      typeBadgeEdu: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
      ownerPanel: "bg-slate-800/40",
      ownerPanelBorder: "border-slate-700/50",
      ownerPanelAccent: "text-violet-400",
      ownerBtn: "bg-slate-900 hover:bg-slate-800 text-white border-slate-700",
      ownerUploadBtn: "bg-violet-600 hover:bg-violet-500 text-white",
      ownerUploadPanel: "bg-violet-950/20 border-violet-800/30",
      coverPlaceholder: "from-violet-950 to-slate-900",
      techBadge: "bg-white/5 border border-white/10 text-slate-300",
      photosBadge: "bg-slate-900/80 border-white/10 text-white",
      footerLabel: "text-slate-400",
      socialBtn: "bg-white/5 border-white/10 hover:bg-white/10 text-white",
      footerSeparator: "border-white/5",
    },
    sleek: {
      bg: "bg-slate-950 text-zinc-100",
      accent: "text-cyan-400",
      accentBg: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
      card: "bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all duration-300",
      navBg: "bg-slate-950/70 border-b border-white/[0.06] backdrop-blur-md",
      textMuted: "text-zinc-400",
      button: "bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-950/25",
      border: "border-white/[0.06]",
      font: "font-sans",
      gradientText: "bg-linear-to-r from-cyan-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent",
      titleText: "text-zinc-100",
      modalBg: "bg-zinc-900/95",
      modalBorder: "border-white/[0.08]",
      modalFooterBg: "bg-black/35",
      modalCloseBtn: "bg-white/5 hover:bg-white/10 text-zinc-300",
      modalLinkBtn: "bg-linear-to-r from-cyan-500 to-blue-500 hover:bg-cyan-400 hover:bg-blue-400 text-white",
      galleryBg: "bg-black/40",
      timelineCard: "bg-white/[0.02] border border-white/[0.08] text-zinc-100",
      timelineLine: "from-cyan-500 via-blue-500 to-transparent",
      timelineExpDot: "bg-cyan-600 border-cyan-400 text-white",
      timelineEduDot: "bg-blue-600 border-blue-400 text-white",
      expBadge: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
      eduBadge: "bg-blue-500/10 text-blue-300 border-blue-500/20",
      typeBadgeExp: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
      typeBadgeEdu: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
      ownerPanel: "bg-white/[0.02]",
      ownerPanelBorder: "border-white/[0.08]",
      ownerPanelAccent: "text-cyan-400",
      ownerBtn: "bg-zinc-900 hover:bg-zinc-800 text-white border-white/[0.08]",
      ownerUploadBtn: "bg-cyan-600 hover:bg-cyan-500 text-white",
      ownerUploadPanel: "bg-cyan-950/20 border-cyan-800/30",
      coverPlaceholder: "from-cyan-950 to-slate-950",
      techBadge: "bg-white/[0.03] border border-white/[0.08] text-zinc-300",
      photosBadge: "bg-zinc-950/80 border-white/[0.08] text-white",
      footerLabel: "text-zinc-500",
      socialBtn: "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.08] text-white",
      footerSeparator: "border-white/[0.06]",
    },
    creative: {
      bg: "bg-orange-50/50 text-slate-800",
      accent: "text-rose-500",
      accentBg: "bg-rose-500/10 text-rose-600 border-rose-500/20",
      card: "bg-white border border-orange-100 shadow-xl shadow-orange-100/40 hover:-translate-y-1 hover:shadow-rose-100/30 transition-all",
      navBg: "bg-white/80 border-b border-orange-100",
      textMuted: "text-slate-500",
      button: "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200",
      border: "border-orange-100",
      font: "font-sans",
      gradientText: "bg-linear-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent",
      titleText: "text-slate-800",
      modalBg: "bg-white",
      modalBorder: "border-orange-200",
      modalFooterBg: "bg-orange-50",
      modalCloseBtn: "bg-orange-100 hover:bg-orange-200 text-slate-600",
      modalLinkBtn: "bg-rose-500 hover:bg-rose-600 text-white",
      galleryBg: "bg-orange-50",
      timelineCard: "bg-white border border-orange-100 text-slate-800",
      timelineLine: "from-rose-400 via-orange-400 to-transparent",
      timelineExpDot: "bg-rose-500 border-rose-300 text-white",
      timelineEduDot: "bg-orange-500 border-orange-300 text-white",
      expBadge: "bg-rose-500/10 text-rose-600 border-rose-500/20",
      eduBadge: "bg-orange-500/10 text-orange-600 border-orange-500/20",
      typeBadgeExp: "bg-rose-500/10 text-rose-500 border border-rose-500/20",
      typeBadgeEdu: "bg-orange-500/10 text-orange-500 border border-orange-500/20",
      ownerPanel: "bg-rose-50",
      ownerPanelBorder: "border-rose-200",
      ownerPanelAccent: "text-rose-500",
      ownerBtn: "bg-white hover:bg-rose-50 text-slate-700 border-rose-200",
      ownerUploadBtn: "bg-rose-500 hover:bg-rose-600 text-white",
      ownerUploadPanel: "bg-rose-50 border-rose-200",
      coverPlaceholder: "from-rose-100 to-orange-100",
      techBadge: "bg-orange-50 border border-orange-200 text-slate-600",
      photosBadge: "bg-white/90 border-orange-200 text-slate-700",
      footerLabel: "text-slate-400",
      socialBtn: "border-orange-200 hover:bg-orange-50 text-slate-600",
      footerSeparator: "border-orange-200",
    },
    minimalist: {
      bg: "bg-white text-stone-900",
      accent: "text-stone-900 underline underline-offset-4 decoration-stone-400",
      accentBg: "bg-stone-100 text-stone-800 border-stone-200",
      card: "bg-white border border-stone-200/80 rounded-none shadow-none hover:bg-stone-50 transition-colors",
      navBg: "bg-white/95 border-b border-stone-200",
      textMuted: "text-stone-500",
      button: "bg-stone-900 hover:bg-stone-800 text-white rounded-none",
      border: "border-stone-200",
      font: "font-serif",
      gradientText: "text-stone-900 font-extrabold",
      titleText: "text-stone-900",
      modalBg: "bg-white",
      modalBorder: "border-stone-200",
      modalFooterBg: "bg-stone-50",
      modalCloseBtn: "bg-stone-100 hover:bg-stone-200 text-stone-600",
      modalLinkBtn: "bg-stone-900 hover:bg-stone-800 text-white",
      galleryBg: "bg-stone-100",
      timelineCard: "bg-white border border-stone-200 text-stone-900",
      timelineLine: "from-stone-400 via-stone-300 to-transparent",
      timelineExpDot: "bg-stone-800 border-stone-500 text-white",
      timelineEduDot: "bg-stone-600 border-stone-400 text-white",
      expBadge: "bg-stone-100 text-stone-800 border-stone-300",
      eduBadge: "bg-stone-100 text-stone-700 border-stone-300",
      typeBadgeExp: "bg-stone-100 text-stone-700 border border-stone-300",
      typeBadgeEdu: "bg-stone-100 text-stone-600 border border-stone-300",
      ownerPanel: "bg-stone-100",
      ownerPanelBorder: "border-stone-300",
      ownerPanelAccent: "text-stone-700",
      ownerBtn: "bg-white hover:bg-stone-50 text-stone-800 border-stone-300",
      ownerUploadBtn: "bg-stone-900 hover:bg-stone-800 text-white",
      ownerUploadPanel: "bg-stone-100 border-stone-300",
      coverPlaceholder: "from-stone-50 to-stone-200",
      techBadge: "bg-stone-50 border border-stone-200 text-stone-600",
      photosBadge: "bg-white/90 border-stone-200 text-stone-700",
      footerLabel: "text-stone-400",
      socialBtn: "border-stone-300 hover:bg-stone-50 text-stone-800",
      footerSeparator: "border-stone-200",
    }
  };
  const themeClasses = themeConfig[theme] || themeConfig.modern;

  const renderSectionHeader = (title, icon) => {
    const Icon = icon;
    return (
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2.5 rounded-xl ${theme === 'minimalist' ? 'border border-stone-300' : 'bg-white/5 border border-white/10'} ${themeClasses.accent}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h2 className={`text-2xl font-black uppercase tracking-wider ${theme === 'minimalist' ? 'font-serif text-stone-900' : ''}`}>
          {title}
        </h2>
      </div>
    );
  };

  // Handler for owner uploading project images directly
  const handleUploadProjectImages = async (e, projectIndex) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = files.map(file => {
        return new Promise((resolve, reject) => {
          if (file.size > 2 * 1024 * 1024) {
            reject(new Error(`${file.name} is too large (max 2MB)`));
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const newBase64Images = await Promise.all(uploadPromises);

      // Update local projects array
      const updatedProjects = [...projects];
      const project = updatedProjects[projectIndex];
      project.images = [...(project.images || []), ...newBase64Images];

      const updatedPortfolio = {
        ...localPortfolio,
        projects: updatedProjects
      };

      const res = await savePortfolio(updatedPortfolio);
      if (res.success) {
        setLocalPortfolio(updatedPortfolio);
        // Sync active modal project
        setActiveProject({
          ...project,
          index: projectIndex
        });
        toast.success("Project images uploaded and saved successfully!");
      }
    } catch (err) {
      toast.error(err.message || "Failed to upload project images.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handler for owner uploading About Me image directly
  const handleUploadAboutMeImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB.");
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Img = reader.result;
        const updatedVisibility = {
          ...sectionVisibility,
          aboutMeImage: base64Img
        };

        const updatedPortfolio = {
          ...localPortfolio,
          sectionVisibility: updatedVisibility
        };

        const res = await savePortfolio(updatedPortfolio);
        if (res.success) {
          setLocalPortfolio(updatedPortfolio);
          toast.success("About Me image updated successfully!");
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      toast.error("Failed to update About Me image.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handler for changing About image position directly
  const toggleAboutImageSide = async () => {
    const newSide = aboutMeImageSide === "left" ? "right" : "left";
    try {
      const updatedVisibility = {
        ...sectionVisibility,
        aboutMeImageSide: newSide
      };

      const updatedPortfolio = {
        ...localPortfolio,
        sectionVisibility: updatedVisibility
      };

      const res = await savePortfolio(updatedPortfolio);
      if (res.success) {
        setLocalPortfolio(updatedPortfolio);
        toast.success(`About image moved to the ${newSide}!`);
      }
    } catch (err) {
      toast.error("Failed to update About image side.");
    }
  };

  const downloadResumeUrl = resumeUrl || (hasCareerlyResume ? `/api/portfolio/download-resume?username=${username}` : null);

  return (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.font} pb-24 transition-colors duration-300`}>
      {/* Owner Control Dashboard Bar */}
      {isOwner && (
        <div className="bg-violet-950 text-white py-3 px-6 sticky top-0 z-50 flex items-center justify-between border-b border-violet-800 shadow-md">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            <span className="text-sm font-black tracking-wider uppercase">Owner Mode Preview</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/portfolio">
              <button className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 px-4 py-1.5 text-xs font-black uppercase rounded-lg transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Editor
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Floating Top Navbar */}
      <nav className={`sticky ${isOwner ? 'top-11.25' : 'top-0'} z-40 backdrop-blur-md ${themeClasses.navBg} transition-all`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xs uppercase tracking-[0.25em] font-black text-slate-400 group-hover:text-slate-100 transition-colors">
              ← Careerly
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-xs uppercase tracking-widest font-black">
            <a href="#home" className={`hover:${themeClasses.accent} transition-colors`}>Home</a>
            {isVisible("aboutMe") && <a href="#about" className={`hover:${themeClasses.accent} transition-colors`}>About</a>}
            {isVisible("projects") && projects.length > 0 && <a href="#projects" className={`hover:${themeClasses.accent} transition-colors`}>Projects</a>}
            {timelineItems.length > 0 && <a href="#timeline" className={`hover:${themeClasses.accent} transition-colors`}>Journey</a>}
          </div>

          {downloadResumeUrl && (
            <a
              id="portfolio-resume-download"
              href={downloadResumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-black uppercase tracking-widest transition-all rounded-xl ${themeClasses.button}`}
            >
              <Download className="w-3.5 h-3.5" />
              Resume
            </a>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header id="home" className="max-w-6xl mx-auto px-6 pt-16 md:pt-28 pb-16 border-b border-white/5 scroll-mt-20">
        <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16">
          <div className="text-center md:text-left flex-1 space-y-6">
            <div className="space-y-2">
              <span className={`text-xs font-black uppercase tracking-[0.3em] ${themeClasses.accent}`}>
                Hello, I'm
              </span>
              <h1 className={`text-5xl md:text-7xl font-black tracking-tight leading-none ${theme === 'minimalist' ? 'font-serif text-stone-900' : ''}`}>
                {portfolio.user?.name || "Careerly User"}
              </h1>
              <p className={`text-xl md:text-3xl font-extrabold uppercase tracking-wide pt-1 ${themeClasses.gradientText}`}>
                {field}
              </p>
            </div>

            <p className={`text-base md:text-lg leading-relaxed max-w-xl ${themeClasses.textMuted}`}>
              {heroDescription}
            </p>

            {/* Quick Contact & Details */}
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3 pt-2 text-sm">
              {contactEmail && (
                <a href={`mailto:${contactEmail}`} className={`flex items-center gap-2 ${themeClasses.textMuted} hover:${themeClasses.accent} transition-colors`}>
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>{contactEmail}</span>
                </a>
              )}
              {contactPhone && (
                <a href={`tel:${contactPhone}`} className={`flex items-center gap-2 ${themeClasses.textMuted} hover:${themeClasses.accent} transition-colors`}>
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>{contactPhone}</span>
                </a>
              )}
              {location && (
                <div className={`flex items-center gap-2 ${themeClasses.textMuted}`}>
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>{location}</span>
                </div>
              )}
            </div>

            <div className="flex justify-center md:justify-start items-center gap-4 pt-4">
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-xl transition-all hover:scale-110 border ${themeClasses.socialBtn}`}
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-xl transition-all hover:scale-110 border ${themeClasses.socialBtn}`}
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-xl transition-all hover:scale-110 border ${themeClasses.socialBtn}`}
                  aria-label="Website"
                >
                  <Globe className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Profile Image container */}
          <div className="relative shrink-0 w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl group">
            <img
              src={userImageUrl}
              alt={portfolio.user?.name || "Profile"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-6xl mx-auto px-6 mt-16 space-y-16">

        {/* About Section */}
        {isVisible("aboutMe") && aboutMe && (
          <section id="about" className={`p-6 md:p-10 rounded-3xl ${themeClasses.card} scroll-mt-20`}>
            {renderSectionHeader("About Me", Award)}

            <div className={`grid grid-cols-1 ${aboutMeImage ? 'lg:grid-cols-12' : 'grid-cols-1'} gap-8 items-center`}>

              {/* If Left Aligned Image */}
              {aboutMeImage && aboutMeImageSide === "left" && (
                <div className="lg:col-span-5 relative group">
                  <div className={`aspect-square rounded-2xl overflow-hidden border ${themeClasses.modalBorder} shadow-xl relative`}>
                    <img src={aboutMeImage} className="w-full h-full object-cover" alt="About Me" />
                    {isOwner && (
                      <button
                        onClick={toggleAboutImageSide}
                        className={`absolute bottom-2 right-2 text-xs font-black px-3 py-1.5 rounded-lg border backdrop-blur-xs flex items-center gap-1.5 ${themeClasses.ownerBtn}`}
                      >
                        <ChevronRight className="w-3.5 h-3.5" /> Move Right
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className={aboutMeImage ? 'lg:col-span-7 space-y-6' : 'space-y-6'}>
                <p className={`text-base md:text-lg leading-relaxed whitespace-pre-line ${themeClasses.textMuted}`}>
                  {aboutMe}
                </p>

                {/* Owner upload options inside public preview */}
                {isOwner && (
                  <div className={`p-4 ${themeClasses.ownerPanel} rounded-2xl border ${themeClasses.ownerPanelBorder} flex flex-col sm:flex-row gap-4 items-center justify-between text-xs`}>
                    <div className="flex items-center gap-2">
                      <Camera className={`w-4 h-4 ${themeClasses.ownerPanelAccent}`} />
                      <span className={`font-bold ${themeClasses.textMuted}`}>Customize About Section Image:</span>
                    </div>
                    <div className="flex gap-2">
                      <label className={`${themeClasses.ownerBtn} font-bold py-1.5 px-3 rounded-lg border cursor-pointer transition-colors flex items-center gap-1`}>
                        <Upload className="w-3.5 h-3.5" /> {aboutMeImage ? 'Replace Image' : 'Upload Image'}
                        <input type="file" accept="image/*" className="hidden" onChange={handleUploadAboutMeImage} disabled={isUploading} />
                      </label>
                      {aboutMeImage && (
                        <button
                          onClick={toggleAboutImageSide}
                          className={`${themeClasses.ownerBtn} font-bold py-1.5 px-3 rounded-lg border transition-colors`}
                        >
                          Show on {aboutMeImageSide === "left" ? "Right" : "Left"}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Skills list inside About Section */}
                {isVisible("skills") && skills.length > 0 && (
                  <div className="pt-4 space-y-3">
                    <h3 className={`text-sm font-black uppercase tracking-wider ${themeClasses.textMuted}`}>Key Competencies</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border uppercase tracking-wider ${themeClasses.accentBg}`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* If Right Aligned Image */}
              {aboutMeImage && aboutMeImageSide === "right" && (
                <div className="lg:col-span-5 relative group">
                  <div className={`aspect-square rounded-2xl overflow-hidden border ${themeClasses.modalBorder} shadow-xl relative`}>
                    <img src={aboutMeImage} className="w-full h-full object-cover" alt="About Me" />
                    {isOwner && (
                      <button
                        onClick={toggleAboutImageSide}
                        className={`absolute bottom-2 left-2 text-xs font-black px-3 py-1.5 rounded-lg border backdrop-blur-xs flex items-center gap-1.5 ${themeClasses.ownerBtn}`}
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> Move Left
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>
          </section>
        )}

        {/* Projects Section - SLIDER CAROUSEL TEMPLATE */}
        {isVisible("projects") && projects.length > 0 && (
          <section id="projects" className="scroll-mt-20 space-y-6">
            <div className="flex items-center justify-between">
              {renderSectionHeader("Featured Projects", FolderGit2)}
              <div className="flex gap-2">
                <button
                  onClick={() => scrollSlider("left")}
                  className={`p-2 rounded-lg border hover:scale-105 transition-all ${theme === 'minimalist' ? 'border-stone-300 hover:bg-stone-50 text-stone-800' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'}`}
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollSlider("right")}
                  className={`p-2 rounded-lg border hover:scale-105 transition-all ${theme === 'minimalist' ? 'border-stone-300 hover:bg-stone-50 text-stone-800' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'}`}
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slider track container */}
            <div
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto snap-x scrollbar-hide py-2 px-1 pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {projects.map((proj, idx) => {
                const hasImages = proj.images && proj.images.length > 0;
                const coverImage = hasImages ? proj.images[0] : null;

                return (
                  <div
                    key={idx}
                    onClick={() => setActiveProject({ ...proj, index: idx })}
                    className={`w-72.5 md:w-87.5 shrink-0 snap-start p-5 rounded-2xl border flex flex-col justify-between cursor-pointer ${themeClasses.card}`}
                  >
                    <div className="space-y-4">
                      {/* Project cover preview */}
                      <div className={`h-40 w-full rounded-xl overflow-hidden ${themeClasses.galleryBg} border ${themeClasses.modalBorder} relative flex items-center justify-center`}>
                        {coverImage ? (
                          <img src={coverImage} className="w-full h-full object-cover" alt={proj.title} />
                        ) : (
                          <div className={`w-full h-full bg-linear-to-br ${themeClasses.coverPlaceholder} flex items-center justify-center`}>
                            <FolderGit2 className={`w-10 h-10 ${themeClasses.accent}`} />
                          </div>
                        )}
                        {hasImages && (
                          <span className={`absolute bottom-2 right-2 text-[10px] font-black uppercase px-2 py-0.5 rounded border ${themeClasses.photosBadge}`}>
                            {proj.images.length} Photos
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <h3 className="text-md font-black uppercase tracking-tight line-clamp-1">
                            {proj.title}
                          </h3>
                          <ChevronRight className={`w-4 h-4 ${themeClasses.accent}`} />
                        </div>
                        <p className={`text-xs leading-relaxed line-clamp-3 ${themeClasses.textMuted}`}>
                          {proj.description}
                        </p>
                      </div>
                    </div>

                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className={`flex flex-wrap gap-1.5 pt-4 mt-4 border-t ${themeClasses.footerSeparator}`}>
                        {proj.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider ${themeClasses.techBadge}`}
                          >
                            {tech}
                          </span>
                        ))}
                        {proj.technologies.length > 3 && (
                          <span className={`text-[9px] font-bold self-center ${themeClasses.textMuted}`}>
                            +{proj.technologies.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Standard sidebar / grid layout components */}
        {layout === "sidebar" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <aside className="lg:col-span-4 space-y-8">
              {isVisible("certifications") && certifications.length > 0 && (
                <div className={`p-6 rounded-3xl ${themeClasses.card}`}>
                  {renderSectionHeader("Certifications", Award)}
                  <div className="space-y-4">
                    {certifications.map((cert, idx) => (
                      <div key={idx} className="flex justify-between items-center gap-3">
                        <div>
                          <h4 className="text-xs font-bold text-slate-200 line-clamp-1">{cert.name}</h4>
                          <p className={`text-[10px] ${themeClasses.textMuted}`}>{cert.issuer}</p>
                        </div>
                        {cert.link && (
                          <a href={cert.link} target="_blank" rel="noopener noreferrer" className={`text-xs ${themeClasses.accent} hover:underline`}>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>
            <div className="lg:col-span-8 space-y-8">
              {timelineItems.length > 0 && (
                <section id="timeline" className="scroll-mt-20 space-y-6">
                  {renderSectionHeader("Journey & Timeline", Briefcase)}
                  <div className="relative wrap overflow-hidden p-2 md:p-6 h-full">
                    {/* Vertical timeline line */}
                    <div className="absolute h-full w-0.5 left-6 md:left-1/2 transform md:-translate-x-1/2 bg-linear-to-b from-violet-500 via-indigo-500 to-transparent" />

                    <div className="space-y-8 md:space-y-0">
                      {timelineItems.map((item, idx) => {
                        const isExperience = item.type === "experience";
                        const isEven = idx % 2 === 0;

                        return (
                          <div key={idx} className={`flex flex-col md:flex-row items-start md:items-center justify-between w-full relative md:pb-12 ${isEven ? "md:flex-row-reverse" : ""}`}>
                            {/* Center Icon */}
                            <div className="absolute left-3.5 md:left-1/2 transform -translate-x-1/2 z-10 flex items-center justify-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-md transition-transform hover:scale-110 duration-300 ${
                                isExperience ? "bg-violet-600 border-violet-400 text-white" : "bg-indigo-600 border-indigo-400 text-white"
                              }`}>
                                {isExperience ? <Briefcase className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
                              </div>
                            </div>

                            {/* Card container */}
                            <div className="w-full md:w-[45%] pl-12 md:pl-0">
                              <div className={`p-6 rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${themeClasses.timelineCard}`}>
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                                    isExperience ? themeClasses.expBadge : themeClasses.eduBadge
                                  }`}>
                                    {item.date}
                                  </span>
                                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                                    isExperience ? themeClasses.typeBadgeExp : themeClasses.typeBadgeEdu
                                  }`}>
                                    {isExperience ? "Experience" : "Education"}
                                  </span>
                                </div>
                                <h3 className={`text-md font-black uppercase tracking-tight ${themeClasses.titleText}`}>{item.title}</h3>
                                <h4 className={`text-xs font-bold mb-3 ${themeClasses.accent}`}>{item.subtitle}</h4>
                                {item.description && (
                                  <p className={`text-xs leading-relaxed whitespace-pre-line ${themeClasses.textMuted}`}>{item.description}</p>
                                )}
                              </div>
                            </div>

                            {/* Spacer block */}
                            <div className="hidden md:block w-[45%]" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {timelineItems.length > 0 && (
              <section id="timeline" className="scroll-mt-20 space-y-6">
                {renderSectionHeader("Journey & Timeline", Briefcase)}
                <div className="relative wrap overflow-hidden p-2 md:p-6 h-full">
                  {/* Vertical timeline line */}
                  <div className="absolute h-full w-0.5 left-6 md:left-1/2 transform md:-translate-x-1/2 bg-linear-to-b from-violet-500 via-indigo-500 to-transparent" />

                  <div className="space-y-8 md:space-y-0">
                    {timelineItems.map((item, idx) => {
                      const isExperience = item.type === "experience";
                      const isEven = idx % 2 === 0;

                      return (
                        <div key={idx} className={`flex flex-col md:flex-row items-start md:items-center justify-between w-full relative md:pb-12 ${isEven ? "md:flex-row-reverse" : ""}`}>
                          {/* Center Icon */}
                          <div className="absolute left-3.5 md:left-1/2 transform -translate-x-1/2 z-10 flex items-center justify-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-md transition-transform hover:scale-110 duration-300 ${
                              isExperience ? "bg-violet-600 border-violet-400 text-white" : "bg-indigo-600 border-indigo-400 text-white"
                            }`}>
                              {isExperience ? <Briefcase className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
                            </div>
                          </div>

                          {/* Card container */}
                          <div className="w-full md:w-[45%] pl-12 md:pl-0">
                            <div className={`p-6 rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${themeClasses.timelineCard}`}>
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                                  isExperience ? themeClasses.expBadge : themeClasses.eduBadge
                                }`}>
                                  {item.date}
                                &rbrace;</span>
                                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                                  isExperience ? themeClasses.typeBadgeExp : themeClasses.typeBadgeEdu
                                }`}>
                                  {isExperience ? "Experience" : "Education"}
                                </span>
                              </div>
                              <h3 className={`text-md font-black uppercase tracking-tight ${themeClasses.titleText}`}>{item.title}</h3>
                              <h4 className={`text-xs font-bold mb-3 ${themeClasses.accent}`}>{item.subtitle}</h4>
                              {item.description && (
                                <p className={`text-xs leading-relaxed whitespace-pre-line ${themeClasses.textMuted}`}>{item.description}</p>
                              )}
                            </div>
                          </div>

                          {/* Spacer block */}
                          <div className="hidden md:block w-[45%]" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {isVisible("certifications") && certifications.length > 0 && (
              <section id="certifications" className={`p-6 md:p-8 rounded-3xl ${themeClasses.card}`}>
                {renderSectionHeader("Certifications", Award)}
                <div className="space-y-4">
                  {certifications.map((cert, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${theme === 'minimalist' ? 'border-stone-200' : 'border-white/5 bg-white/5/20'}`}
                    >
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-tight">{cert.name}</h3>
                        <p className={`text-xs ${themeClasses.textMuted}`}>
                          {cert.issuer} {cert.date ? `| ${cert.date}` : ""}
                        </p>
                      </div>
                      {cert.link && (
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-2 bg-white/5 rounded-lg border border-white/10 hover:${themeClasses.accent} transition-colors`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Achievements Section */}
        {isVisible("achievements") && achievements.length > 0 && (
          <section className={`p-6 md:p-8 rounded-3xl ${themeClasses.card}`}>
            {renderSectionHeader("Achievements", BadgeAlert)}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((ach, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className={`p-1.5 rounded-lg mt-0.5 ${themeClasses.accentBg}`}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-md font-bold uppercase tracking-tight">{ach.title}</h3>
                    <p className={`text-sm leading-relaxed ${themeClasses.textMuted}`}>
                      {ach.description}
                    </p>
                    {ach.date && (
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1 block">
                        {ach.date}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Custom Sections */}
        {customSections && customSections.map((sec, idx) => {
          const visibleKey = `custom_${idx}`;
          if (isVisible(visibleKey) === false || !sec.title || !sec.content) return null;
          return (
            <section key={idx} className={`p-6 md:p-8 rounded-3xl ${themeClasses.card}`}>
              {renderSectionHeader(sec.title, Award)}
              <p className={`text-base leading-relaxed whitespace-pre-line ${themeClasses.textMuted}`}>
                {sec.content}
              </p>
            </section>
          );
        })}

      </main>

      {/* Premium Footer Section */}
      <footer className={`mt-32 border-t ${themeClasses.border} pt-16 pb-12`}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Info */}
          <div className="text-center sm:text-left space-y-1">
            <h3 className={`text-base font-black uppercase tracking-wider ${themeClasses.gradientText}`}>
              {portfolio.user?.name || "Careerly User"}
            </h3>
            <p className={`text-xs font-semibold tracking-wider uppercase ${themeClasses.accent}`}>
              {field}
            </p>
          </div>

          {/* Social & Contact */}
          <div className="flex flex-col items-center sm:items-end gap-3">
            <div className="flex gap-2.5">
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${themeClasses.socialBtn}`}
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${themeClasses.socialBtn}`}
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${themeClasses.socialBtn}`}
                  aria-label="Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
            {contactEmail && (
              <a 
                href={`mailto:${contactEmail}`} 
                className={`text-xs ${themeClasses.textMuted} hover:${themeClasses.accent} transition-colors`}
              >
                {contactEmail}
              </a>
            )}
          </div>
        </div>

        {/* Separator and copyright info */}
        <div className="max-w-6xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-center">
          <p className={themeClasses.textMuted}>
            © {new Date().getFullYear()} {portfolio.user?.name || "Careerly User"}. Powered by <Link href="/" className="font-bold hover:underline">Careerly</Link>.
          </p>
          <a href="#" className={`font-bold hover:underline ${themeClasses.accent}`}>
            Back to Top
          </a>
        </div>
      </footer>

      {/* Project Detail Dialog Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className={`${themeClasses.modalBg} border ${themeClasses.modalBorder} rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative flex flex-col animate-slide-up`}>

            {/* Modal Header */}
            <div className={`p-6 border-b ${themeClasses.modalBorder} flex justify-between items-start gap-4`}>
              <div>
                <h3 className={`text-xl md:text-2xl font-black ${themeClasses.titleText} uppercase tracking-tight`}>
                  {activeProject.title}
                </h3>
                {activeProject.technologies && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {activeProject.technologies.map(tech => (
                      <span key={tech} className={`px-2 py-0.5 text-[10px] font-bold rounded ${themeClasses.techBadge}`}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => setActiveProject(null)}
                className={`p-1 rounded-lg transition-colors ${themeClasses.modalCloseBtn}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 max-h-[60vh]">

              {/* Project gallery slider */}
              {activeProject.images && activeProject.images.length > 0 && (
                <div className="space-y-2">
                  <h4 className={`text-xs font-black uppercase ${themeClasses.footerLabel} tracking-wider`}>Project Gallery</h4>
                  <div className="flex gap-4 overflow-x-auto pb-2 snap-x scrollbar-hide">
                    {activeProject.images.map((img, i) => (
                      <div key={i} className={`w-75 md:w-100 aspect-video shrink-0 snap-start rounded-xl overflow-hidden border ${themeClasses.modalBorder} ${themeClasses.galleryBg} shadow-md`}>
                        <img src={img} className="w-full h-full object-contain" alt={`${activeProject.title} screenshot ${i + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project description detail */}
              <div className="space-y-2">
                <h4 className={`text-xs font-black uppercase ${themeClasses.footerLabel} tracking-wider`}>Description & Outcome</h4>
                <p className={`${themeClasses.textMuted} text-sm leading-relaxed whitespace-pre-line`}>
                  {activeProject.description}
                </p>
              </div>

              {/* Owner upload options inside modal */}
              {isOwner && (
                <div className={`p-5 ${themeClasses.ownerUploadPanel} border rounded-2xl space-y-3 text-xs`}>
                  <div className="flex items-center gap-2">
                    <Upload className={`w-4 h-4 ${themeClasses.ownerPanelAccent}`} />
                    <span className={`font-bold ${themeClasses.titleText} uppercase tracking-wider`}>Manage Project Screenshots (Owner-only)</span>
                  </div>
                  <p className={themeClasses.textMuted}>
                    Add high-quality screenshots (PNG, JPG) to showcase this project to potential employers. Max 2MB per file.
                  </p>
                  <div className="flex items-center gap-2">
                    <label className={`${themeClasses.ownerUploadBtn} font-bold py-1.5 px-4 rounded-lg cursor-pointer transition-colors inline-flex items-center gap-1.5 shadow-sm`}>
                      <Upload className="w-3.5 h-3.5" /> {isUploading ? 'Uploading...' : 'Upload Screenshots'}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleUploadProjectImages(e, activeProject.index)}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className={`p-6 border-t ${themeClasses.modalBorder} ${themeClasses.modalFooterBg} flex justify-end gap-3`}>
              {activeProject.link && (
                <a
                  href={activeProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-5 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-colors shadow-lg ${themeClasses.modalLinkBtn}`}
                >
                  <Globe className="w-4 h-4" /> Live Demo / Repository <ExternalLink className="w-3 h-3" />
                </a>
              )}
              <button
                onClick={() => setActiveProject(null)}
                className={`px-5 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-colors ${themeClasses.modalCloseBtn}`}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
