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
    <div className="mx-3 mb-4 rounded-lg border border-gray-700 dark:border-gray-600 bg-gray-800/50 dark:bg-gray-700/30 p-3 transition-colors duration-200">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-semibold text-gray-200 dark:text-gray-100 flex items-center gap-1.5 transition-colors duration-200">
          <span>🤖</span>
          <span>AI 训练建议</span>
        </h2>
        <button
          onClick={fetchSuggestion}
          disabled={loading}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-300 dark:hover:text-gray-200 transition-colors disabled:opacity-40 text-xs"
          title="刷新建议"
          aria-label="刷新 AI 训练建议"
        >
          ↺
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-400 transition-colors duration-200">
          <span className="inline-block w-3 h-3 rounded-full border border-gray-500 dark:border-gray-400 border-t-blue-400 animate-spin" />
          <span>生成建议中…</span>
        </div>
      )}

      {!loading && error && (
        <p className="text-xs text-red-400 dark:text-red-300">{error}</p>
      )}

      {!loading && data && (
        <>
          <p className="text-xs text-gray-300 dark:text-gray-200 leading-relaxed transition-colors duration-200">
            {data.suggestion}
          </p>
          <div className="mt-2 pt-2 border-t border-gray-700 dark:border-gray-600 grid grid-cols-3 gap-1 text-center transition-colors duration-200">
            <div>
              <p className="text-xs font-medium text-white dark:text-gray-100 transition-colors duration-200">
                {data.stats.rideCount}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">骑行次数</p>
            </div>
            <div>
              <p className="text-xs font-medium text-white dark:text-gray-100 transition-colors duration-200">
                {data.stats.totalElevation}m
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">累计爬升</p>
            </div>
            <div>
              <p className="text-xs font-medium text-white dark:text-gray-100 transition-colors duration-200">
                {data.stats.avgSpeed.toFixed(1)}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">均速 km/h</p>
            </div>
          </div>
          {data.source === "mock" && (
            <p className="mt-1.5 text-[10px] text-gray-600 dark:text-gray-500 text-right transition-colors duration-200">
              模拟建议 · 设置 LLM_URL 后自动切换
            </p>
          )}
        </>
      )}
    </div>
  );
}
