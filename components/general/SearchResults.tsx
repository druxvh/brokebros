"use client"

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/general/Loader";
import { ItemCard } from "@/components/general/List";
import { useRouter, useSearchParams } from "next/navigation";
import type { TmdbItem, TmdbResponse } from "@/types/types";

export const dynamic = "force-dynamic";

// Deduplicate by id to prevent result ids and known for data ids
function dedupeResults(results: TmdbItem[]): TmdbItem[] {
    const seen = new Set<number>()
    const unique: TmdbItem[] = []

    for (const item of results) {
        if (!item.poster_path || (!item.title && !item.name)) continue

        if (!seen.has(item.id)) {
            seen.add(item.id)
            unique.push(item)
        }
    }

    return unique
}

function processResults(results: TmdbItem[]): TmdbItem[] {
    const flattened: TmdbItem[] = []

    results.forEach((item) => {
        if (item.media_type === "person" && item.known_for) {
            flattened.push(...item.known_for)
        } else {
            flattened.push(item)
        }
    })

    return dedupeResults(flattened)
}

export default function SearchResults() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const query = searchParams.get("q") || ""

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    useEffect(() => {
        if (!query || query.length === 0) {
            router.replace("/");
        }
    }, [query, router]);

    // Fetch search results from API
    const { data, isLoading, isError } = useQuery<TmdbResponse<TmdbItem>>({
        queryKey: ["search", query],
        queryFn: async ({ signal }) => {
            const res = await fetch(`${baseUrl}/api/search?q=${encodeURIComponent(query)}`, { signal }); // aborts the previous request if a new one is made
            if (!res.ok) throw new Error("Search failed");
            return res.json() as Promise<TmdbResponse<TmdbItem>>; // returns TmdbResponse
        },
        enabled: query.length > 0,
        staleTime: 1000 * 60 * 60 * 1,
        // placeholderData: keepPreviousData, // keep previous data while loading new data
    });

    const results = useMemo(() => {
        const raw = data?.results ?? [];
        return processResults(raw);
    }, [data]);

    if (!query) return null

    return (
        <div className="min-h-screen w-full h-full p-4 flex flex-col justify-start gap-6">
            <h2 className="text-lg text-center text-primary/90">Results for {" "}
                <span className="font-bold">“{query}”</span>
            </h2>


            {isError && <p className="text-red-400 text-sm text-center">Error fetching results.</p>}

            {isLoading && <Loader />}

            {results.length === 0 && query.length > 0 && !isLoading && (
                <p className="col-span-full text-sm text-gray-500">No items found.</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">

                {results.length > 0 && (
                    results.map((item) => (
                        <ItemCard key={item.id} data={item} />
                    ))
                )
                }
            </div>
        </div>

    )
}