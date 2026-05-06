import { checkAdmin } from "@/actions/admin";
import { redirect } from "next/navigation";
import AdminSidebar from "./_components/AdminSidebar";
import AdminHeader from "./_components/AdminHeader";

export default async function AdminLayout({ children }) {
  try {
    await checkAdmin();
  } catch (error) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Admin Sidebar */}
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Admin Header */}
        <AdminHeader />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
