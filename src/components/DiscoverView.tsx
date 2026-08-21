import React from 'react';
import { motion } from 'motion/react';
import { Movie, Collection, VibeCategory } from '../types';
import { SearchBar } from './SearchBar';
import { GenrePills } from './GenrePills';

interface DiscoverViewProps {
  movies: Movie[];
  collections: Collection[];
  vibeCategories: VibeCategory[];
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectMovie: (movie: Movie) => void;
  onOpenCollection: (collectionId: string) => void;
  onSelectVibe: (vibe: VibeCategory) => void;
  onOpenAiSearch: () => void;
  savedMovieIds: string[];
  likedMovieIds: string[];
  onToggleSave: (id: string) => void;
  onToggleLike: (id: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  movies,
  vibeCategories,
  selectedGenre,
  onSelectGenre,
  searchQuery,
  setSearchQuery,
  onSelectMovie,
  onOpenCollection,
  onSelectVibe,
  onOpenAiSearch,
  savedMovieIds,
  likedMovieIds,
  onToggleSave,
  onToggleLike,
  searchInputRef,
}) => {
  // Filter movies based on search query and selected genre
  const filteredMovies = movies.filter((movie) => {
    const matchesGenre =
      selectedGenre === 'All' ||
      movie.genre.toLowerCase() === selectedGenre.toLowerCase() ||
      movie.subGenres.some((sg) => sg.toLowerCase() === selectedGenre.toLowerCase());

    const matchesSearch =
      !searchQuery.trim() ||
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.mood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.moodTags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      movie.cast.some((actor) => actor.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesGenre && matchesSearch;
  });

  // Specifically slice movies for Section 1 (Late Night Thrills)
  const lateNightMovies = filteredMovies.filter(
    (m) => m.category === 'late_night' || m.genre === 'Thriller' || m.genre === 'Noir' || m.genre === 'Action' || m.genre === 'Sci-Fi'
  );

  // Quiet Contemplation featured editorial collection
  const quietContemplation = movies.find((m) => m.id === 'quiet-contemplation') || movies[0];

  return (
    <main className="max-w-2xl mx-auto px-6 pt-6 pb-28">
      {/* Prominent Search Bar */}
      <SearchBar
        query={searchQuery}
        setQuery={setSearchQuery}
        onOpenAiSearch={onOpenAiSearch}
        inputRef={searchInputRef}
      />

      {/* Genre Tags Horizontal Scroll */}
      <GenrePills
        selectedGenre={selectedGenre}
        onSelectGenre={onSelectGenre}
      />

      {/* Search results active banner if filtering */}
      {searchQuery && (
        <div className="mb-8 p-4 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center justify-between">
          <p className="text-xs text-[#d4d4d4] font-light">
            Found <span className="font-medium text-[#c8b99d]">{filteredMovies.length}</span> films matching &ldquo;{searchQuery}&rdquo;
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-[10px] uppercase tracking-[0.2em] text-[#8e7d5d] hover:text-white"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Section 1: Late Night Thrills */}
      <section className="mb-14">
        <div className="flex items-end justify-between mb-6 pb-2 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="h-[1px] w-6 bg-[#8e7d5d]"></div>
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#8e7d5d] font-semibold">
                Atmospheric Cinema
              </span>
            </div>
            <h2 className="font-serif italic text-3xl font-light text-white tracking-wide">
              Late Night Thrills
            </h2>
          </div>
          <button
            onClick={() => onOpenCollection('late-night-thrills-col')}
            className="text-[10px] uppercase tracking-[0.2em] text-[#d4d4d4]/70 hover:text-white pb-1 border-b border-white/20 transition-colors cursor-pointer"
          >
            View Archive
          </button>
        </div>

        {/* 2-Column Masonry Grid Matching Screenshot */}
        <div className="masonry-grid">
          {lateNightMovies.slice(0, 6).map((movie) => {
            const isLiked = likedMovieIds.includes(movie.id);
            const isSaved = savedMovieIds.includes(movie.id);

            return (
              <motion.div
                key={movie.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                onClick={() => onSelectMovie(movie)}
                className="masonry-item relative group rounded-xl overflow-hidden bg-[#0a0a0a] border border-white/10 hover:border-[#8e7d5d]/50 transition-all cursor-pointer shadow-2xl"
              >
                {/* Poster Image */}
                <div className="relative overflow-hidden">
                  <img
                    alt={movie.title}
                    src={movie.posterUrl}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
                </div>

                {/* Top quick badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[9px] font-mono tracking-widest text-[#c8b99d] border border-[#8e7d5d]/30">
                    {movie.qualityBadge || '4K HDR'}
                  </span>
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleLike(movie.id)}
                      className={`w-7 h-7 rounded-full backdrop-blur-md border flex items-center justify-center transition-colors ${
                        isLiked ? 'bg-[#8e7d5d] border-[#8e7d5d] text-black' : 'bg-black/70 border-white/20 text-white/80 hover:text-white'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-sm ${isLiked ? 'material-symbols-filled' : ''}`}>
                        favorite
                      </span>
                    </button>
                    <button
                      onClick={() => onToggleSave(movie.id)}
                      className={`w-7 h-7 rounded-full backdrop-blur-md border flex items-center justify-center transition-colors ${
                        isSaved ? 'bg-white border-white text-black' : 'bg-black/70 border-white/20 text-white/80 hover:text-white'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-sm ${isSaved ? 'material-symbols-filled' : ''}`}>
                        {isSaved ? 'bookmark_added' : 'add'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Bottom text info */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#8e7d5d] block mb-0.5">
                    {movie.genre} • {movie.year}
                  </span>
                  <p className="font-serif italic text-lg text-white font-normal leading-snug group-hover:text-[#c8b99d] transition-colors">
                    {movie.title}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Section 2: Sunday Morning Vibes */}
      <section className="mb-14">
        <div className="flex items-end justify-between mb-6 pb-2 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="h-[1px] w-6 bg-[#8e7d5d]"></div>
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#8e7d5d] font-semibold">
                Curated Series
              </span>
            </div>
            <h2 className="font-serif italic text-3xl font-light text-white tracking-wide">
              Quiet Contemplation
            </h2>
          </div>
          <button
            onClick={() => onOpenCollection('quiet-contemplation-col')}
            className="text-[10px] uppercase tracking-[0.2em] text-[#d4d4d4]/70 hover:text-white pb-1 border-b border-white/20 transition-colors cursor-pointer"
          >
            Explore All
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Editorial Card Matching Screenshot */}
          <motion.div
            whileHover={{ scale: 1.005 }}
            onClick={() => onSelectMovie(quietContemplation)}
            className="relative h-72 rounded-2xl overflow-hidden group cursor-pointer border border-white/10 shadow-2xl bg-[#0a0a0a]"
          >
            <img
              alt="Soft morning light"
              src={quietContemplation.posterUrl}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] opacity-80"
            />
            {/* Gradient Mask matching screenshot */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent"></div>
            <div className="absolute top-0 left-0 w-full h-full subtle-grid-bg opacity-30 pointer-events-none" />

            <div className="absolute inset-0 flex flex-col justify-center p-8 z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-[1px] w-4 bg-[#8e7d5d]"></span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#8e7d5d] font-semibold">
                  Curated Collection • Ref. 4092
                </span>
              </div>
              <h3 className="font-serif italic text-4xl font-light max-w-xs leading-tight mb-3 text-white">
                The Architecture <br /> of Silence
              </h3>
              <p className="text-xs text-[#d4d4d4]/60 max-w-sm mb-5 font-light leading-relaxed">
                Exploring contemplative indie cinematography, acoustic resonance, and fluid stillness.
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMovie(quietContemplation);
                  }}
                  className="px-6 py-2.5 rounded-full border border-white/20 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-medium flex items-center gap-2 hover:bg-transparent hover:text-white hover:border-white transition-all cursor-pointer shadow-lg"
                >
                  <span className="material-symbols-outlined text-sm material-symbols-filled">
                    play_arrow
                  </span>
                  Explore Film
                </button>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8e7d5d] border-b border-[#8e7d5d]/40 pb-0.5">
                  Archival Cut
                </span>
              </div>
            </div>
          </motion.div>

          {/* Small Grid for Vibes */}
          <div className="grid grid-cols-2 gap-4">
            {vibeCategories.slice(0, 2).map((vibe) => (
              <motion.button
                key={vibe.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectVibe(vibe)}
                className="bg-[#0d0d0d] p-6 rounded-2xl flex flex-col items-center text-center border border-white/10 hover:border-[#8e7d5d]/50 transition-all cursor-pointer group shadow-xl"
              >
                <div className="w-10 h-10 rounded-full border border-[#8e7d5d]/30 bg-[#141414] flex items-center justify-center mb-3 text-[#8e7d5d] group-hover:border-[#c8b99d] group-hover:text-[#c8b99d] transition-transform group-hover:scale-105">
                  <span className="material-symbols-outlined text-xl" data-icon={vibe.icon}>
                    {vibe.icon}
                  </span>
                </div>
                <p className="font-serif italic text-base font-normal text-white group-hover:text-[#c8b99d] transition-colors">
                  {vibe.name}
                </p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#8e7d5d] mt-1 font-medium">
                  {vibe.movieCount} Films in Archive
                </p>
              </motion.button>
            ))}
          </div>

          {/* Secondary Vibe Row */}
          <div className="grid grid-cols-2 gap-4">
            {vibeCategories.slice(2, 4).map((vibe) => (
              <motion.button
                key={vibe.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectVibe(vibe)}
                className="bg-[#0d0d0d] p-6 rounded-2xl flex flex-col items-center text-center border border-white/10 hover:border-[#8e7d5d]/50 transition-all cursor-pointer group shadow-xl"
              >
                <div className="w-10 h-10 rounded-full border border-white/15 bg-[#141414] flex items-center justify-center mb-3 text-white/80 group-hover:border-[#c8b99d] group-hover:text-[#c8b99d] transition-transform group-hover:scale-105">
                  <span className="material-symbols-outlined text-xl" data-icon={vibe.icon}>
                    {vibe.icon}
                  </span>
                </div>
                <p className="font-serif italic text-base font-normal text-white group-hover:text-[#c8b99d] transition-colors">
                  {vibe.name}
                </p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/50 mt-1 font-medium">
                  {vibe.movieCount} Films in Archive
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Trending Now & Director's Cut Spotlight */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-5 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="h-[1px] w-4 bg-[#8e7d5d]"></div>
            <h2 className="font-serif italic text-2xl font-light text-white tracking-wide">
              Selected Repertory
            </h2>
          </div>
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#8e7d5d] font-semibold">
            INDEX MMXXIV
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {movies.slice(4, 8).map((movie) => (
            <motion.div
              key={movie.id}
              whileHover={{ y: -2 }}
              onClick={() => onSelectMovie(movie)}
              className="p-3.5 rounded-xl bg-[#0a0a0a] border border-white/10 hover:border-[#8e7d5d]/40 transition-all cursor-pointer group shadow-lg"
            >
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-2.5">
                <img
                  src={movie.backdropUrl || movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 border border-white/10 text-[9px] font-mono text-[#c8b99d]">
                  ★ {movie.rating}
                </span>
              </div>
              <p className="font-serif italic text-base font-normal text-white truncate group-hover:text-[#c8b99d] transition-colors">
                {movie.title}
              </p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#8e7d5d] mt-0.5 truncate">
                {movie.genre} • {movie.director}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
};

