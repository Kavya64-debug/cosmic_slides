import React from 'react';
import { GENRE_FILTERS } from '../data/moviesData';

interface GenrePillsProps {
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
}

export const GenrePills: React.FC<GenrePillsProps> = ({
  selectedGenre,
  onSelectGenre,
}) => {
  return (
    <div className="flex overflow-x-auto gap-2.5 mb-10 hide-scrollbar -mx-6 px-6 scroll-smooth">
      {GENRE_FILTERS.map((genre) => {
        const isActive = selectedGenre === genre;
        return (
          <button
            key={genre}
            onClick={() => onSelectGenre(genre)}
            className={`flex-shrink-0 px-5 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer ${
              isActive
                ? 'bg-white text-black font-semibold border border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                : 'bg-[#0d0d0d] text-white/60 border border-white/10 hover:border-white/30 hover:text-white'
            }`}
          >
            {genre}
          </button>
        );
      })}
    </div>
  );
};

