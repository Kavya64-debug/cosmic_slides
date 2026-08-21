import { useState, useEffect, useRef } from 'react';
import { Movie, Collection, VibeCategory, ToastMessage } from './types';
import { INITIAL_MOVIES, CURATED_COLLECTIONS, VIBE_CATEGORIES } from './data/moviesData';
import { TopAppBar } from './components/TopAppBar';
import { DiscoverView } from './components/DiscoverView';
import { FeedView } from './components/FeedView';
import { ProfileView } from './components/ProfileView';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { AiVibeSearchModal } from './components/AiVibeSearchModal';
import { CollectionModal } from './components/CollectionModal';
import { FloatingReactionBar } from './components/FloatingReactionBar';
import { BottomNavBar, NavTab } from './components/BottomNavBar';
import { ToastContainer } from './components/Toast';

export default function App() {
  const [movies] = useState<Movie[]>(INITIAL_MOVIES);
  const [activeTab, setActiveTab] = useState<NavTab>('discover');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persisted state
  const [savedMovieIds, setSavedMovieIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('cineswipe_saved');
      return stored ? JSON.parse(stored) : ['neon-pulse', 'quiet-contemplation'];
    } catch {
      return ['neon-pulse', 'quiet-contemplation'];
    }
  });

  const [likedMovieIds, setLikedMovieIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('cineswipe_liked');
      return stored ? JSON.parse(stored) : ['neon-pulse', 'ghost-shell'];
    } catch {
      return ['neon-pulse', 'ghost-shell'];
    }
  });

  // Modals state
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isAiSearchOpen, setIsAiSearchOpen] = useState(false);
  const [activeCollection, setActiveCollection] = useState<{
    title: string;
    subtitle?: string;
    tag?: string;
    movies: Movie[];
  } | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('cineswipe_saved', JSON.stringify(savedMovieIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedMovieIds]);

  useEffect(() => {
    try {
      localStorage.setItem('cineswipe_liked', JSON.stringify(likedMovieIds));
    } catch (e) {
      console.error(e);
    }
  }, [likedMovieIds]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Toggle Save / Watchlist
  const handleToggleSave = (movieId: string) => {
    const movie = movies.find((m) => m.id === movieId);
    const movieTitle = movie?.title || 'Film';

    setSavedMovieIds((prev) => {
      const exists = prev.includes(movieId);
      if (exists) {
        addToast({
          title: 'Removed from Watchlist',
          description: movieTitle,
          type: 'info',
        });
        return prev.filter((id) => id !== movieId);
      } else {
        addToast({
          title: 'Saved to Watchlist',
          description: `${movieTitle} added to your queue`,
          type: 'info',
        });
        return [...prev, movieId];
      }
    });
  };

  // Toggle Like
  const handleToggleLike = (movieId: string) => {
    const movie = movies.find((m) => m.id === movieId);
    const movieTitle = movie?.title || 'Film';

    setLikedMovieIds((prev) => {
      const exists = prev.includes(movieId);
      if (exists) {
        addToast({
          title: 'Removed from Favorites',
          description: movieTitle,
          type: 'pink',
        });
        return prev.filter((id) => id !== movieId);
      } else {
        addToast({
          title: 'Added to Favorites ❤️',
          description: `You loved ${movieTitle}`,
          type: 'pink',
        });
        return [...prev, movieId];
      }
    });
  };

  // Share Movie or App
  const handleShare = (movie?: Movie) => {
    const title = movie ? movie.title : 'CineSwipe';
    const text = movie
      ? `Check out "${movie.title}" (${movie.genre} • ${movie.year}) on CineSwipe!`
      : 'Explore CineSwipe: Atmospheric film discovery and mood curation';

    if (navigator.share) {
      navigator
        .share({
          title,
          text,
          url: window.location.href,
        })
        .catch(() => {
          // fallback
        });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      addToast({
        title: 'Link Copied to Clipboard',
        description: movie ? `Share link for ${movie.title}` : 'CineSwipe app link copied',
        type: 'info',
      });
    }
  };

  // Global reaction bar targeting: target first movie or currently open movie
  const currentFocusedMovie = selectedMovie || movies[0];
  const isCurrentLiked = currentFocusedMovie ? likedMovieIds.includes(currentFocusedMovie.id) : false;
  const isCurrentSaved = currentFocusedMovie ? savedMovieIds.includes(currentFocusedMovie.id) : false;

  // Open collection handler
  const handleOpenCollection = (collectionId: string) => {
    if (collectionId === 'late-night-thrills-col') {
      setActiveCollection({
        title: 'Late Night Thrills',
        subtitle: 'High-contrast neon lighting, pulse-pounding synths, and midnight velocity',
        tag: 'CURATED COLLECTION',
        movies: movies.filter(
          (m) => m.category === 'late_night' || m.genre === 'Thriller' || m.genre === 'Noir' || m.genre === 'Action' || m.genre === 'Sci-Fi'
        ),
      });
    } else if (collectionId === 'quiet-contemplation-col') {
      setActiveCollection({
        title: 'Sunday Morning Vibes',
        subtitle: 'Acoustic notes, warm natural sunlight, and reflective indie cinema',
        tag: 'CURATED COLLECTION',
        movies: movies.filter((m) => m.category === 'sunday_morning' || m.genre === 'Indie' || m.genre === 'Drama'),
      });
    }
  };

  const handleSelectVibe = (vibe: VibeCategory) => {
    setActiveCollection({
      title: `${vibe.name} Selection`,
      subtitle: vibe.description,
      tag: 'VIBE VAULT',
      movies: movies.filter((m) => (vibe.filterGenre ? m.genre === vibe.filterGenre || m.subGenres.includes(vibe.filterGenre) : true)),
    });
  };

  const handleAiSelectTitle = (title: string) => {
    const found = movies.find((m) => m.title.toLowerCase().includes(title.toLowerCase()));
    if (found) {
      setSelectedMovie(found);
    } else {
      setSearchQuery(title);
      setActiveTab('discover');
    }
  };

  const focusSearchInput = () => {
    setActiveTab('discover');
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const savedMovies = movies.filter((m) => savedMovieIds.includes(m.id));
  const likedMovies = movies.filter((m) => likedMovieIds.includes(m.id));

  return (
    <div className="min-h-screen bg-[#050505] text-[#d4d4d4] font-body antialiased selection:bg-[#8e7d5d] selection:text-black">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Top App Bar Header */}
      <TopAppBar
        onOpenAiSearch={() => setIsAiSearchOpen(true)}
        onFocusSearch={focusSearchInput}
        onLogoClick={() => {
          setActiveTab('discover');
          setSearchQuery('');
          setSelectedGenre('All');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Views */}
      {activeTab === 'discover' && (
        <DiscoverView
          movies={movies}
          collections={CURATED_COLLECTIONS}
          vibeCategories={VIBE_CATEGORIES}
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectMovie={(movie) => setSelectedMovie(movie)}
          onOpenCollection={handleOpenCollection}
          onSelectVibe={handleSelectVibe}
          onOpenAiSearch={() => setIsAiSearchOpen(true)}
          savedMovieIds={savedMovieIds}
          likedMovieIds={likedMovieIds}
          onToggleSave={handleToggleSave}
          onToggleLike={handleToggleLike}
          searchInputRef={searchInputRef}
        />
      )}

      {activeTab === 'feed' && (
        <FeedView
          movies={movies}
          onSelectMovie={(movie) => setSelectedMovie(movie)}
          onLikeMovie={handleToggleLike}
          onSaveMovie={handleToggleSave}
          onShareMovie={(movie) => handleShare(movie)}
        />
      )}

      {activeTab === 'profile' && (
        <ProfileView
          savedMovies={savedMovies}
          likedMovies={likedMovies}
          onSelectMovie={(movie) => setSelectedMovie(movie)}
          onRemoveSaved={handleToggleSave}
          onRemoveLiked={handleToggleLike}
          onOpenAiSearch={() => setIsAiSearchOpen(true)}
        />
      )}

      {/* Floating Reaction Bar (Right side, matching screenshot) */}
      {activeTab === 'discover' && (
        <FloatingReactionBar
          isLiked={isCurrentLiked}
          isSaved={isCurrentSaved}
          onToggleLike={() => currentFocusedMovie && handleToggleLike(currentFocusedMovie.id)}
          onToggleSave={() => currentFocusedMovie && handleToggleSave(currentFocusedMovie.id)}
          onShare={() => handleShare(currentFocusedMovie)}
        />
      )}

      {/* Bottom Floating Pill Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={savedMovieIds.length}
      />

      {/* Movie Details Modal (Trailer / Synopsis / AI DNA) */}
      <MovieDetailsModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        isLiked={selectedMovie ? likedMovieIds.includes(selectedMovie.id) : false}
        isSaved={selectedMovie ? savedMovieIds.includes(selectedMovie.id) : false}
        onToggleLike={handleToggleLike}
        onToggleSave={handleToggleSave}
        onShareMovie={(movie) => handleShare(movie)}
        onSelectMovie={(movie) => setSelectedMovie(movie)}
        allMovies={movies}
      />

      {/* AI Vibe Matcher Modal */}
      <AiVibeSearchModal
        isOpen={isAiSearchOpen}
        onClose={() => setIsAiSearchOpen(false)}
        onSelectMovieTitle={handleAiSelectTitle}
        allMovies={movies}
      />

      {/* Collection "See All" Modal */}
      <CollectionModal
        isOpen={!!activeCollection}
        onClose={() => setActiveCollection(null)}
        title={activeCollection?.title || ''}
        subtitle={activeCollection?.subtitle}
        tag={activeCollection?.tag}
        movies={activeCollection?.movies || []}
        onSelectMovie={(movie) => setSelectedMovie(movie)}
      />
    </div>
  );
}
