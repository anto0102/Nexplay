import { Movie, TVShow, MovieDetails, TVShowDetails, Credits, Video, TMDBResponse, Genre, SearchResultItem } from './types';

const TMDB_API_KEY = '2d082597ab951b3a9596ca23e71413a8';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const IMAGE_SIZES = {
  backdrop: {
    w300: `${TMDB_IMAGE_BASE_URL}/w300`,
    w780: `${TMDB_IMAGE_BASE_URL}/w780`,
    w1280: `${TMDB_IMAGE_BASE_URL}/w1280`,
    original: `${TMDB_IMAGE_BASE_URL}/original`,
  },
  poster: {
    w92: `${TMDB_IMAGE_BASE_URL}/w92`,
    w154: `${TMDB_IMAGE_BASE_URL}/w154`,
    w185: `${TMDB_IMAGE_BASE_URL}/w185`,
    w342: `${TMDB_IMAGE_BASE_URL}/w342`,
    w500: `${TMDB_IMAGE_BASE_URL}/w500`,
    w780: `${TMDB_IMAGE_BASE_URL}/w780`,
    original: `${TMDB_IMAGE_BASE_URL}/original`,
  },
  profile: {
    w45: `${TMDB_IMAGE_BASE_URL}/w45`,
    w185: `${TMDB_IMAGE_BASE_URL}/w185`,
    h632: `${TMDB_IMAGE_BASE_URL}/h632`,
    original: `${TMDB_IMAGE_BASE_URL}/original`,
  },
};

async function fetchFromTMDB<T>(endpoint: string): Promise<T> {
  try {
    // Handle URLs that already have query parameters
    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${TMDB_BASE_URL}${endpoint}${separator}api_key=${TMDB_API_KEY}&language=it-IT`;
    console.log('Fetching from TMDB:', endpoint);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`TMDB API error:`, {
        status: response.status,
        statusText: response.statusText,
        url: url.replace(TMDB_API_KEY, '[HIDDEN]'),
        error: errorText
      });

      // Return mock data for development if API fails
      if (response.status === 401) {
        console.warn('TMDB API Unauthorized - using mock data');
        return getMockData(endpoint) as T;
      }

      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    // Fallback to mock data
    return getMockData(endpoint) as T;
  }
}

// Mock data function for fallback
function getMockData(endpoint: string): unknown {
  const mockMovie = {
    id: 1,
    title: 'Film di Esempio',
    name: 'Serie di Esempio',
    overview: 'Questo è un contenuto di esempio quando l\'API TMDB non è disponibile.',
    poster_path: null,
    backdrop_path: null,
    release_date: '2024-01-01',
    first_air_date: '2024-01-01',
    vote_average: 8.5,
    vote_count: 1000,
    genre_ids: [28, 12],
    adult: false,
    original_language: 'en',
    popularity: 100,
    video: false,
    origin_country: ['US']
  };

  if (endpoint.includes('/trending/') || endpoint.includes('/popular') || endpoint.includes('/top_rated') || endpoint.includes('/discover')) {
    return {
      page: 1,
      results: Array(20).fill(0).map((_, i) => ({
        ...mockMovie,
        id: i + 1,
        title: `${mockMovie.title} ${i + 1}`,
        name: `${mockMovie.name} ${i + 1}`,
      })),
      total_pages: 1,
      total_results: 20
    };
  }

  // Handle search endpoints
  if (endpoint.includes('/search/')) {
    return {
      page: 1,
      results: Array(5).fill(0).map((_, i) => ({
        ...mockMovie,
        id: i + 1,
        title: `Risultato Ricerca ${i + 1}`,
        name: `Serie Ricerca ${i + 1}`,
        media_type: i % 2 === 0 ? 'movie' : 'tv',
      })),
      total_pages: 1,
      total_results: 5
    };
  }

  return mockMovie;
}

// Movies
export async function getTrendingMovies(): Promise<TMDBResponse<Movie>> {
  return fetchFromTMDB('/trending/movie/week');
}

export async function getPopularMovies(): Promise<TMDBResponse<Movie>> {
  return fetchFromTMDB('/movie/popular');
}

export async function getTopRatedMovies(): Promise<TMDBResponse<Movie>> {
  return fetchFromTMDB('/movie/top_rated');
}

export async function getUpcomingMovies(): Promise<TMDBResponse<Movie>> {
  return fetchFromTMDB('/movie/upcoming');
}

export async function getNowPlayingMovies(): Promise<TMDBResponse<Movie>> {
  return fetchFromTMDB('/movie/now_playing');
}

export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  return fetchFromTMDB(`/movie/${movieId}`);
}

export async function getMovieCredits(movieId: number): Promise<Credits> {
  return fetchFromTMDB(`/movie/${movieId}/credits`);
}

export async function getMovieVideos(movieId: number): Promise<{ results: Video[] }> {
  return fetchFromTMDB(`/movie/${movieId}/videos`);
}

export async function getMovieRecommendations(movieId: number): Promise<TMDBResponse<Movie>> {
  return fetchFromTMDB(`/movie/${movieId}/recommendations`);
}

export async function getSimilarMovies(movieId: number): Promise<TMDBResponse<Movie>> {
  return fetchFromTMDB(`/movie/${movieId}/similar`);
}

// TV Shows
export async function getTrendingTVShows(): Promise<TMDBResponse<TVShow>> {
  return fetchFromTMDB('/trending/tv/week');
}

export async function getPopularTVShows(): Promise<TMDBResponse<TVShow>> {
  return fetchFromTMDB('/tv/popular');
}

export async function getTopRatedTVShows(): Promise<TMDBResponse<TVShow>> {
  return fetchFromTMDB('/tv/top_rated');
}

export async function getTVShowDetails(tvId: number): Promise<TVShowDetails> {
  return fetchFromTMDB(`/tv/${tvId}`);
}

export async function getTVShowCredits(tvId: number): Promise<Credits> {
  return fetchFromTMDB(`/tv/${tvId}/credits`);
}

export async function getTVShowVideos(tvId: number): Promise<{ results: Video[] }> {
  return fetchFromTMDB(`/tv/${tvId}/videos`);
}

export async function getTVShowRecommendations(tvId: number): Promise<TMDBResponse<TVShow>> {
  return fetchFromTMDB(`/tv/${tvId}/recommendations`);
}

export async function getSimilarTVShows(tvId: number): Promise<TMDBResponse<TVShow>> {
  return fetchFromTMDB(`/tv/${tvId}/similar`);
}

// Genres
export async function getMovieGenres(): Promise<{ genres: Genre[] }> {
  return fetchFromTMDB('/genre/movie/list');
}

export async function getTVGenres(): Promise<{ genres: Genre[] }> {
  return fetchFromTMDB('/genre/tv/list');
}

// Search
export async function searchMovies(query: string): Promise<TMDBResponse<Movie>> {
  return fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}`);
}

export async function searchTVShows(query: string): Promise<TMDBResponse<TVShow>> {
  return fetchFromTMDB(`/search/tv?query=${encodeURIComponent(query)}`);
}

// Discover
export async function discoverMovies(params: {
  genre?: number;
  year?: number;
  sortBy?: string;
}): Promise<TMDBResponse<Movie>> {
  const queryParams = new URLSearchParams();
  if (params.genre) queryParams.append('with_genres', params.genre.toString());
  if (params.year) queryParams.append('year', params.year.toString());
  if (params.sortBy) queryParams.append('sort_by', params.sortBy);

  return fetchFromTMDB(`/discover/movie?${queryParams.toString()}`);
}

export async function discoverTVShows(params: {
  genre?: number;
  year?: number;
  sortBy?: string;
}): Promise<TMDBResponse<TVShow>> {
  const queryParams = new URLSearchParams();
  if (params.genre) queryParams.append('with_genres', params.genre.toString());
  if (params.year) queryParams.append('first_air_date_year', params.year.toString());
  if (params.sortBy) queryParams.append('sort_by', params.sortBy);

  return fetchFromTMDB(`/discover/tv?${queryParams.toString()}`);
}

// Search multi function
export async function searchMulti(query: string): Promise<TMDBResponse<SearchResultItem>> {
  const encodedQuery = encodeURIComponent(query);
  return fetchFromTMDB(`/search/multi?query=${encodedQuery}`);
}

// Utility functions with optimized sizes for responsive design
export function getImageUrl(path: string | null, size: string = 'w500'): string {
  if (!path) {
    // Return a data URI for a simple placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgdmlld0JveD0iMCAwIDUwMCA3NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUwMCIgaGVpZ2h0PSI3NTAiIGZpbGw9IiMxMTExMTEiLz48cGF0aCBkPSJNMjAwIDMwMEwzMDAgMzc1TDIwMCA0NTBWMzAwWiIgZmlsbD0iIzY2NjY2NiIvPjx0ZXh0IHg9IjI1MCIgeT0iNTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2NjY2IiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPkltbWFnaW5lIG5vbiBkaXNwb25pYmlsZTwvdGV4dD48L3N2Zz4=';
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function getBackdropUrl(path: string | null, size: string = 'w1280'): string {
  if (!path) {
    // Return a data URI for a backdrop placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI3MjAiIHZpZXdCb3g9IjAgMCAxMjgwIDcyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI3MjAiIGZpbGw9IiMxMTExMTEiLz48cGF0aCBkPSJNNTAwIDI4MEw3MjAgMzYwTDUwMCA0NDBWMjgwWiIgZmlsbD0iIzQ0NDQ0NCIvPjx0ZXh0IHg9IjY0MCIgeT0iNDIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2NjY2IiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0iQXJpYWwiPkltbWFnaW5lIG5vbiBkaXNwb25pYmlsZTwvdGV4dD48L3N2Zz4=';
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

// Optimized function for responsive images - returns appropriate sizes based on viewport
export function getOptimizedImageUrl(path: string | null, type: 'poster' | 'backdrop' = 'poster'): {
  src: string;
  srcset: string;
  sizes: string;
} {
  if (!path) {
    const placeholder = type === 'poster'
      ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgdmlld0JveD0iMCAwIDUwMCA3NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUwMCIgaGVpZ2h0PSI3NTAiIGZpbGw9IiMxMTExMTEiLz48cGF0aCBkPSJNMjAwIDMwMEwzMDAgMzc1TDIwMCA0NTBWMzAwWiIgZmlsbD0iIzY2NjY2NiIvPjx0ZXh0IHg9IjI1MCIgeT0iNTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2NjY2IiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPkltbWFnaW5lIG5vbiBkaXNwb25pYmlsZTwvdGV4dD48L3N2Zz4='
      : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI3MjAiIHZpZXdCb3g9IjAgMCAxMjgwIDcyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI3MjAiIGZpbGw9IiMxMTExMTEiLz48cGF0aCBkPSJNNTAwIDI4MEw3MjAgMzYwTDUwMCA0NDBWMjgwWiIgZmlsbD0iIzQ0NDQ0NCIvPjx0ZXh0IHg9IjY0MCIgeT0iNDIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2NjY2IiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0iQXJpYWwiPkltbWFnaW5lIG5vbiBkaXNwb25pYmlsZTwvdGV4dD48L3N2Zz4=';

    return {
      src: placeholder,
      srcset: placeholder,
      sizes: '100vw'
    };
  }

  if (type === 'poster') {
    return {
      src: `${TMDB_IMAGE_BASE_URL}/w342${path}`,
      srcset: [
        `${TMDB_IMAGE_BASE_URL}/w185${path} 185w`,
        `${TMDB_IMAGE_BASE_URL}/w342${path} 342w`,
        `${TMDB_IMAGE_BASE_URL}/w500${path} 500w`
      ].join(', '),
      sizes: '(max-width: 640px) 185px, (max-width: 1024px) 342px, 500px'
    };
  } else {
    return {
      src: `${TMDB_IMAGE_BASE_URL}/w780${path}`,
      srcset: [
        `${TMDB_IMAGE_BASE_URL}/w300${path} 300w`,
        `${TMDB_IMAGE_BASE_URL}/w780${path} 780w`,
        `${TMDB_IMAGE_BASE_URL}/w1280${path} 1280w`
      ].join(', '),
      sizes: '(max-width: 768px) 300px, (max-width: 1200px) 780px, 1280px'
    };
  }
}