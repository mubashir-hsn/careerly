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
    <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-2">
      {coverLetters.map((letter) => (
        <Card key={letter.id} className="group relative w-full h-fit">
          <CardHeader className={'flex justify-between items-center gap-2'}>
              <div className="flex items-center gap-2">
                <div className="bg-slate-100 px-2 py-3 rounded-md">
                  <LetterText className="w-8 h-8 text-indigo-500" />
                </div>
                  <CardTitle className="text-lg gradient-subtitle flex flex-col gap-0 pt-2">
                    <p className="capitalize">{letter.jobTitle}</p> <p className="text-sm text-indigo-500">at <span className="capitalize">{letter.companyName}</span> </p>
                  </CardTitle>
              </div>
               <div className={'text-slate-500 text-xs font-medium flex items-center gap-1'}>
                  <Calendar className="w-4 h-4" /> {format(new Date(letter.createdAt), "PPP")}
               </div>
          </CardHeader>
          <CardContent className={'space-y-4'}>
            <div className=" bg-slate-100 text-slate-500 border-l-2 border-blue-500 rounded-lg p-4">
              <p className='font-bold'>Requirements:</p>
              <p className="line-clamp-2 text-sm">{letter.jobDescription} </p>
            </div>
            <div className="flex space-x-2">
                <AlertDialog>
                  <Button
                    size="icon"
                    onClick={() => router.push(`/ai-cover-letter/${letter.id}`)}
                    className={'w-1/2 bg-blue-500 text-white hover:bg-blue-400'}
                  >
                    <Eye className="h-4 w-4" /> View Letter
                  </Button>
                  <AlertDialogTrigger asChild>
                    <Button variant="default" size="icon" className={'w-1/2 bg-red-500 text-white hover:bg-red-400'}>
                      <Trash2 className="h-4 w-4" /> Delete Letter
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Cover Letter?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your cover letter for {letter.jobTitle} at{" "}
                        {letter.companyName}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(letter.id)}
                        className="bg-destructive text-white hover:bg-destructive/90"
                      >
                        Delete
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