import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Movie } from '../types';

interface FeedViewProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onLikeMovie: (id: string) => void;
  onSaveMovie: (id: string) => void;
  onShareMovie: (movie: Movie) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  movies,
  onSelectMovie,
  onLikeMovie,
  onSaveMovie,
  onShareMovie: _onShareMovie,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-150, 0, 150], [0.6, 1, 0.6]);
  const likeOpacity = useTransform(x, [10, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -10], [1, 0]);

  const activeMovie = movies[currentIndex % movies.length];
  const nextMovie = movies[(currentIndex + 1) % movies.length];

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    if (direction === 'right' && activeMovie) {
      onLikeMovie(activeMovie.id);
      onSaveMovie(activeMovie.id);
    }
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
      setSwipeDirection(null);
      x.set(0);
    }, 200);
  };

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      handleSwipe('right');
    } else if (info.offset.x < -100) {
      handleSwipe('left');
    }
  };

  if (!activeMovie) return null;

  return (
    <div className="max-w-md mx-auto px-4 pt-4 pb-28 min-h-[calc(100vh-140px)] flex flex-col justify-between">
      {/* Top Feed Info Bar */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8e7d5d]" />
          <p className="font-serif italic text-sm font-normal text-[#d4d4d4] tracking-widest uppercase">
            Curated Deck
          </p>
        </div>
        <div className="px-3 py-0.5 rounded-full bg-[#0a0a0a] text-[10px] font-mono text-[#8e7d5d] border border-white/10 tracking-widest">
          {((currentIndex % movies.length) + 1)} <span className="text-white/20">/</span> {movies.length}
        </div>
      </div>

      {/* Swipeable Card Stage */}
      <div className="relative w-full aspect-[9/13] max-h-[540px] my-auto">
        {/* Next Card Background (for 3D depth) */}
        {nextMovie && (
          <div className="absolute inset-0 rounded-2xl overflow-hidden bg-[#0a0a0a] scale-95 translate-y-3 opacity-40 border border-white/5 pointer-events-none shadow-2xl">
            <img
              src={nextMovie.posterUrl}
              alt={nextMovie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/50 to-transparent" />
          </div>
        )}

        {/* Active Front Card */}
        <AnimatePresence>
          <motion.div
            key={activeMovie.id}
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] cursor-grab active:cursor-grabbing select-none"
          >
            {/* Poster / Video simulation */}
            <div className="relative w-full h-full">
              <img
                src={activeMovie.posterUrl}
                alt={activeMovie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
              <div className="absolute top-0 left-0 w-full h-full subtle-grid-bg opacity-30 pointer-events-none" />

              {/* Swipe Direction Stamps */}
              <motion.div
                style={{ opacity: likeOpacity }}
                className="absolute top-8 right-8 z-30 px-5 py-2 rounded-full border border-[#8e7d5d] bg-black/80 text-[#c8b99d] font-bold text-xs uppercase tracking-[0.2em] -rotate-6 pointer-events-none backdrop-blur-md shadow-2xl"
              >
                ✦ ARCHIVE
              </motion.div>

              <motion.div
                style={{ opacity: nopeOpacity }}
                className="absolute top-8 left-8 z-30 px-5 py-2 rounded-full border border-white/20 bg-black/80 text-white/60 font-bold text-xs uppercase tracking-[0.2em] rotate-6 pointer-events-none backdrop-blur-md shadow-2xl"
              >
                PASS
              </motion.div>

              {/* Top Details Pills */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
                <span className="px-2.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-[9px] font-mono tracking-widest text-[#c8b99d] border border-white/10">
                  {activeMovie.genre}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[10px] text-white/90 border border-white/10 flex items-center gap-1 font-light">
                  <span className="text-[#8e7d5d] font-serif italic">★</span> {activeMovie.rating}
                  {activeMovie.matchScore && (
                    <span className="text-[#8e7d5d] font-mono ml-1">{activeMovie.matchScore}%</span>
                  )}
                </span>
              </div>

              {/* Bottom Card Content */}
              <div className="absolute bottom-0 inset-x-0 p-6 z-20 space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="h-[1px] w-4 bg-[#8e7d5d]"></span>
                    <span className="text-[9px] uppercase tracking-[0.25em] text-[#8e7d5d] font-semibold">
                      {activeMovie.year} • {activeMovie.duration}
                    </span>
                  </div>
                  <h3 className="font-serif italic text-3xl sm:text-4xl font-light text-white leading-tight">
                    {activeMovie.title}
                  </h3>
                  <p className="text-xs text-[#d4d4d4]/70 line-clamp-2 mt-1.5 font-light leading-relaxed">
                    {activeMovie.synopsis}
                  </p>
                </div>

                {/* Mood pills */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {activeMovie.moodTags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full bg-black/60 text-[9px] uppercase tracking-wider text-white/60 border border-white/10"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Quick Expand details button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMovie(activeMovie);
                  }}
                  className="w-full py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] font-medium text-white flex items-center justify-center gap-2 border border-white/15 transition-colors cursor-pointer"
                >
                  <span>Explore Archival Record</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Controls Bar */}
      <div className="flex items-center justify-center gap-5 mt-4 px-2">
        {/* Pass Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => handleSwipe('left')}
          className="w-13 h-13 rounded-full bg-[#0a0a0a] text-white/60 hover:text-white border border-white/15 flex items-center justify-center shadow-xl transition-all cursor-pointer"
          title="Pass"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </motion.button>

        {/* Play Film Details */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          onClick={() => onSelectMovie(activeMovie)}
          className="px-7 py-3.5 rounded-full bg-white text-black text-[10px] uppercase tracking-[0.2em] font-medium flex items-center gap-2 shadow-2xl cursor-pointer hover:bg-transparent hover:text-white hover:border-white border border-white transition-all"
        >
          <span className="material-symbols-outlined text-base material-symbols-filled">
            play_arrow
          </span>
          <span>View Archive</span>
        </motion.button>

        {/* Like & Save Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => handleSwipe('right')}
          className="w-13 h-13 rounded-full bg-[#0a0a0a] hover:bg-[#8e7d5d] text-[#c8b99d] hover:text-black border border-[#8e7d5d]/40 flex items-center justify-center shadow-xl transition-all cursor-pointer"
          title="Like & Save"
        >
          <span className="material-symbols-outlined text-xl material-symbols-filled">
            favorite
          </span>
        </motion.button>
      </div>
    </div>
  );
};

