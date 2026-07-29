export const ANILIST_API = "https://graphql.anilist.co";

export const BLOCKED_DOMAINS = [
  "megaplay.buzz",
  "playmogo.com",
  "vidtube.site",
  "vidwish.live",
  "animeplay.cfd",
  "myvidplay.com",
  "otakuhg.site",
  "otakuvid.online",
  "echovideo.ru",
  "gn1r5n.org",
  "ninstream.com",
  "dropfile.cc",
  "tryembed.us.cc",
];

export const ALLOWED_DOMAINS = ["vivibebe.site", "bibiemb.xyz"];

export const ALL_GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Romance",
  "Horror", "Sports", "Mystery", "Sci-Fi", "Slice of Life", "Music",
  "Psychological", "Mecha", "Supernatural", "Thriller", "Ecchi",
  "Mahou Shoujo",
];

export const ANIME_FORMATS = [
  { value: "TV", label: "TV" },
  { value: "MOVIE", label: "Movie" },
  { value: "OVA", label: "OVA" },
  { value: "ONA", label: "ONA" },
  { value: "SPECIAL", label: "Special" },
  { value: "MUSIC", label: "Music" },
];

export const SORT_OPTIONS = [
  { value: "POPULARITY_DESC", label: "Most Popular" },
  { value: "SCORE_DESC", label: "Highest Rated" },
  { value: "TRENDING_DESC", label: "Trending" },
  { value: "START_DATE_DESC", label: "Newest" },
  { value: "FAVOURITES_DESC", label: "Most Favourited" },
  { value: "EPISODES_DESC", label: "Most Episodes" },
];

export const SEASONS = ["WINTER", "SPRING", "SUMMER", "FALL"];

export const SIDEBAR_ITEMS = [
  { name: "Home", href: "/", icon: "Home" },
  { name: "Genre", href: "/genre", icon: "Layers" },
  { name: "Types", href: "/types", icon: "Film" },
  { name: "Updated", href: "/updated", icon: "RefreshCw" },
  { name: "Added", href: "/added", icon: "PlusCircle" },
  { name: "Popular", href: "/popular", icon: "TrendingUp" },
  { name: "Upcoming", href: "/upcoming", icon: "Calendar" },
  { name: "Ongoing", href: "/ongoing", icon: "Play" },
  { name: "Completed", href: "/completed", icon: "CheckCircle" },
] as const;

export const JUST4ANIME_SERVERS = ["zeke", "sai", "mai", "kai", "aoi", "jin", "echo", "ryuk"];
