"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay'
import { TmdbItem } from "@/types/types"
import Image from "next/image"
import { useRouter } from "next/navigation"

const TMDB_IMG_BASE = "https://image.tmdb.org/t/p/original"

export function MainCarousel({ data }: {
    data?: TmdbItem[] | undefined
}) {
    const plugin = React.useRef(
        Autoplay({ delay: 5000 })
    )
    const router = useRouter()

    function handleClick(item: TmdbItem) {
        const media = item.media_type === 'tv' ? "tv" : 'movie'
        const id = item.id

        // navigate
        router.push(`/${media}/${id}`)

    }


    if (!data || data.length === 0) {
        // simple fallback: show 5 placeholders
        return (
            <Carousel plugins={[plugin.current]} className="w-full h-full max-w-3xl mx-auto">
                <CarouselContent>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <CarouselItem key={i}>
                            <div className="p-1">
                                <Card className="rounded-none">
                                    <CardContent className="flex aspect-video items-center justify-center p-6 bg-neutral-900">
                                        <span className="text-4xl font-semibold text-neutral-400">{i + 1}</span>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        )
    }

    // choose how many top items to show: between 5 and 10
    const count = Math.min(10, Math.max(5, data.length))

    // sort by vote_average desc and take top `count`
    const topItems = [...data]
        .sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0))
        .slice(0, count)

    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full h-fit max-w-4xl mx-auto bg-black"
            onMouseEnter={() => plugin.current?.stop()}
            onMouseLeave={() => plugin.current?.reset()}
        >
            <CarouselContent className="bg-black p-0 m-0">
                {topItems.map((item, index) => {
                    const imagePath = item.backdrop_path ?? item.poster_path;
                    const imgSrc = imagePath ? `${TMDB_IMG_BASE}${imagePath}` : null;
                    const title = item.title ?? item.name ?? "Untitled";
                    const overview = item.overview ?? "";


                    return (
                        <CarouselItem
                            key={item.id ?? index}
                            onClick={() => handleClick(item)}
                            className="p-0 m-0 bg-black"
                        >
                            <Card className="rounded-none overflow-hidden bg-black h-fit p-0 border-0">
                                {/* parent must be relative for next/image fill */}
                                <CardContent className="relative aspect-video p-0 bg-black overflow-hidden">
                                    {imgSrc ? (
                                        <Image
                                            src={imgSrc}
                                            alt={title}
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 1024px"
                                            className="object-cover block"
                                            style={{ objectFit: "cover" }}
                                            priority={index === 0}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-black">
                                            <span className="text-4xl font-semibold text-neutral-400">{index + 1}</span>
                                        </div>
                                    )}

                                    <div className="absolute left-0 bottom-0 sm:left-4 sm:bottom-4 w-full sm:rounded-sm bg-black/60 p-4 text-primary/90 backdrop-blur-sm sm:max-w-[50%]">
                                        <h3 className="text-md sm:text-lg font-semibold leading-tight">{title}</h3>
                                        {overview && (
                                            <p className=" hidden sm:block mt-1 text-[8px] sm:text-sm line-clamp-2 text-neutral-200 text-wrap">{overview}</p>
                                        )}
                                        { }
                                        <div className="mt-2 flex items-center gap-3 text-xs text-neutral-300">
                                            <span className="inline-flex items-center rounded-md bg-neutral-900/40 px-2 py-1">
                                                ⭐ {Number(item.vote_average ?? 0).toFixed(1)}
                                            </span>
                                            <span>{item.release_date ?? item.first_air_date ?? ""}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    );
                })}
            </CarouselContent>
        </Carousel>

    )
}

