import List from "@/components/general/List";
import { MainCarousel } from "@/components/general/MainCarousel";
import { TmdbItem, TmdbResponse } from "@/types/types";

// export const dynamic = "force-dynamic";

export default async function Home() {
  const baseUrl = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
  const apikey = process.env.TMDB_API_KEY;

  // Helper: fetch multiple pages for one endpoint
  async function fetchPages(endpoint: string, pages = 3) {
    const requests = Array.from({ length: pages }, (_, i) =>
      fetch(`${endpoint}&page=${i + 1}`, { next: { revalidate: 86400 } })
    );
    const responses = await Promise.all(requests);
    const jsons: TmdbResponse<TmdbItem>[] = await Promise.all(
      responses.map((res) => (res.ok ? res.json() : { results: [] }))
    );

    // Flatten + dedupe by id
    const map = new Map<number, TmdbItem>();
    jsons.flatMap((r) => r.results ?? []).forEach((item) => {
      if (!map.has(item.id)) {
        map.set(item.id, item);
      }
    });

    return Array.from(map.values());
  }

  // Endpoints
  const endpoints = {
    trendingMovies: `${baseUrl}/trending/movie/week?api_key=${apikey}`,
    trendingTV: `${baseUrl}/trending/tv/week?api_key=${apikey}`,
    topRatedMovies: `${baseUrl}/movie/top_rated?api_key=${apikey}`,
    topRatedTV: `${baseUrl}/tv/top_rated?api_key=${apikey}`,
    trendingMoviesIN: `${baseUrl}/trending/movie/week?api_key=${apikey}&region=IN`,
    trendingTVIN: `${baseUrl}/trending/tv/week?api_key=${apikey}&with_origin_country=IN`,
    nowPlayingMovies: `${baseUrl}/movie/now_playing?api_key=${apikey}&region=IN`,
    onTheAirTV: `${baseUrl}/tv/on_the_air?api_key=${apikey}&with_origin_country=IN`,
  };

  // Normal single-page fetches
  const normalEndpoints = [
    endpoints.trendingMovies,
    endpoints.trendingTV,
    endpoints.topRatedMovies,
    endpoints.topRatedTV,
    endpoints.nowPlayingMovies,
    endpoints.onTheAirTV,
  ];

  const normalResponses = await Promise.all(
    normalEndpoints.map((url) =>
      fetch(url, { next: { revalidate: 86400 } })
    )
  );

  const [
    trendingMovies,
    trendingTV,
    topRatedMovies,
    topRatedTV,
    nowPlayingMovies,
    onTheAirTV,
  ]: TmdbResponse<TmdbItem>[] = await Promise.all(
    normalResponses.map((res) => (res.ok ? res.json() : { results: [] }))
  );

  // Multi-page fetches for India
  const [trendingMoviesIN, trendingTVIN] = await Promise.all([
    fetchPages(endpoints.trendingMoviesIN, 3),
    fetchPages(endpoints.trendingTVIN, 5),
  ]);

  // Merge both Indian movies + tv, sort by vote_average or popularity
  const mergedIndia: TmdbItem[] = [...trendingMoviesIN, ...trendingTVIN].sort(
    (a, b) => (b.popularity ?? 0) - (a.popularity ?? 0)
  );

  return (
    <div className="space-y-8">
      {/* Hero Carousel */}
      <MainCarousel data={mergedIndia} />

      {/* Indian Sections */}
      <List title="Trending TV Shows in India" data={trendingTVIN} />
      <List title="Trending Movies in India" data={trendingMoviesIN} />

      {/* Other Sections */}
      <List title="On the Air TV" data={onTheAirTV.results} />
      <List title="Now Playing (Movies)" data={nowPlayingMovies.results} />
      <List title="Trending TV Shows Worldwide" data={trendingTV.results} />
      <List title="Trending Movies Worldwide" data={trendingMovies.results} />
      <List title="Top Rated TV Shows" data={topRatedTV.results} />
      <List title="Top Rated Movies" data={topRatedMovies.results} />
    </div>
  );
}
