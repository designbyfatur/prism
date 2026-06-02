import { NextRequest, NextResponse } from "next/server";

const WORKER_URL = process.env.WORKER_URL ?? "http://localhost:3002";

export async function POST(req: NextRequest) {
  const { platform, userId } = await req.json();

  if (!platform || !userId) {
    return NextResponse.json({ error: "Missing platform or userId" }, { status: 400 });
  }

  try {
    const res = await fetch(`${WORKER_URL}/capture/${platform}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
      signal: AbortSignal.timeout(6 * 60 * 1000), // 6 min timeout
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.error ?? "Capture failed" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
