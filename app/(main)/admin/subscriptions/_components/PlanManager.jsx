"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan } from "@/actions/admin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function PlanManager({ initialPlans }) {
  const [plans, setPlans] = useState(initialPlans);
  const [isOpen, setIsOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    type: "PRO",
    tier: "Starter",
    tokensIncluded: 1000,
    price: 0,
    features: [],
    isActive: true,
  });

  const handleOpen = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        type: plan.type,
        tier: plan.tier || "",
        tokensIncluded: plan.tokensIncluded,
        price: plan.price,
        features: plan.features || [],
        isActive: plan.isActive,
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: "",
        type: "PRO",
        tier: "Starter",
        tokensIncluded: 1000,
        price: 999,
        features: ["All AI Tools", "Market Insights", "Priority Support"],
        isActive: true,
      });
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingPlan) {
        await updateSubscriptionPlan(editingPlan.id, formData);
        toast.success("Plan updated successfully!");
      } else {
        await createSubscriptionPlan(formData);
        toast.success("New plan created!");
      }
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to save plan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this plan? This cannot be undone if no users are active.")) return;
    
    setLoading(true);
    try {
      await deleteSubscriptionPlan(id);
      toast.success("Plan deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Could not delete plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Subscription Plans</h1>
          <p className="text-slate-500 font-medium mt-1">Configure pricing, tiers, and AI credit limits.</p>
        </div>
        <Button 
          onClick={() => handleOpen()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl gap-2 font-bold h-11 px-6 shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-5 h-5" />
          Add New tier
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {initialPlans.map((plan) => (
          <Card key={plan.id} className="border-0 shadow-xl bg-white relative overflow-hidden group transition-all hover:shadow-2xl">
            <div className={`absolute top-0 left-0 w-2 h-full ${plan.type === "PRO" ? "bg-purple-600" : "bg-slate-200"}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl font-black text-slate-900 tracking-tight">{plan.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`font-black uppercase text-[9px] px-2 py-0.5 border-0 ${plan.type === "PRO" ? "bg-purple-100 text-purple-600" : "bg-slate-100 text-slate-500"}`}>
                    {plan.type}
                  </Badge>
                  {plan.tier && <span className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">{plan.tier}</span>}
                </div>
              </div>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleOpen(plan)}
                  className="rounded-xl hover:bg-indigo-50 hover:text-indigo-600 text-slate-400"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                {plan.type !== "FREE" && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(plan.id)}
                      className="rounded-xl hover:bg-rose-50 hover:text-rose-600 text-slate-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1 leading-none">Monthly Price</p>
                  <p className="text-lg font-black text-slate-900 leading-none">
                    {plan.price === 0 ? "Free" : `Rs ${plan.price.toLocaleString()}`}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1 leading-none">Credits</p>
                  <p className="text-lg font-black text-slate-900 leading-none">
                    {plan.tokensIncluded.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1 leading-none">Status</p>
                  <div className="flex items-center gap-1.5">
                     <div className={`w-2 h-2 rounded-full ${plan.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                     <p className={`text-xs font-black uppercase tracking-tighter ${plan.isActive ? "text-emerald-600" : "text-slate-400"}`}>
                        {plan.isActive ? "Active" : "Archived"}
                     </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Included Capabilities</p>
                <div className="flex flex-wrap gap-2">
                  {(plan.features || ["All AI Tools", "Market Insights", "Priority Support"]).map((f) => (
                    <Badge key={f} variant="outline" className="font-bold text-[10px] text-slate-500 border-slate-200 bg-slate-50/50 rounded-lg px-2">
                      <Check className="w-3 h-3 mr-1 text-emerald-500" />
                      {f}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl border-0 overflow-hidden outline-none">
          <form onSubmit={handleSubmit}>
            <DialogHeader className="bg-slate-900 text-white p-6 -m-6 mb-4">
              <DialogTitle className="text-2xl font-black tracking-tight leading-none">
                {editingPlan ? "Modify Plan" : "Forge New Tier"}
              </DialogTitle>
              <DialogDescription className="text-slate-400 font-medium">
                Adjust platform limits and pricing structures.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Plan Name</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Pro Starter"
                    className="rounded-xl border-slate-200 font-bold"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Plan Type</Label>
                  <Select 
                    value={formData.type}
                    onValueChange={(v) => setFormData({...formData, type: v})}
                  >
                    <SelectTrigger className="rounded-xl border-slate-200 font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100">
                      <SelectItem value="FREE">FREE</SelectItem>
                      <SelectItem value="PRO">PRO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tier Name</Label>
                  <Input 
                    value={formData.tier}
                    onChange={(e) => setFormData({...formData, tier: e.target.value})}
                    placeholder="e.g. Bronze"
                    className="rounded-xl border-slate-200 font-bold"
                    required={formData.type === "PRO"}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price (PKR)</Label>
                  <Input 
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="rounded-xl border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Included Credits (Tokens)</Label>
                <Input 
                  type="number"
                  value={formData.tokensIncluded}
                  onChange={(e) => setFormData({...formData, tokensIncluded: e.target.value})}
                  className="rounded-xl border-slate-200 font-bold"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 gap-4 mt-2">
                <div>
                   <p className="text-xs font-black text-slate-900 leading-none">Active Visibility</p>
                   <p className="text-[10px] text-slate-400 font-medium">Show this plan to users on pricing page.</p>
                </div>
                <Switch 
                  checked={formData.isActive}
                  onCheckedChange={(v) => setFormData({...formData, isActive: v})}
                />
              </div>
            </div>

            <DialogFooter className="mt-8">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsOpen(false)}
                className="rounded-xl font-bold"
              >
                 Discard
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black px-8 h-11 shadow-lg shadow-indigo-100"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Authorize Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
