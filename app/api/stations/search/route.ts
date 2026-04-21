import { NextRequest, NextResponse } from "next/server";
import { searchStations } from "@/lib/radio-browser";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q") || "";
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50");

  try {
    const stations = await searchStations(query, limit);
    return NextResponse.json(stations);
  } catch (error) {
    console.error("Station search error:", error);
    return NextResponse.json({ error: "Failed to search stations" }, { status: 500 });
  }
}
