import React, { useRef } from 'react';

interface SearchBarProps {
  query: string;
  setQuery: (q: string) => void;
  onOpenAiSearch: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  setQuery,
  onOpenAiSearch,
  inputRef,
}) => {
  const localRef = useRef<HTMLInputElement>(null);
  const activeInputRef = inputRef || localRef;

  return (
    <div className="relative mb-8">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-white/40 text-lg" data-icon="search">
            search
          </span>
        </div>

        <input
          ref={activeInputRef as any}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the archive by title, director, or cinematic motif..."
          className="w-full bg-[#0d0d0d] border border-white/10 rounded-full py-3.5 pl-12 pr-24 text-sm text-[#d4d4d4] placeholder-white/30 focus:outline-none focus:border-[#8e7d5d] focus:ring-1 focus:ring-[#8e7d5d]/40 transition-all font-light tracking-wide shadow-2xl"
        />

        <div className="absolute inset-y-0 right-2.5 flex items-center gap-1.5">
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 text-white/40 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              title="Clear"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          ) : (
            <button
              onClick={onOpenAiSearch}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161616] border border-[#8e7d5d]/40 text-[#c8b99d] text-[10px] uppercase tracking-[0.15em] font-medium hover:bg-[#8e7d5d] hover:text-black transition-all cursor-pointer"
              title="Curator AI Vibe Search"
            >
              <span className="material-symbols-outlined text-xs">auto_awesome</span>
              <span>AI</span>
            </button>
          )}
        </div>
      </div>

      {query && (
        <div className="mt-2.5 flex items-center justify-between px-3 text-[11px] text-[#8e7d5d]">
          <span className="uppercase tracking-[0.1em]">Archive index filter: &ldquo;{query}&rdquo;</span>
          <button
            onClick={() => setQuery('')}
            className="text-[#d4d4d4] hover:text-white uppercase tracking-widest text-[10px] border-b border-white/20"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

