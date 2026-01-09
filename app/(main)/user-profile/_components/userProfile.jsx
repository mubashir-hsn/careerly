"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Briefcase, Calendar, Pencil, User } from "lucide-react";
import UpdateProfileForm from "./updateProfileForm";

const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
};


export default function UserProfilePage({ user }) {
    const [isEditing, setIsEditing] = useState(false);
    

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
        <div className="min-h-screen bg-muted p-6 flex justify-center">
            <Card className="w-full max-w-4xl rounded-2xl shadow-xl">
                <CardContent className="p-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <Avatar className="h-28 w-28 ring-4 ring-background shadow">
                            <AvatarImage src={user.imageUrl} />
                            <AvatarFallback>
                                <User className="h-10 w-10" />
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-semibold">{user.name}</h1>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground mt-1">
                                <Mail className="h-4 w-4" />
                                <span>{user.email}</span>
                            </div>
                            <p className="mt-4 text-sm max-w-xl">
                                {user.bio || "No bio added yet"}
                            </p>
                        </div>

                        <Button onClick={() => setIsEditing(!isEditing)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Profile
                        </Button>
                    </div>

                    <div className="my-8 h-px bg-border" />

                    {/* Profile Edit Form */}
                    {isEditing && (
                        <UpdateProfileForm user={user} setIsEditing={setIsEditing}/>
                    )}

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <Card className="rounded-xl">
                            <CardContent className="p-5 space-y-3">
                                <h2 className="font-medium">Professional</h2>
                                <div className="flex items-center gap-2 text-sm">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    <span>{user.industry}</span>
                                </div>
                                <div className="text-sm">Experience: {user.experience} years</div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-xl">
                            <CardContent className="p-5 space-y-3">
                                <h2 className="font-medium">Account</h2>
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>Joined: {formatDate(user.createdAt)}</span>
                                </div>
                                <div className="text-sm">Updated: {formatDate(user.updatedAt)}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Skills */}
                    <div className="mt-8">
                        <h2 className="font-medium mb-3">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {user.skills.map((skill) => (
                                <Badge key={skill} className="rounded-lg px-3 py-1">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
