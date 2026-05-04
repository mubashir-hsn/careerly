import { getPlans } from "@/actions/subscription";
import PlanManager from "./_components/PlanManager";

export const metadata = {
  title: "Subscription Management - Careerly Admin",
};

export default async function AdminSubscriptionsPage() {
  const plans = await getPlans();

  return (
    <div className="p-6">
      <PlanManager initialPlans={plans} />
    </div>
  );
}
