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
} from "@/components/ui/dialog"

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
    const industry = user.industry.split('-')[0];
    let subIndustry = user.industry.replace('-', ' ').split(' ')[1];
    subIndustry = subIndustry.replaceAll('-', ' ');

    const industryName = industries.find((ind) => ind.id.toLowerCase() === industry.toLowerCase())?.name

    if (!user) {
        return (
            <div className="min-h-screen flex justify-center p-6">
                <Card className="w-full max-w-4xl p-8 space-y-6">
                    <div className="flex items-center gap-6">
                        <Skeleton className="h-28 w-28 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                    </div>
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-40 w-full" />
                </Card>
            </div>
        );
    }



    return (
        <div className="min-h-screen w-full bg-slate-100 p-6 space-y-4">

            <Card className={'max-w-4xl mx-auto bg-white shadow-none border-0'}>
                <CardHeader>
                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <Avatar className="h-28 w-28 ring-4 ring-background shadow">
                            <AvatarImage src={user.imageUrl} />
                            <AvatarFallback>
                                <User className="h-10 w-10" />
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-semibold text-slate-800">{user.name}</h1>
                            <div className="flex items-center justify-center text-slate-400 md:justify-start gap-2 text-sm mt-1">
                                <Mail className="h-4 w-4" />
                                <span>{user.email}</span>
                            </div>
                            <p className="mt-4 text-sm max-w-xl text-slate-700">
                                {user.bio || "No bio added yet"}
                            </p>
                        </div>

                        <Button onClick={() => setIsEditing(!isEditing)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Profile
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            {/* Update Profile Dialog */}
            <Dialog open={!!isEditing} onOpenChange={() => setIsEditing(false)} >
                <DialogContent className="max-w-5xl h-[90vh] bg-slate-100 overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            <h1 className="font-semibold">Update Profile</h1>
                        </DialogTitle>
                    </DialogHeader>
                    <UpdateProfileForm user={user} setIsEditing={setIsEditing} industry={industry} subIndustry={subIndustry} />
                </DialogContent>
            </Dialog>

            <div className="w-full max-w-4xl mx-auto space-y-3 mt-2">
                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-4">
                        <h1 className="font-bold uppercase text-slate-400 px-4 tracking-widest">Account Details</h1>
                        <Card className="rounded-xl border-0 shadow-none bg-white">
                            <CardContent className="px-5 pt-2 space-y-3">
                                {/* User Industry */}
                                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center p-2">
                                        <Briefcase className="h-5 w-5 font-bold text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-slate-500 font-semibold text-sm">Industry</h2>
                                        <p className="font-medium capitalize">{industryName}</p>
                                    </div>
                                </div>
                                {/* Sub Industry */}
                                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                                    <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center p-2">
                                        <Gem className="h-5 w-5 font-bold text-purple-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-slate-500 font-semibold text-sm">Specialization</h2>
                                        <p className="font-medium capitalize">{subIndustry}</p>
                                    </div>
                                </div>
                                {/* Experience */}
                                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                                    <div className="w-12 h-12 rounded-full bg-green-100 text-green-500 flex items-center justify-center p-2">
                                        <Star className="h-5 w-5 font-bold text-green-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-slate-500 font-semibold text-sm">Experience</h2>
                                        <p className="font-medium capitalize">{user.experience} years</p>
                                    </div>
                                </div>
                                {/* Member */}
                                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                                    <div className="w-12 h-12 rounded-full bg-amber-100 text-blue-500 flex items-center justify-center p-2">
                                        <Calendar className="h-5 w-5 font-bold text-amber-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-slate-500 font-semibold text-sm">Member Since</h2>
                                        <p className="font-medium capitalize">{formatDate(user.createdAt)}</p>
                                    </div>
                                </div>
                                {/* Last Updated */}
                                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 text-blue-500 flex items-center justify-center p-2">
                                        <History className="h-5 w-5 font-bold text-slate-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-slate-500 font-semibold text-sm">Last Updated</h2>
                                        <p className="font-medium capitalize">{formatDate(user.updatedAt)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                    <div className="space-y-4">
                        <h1 className="font-bold shrink-0 uppercase text-slate-400 px-4 tracking-widest">Core Skills</h1>

                        <Card className="rounded-xl border-0 shadow-none">
                            <CardContent className="px-5 py-2 space-y-3">
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.map((skill) => (
                                        <Badge key={skill} className={`rounded-full font-medium px-4 py-2 ${getRandomColor()}`}>
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    );
}
