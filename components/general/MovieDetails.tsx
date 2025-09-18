"use client";

import Image from "next/image";
import { TmdbItem } from "@/types/types";
import { useState } from "react";

const TMDB_IMG = "https://image.tmdb.org/t/p/original";

export default function MovieDetail({ movie }: { movie: TmdbItem }) {

    const [iframeLoaded, setIframeLoaded] = useState(false);

    const id = movie.id
    const title = movie.title ?? movie.name;
    const backdrop = movie.backdrop_path ?? movie.poster_path;
    const poster = movie.poster_path ?? movie.backdrop_path;

    return (
        <div className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-sm shadow-lg">
                {/* backdrop */}
                <div className="absolute inset-0 -z-10 h-full w-full" />
                {backdrop ? (
                    <div className="relative h-72 sm:h-[420px] md:h-[520px]">
                        <Image
                            src={`${TMDB_IMG}${backdrop}`}
                            alt={title || "Movie Image"}
                            sizes="(max-width: 1024px) 100vw, 1024px"
                            fill
                            style={{ objectFit: "cover" }}
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    </div>
                ) : (
                    <div className="h-72 sm:h-[420px] md:h-[520px] bg-gradient-to-br from-neutral-800 to-neutral-700 rounded-2xl" />
                )}

                {/* content */}
                <div className="relative z-10 -mt-15 flex flex-col sm:flex-row gap-6 pb-8 px-4">
                    {/* poster */}
                    <div
                        className="rounded-sm overflow-hidden shadow text-primary/90">
                        <div className="relative aspect-[2/3]  h-[220px] sm:h-[320px] p-0">
                            {poster ? (
                                <Image
                                    src={`${TMDB_IMG}${poster}`}
                                    alt={title || "fkvj"}
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
                                <h1 className="text-2xl font-extrabold text-white sm:text-3xl">{title}</h1>
                                <p className="mt-1 text-sm text-neutral-300">
                                    {movie.release_date ?? movie.first_air_date}
                                </p>
                                <div className="mt-3 flex flex-wrap items-center gap-3">
                                    <span className="rounded-md bg-neutral-900/60 px-2 py-1 text-sm text-neutral-200">⭐ {Number(movie.vote_average ?? 0).toFixed(1)}</span>
                                </div>
                            </div>
                        </div>

                        <p className="max-w-3xl text-sm text-neutral-200">{movie.overview}</p>

                    </div>
                </div>
            </div>
            {/* vid */}
            <div className="relative not-only:w-full h-full aspect-video bg-none px-4 mt-10">
                {!iframeLoaded && poster && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
                        <Image src={`${TMDB_IMG}${poster}`} alt={title || "movie"} fill style={{ objectFit: 'cover' }} />
                        <div className="absolute inset-0 bg-black/60" />
                        <div className="z-20 text-white">Loading player...</div>
                    </div>
                )}
                <iframe
                    onLoad={() => setIframeLoaded(true)}
                    key={id}
                    src={`https://vidfast.pro/movie/${id}`}
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
