"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, FileSpreadsheet } from "lucide-react";
import { exportAllPayments } from "@/actions/admin";
import { format } from "date-fns";
import { toast } from "sonner";

export default function ExportCSVButton({ searchQuery = "", startDate = null, endDate = null }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const data = await exportAllPayments(searchQuery, startDate, endDate);

      if (!data || data.length === 0) {
        toast.error("No data found for the current filters");
        return;
      }

      // Prepare CSV content
      const headers = ["User Name", "User Email", "Plan/Item", "Tokens", "Amount", "Currency", "Date", "Status", "Transaction ID"];
      
      const csvRows = data.map((p) => [
        `"${(p.user?.name || "Anonymous").replace(/"/g, '""')}"`,
        `"${(p.user?.email || "N/A").replace(/"/g, '""')}"`,
        `"${(p.plan?.name || "Token Recharge").replace(/"/g, '""')}"`,
        p.tokens,
        p.amount,
        `"${(p.currency || "INR").replace(/"/g, '""')}"`,
        `"${format(new Date(p.createdAt), "yyyy-MM-dd HH:mm:ss")}"`,
        `"${(p.status || "N/A").replace(/"/g, '""')}"`,
        `"${(p.stripeSessionId || "N/A").replace(/"/g, '""')}"`
      ].join(","));

      const csvContent = [headers.join(","), ...csvRows].join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `revenue_${format(new Date(), "yyyy-MM-dd")}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`${data.length} records exported successfully`);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      className={`rounded-xl border-slate-200 h-10 px-4 font-bold text-xs uppercase tracking-widest transition-all ${isExporting ? 'bg-slate-50' : 'hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-md'}`}
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <FileSpreadsheet className="w-4 h-4 mr-2" />
      )}
      {isExporting ? "Exporting..." : "Export CSV"}
    </Button>
  );
}
