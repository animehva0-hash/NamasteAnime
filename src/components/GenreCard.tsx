import Link from "next/link";

const genreColors: Record<string, string> = {
  Action: "from-red-600 to-orange-500",
  Adventure: "from-emerald-600 to-teal-500",
  Comedy: "from-yellow-500 to-amber-400",
  Drama: "from-purple-600 to-pink-500",
  Fantasy: "from-indigo-600 to-purple-500",
  Romance: "from-pink-500 to-rose-400",
  Horror: "from-gray-800 to-red-900",
  Sports: "from-green-600 to-lime-500",
  Mystery: "from-slate-700 to-indigo-800",
  "Sci-Fi": "from-cyan-600 to-blue-500",
  "Slice of Life": "from-orange-400 to-yellow-300",
  Music: "from-violet-600 to-fuchsia-500",
  Psychological: "from-gray-700 to-purple-900",
  Mecha: "from-blue-700 to-cyan-600",
  Supernatural: "from-violet-700 to-indigo-600",
  Thriller: "from-red-800 to-gray-700",
  Ecchi: "from-pink-600 to-red-400",
  "Mahou Shoujo": "from-fuchsia-500 to-pink-400",
};

const genreIcons: Record<string, string> = {
  Action: "⚔️", Adventure: "🗺️", Comedy: "😂", Drama: "🎭",
  Fantasy: "🧙", Romance: "💕", Horror: "👻", Sports: "⚽",
  Mystery: "🔍", "Sci-Fi": "🚀", "Slice of Life": "☀️", Music: "🎵",
  Psychological: "🧠", Mecha: "🤖", Supernatural: "👽", Thriller: "😱",
  Ecchi: "🔥", "Mahou Shoujo": "✨",
};

interface GenreCardProps {
  genre: string;
}

export default function GenreCard({ genre }: GenreCardProps) {
  const gradientClass = genreColors[genre] || "from-gray-600 to-gray-500";
  const icon = genreIcons[genre] || "🎬";
  const slug = genre.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link href={`/genre/${slug}`}>
      <div className={`relative group rounded-xl overflow-hidden bg-gradient-to-br ${gradientClass} p-6 h-32 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
        <span className="text-3xl">{icon}</span>
        <h3 className="text-lg font-bold text-white">{genre}</h3>
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-xl" />
      </div>
    </Link>
  );
}
