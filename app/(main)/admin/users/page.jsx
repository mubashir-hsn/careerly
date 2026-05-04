import { getAllUsers } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "User Management - Careerly Admin",
};

export default async function AdminUsersPage({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params.page) || 1;
  const { users, total, totalPages } = await getAllUsers(page);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
        <p className="text-slate-500 font-medium mt-1">Found {total} registered accounts across the platform.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-1">
            <thead>
              <tr className="text-slate-400">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Subscriber</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Plan Tier</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-center">Tokens Used</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              {users.map((user) => {
                const sub = user.subscription;
                const plan = sub?.plan;
                return (
                  <tr key={user.id} className="hover:bg-slate-50 transition-all rounded-2xl group">
                    <td className="px-8 py-4 first:rounded-l-2xl">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarImage src={user.imageUrl} />
                          <AvatarFallback className="bg-indigo-600 text-white font-bold">{user.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-black text-slate-900 leading-none mb-1 group-hover:text-indigo-600 transition-colors">{user.name || "Anonymous"}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`font-black uppercase text-[9px] px-2 py-0.5 border-0 ${plan?.type === "PRO" ? "bg-purple-600 text-white shadow-lg shadow-purple-100" : "bg-slate-100 text-slate-500 shadow-none"}`}>
                        {plan?.name || "Free Base"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-black text-slate-700 leading-none">{sub?.tokensUsed?.toLocaleString() || 0}</span>
                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest pt-1">Consumed</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="outline" className={`font-black uppercase text-[9px] px-2 py-0.5 ${sub?.status === "ACTIVE" ? "text-emerald-600 border-emerald-100 bg-emerald-50/30" : "text-rose-600 border-rose-100 bg-rose-50/30"}`}>
                        {sub?.status || "PENDING"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right pr-8 last:rounded-r-2xl">
                      <Button asChild variant="outline" size="sm" className="h-8 rounded-lg border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 font-bold transition-all shadow-sm">
                        <Link href={`/admin/users/${user.id}`} className="flex items-center gap-1.5">
                          Audit
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Basic Pagination (Simplified) */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500 font-medium">
          Showing page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          {/* Add actual pagination buttons here if needed */}
        </div>
      </div>
    </div>
  );
}
