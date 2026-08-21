import React from 'react';
import { motion } from 'motion/react';

interface FloatingReactionBarProps {
  isLiked: boolean;
  isSaved: boolean;
  onToggleLike: () => void;
  onToggleSave: () => void;
  onShare: () => void;
}

export const FloatingReactionBar: React.FC<FloatingReactionBarProps> = ({
  isLiked,
  isSaved,
  onToggleLike,
  onToggleSave,
  onShare,
}) => {
  return (
    <div className="fixed right-6 bottom-32 flex flex-col gap-3.5 z-40 pointer-events-auto">
      {/* Like Button */}
      <div className="flex flex-col items-center gap-1">
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.06 }}
          onClick={onToggleLike}
          className={`w-11 h-11 rounded-full backdrop-blur-xl flex items-center justify-center transition-all duration-300 border shadow-2xl cursor-pointer ${
            isLiked
              ? 'bg-[#8e7d5d] text-black border-[#8e7d5d] shadow-[0_0_20px_rgba(142,125,93,0.4)]'
              : 'bg-[#0a0a0a]/90 text-white/70 hover:text-white border-white/15 hover:border-white/40'
          }`}
          title={isLiked ? 'Liked' : 'Like'}
          aria-label="Like"
        >
          <span
            className={`material-symbols-outlined text-lg ${isLiked ? 'material-symbols-filled' : ''}`}
            data-icon="favorite"
          >
            favorite
          </span>
        </motion.button>
        <span className={`text-[8px] uppercase tracking-[0.2em] font-medium transition-colors ${isLiked ? 'text-[#c8b99d]' : 'text-white/40'}`}>
          {isLiked ? 'Saved' : 'Like'}
        </span>
      </div>

      {/* Save / Watchlist Button */}
      <div className="flex flex-col items-center gap-1">
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.06 }}
          onClick={onToggleSave}
          className={`w-11 h-11 rounded-full backdrop-blur-xl flex items-center justify-center transition-all duration-300 border shadow-2xl cursor-pointer ${
            isSaved
              ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
              : 'bg-[#0a0a0a]/90 text-white/70 hover:text-white border-white/15 hover:border-white/40'
          }`}
          title={isSaved ? 'Archived' : 'Archive'}
          aria-label="Save"
        >
          <span
            className={`material-symbols-outlined text-lg ${isSaved ? 'material-symbols-filled' : ''}`}
            data-icon="add_to_photos"
          >
            {isSaved ? 'bookmark_added' : 'bookmark_border'}
          </span>
        </motion.button>
        <span className={`text-[8px] uppercase tracking-[0.2em] font-medium transition-colors ${isSaved ? 'text-white' : 'text-white/40'}`}>
          {isSaved ? 'In Index' : 'Add'}
        </span>
      </div>

      {/* Share Button */}
      <div className="flex flex-col items-center gap-1">
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.06 }}
          onClick={onShare}
          className="w-11 h-11 rounded-full bg-[#0a0a0a]/90 backdrop-blur-xl flex items-center justify-center text-white/70 hover:text-white border border-white/15 hover:border-white/40 transition-all duration-300 shadow-2xl cursor-pointer"
          title="Share Archive"
          aria-label="Share"
        >
          <span className="material-symbols-outlined text-lg" data-icon="share">
            share
          </span>
        </motion.button>
        <span className="text-[8px] uppercase tracking-[0.2em] text-white/40 font-medium">Share</span>
      </div>
    </div>
  );
};

