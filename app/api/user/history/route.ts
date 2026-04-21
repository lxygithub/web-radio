import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getDB, getHistory, addHistory } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const db = getDB();
  if (!db) {
    return NextResponse.json({ error: "Database not available" }, { status: 503 });
  }

  const history = await getHistory(payload.userId);
  return NextResponse.json(history);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const db = getDB();
  if (!db) {
    return NextResponse.json({ error: "Database not available" }, { status: 503 });
  }

  const { stationUuid, stationName, stationUrl } = await req.json();
  const id = crypto.randomUUID();
  const playedAt = Math.floor(Date.now() / 1000);

  const success = await addHistory(id, payload.userId, stationUuid, stationName, stationUrl, playedAt);
  return NextResponse.json({ success });
}
