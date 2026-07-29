// Check if anime has English dub available
// Uses AniList popularity + known dub list

// Popular anime IDs that are confirmed to have English dubs
const CONFIRMED_DUB_IDS = new Set([
  // Naruto/Boruto
  20, 1735, 20, 21, 
  // One Piece
  21,
  // Attack on Titan
  16498, 20958, 99147, 110277, 131681,
  // Dragon Ball
  813, 20474, 21175,
  // My Hero Academia  
  21459, 100166, 104276, 113415, 139630,
  // Demon Slayer
  101922, 129874, 145139, 166240,
  // Jujutsu Kaisen
  113415, 145064,
  // Fullmetal Alchemist
  5114, 121,
  // Death Note
  1535,
  // Sword Art Online
  11757, 20594, 100182,
  // One Punch Man
  21087, 97668,
  // Tokyo Ghoul
  20605, 20850,
  // Spy x Family
  140960, 142838,
  // Chainsaw Man
  127230,
  // Mob Psycho
  21507, 101338,
  // Re:Zero
  21355, 108632, 119661,
  // Konosuba
  21202, 21699,
  // Shield Hero
  99263, 111321,
  // Vinland Saga
  101348, 136430,
  // Dr. Stone
  105333, 113936,
  // Fire Force
  105310, 114236,
  // Classroom of Elite
  98659, 145545,
  // Mushoku Tensei
  97986, 108465, 146065,
  // Solo Leveling
  151807,
  // Smoking Behind the Supermarket with You
  196187,
  // Bleach
  269, 163134,
  // Hunter x Hunter
  11061,
  // Fairy Tail
  6702, 20608,
  // Black Clover
  97940,
  // Haikyuu
  20464, 20920, 99726,
  // Assassination Classroom
  20755, 21170,
  // Steins;Gate
  9253,
  // Cowboy Bebop
  1,
  // Evangelion
  30,
  // Code Geass
  1575, 2904,
  // Overlord
  20832, 101474, 133844,
  // Danmachi
  20920, 101167,
  // Tensura
  101280, 108511, 156822,
]);

export function hasDub(animeId: number, popularity?: number | null): boolean {
  // Check confirmed list first
  if (CONFIRMED_DUB_IDS.has(animeId)) return true;
  
  // Very popular anime (top ~200) usually have dubs
  // But we don't guess - only confirmed IDs get the badge
  return false;
}
