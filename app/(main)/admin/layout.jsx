import { checkAdmin } from "@/actions/admin";
import { redirect } from "next/navigation";
import AdminSidebar from "./_components/AdminSidebar";

export default async function AdminLayout({ children }) {
  try {
    await checkAdmin();
  } catch (error) {
    // If not an admin, redirect to dashboard or home
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
