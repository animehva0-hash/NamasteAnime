import { NextResponse } from "next/server";
import { db } from "@/db";
import { continueWatching } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const items = await db.select().from(continueWatching).orderBy(desc(continueWatching.updatedAt)).limit(20);
    return NextResponse.json(items);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
