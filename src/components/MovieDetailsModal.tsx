import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Movie } from '../types';

interface MovieDetailsModalProps {
  movie: Movie | null;
  onClose: () => void;
  isLiked: boolean;
  isSaved: boolean;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
  onShareMovie: (movie: Movie) => void;
  onSelectMovie?: (movie: Movie) => void;
  allMovies?: Movie[];
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  onClose,
  isLiked,
  isSaved,
  onToggleLike,
  onToggleSave,
  onShareMovie,
  onSelectMovie,
  allMovies = [],
}) => {
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [aiBreakdown, setAiBreakdown] = useState<{
    cinematographyStyle?: string;
    soundPalette?: string;
    pacing?: string;
    idealVibe?: string;
  } | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    if (!movie) {
      setIsPlayingTrailer(false);
      setAiBreakdown(null);
      return;
    }

    // Fetch AI vibe breakdown
    setLoadingAi(true);
    fetch('/api/ai/vibe-breakdown', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        movieTitle: movie.title,
        movieGenre: movie.genre,
        synopsis: movie.synopsis,
      }),
    })
      .then((res) => res.json())
      .then((data) => setAiBreakdown(data))
      .catch(() => {
        setAiBreakdown({
          cinematographyStyle: 'High-contrast anamorphic 35mm framing with rich atmospheric chiaroscuro.',
          soundPalette: 'Analog synthesizers layered with deep sub-bass drones and ambient field recordings.',
          pacing: 'Atmospheric and deliberate tension built through measured visual pauses.',
          idealVibe: 'Headphones on, darkened sanctuary, late night.',
        });
      })
      .finally(() => setLoadingAi(false));
  }, [movie]);

  if (!movie) return null;

  const relatedMovies = allMovies
    .filter((m) => m.id !== movie.id && (m.genre === movie.genre || m.mood === movie.mood))
    .slice(0, 3);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop click dismiss */}
        <div className="fixed inset-0" onClick={onClose}></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-[#080808] border border-white/10 rounded-2xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.95)] z-10 my-auto text-[#d4d4d4]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Image / Trailer Container */}
          <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-black">
            {isPlayingTrailer ? (
              <div className="relative w-full h-full bg-[#050505] flex items-center justify-center">
                {/* Simulated film preview */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={movie.backdropUrl || movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover opacity-25 blur-sm scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/40 to-black/70" />
                </div>

                {/* Animated Film Pulse Preview */}
                <div className="relative z-10 text-center px-6">
                  <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 mx-auto flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-2xl text-[#8e7d5d] material-symbols-filled">
                      movie
                    </span>
                  </div>
                  <p className="font-serif italic text-xl font-light text-white tracking-wide">
                    Streaming {movie.title}
                  </p>
                  <p className="text-[10px] text-[#8e7d5d] mt-1 font-mono tracking-widest uppercase">
                    {movie.qualityBadge || '4K ARCHIVAL MASTER'} • DOLBY 7.1
                  </p>

                  <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="px-4 py-1.5 rounded-full bg-[#121212] text-[10px] uppercase tracking-wider font-medium border border-white/15 flex items-center gap-1.5 hover:border-white/30 text-white cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isMuted ? 'volume_off' : 'volume_up'}
                      </span>
                      <span>{isMuted ? 'Unmute' : 'Audio On'}</span>
                    </button>
                    <button
                      onClick={() => setIsPlayingTrailer(false)}
                      className="px-4 py-1.5 rounded-full bg-white text-black text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1.5 hover:bg-white/80 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">pause</span>
                      <span>Close Preview</span>
                    </button>
                  </div>
                </div>

                {/* Simulated Scrubber bar */}
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white/10">
                  <div className="h-full bg-[#8e7d5d] w-3/5" />
                </div>
              </div>
            ) : (
              <>
                <img
                  src={movie.backdropUrl || movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-black/30" />

                {/* Play Trailer overlay button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPlayingTrailer(true)}
                    className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl cursor-pointer hover:bg-transparent hover:text-white hover:border-white border border-white transition-all"
                    aria-label="Play Trailer"
                  >
                    <span className="material-symbols-outlined text-2xl material-symbols-filled ml-1">
                      play_arrow
                    </span>
                  </motion.button>
                </div>
              </>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/70 backdrop-blur-md text-white/70 hover:text-white flex items-center justify-center border border-white/15 transition-colors z-20 cursor-pointer text-xs"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Quality Pill */}
            {movie.qualityBadge && (
              <div className="absolute top-4 left-4 z-20 px-2.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-[9px] font-mono tracking-widest text-[#8e7d5d] border border-white/10">
                {movie.qualityBadge}
              </div>
            )}
          </div>

          {/* Modal Content Details */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto hide-scrollbar">
            {/* Title & Metadata Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[#8e7d5d] text-[10px] uppercase font-semibold tracking-[0.2em]">
                    {movie.genre}
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="text-white/50 text-xs">{movie.year}</span>
                  <span className="text-white/20">•</span>
                  <span className="text-white/50 text-xs">{movie.duration}</span>
                </div>
                <h2 className="font-serif italic text-3xl sm:text-4xl font-light tracking-wide text-white">
                  {movie.title}
                </h2>
              </div>

              {/* Rating & Match Score */}
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-full bg-[#121212] border border-white/10 flex items-center gap-1.5">
                  <span className="text-[#8e7d5d] font-serif italic">★</span>
                  <span className="font-light text-xs text-white">{movie.rating}</span>
                </div>
                {movie.matchScore && (
                  <div className="px-3 py-1 rounded-full bg-[#121212] border border-[#8e7d5d]/40 text-[#c8b99d] text-[10px] font-mono tracking-widest">
                    {movie.matchScore}% MATCH
                  </div>
                )}
              </div>
            </div>

            {/* Main Action CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsPlayingTrailer(true)}
                className="flex-1 min-w-[160px] py-3.5 px-6 rounded-full bg-white text-black font-medium text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-2xl hover:bg-transparent hover:text-white border border-white transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined material-symbols-filled text-base">
                  play_arrow
                </span>
                Experience Film
              </button>

              <button
                onClick={() => onToggleSave(movie.id)}
                className={`py-3.5 px-5 rounded-full font-medium text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-white text-black border-white'
                    : 'bg-[#121212] text-white border-white/15 hover:border-white/40'
                }`}
              >
                <span className={`material-symbols-outlined text-base ${isSaved ? 'material-symbols-filled' : ''}`}>
                  {isSaved ? 'bookmark_added' : 'bookmark_border'}
                </span>
                <span>{isSaved ? 'In Queue' : 'Add to Queue'}</span>
              </button>

              <button
                onClick={() => onToggleLike(movie.id)}
                className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                  isLiked
                    ? 'bg-[#8e7d5d] text-black border-[#8e7d5d]'
                    : 'bg-[#121212] text-white/70 border-white/15 hover:text-white hover:border-white/40'
                }`}
                title={isLiked ? 'Liked' : 'Like'}
              >
                <span className={`material-symbols-outlined text-lg ${isLiked ? 'material-symbols-filled' : ''}`}>
                  favorite
                </span>
              </button>

              <button
                onClick={() => onShareMovie(movie)}
                className="w-11 h-11 rounded-full bg-[#121212] text-white/70 hover:text-white border border-white/15 hover:border-white/40 flex items-center justify-center transition-all cursor-pointer"
                title="Share Film"
              >
                <span className="material-symbols-outlined text-lg">share</span>
              </button>
            </div>

            {/* Synopsis */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-[1px] w-4 bg-[#8e7d5d]"></span>
                <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#8e7d5d] font-semibold">
                  Synopsis
                </h3>
              </div>
              <p className="text-[#d4d4d4]/90 text-sm leading-relaxed font-light">
                {movie.synopsis}
              </p>
            </div>

            {/* Mood Tags */}
            <div className="flex flex-wrap gap-1.5">
              {movie.moodTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-[#121212] text-white/60 border border-white/10 text-[9px] uppercase tracking-wider font-light"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* AI Cinematic DNA Breakdown */}
            <div className="p-5 rounded-xl bg-[#0c0c0c] border border-white/10 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[#8e7d5d] font-serif italic text-base">✦</span>
                <h4 className="font-serif italic text-base font-light text-white tracking-wide">
                  Cinematic DNA Analysis
                </h4>
                {loadingAi && (
                  <span className="text-[9px] text-[#8e7d5d] animate-pulse font-mono ml-auto">
                    Analyzing composition...
                  </span>
                )}
              </div>

              {aiBreakdown && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-lg bg-[#141414] border border-white/5">
                    <p className="text-[#8e7d5d] text-[9px] uppercase tracking-[0.2em] font-medium mb-1">Visual Palette</p>
                    <p className="text-white/80 font-light leading-snug">
                      {aiBreakdown.cinematographyStyle}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#141414] border border-white/5">
                    <p className="text-[#8e7d5d] text-[9px] uppercase tracking-[0.2em] font-medium mb-1">Sound & Atmosphere</p>
                    <p className="text-white/80 font-light leading-snug">{aiBreakdown.soundPalette}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#141414] border border-white/5">
                    <p className="text-[#8e7d5d] text-[9px] uppercase tracking-[0.2em] font-medium mb-1">Pacing</p>
                    <p className="text-white/80 font-light leading-snug">{aiBreakdown.pacing}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#141414] border border-white/5">
                    <p className="text-[#8e7d5d] text-[9px] uppercase tracking-[0.2em] font-medium mb-1">Ideal Context</p>
                    <p className="text-white/80 font-light leading-snug">{aiBreakdown.idealVibe}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Cast & Director */}
            <div className="grid grid-cols-2 gap-4 text-xs text-white/60 pt-4 border-t border-white/10 font-light">
              <div>
                <p className="text-[#8e7d5d] text-[9px] uppercase tracking-[0.2em] font-semibold mb-1">Director</p>
                <p className="text-white">{movie.director}</p>
              </div>
              <div>
                <p className="text-[#8e7d5d] text-[9px] uppercase tracking-[0.2em] font-semibold mb-1">Starring</p>
                <p className="text-white">{movie.cast.join(', ')}</p>
              </div>
            </div>

            {/* Similar films in this vibe */}
            {relatedMovies.length > 0 && onSelectMovie && (
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-[1px] w-4 bg-[#8e7d5d]"></span>
                  <h4 className="font-serif italic text-base font-light text-white">
                    Related Series
                  </h4>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {relatedMovies.map((rel) => (
                    <button
                      key={rel.id}
                      onClick={() => onSelectMovie(rel)}
                      className="group text-left focus:outline-none cursor-pointer"
                    >
                      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[#121212] mb-1.5 border border-white/10 group-hover:border-[#8e7d5d] transition-all">
                        <img
                          src={rel.posterUrl}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <p className="font-serif italic text-xs text-white truncate group-hover:text-[#c8b99d]">
                        {rel.title}
                      </p>
                      <p className="text-[10px] text-white/40">{rel.year}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

