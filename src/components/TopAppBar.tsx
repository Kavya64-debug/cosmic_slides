import React from 'react';

interface TopAppBarProps {
  onOpenAiSearch: () => void;
  onFocusSearch: () => void;
  onLogoClick?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  onOpenAiSearch,
  onFocusSearch,
  onLogoClick,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 transition-all">
      <div className="flex items-center justify-between px-6 py-4 max-w-2xl mx-auto">
        <button
          onClick={onLogoClick}
          className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
        >
          <div className="w-8 h-8 rounded border border-[#8e7d5d]/40 bg-[#121212] flex items-center justify-center text-[#8e7d5d] group-hover:border-[#c8b99d] group-hover:text-[#c8b99d] transition-all">
            <span className="material-symbols-outlined text-lg" data-icon="movie">
              movie
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="h-[1px] w-3 bg-[#8e7d5d] hidden sm:inline-block"></span>
              <h1 className="font-serif italic text-2xl font-normal tracking-widest text-white flex items-center gap-1.5">
                CINESWIPE
              </h1>
            </div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-[#8e7d5d] font-medium hidden sm:block">
              Cinematic Archive • MMXXIV
            </p>
          </div>
        </button>

        <div className="flex items-center gap-3">
          {/* AI Vibe Matcher Button */}
          <button
            onClick={onOpenAiSearch}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121212] hover:bg-white hover:text-black border border-white/15 text-[#d4d4d4] text-[10px] uppercase tracking-[0.15em] font-medium transition-all cursor-pointer"
            title="Curator AI Vibe Matcher"
          >
            <span className="material-symbols-outlined text-sm text-[#8e7d5d]" data-icon="auto_awesome">
              auto_awesome
            </span>
            <span>Vibe AI</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={onFocusSearch}
            className="w-8 h-8 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center transition-colors text-[#d4d4d4] hover:text-white"
            aria-label="Search"
          >
            <span className="material-symbols-outlined text-base" data-icon="search">
              search
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

