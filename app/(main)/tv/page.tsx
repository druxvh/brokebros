'use client'

import List from "@/components/general/List"
import Loader from "@/components/general/Loader";
// import { getTVShows } from "@/lib/tmdb";
import { useQuery } from "@tanstack/react-query"

export default function Page() {

    const popular = useQuery({
        queryKey: ['tv', 'popular'],
        queryFn: async () => await fetch("/api/tv/popular").then(res => res.json()),
        staleTime: 1000 * 60 * 60,
    });
    const onTheAir = useQuery({
        queryKey: ['tv', 'on_the_air'],
        queryFn: async () => await fetch("/api/tv/on_the_air").then(res => res.json()),
        staleTime: 1000 * 60 * 60,
    });
    const topRated = useQuery({
        queryKey: ['tv', 'top_rated'],
        queryFn: async () => await fetch("/api/tv/top_rated").then(res => res.json()),
        staleTime: 1000 * 60 * 60,
    });

    console.log(popular, onTheAir, topRated);

    if (popular.isLoading || onTheAir.isLoading || topRated.isLoading) return <Loader />

    return (
        <>
            <List title="Popular" data={popular.data?.results} />
            <List title="On The Air" data={onTheAir.data?.results} />
            <List title="Top Rated" data={topRated.data?.results} />
        </>
    );
}
