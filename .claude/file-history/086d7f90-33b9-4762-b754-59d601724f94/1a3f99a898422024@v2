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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[40px_2fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-3 bg-gray-800/50 rounded-lg text-xs text-gray-400 uppercase tracking-wider font-medium">
        <div className="text-center">Rank</div>
        <div>Cyclist</div>
        <div className="text-right">Distance</div>
        <div className="text-right">Elevation</div>
        <div className="text-right">Activities</div>
        <div className="text-right">Avg Speed</div>
      </div>

      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.username}
            className="grid grid-cols-[40px_2fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg items-center hover:bg-gray-800/30 transition-colors"
          >
            <div className={`text-center font-bold ${getRankColor(user.rank)}`}>
              {getRankIcon(user.rank)}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{user.avatar}</span>
              <span className="font-medium text-white">{user.username}</span>
            </div>
            <div className="text-right text-gray-300">
              {user.totalDistance.toFixed(1)}
              <span className="text-gray-500 text-xs ml-1">km</span>
            </div>
            <div className="text-right text-gray-300">
              {user.totalElevation.toLocaleString()}
              <span className="text-gray-500 text-xs ml-1">m</span>
            </div>
            <div className="text-right text-gray-300">{user.totalActivities}</div>
            <div className="text-right text-gray-300">
              {user.avgSpeed.toFixed(1)}
              <span className="text-gray-500 text-xs ml-1">km/h</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
