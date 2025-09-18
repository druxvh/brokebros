'use client'

import List from "@/components/general/List"
import Loader from "@/components/general/Loader";
// import { getMovies } from "@/lib/tmdb";
import { useQuery } from "@tanstack/react-query"

export default function Page() {

    const popular = useQuery({
        queryKey: ['movie', 'popular'],
        queryFn: async () => await fetch("/api/movie/popular").then(res => res.json()),
        staleTime: 1000 * 60 * 60,
    });
    const topRated = useQuery({
        queryKey: ['movie', 'top_rated'],
        queryFn: async () => await fetch("/api/movie/top_rated").then(res => res.json()),
        staleTime: 1000 * 60 * 60,
    });

    console.log(popular, topRated);

    if (popular.isLoading || topRated.isLoading) return <Loader />

    return (
        <>
            <List title="Popular" data={popular.data?.results} />
            <List title="Top Rated" data={topRated.data?.results} />
        </>
    );
}
