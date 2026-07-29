import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { watchHistory, continueWatching } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET() {
  try {
    const history = await db.select().from(watchHistory).orderBy(desc(watchHistory.updatedAt)).limit(50);
    return NextResponse.json(history);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { animeId, title, coverImage, episodeNumber, totalEpisodes, progress, serverType, serverName } = body;

    // Upsert watch history
    const existing = await db
      .select()
      .from(watchHistory)
      .where(and(eq(watchHistory.animeId, animeId), eq(watchHistory.episodeNumber, episodeNumber)));

    if (existing.length > 0) {
      await db
        .update(watchHistory)
        .set({ progress, serverType, serverName, updatedAt: new Date() })
        .where(eq(watchHistory.id, existing[0].id));
    } else {
      await db.insert(watchHistory).values({
        animeId,
        title,
        coverImage,
        episodeNumber,
        totalEpisodes,
        progress: progress || 0,
        serverType,
        serverName,
      });
    }

    // Update continue watching
    const existingCW = await db
      .select()
      .from(continueWatching)
      .where(eq(continueWatching.animeId, animeId));

    if (existingCW.length > 0) {
      await db
        .update(continueWatching)
        .set({ episodeNumber, progress: progress || 0, updatedAt: new Date() })
        .where(eq(continueWatching.id, existingCW[0].id));
    } else {
      await db.insert(continueWatching).values({
        animeId,
        title,
        coverImage,
        episodeNumber,
        totalEpisodes,
        progress: progress || 0,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
