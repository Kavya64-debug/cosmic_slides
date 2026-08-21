import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Movie } from '../types';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  tag?: string;
  themeColor?: string;
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  tag,
  movies,
  onSelectMovie,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6">
        <div className="fixed inset-0" onClick={onClose}></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 15 }}
          className="relative w-full max-w-2xl bg-[#080808] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.95)] z-10 text-[#d4d4d4] max-h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-6">
            <div>
              {tag && (
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="h-[1px] w-4 bg-[#8e7d5d]"></span>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#8e7d5d] block">
                    {tag}
                  </span>
                </div>
              )}
              <h2 className="font-serif italic text-2xl sm:text-3xl font-light text-white tracking-wide">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs text-white/50 mt-1 font-light">{subtitle}</p>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/60 text-white/50 hover:text-white flex items-center justify-center transition-colors border border-white/10 text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Movies List / Masonry */}
          <div className="overflow-y-auto hide-scrollbar flex-1 pr-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {movies.map((movie) => (
                <motion.div
                  key={movie.id}
                  whileHover={{ y: -3 }}
                  onClick={() => {
                    onSelectMovie(movie);
                    onClose();
                  }}
                  className="rounded-xl overflow-hidden bg-[#121212] border border-white/10 hover:border-[#8e7d5d]/50 transition-all cursor-pointer group shadow-lg"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[9px] font-mono text-[#8e7d5d] border border-white/10">
                      ★ {movie.rating}
                    </span>
                  </div>
                  <div className="p-3.5">
                    <h4 className="font-serif italic text-sm font-normal text-white truncate group-hover:text-[#c8b99d] transition-colors">
                      {movie.title}
                    </h4>
                    <p className="text-[10px] text-white/40 mt-0.5 font-light">
                      {movie.genre} • {movie.year}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

