import { NextResponse } from "next/server";
import { mockActivities } from "@/lib/mockData";

const LLM_URL =
  process.env.LLM_URL ?? "http://localhost:8080/completion";

// Parse "h:mm:ss" or "hh:mm:ss" duration string into decimal hours
function parseDurationHours(duration: string): number {
  const parts = duration.split(":").map(Number);
  if (parts.length !== 3) return 0;
  const [h, m, s] = parts;
  return h + m / 60 + s / 3600;
}

// Build an analysis prompt from the past week's activities
function buildPrompt(
  totalElevation: number,
  avgSpeed: number,
  rideCount: number
): string {
  return (
    `你是一位专业自行车训练教练。根据以下过去一周的骑行数据，给出简洁的中文训练建议（100字以内）：\n` +
    `- 过去7天骑行次数：${rideCount} 次\n` +
    `- 累计爬升：${totalElevation} 米\n` +
    `- 平均速度：${avgSpeed.toFixed(1)} km/h\n\n` +
    `请评估本周训练强度，并给出下周的针对性建议。`
  );
}

// Generate a mock coaching suggestion based on computed stats
function mockSuggestion(
  totalElevation: number,
  avgSpeed: number,
  rideCount: number
): string {
  if (rideCount === 0) {
    return "本周暂无骑行数据，建议从轻松的平路骑行开始，逐步建立有氧基础。";
  }

  const climbNote =
    totalElevation >= 1000
      ? "本周爬升训练量达标"
      : "本周爬升量偏少，可适当增加丘陵路线";

  const speedNote =
    avgSpeed >= 24
      ? "均速表现良好"
      : "均速略低，注意提升踏频和核心力量";

  const nextWeek =
    totalElevation >= 1000
      ? "建议下周增加平路有氧耐力骑行，注重恢复与基础能力提升。"
      : "建议下周加入一次爬坡训练，同时保持有氧耐力骑行节奏。";

  return `${climbNote}，${speedNote}。${nextWeek}`;
}

export async function GET() {
  // Filter activities to last 7 days (simulating a SQLite query)
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recentActivities = mockActivities.filter(
    (a) => new Date(a.date) >= weekAgo
  );

  const rideCount = recentActivities.length;
  const totalElevation = recentActivities.reduce(
    (sum, a) => sum + a.elevation,
    0
  );

  // Weighted average speed: total distance / total hours (more accurate than
  // averaging per-ride speeds, which skews results when ride lengths differ)
  const totalDistance = recentActivities.reduce((sum, a) => sum + a.distance, 0);
  const totalHours = recentActivities.reduce(
    (sum, a) => sum + parseDurationHours(a.duration),
    0
  );
  const avgSpeed = totalHours > 0 ? totalDistance / totalHours : 0;

  const prompt = buildPrompt(totalElevation, avgSpeed, rideCount);

  const noStore = { "Cache-Control": "no-store" };

  // Skip LLM attempt when URL is not explicitly configured (avoids timeout on
  // every request in environments without a local model running)
  if (process.env.LLM_URL) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const llmResponse = await fetch(LLM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, n_predict: 200, temperature: 0.7 }),
        signal: controller.signal,
      });

      if (llmResponse.ok) {
        const data = await llmResponse.json();
        const content: string = data.content ?? data.text ?? "";
        if (content.trim()) {
          return NextResponse.json(
            {
              suggestion: content.trim(),
              source: "llm",
              stats: { rideCount, totalElevation, avgSpeed },
            },
            { headers: noStore }
          );
        }
      }
    } catch {
      // LLM not available — fall through to mock response
    } finally {
      clearTimeout(timeout);
    }
  }

  return NextResponse.json(
    {
      suggestion: mockSuggestion(totalElevation, avgSpeed, rideCount),
      source: "mock",
      stats: { rideCount, totalElevation, avgSpeed },
    },
    { headers: noStore }
  );
}
