"use client";

import { TmdbTVItemById } from "@/types/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useTVUrlState } from "@/hooks/useTVUrlState";
import { addToRecentlyWatched } from "@/lib/recentlyWatched";

const TMDB_IMG = "https://image.tmdb.org/t/p/original";

export default function TVDetails({ tv }: { tv: Partial<TmdbTVItemById> }) {
    const id = tv.id ?? 0;
    const title = tv.name ?? "Unknown";
    const backdrop = tv.backdrop_path ?? tv.poster_path;
    const poster = tv.poster_path ?? tv.backdrop_path;
    const totalSeasons = tv.number_of_seasons ?? 1;
    const totalEpisodes = tv.number_of_episodes ?? 1;

    const {
        selectedSeason,
        selectedEpisode,
        isInitialized,
        handleSeasonChange,
        handleEpisodeChange,
    } = useTVUrlState(id, totalSeasons, totalEpisodes);

    const [iframeLoaded, setIframeLoaded] = useState(false);

    // Save to localStorage on mount and whenever season/episode changes
    useEffect(() => {
        if (!isInitialized || !id) return;

        addToRecentlyWatched({
            id,
            mediaType: "tv",
            title,
            name: title,
            posterPath: poster ?? null,
            backdropPath: backdrop ?? null,
            season: selectedSeason,
            episode: selectedEpisode,
            currentTime: 0,
            duration: undefined,
        });
    }, [isInitialized, id, title, poster, backdrop, selectedSeason, selectedEpisode]);

    const episodeCount = tv.seasons?.find((s) => s.season_number === selectedSeason)?.episode_count ?? 0;

    return (
        <div className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden shadow-lg">
                {/* backdrop */}
                <div className="absolute inset-0 -z-10 h-full w-full" />
                {backdrop ? (
                    <div className="relative h-72 sm:h-[420px] md:h-[520px]">
                        <Image
                            src={`${TMDB_IMG}${backdrop}`}
                            alt={title}
                            sizes="(max-width: 1024px) 100vw, 1024px"
                            fill
                            style={{ objectFit: "cover" }}
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    </div>
                ) : (
                    <div className="h-72 sm:h-[420px] md:h-[520px] bg-gradient-to-br from-neutral-800 to-neutral-700" />
                )}

                {/* content */}
                <div className="relative z-10 -mt-15 flex flex-col sm:flex-row gap-6 pb-8 px-4">
                    {/* poster */}
                    <div className="rounded-sm overflow-hidden shadow text-primary/90">
                        <div className="relative aspect-[2/3]  h-[220px] sm:h-[320px] p-0">
                            {poster ? (
                                <Image
                                    src={`${TMDB_IMG}${poster}`}
                                    alt={title}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                    style={{ objectFit: "cover" }}
                                    priority={true}
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-sm text-gray-500">
                                    No poster
                                </div>
                            )}
                        </div>
                    </div>

                    {/* meta */}
                    <div className="flex flex-1 flex-col gap-3 sm:mx-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
                                    {title}
                                </h1>
                                <p className="mt-1 text-sm text-neutral-300">
                                    {tv.first_air_date}
                                </p>
                                <div className="mt-3 flex flex-wrap items-center gap-3">
                                    <span className="rounded-md bg-neutral-900/60 px-2 py-1 text-sm text-neutral-200">
                                        ⭐ {Number(tv.vote_average ?? 0).toFixed(1)}
                                    </span>
                                    <span className="rounded-md bg-neutral-900/60 px-2 py-1 text-sm text-neutral-200">
                                        {totalSeasons} seasons
                                    </span>
                                    <span className="rounded-md bg-neutral-900/60 px-2 py-1 text-sm text-neutral-200">
                                        {totalEpisodes} episodes
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="max-w-3xl text-sm text-neutral-200">{tv.overview}</p>

                    </div>
                </div>
            </div>

            <div className="space-y-6 my-4">
                {/* seasons */}
                {tv.seasons != undefined && tv.seasons?.length > 0 && (
                    <div className="px-4 space-y-6">
                        <h2 className="text-xl font-bold text-white">Seasons</h2>
                        <div className="flex flex-wrap gap-3">
                            {tv.seasons.map((season) => (
                                <Button
                                    variant={"ghost"}
                                    key={season.id}
                                    onClick={() => handleSeasonChange(season.season_number ?? 1)}
                                    className={`px-4 py-2 rounded-sm text-sm font-medium transition cursor-pointer ${
                                        selectedSeason === season.season_number && "bg-primary/90 text-muted"
                                    }`}
                                >
                                    {season.name} ({season.episode_count})
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {/* episodes */}
                {selectedSeason > 0 && (
                    <div className="px-4 mt-10 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">
                                Episodes – Season {selectedSeason}
                            </h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {tv.seasons != undefined &&
                                Array.from({ length: episodeCount }, (_, i) => i + 1).map((ep) => (
                                    <Button
                                        variant={"ghost"}
                                        key={ep}
                                        onClick={() => handleEpisodeChange(ep)}
                                        className={`px-4 py-2 rounded-sm text-sm font-medium transition cursor-pointer ${
                                            selectedEpisode === ep && "bg-primary/90 text-muted"
                                        }`}
                                    >
                                        Ep {ep}
                                    </Button>
                                ))}
                        </div>
                    </div>
                )}
            </div>

            {/* vid */}
            <div className="relative not-only:w-full h-full aspect-video bg-none px-4 mt-10">
                {/* poster overlay */}
                {!iframeLoaded && poster && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
                        <Image src={`${TMDB_IMG}${poster}`} alt={title} fill style={{ objectFit: 'cover' }} />
                        <div className="absolute inset-0 bg-black/60" />
                        <div className="z-20 text-white">Loading player...</div>
                    </div>
                )}
                <iframe
                    onLoad={() => setIframeLoaded(true)}
                    key={`${id}-${selectedSeason}-${selectedEpisode}`}
                    src={`https://vidfast.vc/tv/${id}/${selectedSeason}/${selectedEpisode}?autoPlay=true&title=true&poster=true&theme=16A085&nextButton=true&autoNext=true&sub=true`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    loading="lazy"
                ></iframe>
            </div>
        </div>
    );
}