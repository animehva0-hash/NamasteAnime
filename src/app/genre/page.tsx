import { ALL_GENRES } from "@/lib/constants";
import GenreCard from "@/components/GenreCard";

export default function GenrePage() {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Browse by Genre</h1>
      <p className="text-text-secondary text-sm mb-6 sm:mb-8">Discover anime by your favorite genres</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {ALL_GENRES.map((genre) => (
          <GenreCard key={genre} genre={genre} />
        ))}
      </div>
    </div>
  );
}
