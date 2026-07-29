import { ANILIST_API } from "./constants";

export interface AnilistMedia {
  id: number;
  idMal: number | null;
  title: {
    romaji: string;
    english: string | null;
    native: string | null;
  };
  coverImage: {
    extraLarge: string;
    large: string;
    medium: string;
    color: string | null;
  };
  bannerImage: string | null;
  description: string | null;
  format: string | null;
  status: string | null;
  season: string | null;
  seasonYear: number | null;
  episodes: number | null;
  duration: number | null;
  genres: string[];
  averageScore: number | null;
  meanScore: number | null;
  popularity: number | null;
  trending: number | null;
  favourites: number | null;
  source: string | null;
  studios: {
    nodes: { id: number; name: string }[];
  };
  nextAiringEpisode: {
    airingAt: number;
    episode: number;
    timeUntilAiring: number;
  } | null;
  startDate: { year: number | null; month: number | null; day: number | null };
  endDate: { year: number | null; month: number | null; day: number | null };
  trailer: { id: string; site: string } | null;
  characters: {
    edges: {
      role: string;
      node: {
        id: number;
        name: { full: string };
        image: { large: string; medium: string };
      };
      voiceActors: {
        id: number;
        name: { full: string };
        image: { large: string; medium: string };
        language: string;
      }[];
    }[];
  };
  relations: {
    edges: {
      relationType: string;
      node: {
        id: number;
        title: { romaji: string; english: string | null };
        coverImage: { large: string };
        format: string | null;
        status: string | null;
        type: string;
      };
    }[];
  };
  recommendations: {
    nodes: {
      mediaRecommendation: {
        id: number;
        title: { romaji: string; english: string | null };
        coverImage: { large: string; extraLarge: string };
        format: string | null;
        episodes: number | null;
        averageScore: number | null;
        genres: string[];
      } | null;
    }[];
  };
}

export interface PageInfo {
  total: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
  perPage: number;
}

const MEDIA_FRAGMENT = `
  id
  idMal
  title {
    romaji
    english
    native
  }
  coverImage {
    extraLarge
    large
    medium
    color
  }
  bannerImage
  description
  format
  status
  season
  seasonYear
  episodes
  duration
  genres
  averageScore
  meanScore
  popularity
  trending
  favourites
  source
  studios {
    nodes {
      id
      name
    }
  }
  nextAiringEpisode {
    airingAt
    episode
    timeUntilAiring
  }
  startDate { year month day }
  endDate { year month day }
`;

const MEDIA_DETAIL_FRAGMENT = `
  ${MEDIA_FRAGMENT}
  trailer {
    id
    site
  }
  characters(sort: [ROLE, RELEVANCE], perPage: 20) {
    edges {
      role
      node {
        id
        name { full }
        image { large medium }
      }
      voiceActors(language: JAPANESE) {
        id
        name { full }
        image { large medium }
        language
      }
    }
  }
  relations {
    edges {
      relationType
      node {
        id
        title { romaji english }
        coverImage { large }
        format
        status
        type
      }
    }
  }
  recommendations(perPage: 10) {
    nodes {
      mediaRecommendation {
        id
        title { romaji english }
        coverImage { large extraLarge }
        format
        episodes
        averageScore
        genres
      }
    }
  }
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchAnilist(query: string, variables: Record<string, unknown> = {}, retries = 3): Promise<any> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(ANILIST_API, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ query, variables }),
        next: { revalidate: 600 },
      });
      if (res.status === 429) {
        // Rate limited - wait and retry
        const wait = Math.min(2000 * (attempt + 1), 8000);
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }
      if (!res.ok) {
        if (attempt < retries - 1) {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }
        throw new Error(`AniList API error: ${res.status}`);
      }
      return res.json() as Promise<Record<string, unknown>>;
    } catch (err) {
      if (attempt < retries - 1) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw new Error("AniList API failed after retries");
}

export async function getTrending(page = 1, perPage = 20) {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage lastPage hasNextPage perPage }
        media(type: ANIME, sort: TRENDING_DESC) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `;
  const data = await fetchAnilist(query, { page, perPage });
  return data.data.Page as { pageInfo: PageInfo; media: AnilistMedia[] };
}

export async function getPopular(page = 1, perPage = 20) {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage lastPage hasNextPage perPage }
        media(type: ANIME, sort: POPULARITY_DESC) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `;
  const data = await fetchAnilist(query, { page, perPage });
  return data.data.Page as { pageInfo: PageInfo; media: AnilistMedia[] };
}

export async function getHighestRated(page = 1, perPage = 20) {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage lastPage hasNextPage perPage }
        media(type: ANIME, sort: SCORE_DESC) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `;
  const data = await fetchAnilist(query, { page, perPage });
  return data.data.Page as { pageInfo: PageInfo; media: AnilistMedia[] };
}

export async function getRecentlyUpdated(page = 1, perPage = 20) {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage lastPage hasNextPage perPage }
        media(type: ANIME, sort: UPDATED_AT_DESC, status: RELEASING) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `;
  const data = await fetchAnilist(query, { page, perPage });
  return data.data.Page as { pageInfo: PageInfo; media: AnilistMedia[] };
}

export async function getRecentlyAdded(page = 1, perPage = 20) {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage lastPage hasNextPage perPage }
        media(type: ANIME, sort: ID_DESC) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `;
  const data = await fetchAnilist(query, { page, perPage });
  return data.data.Page as { pageInfo: PageInfo; media: AnilistMedia[] };
}

export async function getAiringToday(page = 1, perPage = 20) {
  const now = Math.floor(Date.now() / 1000);
  const tomorrow = now + 86400;
  const query = `
    query ($page: Int, $perPage: Int, $airingAtGreater: Int, $airingAtLesser: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage lastPage hasNextPage perPage }
        airingSchedules(airingAt_greater: $airingAtGreater, airingAt_lesser: $airingAtLesser, sort: TIME) {
          airingAt
          episode
          media {
            ${MEDIA_FRAGMENT}
          }
        }
      }
    }
  `;
  const data = await fetchAnilist(query, { page, perPage, airingAtGreater: now, airingAtLesser: tomorrow });
  const schedules = data.data.Page.airingSchedules as { airingAt: number; episode: number; media: AnilistMedia }[];
  const seen = new Set<number>();
  const media: AnilistMedia[] = [];
  for (const s of schedules) {
    if (s.media && !seen.has(s.media.id)) {
      seen.add(s.media.id);
      media.push(s.media);
    }
  }
  return { pageInfo: data.data.Page.pageInfo as PageInfo, media };
}

export async function getUpcoming(page = 1, perPage = 20, season?: string, year?: number) {
  const vars: Record<string, unknown> = { page, perPage };
  let seasonFilter = "";
  if (season) {
    vars.season = season;
    seasonFilter += ", season: $season";
  }
  if (year) {
    vars.seasonYear = year;
    seasonFilter += ", seasonYear: $seasonYear";
  }
  const query = `
    query ($page: Int, $perPage: Int${season ? ", $season: MediaSeason" : ""}${year ? ", $seasonYear: Int" : ""}) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage lastPage hasNextPage perPage }
        media(type: ANIME, status: NOT_YET_RELEASED, sort: POPULARITY_DESC${seasonFilter}) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `;
  const data = await fetchAnilist(query, vars);
  return data.data.Page as { pageInfo: PageInfo; media: AnilistMedia[] };
}

export async function getOngoing(page = 1, perPage = 20) {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage lastPage hasNextPage perPage }
        media(type: ANIME, status: RELEASING, sort: POPULARITY_DESC) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `;
  const data = await fetchAnilist(query, { page, perPage });
  return data.data.Page as { pageInfo: PageInfo; media: AnilistMedia[] };
}

export async function getCompleted(page = 1, perPage = 20) {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage lastPage hasNextPage perPage }
        media(type: ANIME, status: FINISHED, sort: POPULARITY_DESC) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `;
  const data = await fetchAnilist(query, { page, perPage });
  return data.data.Page as { pageInfo: PageInfo; media: AnilistMedia[] };
}

export async function getByGenre(genre: string, page = 1, perPage = 20, sort = "POPULARITY_DESC", format?: string) {
  const vars: Record<string, unknown> = { page, perPage, genre, sort: [sort] };
  let formatFilter = "";
  if (format) {
    vars.format = format;
    formatFilter = ", format: $format";
  }
  const query = `
    query ($page: Int, $perPage: Int, $genre: String, $sort: [MediaSort]${format ? ", $format: MediaFormat" : ""}) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage lastPage hasNextPage perPage }
        media(type: ANIME, genre: $genre, sort: $sort${formatFilter}) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `;
  const data = await fetchAnilist(query, vars);
  return data.data.Page as { pageInfo: PageInfo; media: AnilistMedia[] };
}

export async function getByFormat(format: string, page = 1, perPage = 20, sort = "POPULARITY_DESC") {
  const query = `
    query ($page: Int, $perPage: Int, $format: MediaFormat, $sort: [MediaSort]) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage lastPage hasNextPage perPage }
        media(type: ANIME, format: $format, sort: $sort) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `;
  const data = await fetchAnilist(query, { page, perPage, format, sort: [sort] });
  return data.data.Page as { pageInfo: PageInfo; media: AnilistMedia[] };
}

export async function getAnimeDetails(id: number): Promise<AnilistMedia> {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        ${MEDIA_DETAIL_FRAGMENT}
      }
    }
  `;
  const data = await fetchAnilist(query, { id });
  return data.data.Media as AnilistMedia;
}

export async function searchAnime(searchQuery: string, page = 1, perPage = 20) {
  const query = `
    query ($search: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage lastPage hasNextPage perPage }
        media(type: ANIME, search: $search, sort: SEARCH_MATCH) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `;
  const data = await fetchAnilist(query, { search: searchQuery, page, perPage });
  return data.data.Page as { pageInfo: PageInfo; media: AnilistMedia[] };
}

export async function searchCharacters(searchQuery: string, page = 1, perPage = 20) {
  const query = `
    query ($search: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage lastPage hasNextPage perPage }
        characters(search: $search) {
          id
          name { full }
          image { large medium }
          media {
            nodes {
              id
              title { romaji english }
              coverImage { large }
            }
          }
        }
      }
    }
  `;
  const data = await fetchAnilist(query, { search: searchQuery, page, perPage });
  return data.data.Page;
}

export async function searchStudios(searchQuery: string, page = 1, perPage = 20) {
  const query = `
    query ($search: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage lastPage hasNextPage perPage }
        studios(search: $search) {
          id
          name
          media(sort: POPULARITY_DESC, perPage: 6) {
            nodes {
              id
              title { romaji english }
              coverImage { large }
            }
          }
        }
      }
    }
  `;
  const data = await fetchAnilist(query, { search: searchQuery, page, perPage });
  return data.data.Page;
}
