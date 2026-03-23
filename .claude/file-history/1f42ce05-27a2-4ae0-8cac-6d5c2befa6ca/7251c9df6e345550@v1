import StatCard from "@/components/StatCard";
import DashboardClient from "@/components/DashboardClient";
import { mockActivities, monthlySummary } from "@/lib/mockData";

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Your cycling stats for this month</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Monthly Distance"
          value={monthlySummary.totalDistance}
          unit="km"
          icon="🛣️"
        />
        <StatCard
          title="Total Elevation"
          value={monthlySummary.totalElevation.toLocaleString()}
          unit="m"
          icon="⛰️"
        />
        <StatCard
          title="Avg Speed"
          value={monthlySummary.avgSpeed}
          unit="km/h"
          icon="⚡"
        />
      </div>

      {/* Client section: activities table + upload */}
      <DashboardClient initialActivities={mockActivities} />
    </div>
  );
}
