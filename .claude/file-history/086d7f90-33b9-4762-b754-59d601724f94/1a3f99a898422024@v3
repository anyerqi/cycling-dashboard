"use client";

import { LeaderboardUser } from "@/lib/mockLeaderboardData";

interface LeaderboardProps {
  users: LeaderboardUser[];
}

export default function Leaderboard({ users }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-400";
    if (rank === 2) return "text-gray-300";
    if (rank === 3) return "text-amber-600";
    return "text-gray-500";
  };

  // Sort users by rank to ensure correct ordering
  const sortedUsers = [...users].sort((a, b) => a.rank - b.rank);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-800/50 text-gray-400 uppercase tracking-wider font-medium">
              <th scope="col" className="px-4 py-3 text-center w-10">Rank</th>
              <th scope="col" className="px-4 py-3 text-left">Cyclist</th>
              <th scope="col" className="px-4 py-3 text-right">Distance</th>
              <th scope="col" className="px-4 py-3 text-right">Elevation</th>
              <th scope="col" className="px-4 py-3 text-right">Activities</th>
              <th scope="col" className="px-4 py-3 text-right">Avg Speed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {sortedUsers.map((user) => (
              <tr
                key={user.username}
                className="bg-gray-900 hover:bg-gray-800/30 transition-colors"
              >
                <td
                  className={`px-4 py-3 text-center font-bold ${getRankColor(
                    user.rank,
                  )}`}
                >
                  {getRankIcon(user.rank)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{user.avatar}</span>
                    <span className="font-medium text-white">
                      {user.username}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-gray-300">
                  {user.totalDistance.toFixed(1)}
                  <span className="text-gray-500 text-xs ml-1">km</span>
                </td>
                <td className="px-4 py-3 text-right text-gray-300">
                  {user.totalElevation.toLocaleString()}
                  <span className="text-gray-500 text-xs ml-1">m</span>
                </td>
                <td className="px-4 py-3 text-right text-gray-300">
                  {user.totalActivities}
                </td>
                <td className="px-4 py-3 text-right text-gray-300">
                  {user.avgSpeed.toFixed(1)}
                  <span className="text-gray-500 text-xs ml-1">km/h</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
