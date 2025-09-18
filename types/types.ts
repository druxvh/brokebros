// Full API response
export interface TmdbResponse<T = TmdbItem> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
  media_type?: "movie" | "tv"; // for trending endpoints
}

// One movie/TV item (within results)
// search response
export interface TmdbItem {
  id: number;
  media_type?: "movie" | "tv" | "person";

  // common fields
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  original_language?: string;
  genre_ids?: number[];
  popularity?: number;       // "hotness" score
  vote_average?: number;     // rating (0–10)
  vote_count?: number;       // number of votes
  adult: boolean;
  video?: boolean;

  // TV
  name?: string;
  original_name?: string;
  first_air_date?: string;

  // Movie
  title?: string;           // for movies
  original_title?: string;  // original movie title
  release_date?: string;    // movies

  // Person
  known_for?: TmdbItem[]; // for persons
}

// TV item by ID
export type TmdbTVItemById = {
  adult?: boolean
  backdrop_path?: string | null
  episode_run_time?: number[] // in minutes
  first_air_date?: string

  genres?: { id?: number; name?: string }[]

  id: number
  languages?: string[]
  last_air_date?: string
  name?: string
  number_of_seasons?: number
  number_of_episodes?: number
  original_name?: string
  overview?: string
  popularity?: number
  poster_path?: string | null

  seasons?: {
    id?: number
    name?: string
    season_number?: number
    episode_count?: number
    air_date?: string
    overview?: string
    poster_path?: string | null
    vote_average?: number
  }[]

  spoken_languages?: { english_name?: string; iso_639_1?: string; name?: string }[]
  tagline?: string
  homepage?: string
  media_type?: "tv"
  vote_average?: number
  vote_count?: number
}

// Movie item by ID
export type TmdbMovieItemById = {
  id: number;
  title?: string;
  original_title?: string;
  overview?: string;
  tagline?: string;
  homepage?: string;

  poster_path?: string | null;
  backdrop_path?: string | null;

  release_date?: string;
  runtime?: number; // in minutes
  budget?: number; // in USD
  revenue?: number; // in USD 
  adult?: boolean
  genres?: { id?: number; name?: string }[];

  spoken_languages?: { iso_639_1?: string; name?: string }[];

  vote_average?: number;
  vote_count?: number;
  popularity?: number;

  imdb_id?: string;
}