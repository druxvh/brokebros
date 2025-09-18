'use client'

import List from "@/components/general/List"
import Loader from "@/components/general/Loader";
import { useQuery } from "@tanstack/react-query"
import { Suspense } from "react";

export default function Page() {

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const popular = useQuery({
        queryKey: ['tv', 'popular'],
        queryFn: async ({ signal }) => {
            const res = await fetch(`${baseUrl}/api/tv/c/popular`, { signal })
            if (!res.ok) throw new Error("Popular fetch failed")
            return res.json()
        },
        staleTime: 1000 * 60 * 60,
    });
    const onTheAir = useQuery({
        queryKey: ['tv', 'on_the_air'],
        queryFn: async ({ signal }) => {
            const res = await fetch(`${baseUrl}/api/tv/c/on_the_air`, { signal })
            if (!res.ok) throw new Error("On The Air fetch failed")
            return res.json()
        },
        staleTime: 1000 * 60 * 60,
    });
    const topRated = useQuery({
        queryKey: ['tv', 'top_rated'],
        queryFn: async ({ signal }) => {
            const res = await fetch(`${baseUrl}/api/tv/c/top_rated`, { signal })
            if (!res.ok) throw new Error("Top Rated fetch failed")
            return res.json()
        },
        staleTime: 1000 * 60 * 60,
    });

    if (popular.isLoading || onTheAir.isLoading || topRated.isLoading) return <Loader />

    return (
        <>
            <Suspense fallback={<Loader />}>
                <List title="Popular" data={popular.data?.results} />
                <List title="On The Air" data={onTheAir.data?.results} />
                <List title="Top Rated" data={topRated.data?.results} />
            </Suspense>
        </>
    );
}
