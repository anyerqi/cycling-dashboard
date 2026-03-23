import Leaderboard from "@/components/Leaderboard";
import { mockLeaderboardData } from "@/lib/mockLeaderboardData";

export const metadata = {
  title: "Leaderboard - Cycling Dashboard",
  description: "See the top cyclists in the community",
};

export default function LeaderboardPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white">🏆 Leaderboard</h1>
        <p className="text-sm text-gray-400 mt-1">
          Top cyclists ranked by distance, elevation, and activities
        </p>
      </div>

      {/* Leaderboard Table */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <Leaderboard users={mockLeaderboardData} />
      </section>

      {/* Stats Summary */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-4">Community Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-2xl mb-1">🚴</div>
            <div className="text-2xl font-bold text-white">1,006.9</div>
            <div className="text-xs text-gray-400">Avg Distance (km)</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-2xl mb-1">⛰️</div>
            <div className="text-2xl font-bold text-white">14,540</div>
            <div className="text-xs text-gray-400">Avg Elevation (m)</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-2xl font-bold text-white">113.8</div>
            <div className="text-xs text-gray-400">Avg Activities</div>
          </div>
        </div>
      </section>
    </div>
  );
}
