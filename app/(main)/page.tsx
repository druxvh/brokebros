import List from "@/components/general/List";
import Loader from "@/components/general/Loader";
import { MainCarousel } from "@/components/general/MainCarousel";
import { TmdbItem, TmdbResponse } from "@/types/types";
import { Suspense } from "react";

export default async function Home() {

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const [movieRes, tvRes] = await Promise.all([
    fetch(`${baseUrl}/api/trending/movie/day`, { next: { revalidate: 3600 } }), // 1 hour
    fetch(`${baseUrl}/api/trending/tv/day`, { next: { revalidate: 3600 } }),
  ]);

  // handle partial failure: prefer to show whatever succeeds, or throw if both fail
  if (!movieRes.ok && !tvRes.ok) {
    throw new Error("Failed to fetch trending movie and tv");
  }

  const [movie, tv]: [TmdbResponse<TmdbItem>, TmdbResponse<TmdbItem>] = await Promise.all([
    movieRes.ok ? movieRes.json() : { results: [] },
    tvRes.ok ? tvRes.json() : { results: [] },
  ]);

  const data: TmdbItem[] = [...(movie?.results ?? []), ...(tv?.results ?? [])].sort(
    (a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0)
  );

  return (
    <div className="space-y-8">
      <Suspense fallback={<Loader />}>
        <MainCarousel data={data} />
        <List title="Trending Now" data={data} />
      </Suspense>
    </div>
  );
}
