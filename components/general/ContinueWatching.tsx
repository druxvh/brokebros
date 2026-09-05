"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getRecentlyWatched } from "@/lib/recentlyWatched";
import { Badge } from "../ui/badge";

const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

interface ContinueWatchingProps {
    limit?: number;
}

export function ContinueWatching({ limit = 10 }: ContinueWatchingProps) {
    const [items, setItems] = useState<ReturnType<typeof getRecentlyWatched>>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const watched = getRecentlyWatched();
        setItems(watched.slice(0, limit));
    }, [limit]);

    if (!mounted || items.length === 0) {
        return null;
    }

    return (
        <section className="px-2 flex flex-col gap-5 py-5">
            <div className="flex items-center gap-2">
                <div className="w-1 md:w-1.5 h-8 md:h-12 bg-red-600 rounded-xl" />
                <h2 className="max-w-7xl text-2xl md:text-3xl font-bold text-primary">
                    Continue Watching
                </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {items.map((item) => {
                    const title = item.title ?? item.name ?? "Unknown";
                    const posterSrc = item.posterPath ? `${TMDB_IMG}${item.posterPath}` : null;

                    let href = `/${item.mediaType}/${item.id}`;
                    if (item.mediaType === "tv" && item.season && item.episode) {
                        href += `?s=${item.season}&e=${item.episode}`;
                    }

                    const mediaType = item.mediaType === "movie" ? "Movie" : "TV";
                    const label = item.mediaType === "tv" && item.season && item.episode
                        ? `S${item.season} E${item.episode}`
                        : "Movie";

                    return (
                        <Link key={`${item.id}-${item.mediaType}-${item.season ?? 0}-${item.episode ?? 0}`} href={href}>
                            <div className="rounded-sm overflow-hidden shadow text-primary/90 cursor-pointer">
                                <div className="relative w-full aspect-[2/3] rounded-sm">
                                    {posterSrc ? (
                                        <Image
                                            src={posterSrc}
                                            alt={title}
                                            fill
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                            style={{ objectFit: "cover" }}
                                            priority={true}
                                            className="rounded-sm"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-sm text-gray-500">
                                            No poster
                                        </div>
                                    )}
                                    <Badge variant={"secondary"} className="absolute left-2 top-2 px-2 rounded-sm">{mediaType}</Badge>
                                    {item.mediaType === "tv" && item.season && item.episode && (
                                        <Badge variant={"default"} className="absolute right-2 top-2 px-2 rounded-sm bg-primary text-primary-foreground">
                                            {label}
                                        </Badge>
                                    )}
                                </div>

                                <div className="py-2 min-h-10">
                                    <h3 className="text-center text-xs sm:text-base h-fit font-semibold truncate">{title}</h3>

                                    <div className="flex items-center justify-between mt-2 text-[10px] sm:text-xs text-gray-600 dark:text-gray-300">
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <span className="font-medium">Resume</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] sm:text-xs">{mediaType}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}