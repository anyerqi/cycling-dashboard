import { NextResponse } from "next/server";
import { mockActivities } from "@/lib/mockData";

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
  avgPace: number,
  rideCount: number
): string {
  return (
    `你是一位专业自行车训练教练。根据以下过去一周的骑行数据，给出简洁的中文训练建议（100字以内）：\n` +
    `- 过去7天骑行次数：${rideCount} 次\n` +
    `- 累计爬升：${totalElevation} 米\n` +
    `- 平均配速：${avgPace.toFixed(1)} km/h\n\n` +
    `请评估本周训练强度，并给出下周的针对性建议。`
  );
}

// Generate a mock coaching suggestion based on computed stats
function mockSuggestion(
  totalElevation: number,
  avgPace: number,
  rideCount: number
): string {
  if (rideCount === 0) {
    return "本周暂无骑行数据，建议从轻松的平路骑行开始，逐步建立有氧基础。";
  }

  const climbNote =
    totalElevation >= 1000
      ? "本周爬升训练量达标"
      : "本周爬升量偏少，可适当增加丘陵路线";

  const paceNote =
    avgPace >= 24
      ? "配速表现良好"
      : "配速略低，注意提升踏频和核心力量";

  const nextWeek =
    totalElevation >= 1000
      ? "建议下周增加平路有氧耐力骑行，注重恢复与基础能力提升。"
      : "建议下周加入一次爬坡训练，同时保持有氧耐力骑行节奏。";

  return `${climbNote}，${paceNote}。${nextWeek}`;
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

  const paces = recentActivities.map((a) => {
    const hours = parseDurationHours(a.duration);
    return hours > 0 ? a.distance / hours : 0;
  });
  const avgPace =
    paces.length > 0 ? paces.reduce((s, p) => s + p, 0) / paces.length : 0;

  const prompt = buildPrompt(totalElevation, avgPace, rideCount);

  // Attempt to call the local LLM (llama.cpp server)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const llmResponse = await fetch("http://localhost:8080/completion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, n_predict: 200, temperature: 0.7 }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (llmResponse.ok) {
      const data = await llmResponse.json();
      const content: string = data.content ?? data.text ?? "";
      if (content.trim()) {
        return NextResponse.json({
          suggestion: content.trim(),
          source: "llm",
          stats: { rideCount, totalElevation, avgPace },
        });
      }
    }
  } catch {
    // LLM not available — fall through to mock response
  }

  return NextResponse.json({
    suggestion: mockSuggestion(totalElevation, avgPace, rideCount),
    source: "mock",
    stats: { rideCount, totalElevation, avgPace },
  });
}
