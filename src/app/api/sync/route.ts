import { NextRequest, NextResponse } from "next/server";
import { syncAll, syncCategory, needsSync } from "@/lib/sync";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// GET /api/sync — auto sync stale categories only
// GET /api/sync?force=true — force sync all
// GET /api/sync?category=trending — sync single category
export async function GET(request: NextRequest) {
  const force = request.nextUrl.searchParams.get("force") === "true";
  const category = request.nextUrl.searchParams.get("category");

  try {
    if (category) {
      const config = {
        category,
        query: getCategoryQuery(category),
        variables: { page: 1, perPage: 24 },
      };
      const count = await syncCategory(config);
      return NextResponse.json({ synced: { [category]: count } });
    }

    if (force) {
      const results = await syncAll();
      return NextResponse.json({ synced: results, forced: true });
    }

    // Smart sync — only stale categories
    const categories = ["trending", "popular", "highrated", "updated", "added", "upcoming", "ongoing", "completed"];
    const results: Record<string, number | string> = {};

    for (const cat of categories) {
      if (await needsSync(cat, 6)) {
        const config = {
          category: cat,
          query: getCategoryQuery(cat),
          variables: { page: 1, perPage: 24 },
        };
        results[cat] = await syncCategory(config);
        await new Promise((r) => setTimeout(r, 1500));
      } else {
        results[cat] = "fresh";
      }
    }

    return NextResponse.json({ synced: results });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Sync failed" }, { status: 500 });
  }
}

const MEDIA_FRAGMENT = `
  id idMal
  title { romaji english native }
  coverImage { extraLarge large medium color }
  bannerImage description format status season seasonYear
  episodes duration genres averageScore meanScore popularity trending favourites source
  studios { nodes { id name } }
  nextAiringEpisode { airingAt episode timeUntilAiring }
  startDate { year month day }
  endDate { year month day }
`;

function getCategoryQuery(category: string): string {
  const queries: Record<string, string> = {
    trending: `query($page:Int,$perPage:Int){Page(page:$page,perPage:$perPage){media(type:ANIME,sort:TRENDING_DESC){${MEDIA_FRAGMENT}}}}`,
    popular: `query($page:Int,$perPage:Int){Page(page:$page,perPage:$perPage){media(type:ANIME,sort:POPULARITY_DESC){${MEDIA_FRAGMENT}}}}`,
    highrated: `query($page:Int,$perPage:Int){Page(page:$page,perPage:$perPage){media(type:ANIME,sort:SCORE_DESC){${MEDIA_FRAGMENT}}}}`,
    updated: `query($page:Int,$perPage:Int){Page(page:$page,perPage:$perPage){media(type:ANIME,sort:UPDATED_AT_DESC,status:RELEASING){${MEDIA_FRAGMENT}}}}`,
    added: `query($page:Int,$perPage:Int){Page(page:$page,perPage:$perPage){media(type:ANIME,sort:ID_DESC){${MEDIA_FRAGMENT}}}}`,
    upcoming: `query($page:Int,$perPage:Int){Page(page:$page,perPage:$perPage){media(type:ANIME,status:NOT_YET_RELEASED,sort:POPULARITY_DESC){${MEDIA_FRAGMENT}}}}`,
    ongoing: `query($page:Int,$perPage:Int){Page(page:$page,perPage:$perPage){media(type:ANIME,status:RELEASING,sort:POPULARITY_DESC){${MEDIA_FRAGMENT}}}}`,
    completed: `query($page:Int,$perPage:Int){Page(page:$page,perPage:$perPage){media(type:ANIME,status:FINISHED,sort:POPULARITY_DESC){${MEDIA_FRAGMENT}}}}`,
  };
  return queries[category] || queries.trending;
}
