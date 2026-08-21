export interface Movie {
  id: string;
  title: string;
  year: number | string;
  genre: string;
  subGenres: string[];
  duration: string;
  rating: number; // e.g. 8.9 / 10
  director: string;
  cast: string[];
  synopsis: string;
  posterUrl: string;
  backdropUrl?: string;
  trailerUrl?: string;
  aspectRatioClass?: string;
  mood: string; // e.g. "Late Night Thrill", "Quiet Contemplation", "High Octane"
  moodTags: string[];
  matchScore?: number; // e.g. 96%
  isFeatured?: boolean;
  category: 'late_night' | 'sunday_morning' | 'trending' | 'indie_gold' | 'cyberpunk';
  likesCount: number;
  qualityBadge?: string; // "4K HDR", "DOLBY ATMOS", "IMAX"
}

export interface Collection {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  coverImage: string;
  movieCount: number;
  themeColor: string;
  description: string;
  featuredMovieId: string;
}

export interface VibeCategory {
  id: string;
  name: string;
  movieCount: number;
  icon: string;
  theme: 'tertiary' | 'primary' | 'secondary' | 'accent';
  description: string;
  filterGenre?: string;
}

export interface AIRecommendation {
  title: string;
  genre: string;
  year: string;
  matchScore: number;
  vibeAnalysis: string;
  recommendedFor: string;
  moodTags?: string[];
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'pink';
}
