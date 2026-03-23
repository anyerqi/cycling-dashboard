"use client";

import { useState, useMemo } from "react";
import { Activity } from "@/lib/mockData";
import ActivityTable from "./ActivityTable";
import UploadZone from "./UploadZone";

interface DashboardClientProps {
  initialActivities: Activity[];
}

export default function DashboardClient({ initialActivities }: DashboardClientProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [selectedWeek, setSelectedWeek] = useState<string>("all");

  const getWeekKey = (dateStr: string): string => {
    const date = new Date(dateStr);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    return weekStart.toISOString().split("T")[0];
  };

  const weekOptions = useMemo(() => {
    const weeks = new Map<string, { start: Date; count: number }>();
    weeks.set("all", { start: new Date(0), count: activities.length });

    activities.forEach((activity) => {
      const weekKey = getWeekKey(activity.date);
      const weekStart = new Date(weekKey);
      const existing = weeks.get(weekKey);
      if (existing) {
        existing.count += 1;
      } else {
        weeks.set(weekKey, { start: weekStart, count: 1 });
      }
    });

    return Array.from(weeks.entries())
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .map(([key, { count }]) => ({
        key,
        label: key === "all" ? "All Weeks" : `Week of ${key}`,
        count,
      }));
  }, [activities]);

  const filteredActivities = useMemo(() => {
    if (selectedWeek === "all") return activities;
    return activities.filter((activity) => getWeekKey(activity.date) === selectedWeek);
  }, [activities, selectedWeek]);

  const handleActivityAdded = (activity: Activity) => {
    setActivities((prev) => [activity, ...prev]);
  };

  return (
    <div className="space-y-8">
      {/* Recent Activities */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <h2 className="text-base font-semibold text-white">Recent Activities</h2>
          <div className="flex items-center gap-2">
            <label htmlFor="week-select" className="text-xs text-gray-400">
              Filter by week:
            </label>
            <select
              id="week-select"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="text-xs bg-gray-800 border border-gray-700 text-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {weekOptions.map((week) => (
                <option key={week.key} value={week.key}>
                  {week.label} ({week.count})
                </option>
              ))}
            </select>
          </div>
        </div>
        <ActivityTable activities={filteredActivities} />
      </section>

      {/* Upload Section */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-2">Upload Activity</h2>
        <p className="text-xs text-gray-400 mb-4">
          Upload a GPX or FIT file to add it to your activity log.
        </p>
        <UploadZone onActivityAdded={handleActivityAdded} />
      </section>
    </div>
  );
}
