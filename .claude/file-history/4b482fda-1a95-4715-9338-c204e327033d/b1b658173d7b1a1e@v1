"use client";

import { useState } from "react";
import { Activity } from "@/lib/mockData";
import ActivityTable from "./ActivityTable";
import UploadZone from "./UploadZone";

interface DashboardClientProps {
  initialActivities: Activity[];
}

export default function DashboardClient({ initialActivities }: DashboardClientProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);

  const handleActivityAdded = (activity: Activity) => {
    setActivities((prev) => [activity, ...prev]);
  };

  return (
    <div className="space-y-8">
      {/* Recent Activities */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-5">Recent Activities</h2>
        <ActivityTable activities={activities} />
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
