import StatCard from "@/components/StatCard";
import DashboardClient from "@/components/DashboardClient";
import ElevationProfile from "@/components/ElevationProfile";
import { mockActivities, monthlySummary, mockTrackData } from "@/lib/mockData";

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white dark:text-gray-100">Dashboard</h1>
        <p className="text-sm text-gray-400 dark:text-gray-400 mt-1">Your cycling stats for this month</p>
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

      {/* Route & Elevation Profile */}
      <div>
        <h2 className="text-lg font-semibold text-white dark:text-gray-100 mb-3">Route &amp; Elevation Profile</h2>
        <ElevationProfile
          trackPoints={mockTrackData}
          routeName="Mountain Pass Challenge"
        />
      </div>

      {/* Client section: activities table + upload */}
      <DashboardClient initialActivities={mockActivities} />
    </div>
  );
}
