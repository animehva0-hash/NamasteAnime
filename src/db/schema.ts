import { pgTable, serial, text, integer, timestamp, boolean, jsonb, uniqueIndex } from "drizzle-orm/pg-core";

// ── Anime metadata cache (AniList data stored locally) ──
export const animeCache = pgTable("anime_cache", {
  id: serial("id").primaryKey(),
  anilistId: integer("anilist_id").notNull(),
  malId: integer("mal_id"),
  titleRomaji: text("title_romaji").notNull(),
  titleEnglish: text("title_english"),
  titleNative: text("title_native"),
  coverExtraLarge: text("cover_extra_large"),
  coverLarge: text("cover_large"),
  coverMedium: text("cover_medium"),
  coverColor: text("cover_color"),
  bannerImage: text("banner_image"),
  description: text("description"),
  format: text("format"),
  status: text("status"),
  season: text("season"),
  seasonYear: integer("season_year"),
  episodes: integer("episodes"),
  duration: integer("duration"),
  genres: jsonb("genres").$type<string[]>(),
  averageScore: integer("average_score"),
  meanScore: integer("mean_score"),
  popularity: integer("popularity"),
  trending: integer("trending"),
  favourites: integer("favourites"),
  source: text("source"),
  studios: jsonb("studios").$type<{ id: number; name: string }[]>(),
  nextAiringEpisode: jsonb("next_airing_episode").$type<{ airingAt: number; episode: number; timeUntilAiring: number } | null>(),
  startDate: jsonb("start_date").$type<{ year: number | null; month: number | null; day: number | null }>(),
  endDate: jsonb("end_date").$type<{ year: number | null; month: number | null; day: number | null }>(),
  // Detail fields (filled on detail fetch)
  trailer: jsonb("trailer").$type<{ id: string; site: string } | null>(),
  characters: jsonb("characters").$type<unknown>(),
  relations: jsonb("relations").$type<unknown>(),
  recommendations: jsonb("recommendations").$type<unknown>(),
  // Categorization for listing queries
  category: text("category"), // trending, popular, highrated, updated, added, upcoming, ongoing, completed
  categoryRank: integer("category_rank"),
  syncedAt: timestamp("synced_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("anime_cache_anilist_id_category_idx").on(table.anilistId, table.category),
]);

// ── User data tables ──
export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  animeId: integer("anime_id").notNull(),
  title: text("title").notNull(),
  coverImage: text("cover_image"),
  format: text("format"),
  status: text("status"),
  genres: jsonb("genres").$type<string[]>(),
  score: integer("score"),
  episodes: integer("episodes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const watchHistory = pgTable("watch_history", {
  id: serial("id").primaryKey(),
  animeId: integer("anime_id").notNull(),
  title: text("title").notNull(),
  coverImage: text("cover_image"),
  episodeNumber: integer("episode_number").notNull(),
  totalEpisodes: integer("total_episodes"),
  progress: integer("progress").default(0),
  duration: integer("duration").default(0),
  serverType: text("server_type"),
  serverName: text("server_name"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const continueWatching = pgTable("continue_watching", {
  id: serial("id").primaryKey(),
  animeId: integer("anime_id").notNull(),
  title: text("title").notNull(),
  coverImage: text("cover_image"),
  episodeNumber: integer("episode_number").notNull(),
  totalEpisodes: integer("total_episodes"),
  progress: integer("progress").default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  preferredLanguage: text("preferred_language").default("sub"),
  autoplay: boolean("autoplay").default(true),
  preferredQuality: text("preferred_quality").default("auto"),
  theme: text("theme").default("dark"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Sync tracking ──
export const syncLog = pgTable("sync_log", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  lastSyncedAt: timestamp("last_synced_at").defaultNow().notNull(),
  itemCount: integer("item_count").default(0),
  status: text("status").default("success"),
});
