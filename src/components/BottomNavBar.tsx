import React from 'react';

export type NavTab = 'feed' | 'discover' | 'profile';

interface BottomNavBarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  savedCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  savedCount = 0,
}) => {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/15 rounded-full px-8 py-3 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex justify-between items-center">
      {/* Feed (CineSwipe Reel / Swipe Deck) */}
      <button
        onClick={() => onSelectTab('feed')}
        className={`flex flex-col items-center gap-1 group relative transition-colors cursor-pointer ${
          activeTab === 'feed' ? 'text-white' : 'text-white/40 hover:text-white/80'
        }`}
      >
        {activeTab === 'feed' && (
          <div className="absolute -top-1.5 w-1 h-1 bg-[#8e7d5d] rounded-full shadow-[0_0_8px_#8e7d5d]"></div>
        )}
        <span
          className={`material-symbols-outlined text-xl transition-transform duration-200 group-hover:scale-105 ${
            activeTab === 'feed' ? 'material-symbols-filled text-white' : 'text-white/40'
          }`}
          data-icon="play_circle"
        >
          play_circle
        </span>
        <span className={`text-[8px] uppercase tracking-[0.2em] ${activeTab === 'feed' ? 'text-[#c8b99d] font-semibold' : 'text-white/40'}`}>
          Reel
        </span>
      </button>

      {/* Discover (Home Grid matching screenshot) */}
      <button
        onClick={() => onSelectTab('discover')}
        className={`flex flex-col items-center gap-1 relative group transition-colors cursor-pointer ${
          activeTab === 'discover' ? 'text-white' : 'text-white/40 hover:text-white/80'
        }`}
      >
        {activeTab === 'discover' && (
          <div className="absolute -top-1.5 w-1 h-1 bg-[#8e7d5d] rounded-full shadow-[0_0_8px_#8e7d5d]"></div>
        )}
        <span
          className={`material-symbols-outlined text-xl transition-transform duration-200 group-hover:scale-105 ${
            activeTab === 'discover' ? 'material-symbols-filled text-white' : 'text-white/40'
          }`}
          data-icon="explore"
        >
          explore
        </span>
        <span className={`text-[8px] uppercase tracking-[0.2em] ${activeTab === 'discover' ? 'text-[#c8b99d] font-semibold' : 'text-white/40'}`}>
          Discover
        </span>
      </button>

      {/* Profile (Watchlist & Taste Profile) */}
      <button
        onClick={() => onSelectTab('profile')}
        className={`flex flex-col items-center gap-1 relative group transition-colors cursor-pointer ${
          activeTab === 'profile' ? 'text-white' : 'text-white/40 hover:text-white/80'
        }`}
      >
        {activeTab === 'profile' && (
          <div className="absolute -top-1.5 w-1 h-1 bg-[#8e7d5d] rounded-full shadow-[0_0_8px_#8e7d5d]"></div>
        )}
        <div className="relative">
          <span
            className={`material-symbols-outlined text-xl transition-transform duration-200 group-hover:scale-105 ${
              activeTab === 'profile' ? 'material-symbols-filled text-white' : 'text-white/40'
            }`}
            data-icon="person"
          >
            person
          </span>
          {savedCount > 0 && (
            <span className="absolute -top-1 -right-2.5 bg-[#8e7d5d] text-black text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {savedCount}
            </span>
          )}
        </div>
        <span className={`text-[8px] uppercase tracking-[0.2em] ${activeTab === 'profile' ? 'text-[#c8b99d] font-semibold' : 'text-white/40'}`}>
          Archive
        </span>
      </button>
    </nav>
  );
};

