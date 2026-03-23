"use client";

import { useCallback, useEffect, useState } from "react";

interface CoachData {
  suggestion: string;
  source: "llm" | "mock";
  stats: {
    rideCount: number;
    totalElevation: number;
    avgSpeed: number;
  };
}

export default function AICoachPanel() {
  const [data, setData] = useState<CoachData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestion = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai-coach", { cache: "no-store" });
      if (!res.ok) throw new Error("请求失败");
      const json = await res.json();
      setData(json);
    } catch {
      setError("暂时无法获取建议，请稍后重试。");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuggestion();
  }, [fetchSuggestion]);

  return (
    <div className="mx-3 mb-4 rounded-lg border border-gray-700 bg-gray-800/50 p-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
          <span>🤖</span>
          <span>AI 训练建议</span>
        </h2>
        <button
          onClick={fetchSuggestion}
          disabled={loading}
          className="text-gray-500 hover:text-gray-300 transition-colors disabled:opacity-40 text-xs"
          title="刷新建议"
          aria-label="刷新 AI 训练建议"
        >
          ↺
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="inline-block w-3 h-3 rounded-full border border-gray-500 border-t-blue-400 animate-spin" />
          <span>生成建议中…</span>
        </div>
      )}

      {!loading && error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      {!loading && data && (
        <>
          <p className="text-xs text-gray-300 leading-relaxed">
            {data.suggestion}
          </p>
          <div className="mt-2 pt-2 border-t border-gray-700 grid grid-cols-3 gap-1 text-center">
            <div>
              <p className="text-xs font-medium text-white">
                {data.stats.rideCount}
              </p>
              <p className="text-[10px] text-gray-500">骑行次数</p>
            </div>
            <div>
              <p className="text-xs font-medium text-white">
                {data.stats.totalElevation}m
              </p>
              <p className="text-[10px] text-gray-500">累计爬升</p>
            </div>
            <div>
              <p className="text-xs font-medium text-white">
                {data.stats.avgSpeed.toFixed(1)}
              </p>
              <p className="text-[10px] text-gray-500">均速 km/h</p>
            </div>
          </div>
          {data.source === "mock" && (
            <p className="mt-1.5 text-[10px] text-gray-600 text-right">
              模拟建议 · 设置 LLM_URL 后自动切换
            </p>
          )}
        </>
      )}
    </div>
  );
}
