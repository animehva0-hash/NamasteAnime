import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userPreferences } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const prefs = await db.select().from(userPreferences).limit(1);
    if (prefs.length === 0) {
      const newPref = await db.insert(userPreferences).values({}).returning();
      return NextResponse.json(newPref[0]);
    }
    return NextResponse.json(prefs[0]);
  } catch {
    return NextResponse.json({ preferredLanguage: "sub", autoplay: true, preferredQuality: "auto", theme: "dark" });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prefs = await db.select().from(userPreferences).limit(1);
    if (prefs.length === 0) {
      const newPref = await db.insert(userPreferences).values(body).returning();
      return NextResponse.json(newPref[0]);
    }
    await db.update(userPreferences).set({ ...body, updatedAt: new Date() }).where(eq(userPreferences.id, prefs[0].id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
