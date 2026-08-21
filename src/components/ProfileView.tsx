import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Movie } from '../types';

interface ProfileViewProps {
  savedMovies: Movie[];
  likedMovies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onRemoveSaved: (id: string) => void;
  onRemoveLiked: (id: string) => void;
  onOpenAiSearch: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  savedMovies,
  likedMovies,
  onSelectMovie,
  onRemoveSaved,
  onRemoveLiked,
  onOpenAiSearch,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'watchlist' | 'liked' | 'taste'>('watchlist');

  // Compute taste stats
  const totalInteractions = savedMovies.length + likedMovies.length;
  const genres = [...savedMovies, ...likedMovies].map((m) => m.genre);
  const genreCounts: Record<string, number> = {};
  genres.forEach((g) => {
    genreCounts[g] = (genreCounts[g] || 0) + 1;
  });

  return (
    <div className="max-w-2xl mx-auto px-6 pt-6 pb-28 text-[#d4d4d4]">
      {/* Profile Header */}
      <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/10 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full subtle-grid-bg opacity-30 pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border border-[#8e7d5d]/50 bg-[#121212] flex items-center justify-center text-[#8e7d5d] shadow-xl">
              <span className="material-symbols-outlined text-2xl" data-icon="local_movies">
                local_movies
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#8e7d5d] text-black flex items-center justify-center text-[9px] font-bold">
              ✓
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="h-[1px] w-4 bg-[#8e7d5d]"></span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#8e7d5d] font-semibold">
                CURATOR ARCHIVE
              </span>
            </div>
            <h2 className="font-serif italic text-2xl font-light text-white tracking-wide">
              Personal Vault
            </h2>
            <p className="text-[11px] text-white/50 font-light mt-0.5">
              Taste Signature: Atmospheric Noir & Contemplative Indie Cinema
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10 text-center relative z-10">
          <div className="p-3 rounded-xl bg-[#121212] border border-white/5">
            <p className="font-serif italic text-2xl font-light text-white">{savedMovies.length}</p>
            <p className="text-[9px] text-[#8e7d5d] uppercase tracking-[0.2em] font-medium mt-0.5">Queue</p>
          </div>
          <div className="p-3 rounded-xl bg-[#121212] border border-white/5">
            <p className="font-serif italic text-2xl font-light text-[#c8b99d]">{likedMovies.length}</p>
            <p className="text-[9px] text-[#8e7d5d] uppercase tracking-[0.2em] font-medium mt-0.5">Starred</p>
          </div>
          <div className="p-3 rounded-xl bg-[#121212] border border-white/5">
            <p className="font-serif italic text-2xl font-light text-white">99%</p>
            <p className="text-[9px] text-[#8e7d5d] uppercase tracking-[0.2em] font-medium mt-0.5">Aesthetic Sync</p>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2 p-1 rounded-full bg-[#0d0d0d] border border-white/10 mb-8">
        <button
          onClick={() => setActiveSubTab('watchlist')}
          className={`flex-1 py-2.5 rounded-full font-medium text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer ${
            activeSubTab === 'watchlist'
              ? 'bg-white text-black font-semibold shadow-lg'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Queue ({savedMovies.length})
        </button>
        <button
          onClick={() => setActiveSubTab('liked')}
          className={`flex-1 py-2.5 rounded-full font-medium text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer ${
            activeSubTab === 'liked'
              ? 'bg-white text-black font-semibold shadow-lg'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Favorites ({likedMovies.length})
        </button>
        <button
          onClick={() => setActiveSubTab('taste')}
          className={`flex-1 py-2.5 rounded-full font-medium text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer ${
            activeSubTab === 'taste'
              ? 'bg-[#8e7d5d] text-black font-semibold shadow-lg'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Taste DNA
        </button>
      </div>

      {/* Content depending on tab */}
      {activeSubTab === 'watchlist' && (
        <div className="space-y-4">
          {savedMovies.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-[#0a0a0a] border border-white/10 p-8 space-y-3">
              <span className="material-symbols-outlined text-3xl text-white/30">
                bookmark_border
              </span>
              <p className="font-serif italic text-xl font-light text-white">Your queue is empty</p>
              <p className="text-xs text-white/50 max-w-xs mx-auto font-light">
                Browse our curated series or swipe right in the Reel to archive titles.
              </p>
              <button
                onClick={onOpenAiSearch}
                className="mt-3 px-6 py-2.5 rounded-full border border-white/20 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-transparent hover:text-white transition-all cursor-pointer"
              >
                Curator AI Vibe Match
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedMovies.map((movie) => (
                <motion.div
                  key={movie.id}
                  whileHover={{ y: -2 }}
                  className="p-3.5 rounded-xl bg-[#0a0a0a] border border-white/10 flex gap-3.5 group hover:border-[#8e7d5d]/50 transition-all cursor-pointer shadow-lg"
                  onClick={() => onSelectMovie(movie)}
                >
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-20 aspect-[3/4] object-cover rounded-lg shadow-md"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <span className="text-[9px] font-mono text-[#8e7d5d] uppercase tracking-wider">
                        {movie.genre}
                      </span>
                      <h4 className="font-serif italic text-base font-normal text-white truncate group-hover:text-[#c8b99d] transition-colors">
                        {movie.title}
                      </h4>
                      <p className="text-[11px] text-white/50">{movie.year} • {movie.duration}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[10px] text-[#c8b99d] font-mono">
                        ★ {movie.rating}
                      </span>
                      <button
                        onClick={() => onRemoveSaved(movie.id)}
                        className="text-xs text-white/40 hover:text-white p-1"
                        title="Remove"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'liked' && (
        <div className="space-y-4">
          {likedMovies.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-[#0a0a0a] border border-white/10 p-8 space-y-3">
              <span className="material-symbols-outlined text-3xl text-[#8e7d5d]/40">
                favorite_border
              </span>
              <p className="font-serif italic text-xl font-light text-white">No starred titles yet</p>
              <p className="text-xs text-white/50 max-w-xs mx-auto font-light">
                Heart films during discovery to curate your personal repertoire.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {likedMovies.map((movie) => (
                <motion.div
                  key={movie.id}
                  whileHover={{ y: -2 }}
                  className="p-3.5 rounded-xl bg-[#0a0a0a] border border-white/10 flex gap-3.5 group hover:border-[#8e7d5d]/50 transition-all cursor-pointer shadow-lg"
                  onClick={() => onSelectMovie(movie)}
                >
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-20 aspect-[3/4] object-cover rounded-lg shadow-md"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <span className="text-[9px] font-mono text-[#8e7d5d] uppercase tracking-wider">
                        {movie.genre}
                      </span>
                      <h4 className="font-serif italic text-base font-normal text-white truncate group-hover:text-[#c8b99d] transition-colors">
                        {movie.title}
                      </h4>
                      <p className="text-[11px] text-white/50">{movie.year} • {movie.duration}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[10px] text-[#c8b99d] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-[#8e7d5d] material-symbols-filled">favorite</span>
                        Archived
                      </span>
                      <button
                        onClick={() => onRemoveLiked(movie.id)}
                        className="text-xs text-white/40 hover:text-white p-1"
                        title="Unlike"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'taste' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-[1px] w-4 bg-[#8e7d5d]"></div>
                <h3 className="font-serif italic text-lg font-light text-white">
                  Cinematic Spectrum
                </h3>
              </div>
              <span className="text-[9px] text-[#8e7d5d] font-mono uppercase tracking-widest">REAL-TIME</span>
            </div>

            {totalInteractions === 0 ? (
              <p className="text-xs text-white/50 font-light">
                Star or queue titles to generate your individualized cinematic spectrum and acoustic pacing profile.
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(genreCounts).map(([genre, count]) => {
                  const pct = Math.round((count / totalInteractions) * 100);
                  return (
                    <div key={genre} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-light text-[#d4d4d4]">{genre}</span>
                        <span className="font-mono text-[#c8b99d] text-[11px]">{pct}% ({count})</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#1c1c1c] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#8e7d5d] to-[#c8b99d]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center gap-4">
            <span className="material-symbols-outlined text-2xl text-[#8e7d5d]">
              headphones
            </span>
            <div className="flex-1 text-xs">
              <p className="font-serif italic text-base text-white">Recommended Audio Atmosphere</p>
              <p className="text-white/50 mt-0.5 font-light">
                Analog synthesizer pads, 80s tape compression, and late-night ambient field recordings.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

