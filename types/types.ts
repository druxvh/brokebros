// One movie/TV item
export interface TmdbItem {
    id: number;
    title?: string;           // for movies
    name?: string;            // for TV shows
    original_title?: string;  // original movie title
    original_name?: string;   // original TV show name
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    media_type?: "movie" | "tv" | "person";
    original_language: string;
    genre_ids: number[];
    popularity: number;       // "hotness" score
    release_date?: string;    // movies
    first_air_date?: string;  // TV shows
    vote_average: number;     // rating (0–10)
    vote_count: number;       // number of votes
    adult?: boolean;
    video?: boolean;
}

// Full API response
export interface TmdbResponse {
    page: number;
    results: TmdbItem[];
    total_pages: number;
    total_results: number;
}

export type TmdbTVItem = {
  id: number
  name: string
  original_name: string
  overview: string
  tagline?: string
  homepage?: string

  poster_path?: string | null
  backdrop_path?: string | null

  first_air_date?: string
  last_air_date?: string
  type: string

  number_of_seasons: number
  number_of_episodes: number
  seasons: {
    id: number
    name: string
    season_number: number
    episode_count: number
    air_date?: string
    overview?: string
    poster_path?: string | null
    vote_average?: number
  }[]

  genres: { id: number; name: string }[]

  created_by: { id: number; name: string; profile_path?: string | null }[]
  languages: string[]

  vote_average: number
  vote_count: number
  popularity: number

  last_episode_to_air?: {
    id: number
    name: string
    overview: string
    air_date?: string
    season_number: number
    episode_number: number
    still_path?: string | null
    vote_average?: number
  } | null

  
}
