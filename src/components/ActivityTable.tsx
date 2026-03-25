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
          <tr className="border-b border-gray-800 dark:border-gray-700 text-left transition-colors duration-200">
            <th className="pb-3 text-xs text-gray-400 dark:text-gray-400 uppercase tracking-wider font-medium transition-colors duration-200">Date</th>
            <th className="pb-3 text-xs text-gray-400 dark:text-gray-400 uppercase tracking-wider font-medium transition-colors duration-200">Route</th>
            <th className="pb-3 text-xs text-gray-400 dark:text-gray-400 uppercase tracking-wider font-medium text-right transition-colors duration-200">Distance</th>
            <th className="pb-3 text-xs text-gray-400 dark:text-gray-400 uppercase tracking-wider font-medium text-right transition-colors duration-200">Duration</th>
            <th className="pb-3 text-xs text-gray-400 dark:text-gray-400 uppercase tracking-wider font-medium text-right transition-colors duration-200">Elevation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/50 dark:divide-gray-700/50">
          {activities.map((activity) => (
            <tr key={activity.id} className="hover:bg-gray-800/30 dark:hover:bg-gray-700/30 transition-colors">
              <td className="py-3.5 text-gray-300 dark:text-gray-300 transition-colors duration-200">{activity.date}</td>
              <td className="py-3.5 text-white dark:text-gray-100 font-medium transition-colors duration-200">{activity.routeName}</td>
              <td className="py-3.5 text-right text-gray-300 dark:text-gray-300 transition-colors duration-200">
                {activity.distance.toFixed(1)}{" "}
                <span className="text-gray-500 dark:text-gray-400 text-xs transition-colors duration-200">km</span>
              </td>
              <td className="py-3.5 text-right text-gray-300 dark:text-gray-300 transition-colors duration-200">{activity.duration}</td>
              <td className="py-3.5 text-right text-gray-300 dark:text-gray-300 transition-colors duration-200">
                {activity.elevation}{" "}
                <span className="text-gray-500 dark:text-gray-400 text-xs transition-colors duration-200">m</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
