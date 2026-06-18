import { getUserFeedbacks } from "@/actions/feedback";
import SupportForm from "./_components/SupportForm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { MessageSquare, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { checkAuth } from "@/services/authCheck";

export const metadata = {
  title: "Support & Feedback - Careerly",
  description: "Get help or provide feedback to improve Careerly.",
};

export default async function SupportPage() {
  const user = await checkAuth();
  if (!user) redirect("/sign-in");
  const feedbacks = await getUserFeedbacks();

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-amber-500" />;
      case "in_progress":
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case "resolved":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="text-amber-600 bg-amber-50 border-amber-200"
          >
            Pending
          </Badge>
        );
      case "in_progress":
        return (
          <Badge
            variant="outline"
            className="text-blue-600 bg-blue-50 border-blue-200"
          >
            In Progress
          </Badge>
        );
      case "resolved":
        return (
          <Badge
            variant="outline"
            className="text-emerald-600 bg-emerald-50 border-emerald-200"
          >
            Resolved
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-12">
      <div className="text-center md:text-left space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
          Support & <span className="text-primary italic">Feedback</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl font-medium leading-relaxed opacity-80">
          Need help or want to suggest an improvement? We&apos;re here to listen
          and help you succeed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Form Section */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <SupportForm />
        </div>

        {/* History Section */}
        <div className="lg:col-span-3 order-1 lg:order-2 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-indigo-600" />
              Past Requests
            </h2>
            <Badge className="bg-slate-100 text-slate-500 shadow-none border-0 font-black">
              {feedbacks.length} Total
            </Badge>
          </div>

          <div className="space-y-4 max-h-150 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
            {feedbacks.length > 0 ? (
              feedbacks.map((item) => (
                <Card
                  key={item.id}
                  className="border-0 shadow-lg bg-white overflow-hidden hover:shadow-xl transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        {getStatusBadge(item.status)}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {format(new Date(item.createdAt), "MMM dd, yyyy")}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-2">
                      {item.subject}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
                      &quot;{item.message}&quot;
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                  No support requests yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
