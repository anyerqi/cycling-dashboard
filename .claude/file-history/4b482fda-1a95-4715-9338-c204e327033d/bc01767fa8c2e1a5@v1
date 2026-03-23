"use client";

import { Activity } from "@/lib/mockData";

interface ActivityTableProps {
  activities: Activity[];
}

export default function ActivityTable({ activities }: ActivityTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800 text-left">
            <th className="pb-3 text-xs text-gray-400 uppercase tracking-wider font-medium">Date</th>
            <th className="pb-3 text-xs text-gray-400 uppercase tracking-wider font-medium">Route</th>
            <th className="pb-3 text-xs text-gray-400 uppercase tracking-wider font-medium text-right">Distance</th>
            <th className="pb-3 text-xs text-gray-400 uppercase tracking-wider font-medium text-right">Duration</th>
            <th className="pb-3 text-xs text-gray-400 uppercase tracking-wider font-medium text-right">Elevation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/50">
          {activities.map((activity) => (
            <tr key={activity.id} className="hover:bg-gray-800/30 transition-colors">
              <td className="py-3.5 text-gray-300">{activity.date}</td>
              <td className="py-3.5 text-white font-medium">{activity.routeName}</td>
              <td className="py-3.5 text-right text-gray-300">
                {activity.distance.toFixed(1)}{" "}
                <span className="text-gray-500 text-xs">km</span>
              </td>
              <td className="py-3.5 text-right text-gray-300">{activity.duration}</td>
              <td className="py-3.5 text-right text-gray-300">
                {activity.elevation}{" "}
                <span className="text-gray-500 text-xs">m</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
