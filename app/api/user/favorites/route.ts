import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getFavorites, addFavorite, removeFavorite } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const favorites = await getFavorites(payload.userId);
  return NextResponse.json(favorites);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { stationUuid, stationName, stationUrl, stationFavicon } = await req.json();
  const id = crypto.randomUUID();
  const createdAt = Math.floor(Date.now() / 1000);

  const success = await addFavorite(id, payload.userId, stationUuid, stationName, stationUrl, stationFavicon, createdAt);
  return NextResponse.json({ success });
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { stationUuid } = await req.json();
  const success = await removeFavorite(payload.userId, stationUuid);
  return NextResponse.json({ success });
}
