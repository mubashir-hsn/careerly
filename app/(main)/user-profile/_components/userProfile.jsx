"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Briefcase, Calendar, Pencil, User, Gem, Star, History } from "lucide-react";
import UpdateProfileForm from "./updateProfileForm";
import { industries } from "@/data/industries";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
};

const colors = [
    "bg-purple-100 text-purple-500",
    "bg-amber-100 text-amber-500",
    "bg-blue-100 text-blue-500",
    "bg-green-100 text-green-500",
    "bg-orange-100 text-orange-500",
];

const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
};


export default function UserProfilePage({ user }) {
    const [isEditing, setIsEditing] = useState(false);

    if (!user) {
        return (
            <div className="min-h-screen flex justify-center p-6 bg-slate-50/50">
                <Card className="w-full max-w-4xl p-12 space-y-8 border-none shadow-2xl rounded-[2.5rem]">
                    <div className="flex items-center gap-8">
                        <Skeleton className="h-32 w-32 rounded-full" />
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-64" />
                            <Skeleton className="h-5 w-80" />
                        </div>
                    </div>
                    <Skeleton className="h-32 w-full rounded-2xl" />
                    <Skeleton className="h-64 w-full rounded-2xl" />
                </Card>
            </div>
        );
    }

    const industry = user.industry?.split('-')[0] || "";
    let subIndustry = user.industry?.replace('-', ' ').split(' ')[1] || "";
    subIndustry = subIndustry.replaceAll('-', ' ');

    const industryName = industries.find((ind) => ind.id.toLowerCase() === industry.toLowerCase())?.name || "Professional";

    return (
        <div className="min-h-screen w-full bg-slate-50/50 p-4 md:p-8 space-y-8">
            {/* Profile Header Card */}
            <Card className="max-w-4xl mx-auto border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="bg-slate-900 text-white p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full -ml-24 -mb-24 blur-2xl" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <Avatar className="h-32 w-32 ring-4 ring-white/10 shadow-2xl border-4 border-slate-800">
                                <AvatarImage src={user?.imageUrl || '/avatar.png'} />
                                <AvatarFallback className="bg-slate-800">
                                    <User className="h-12 w-12 text-slate-400" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-1 right-1 h-6 w-6 bg-green-500 border-4 border-slate-900 rounded-full" />
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-3">
                            <div className="space-y-1">
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight">{user?.name}</h1>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 font-medium">
                                    <Mail className="h-4 w-4" />
                                    <span>{user?.email}</span>
                                </div>
                            </div>

                            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl italic">
                                "{user?.bio || "Crafting a professional narrative..."}"
                            </p>
                        </div>

                        <Button
                            variant="secondary"
                            className="rounded-2xl px-6 h-12 font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
                            onClick={() => setIsEditing(true)}
                        >
                            <Pencil className="h-4 w-4 mr-2" />
                            Update Profile
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            {/* Content Sections */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <div className="md:col-span-2 space-y-8">
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 pb-2 border-b-2 border-slate-200">
                            <div className="h-6 w-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.4)]" />
                            <h3 className="text-xl font-black tracking-tight text-slate-800 uppercase">Professional INFO</h3>
                        </div>

                        <Card className="border-none shadow-xl rounded-[2rem] bg-white p-2">
                            <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:shadow-md">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                        <Briefcase className="h-6 w-6 font-bold" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Industry</p>
                                        <p className="font-bold text-slate-800 truncate">{industryName}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:shadow-md">
                                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                                        <Gem className="h-6 w-6 font-bold" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Specialization</p>
                                        <p className="font-bold text-slate-800 truncate">{subIndustry}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:shadow-md">
                                    <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                        <Star className="h-6 w-6 font-bold" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Experience</p>
                                        <p className="font-bold text-slate-800 truncate">{user?.experience || 0} Years</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:shadow-md">
                                    <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                        <Calendar className="h-6 w-6 font-bold" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Member Since</p>
                                        <p className="font-bold text-slate-800 truncate">{formatDate(user?.createdAt)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                </div>

                {/* Right Column: Skills */}
                <div className="space-y-8">
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 pb-2 border-b-2 border-slate-200">
                            <div className="h-6 w-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.4)]" />
                            <h3 className="text-xl font-black tracking-tight text-slate-800 uppercase">Skills</h3>
                        </div>

                        <Card className="border-none shadow-xl rounded-[2rem] bg-white h-full">
                            <CardContent className="p-8">
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.map((skill) => (
                                        <Badge
                                            key={skill}
                                            className={`rounded-xl font-bold px-4 py-2 border-none transition-all hover:scale-105 ${getRandomColor()}`}
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                                {user.skills.length === 0 && (
                                    <p className="text-slate-400 text-sm italic py-4">No skills listed yet.</p>
                                )}
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </div>

            {/* Update Profile Dialog */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="max-w-3xl border-none shadow-2xl rounded-[3rem] p-0 overflow-hidden bg-white">
                    <DialogHeader className="bg-slate-900 text-white p-8 pb-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                        <DialogTitle className="text-3xl font-black tracking-tight relative z-10">
                            Refine Your Profile
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-8 md:p-12 -mt-10 rounded-t-[3rem] bg-white relative z-10 overflow-y-auto max-h-[80vh]">
                        <UpdateProfileForm
                            user={user}
                            setIsEditing={setIsEditing}
                            industry={industry}
                            subIndustry={subIndustry}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
