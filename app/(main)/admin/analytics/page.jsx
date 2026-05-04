import { getPlatformStats } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnalyticsCharts from "./_components/AnalyticsCharts";

export const metadata = {
  title: "Platform Analytics - Careerly Admin",
};

export default async function AdminAnalyticsPage() {
  const stats = await getPlatformStats();

  // Prepare data for charts
  const barData = stats.featureUsage.map((f) => ({
    name: f.feature.replace("_", " "),
    usage: f.count,
    tokens: f.tokens,
  }));

  const pieData = stats.featureUsage.map((f) => ({
    name: f.feature.replace("_", " "),
    value: f.tokens,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
        <p className="text-gray-500 mt-1">Deep dive into feature usage and token consumption.</p>
      </div>

      <AnalyticsCharts barData={barData} pieData={pieData} />

      {/* Aggregate Stats Table */}
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader>
          <CardTitle>Usage Summary Data</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Feature</th>
                <th className="py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Uniques</th>
                <th className="py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Total Usage</th>
                <th className="py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Tokens Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.featureUsage.map((f) => (
                <tr key={f.feature}>
                  <td className="py-4 font-bold text-gray-700 uppercase p-2 tracking-tight text-sm">{f.feature.replace("_", " ")}</td>
                  <td className="py-4 text-sm text-gray-500">N/A</td>
                  <td className="py-4 text-sm font-semibold text-gray-600">{f.count.toLocaleString()}</td>
                  <td className="py-4 text-sm font-extrabold text-indigo-600 text-right">{f.tokens.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
