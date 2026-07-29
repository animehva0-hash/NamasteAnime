import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bookmarks } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const all = await db.select().from(bookmarks).orderBy(bookmarks.createdAt);
    return NextResponse.json(all);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { animeId, title, coverImage, format, status, genres, score, episodes } = body;

    // Check if exists
    const existing = await db.select().from(bookmarks).where(eq(bookmarks.animeId, animeId));
    if (existing.length > 0) {
      // Remove bookmark
      await db.delete(bookmarks).where(eq(bookmarks.animeId, animeId));
      return NextResponse.json({ bookmarked: false });
    }

    // Add bookmark
    await db.insert(bookmarks).values({
      animeId,
      title,
      coverImage,
      format,
      status,
      genres: genres || [],
      score,
      episodes,
    });
    return NextResponse.json({ bookmarked: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
