import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AIRecommendation, Movie } from '../types';

interface AiVibeSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMovieTitle: (title: string) => void;
  allMovies: Movie[];
}

const PRESET_VIBES = [
  'Rainy midnight noir with analog Moog synthesizers',
  'Sun-drenched quiet Mediterranean afternoon',
  'Mind-bending metaphysical sci-fi and existential questions',
  'High-tension nocturnal getaway heist in neon rain',
  'Smoky 1980s European espionage and shadow play',
  'Deep-space monolith exploration with ambient drone score',
];

export const AiVibeSearchModal: React.FC<AiVibeSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectMovieTitle,
  allMovies,
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [curatorNote, setCuratorNote] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (customPrompt?: string) => {
    const q = customPrompt || promptInput;
    if (!q.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          existingMovies: allMovies.map((m) => ({
            title: m.title,
            genre: m.genre,
            year: m.year,
            mood: m.mood,
          })),
        }),
      });

      const data = await res.json();
      if (data.recommendations) {
        setRecommendations(data.recommendations);
        setCuratorNote(data.aiCuratorNote || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6">
        <div className="fixed inset-0" onClick={onClose}></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="relative w-full max-w-xl bg-[#080808] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.95)] z-10 text-[#d4d4d4]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#141414] border border-[#8e7d5d]/40 flex items-center justify-center text-[#8e7d5d]">
                <span className="material-symbols-outlined text-xl" data-icon="auto_awesome">
                  auto_awesome
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif italic text-xl font-light text-white flex items-center gap-2">
                    Curator Vibe Matcher
                  </h3>
                  <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-black text-[#8e7d5d] border border-white/10 tracking-widest">
                    Gemini AI
                  </span>
                </div>
                <p className="text-[11px] text-white/50 font-light mt-0.5">
                  Describe what you desire to experience or contemplate.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/60 text-white/50 hover:text-white flex items-center justify-center transition-colors border border-white/10 text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mb-4">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. Atmospheric 3 AM neo-noir detective thriller..."
              className="w-full bg-[#121212] border border-white/15 rounded-full py-3.5 pl-5 pr-28 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#8e7d5d] transition-all font-light"
            />
            <button
              onClick={() => handleSearch()}
              disabled={loading || !promptInput.trim()}
              className="absolute right-2 top-1.5 bottom-1.5 px-5 rounded-full bg-white text-black font-medium text-[10px] uppercase tracking-[0.2em] flex items-center gap-1 hover:bg-white/80 disabled:opacity-40 transition-all cursor-pointer"
            >
              {loading ? (
                <span className="animate-spin text-xs">✦</span>
              ) : (
                <>
                  <span>Match</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </>
              )}
            </button>
          </div>

          {/* Preset Prompts */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-[1px] w-4 bg-[#8e7d5d]"></span>
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#8e7d5d]">
                Archival Inquiries
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_VIBES.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setPromptInput(preset);
                    handleSearch(preset);
                  }}
                  className="px-3 py-1.5 rounded-full bg-[#121212] hover:bg-white/10 hover:text-white border border-white/10 text-[10px] text-white/60 transition-all cursor-pointer text-left font-light"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Results section */}
          {loading && (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 rounded-full border border-[#8e7d5d] border-t-transparent animate-spin mx-auto" />
              <p className="font-serif italic text-sm text-[#c8b99d]">
                Synthesizing cinematic atmosphere...
              </p>
              <p className="text-[11px] text-white/40 font-light">Analyzing rhythm, cinematography, and tonal textures</p>
            </div>
          )}

          {!loading && hasSearched && recommendations.length > 0 && (
            <div className="space-y-3 max-h-72 overflow-y-auto hide-scrollbar pr-1">
              {curatorNote && (
                <div className="p-3.5 rounded-xl bg-[#121212] border border-[#8e7d5d]/30 text-xs text-[#c8b99d] font-serif italic">
                  &ldquo;{curatorNote}&rdquo;
                </div>
              )}

              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onSelectMovieTitle(rec.title);
                    onClose();
                  }}
                  className="p-4 rounded-xl bg-[#121212] hover:bg-[#181818] border border-white/10 hover:border-[#8e7d5d]/50 transition-all cursor-pointer group shadow-lg"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-serif italic text-base font-normal text-white group-hover:text-[#c8b99d] transition-colors">
                      {rec.title}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#181818] text-[#8e7d5d] text-[10px] font-mono border border-white/10">
                      {rec.matchScore}% MATCH
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#8e7d5d] mb-2 font-mono uppercase tracking-wider">
                    <span>{rec.genre}</span>
                    <span>•</span>
                    <span className="text-white/40">{rec.year}</span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed mb-2 font-light">
                    {rec.vibeAnalysis}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-white/40 font-light">
                    <span>{rec.recommendedFor}</span>
                    <span className="text-white font-medium group-hover:text-[#c8b99d] transition-colors uppercase tracking-widest text-[9px]">
                      Examine Record →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

