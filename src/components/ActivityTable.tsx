"use client";

import { useState, useMemo } from "react";
import { Activity } from "@/lib/mockData";

type SortKey = keyof Activity;
type SortDirection = "asc" | "desc";

interface ActivityTableProps {
  activities: Activity[];
}

export default function ActivityTable({ activities }: ActivityTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => {
      let comparison = 0;

      switch (sortKey) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "distance":
          comparison = a.distance - b.distance;
          break;
        case "elevation":
          comparison = a.elevation - b.elevation;
          break;
        case "routeName":
          comparison = a.routeName.localeCompare(b.routeName);
          break;
        case "duration":
          const parseDuration = (dur: string) => {
            const parts = dur.split(":").map(Number);
            if (parts.length === 3) {
              return parts[0] * 3600 + parts[1] * 60 + parts[2];
            }
            return 0;
          };
          comparison = parseDuration(a.duration) - parseDuration(b.duration);
          break;
        default:
          comparison = 0;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [activities, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return "⇅";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No activities found for the selected week.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800 text-left">
            <th
              className="pb-3 text-xs text-gray-400 uppercase tracking-wider font-medium cursor-pointer hover:text-gray-300"
              onClick={() => handleSort("date")}
            >
              Date {getSortIcon("date")}
            </th>
            <th
              className="pb-3 text-xs text-gray-400 uppercase tracking-wider font-medium cursor-pointer hover:text-gray-300"
              onClick={() => handleSort("routeName")}
            >
              Route {getSortIcon("routeName")}
            </th>
            <th
              className="pb-3 text-xs text-gray-400 uppercase tracking-wider font-medium text-right cursor-pointer hover:text-gray-300"
              onClick={() => handleSort("distance")}
            >
              Distance {getSortIcon("distance")}
            </th>
            <th
              className="pb-3 text-xs text-gray-400 uppercase tracking-wider font-medium text-right cursor-pointer hover:text-gray-300"
              onClick={() => handleSort("duration")}
            >
              Duration {getSortIcon("duration")}
            </th>
            <th
              className="pb-3 text-xs text-gray-400 uppercase tracking-wider font-medium text-right cursor-pointer hover:text-gray-300"
              onClick={() => handleSort("elevation")}
            >
              Elevation {getSortIcon("elevation")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/50">
          {sortedActivities.map((activity) => (
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
