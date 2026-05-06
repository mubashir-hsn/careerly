"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar, Eye, LetterText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteCoverLetter } from "@/actions/cover-letter";

export default function CoverLetterList({ coverLetters }) {
  const router = useRouter();

  const handleDelete = async (id) => {
    try {
      await deleteCoverLetter(id);
      toast.success("Cover letter deleted successfully!");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to delete cover letter");
    }
  };

  if (!coverLetters?.length) {
    return (
      <Card className={'bg-white text-slate-600'}>
        <CardHeader>
          <CardTitle>No Cover Letters Yet</CardTitle>
          <CardDescription className={'font-medium'}>
            Create your first cover letter to get started
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coverLetters.map((letter) => (
                <Card 
                    key={letter.id} 
                    className="group relative w-full h-fit border-none shadow-lg hover:shadow-2xl transition-all duration-300 rounded-[2rem] overflow-hidden bg-white"
                >
                    <CardHeader className="p-6 pb-4">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-indigo-50 p-3 rounded-2xl group-hover:bg-indigo-100 transition-colors">
                                    <LetterText className="w-8 h-8 text-indigo-600" />
                                </div>
                                <div className="space-y-0.5">
                                    <h3 className="text-xl font-black text-slate-900 capitalize leading-tight group-hover:text-primary transition-colors">
                                        {letter.jobTitle}
                                    </h3>
                                    <p className="text-sm font-bold text-indigo-500">
                                        at <span className="capitalize">{letter.companyName}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                {format(new Date(letter.createdAt), "MMM dd, yyyy")}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6 pt-0 space-y-6">
                        <div className="relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-100/50 p-4 transition-colors group-hover:bg-blue-50/30 group-hover:border-blue-100">
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-200 group-hover:bg-indigo-400 transition-colors" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Key Requirements</p>
                            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed font-medium">
                                {letter.jobDescription}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={() => router.push(`/ai-cover-letter/${letter.id}`)}
                                className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-md hover:shadow-xl transition-all gap-2"
                            >
                                <Eye className="h-4 w-4" /> View Details
                            </Button>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button 
                                        variant="outline" 
                                        size="icon" 
                                        className="h-11 w-11 rounded-xl border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="rounded-[2rem]">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-xl font-black">Delete Cover Letter?</AlertDialogTitle>
                                        <AlertDialogDescription className="font-medium text-slate-500">
                                            This action cannot be undone. This will permanently
                                            delete your cover letter for <strong>{letter.jobTitle}</strong> at <strong>{letter.companyName}</strong>.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => handleDelete(letter.id)}
                                            className="bg-destructive text-white hover:bg-destructive/90 rounded-xl font-bold"
                                        >
                                            Delete Permanently
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>

  );
}