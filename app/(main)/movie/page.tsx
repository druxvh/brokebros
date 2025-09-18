'use client'

import List from "@/components/general/List"
import Loader from "@/components/general/Loader";
import { useQuery } from "@tanstack/react-query"
import { Suspense } from "react";

export default function Page() {

    const popular = useQuery({
        queryKey: ['movie', 'popular'],
        queryFn: async ({ signal }) => {
            const res = await fetch("/api/movie/c/popular", { signal })
            if (!res.ok) throw new Error("Popular fetch failed")
            return res.json()
        },
        staleTime: 1000 * 60 * 60,
    });
    const topRated = useQuery({
        queryKey: ['movie', 'top_rated'],
        queryFn: async ({ signal }) => {
            const res = await fetch("/api/movie/c/top_rated", { signal })
            if (!res.ok) throw new Error("Popular fetch failed")
            return res.json()
        },
        staleTime: 1000 * 60 * 60,
    });

    if (popular.isLoading || topRated.isLoading) return <Loader />

    return (
        <>
            <Suspense fallback={<Loader />}>
                <List title="Popular" data={popular.data?.results} />
                <List title="Top Rated" data={topRated.data?.results} />
            </Suspense>
        </>
    );
}
