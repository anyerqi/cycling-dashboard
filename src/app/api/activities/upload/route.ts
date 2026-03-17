import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Log receipt of the file (no actual parsing)
  console.log(`[upload] Received file: ${file.name} (${file.size} bytes, type: ${file.type})`);

  // Return mock parsed data with random values
  const distance = parseFloat((Math.random() * 60 + 10).toFixed(1)); // 10–70 km
  const elevation = Math.round(Math.random() * 1200 + 50); // 50–1250 m
  const durationMinutes = Math.round(distance * 2.5); // rough estimate
  const hours = Math.floor(durationMinutes / 60);
  const mins = durationMinutes % 60;
  const secs = Math.round(Math.random() * 59);
  const duration = `${hours}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const today = new Date().toISOString().split("T")[0];

  return NextResponse.json({
    id: crypto.randomUUID(),
    date: today,
    distance,
    elevation,
    duration,
    message: "File received and parsed successfully (mock)",
  });
}
