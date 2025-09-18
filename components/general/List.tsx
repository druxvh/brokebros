"use client";

import { TmdbItem } from "@/types/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";

type Props = {
    title?: string;
    data?: TmdbItem[];
};

export default function List({ title, data }: Props) {
    return (
        <section className="px-2 flex flex-col gap-5 my-6">
            <div className="flex items-center gap-2">
                <div className="w-1 md:w-1.5 h-8 md:h-12 bg-red-600 rounded-xl" />
                <h2 className="max-w-7xl text-2xl md:text-3xl font-bold  bg-gradient-to-b from-gray-200 to-gray-400 bg-clip-text text-transparent">
                    {title ?? "Movie / TV-Show"}
                </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {data && data.length > 0 ? (
                    data.map((item) => <ItemCard key={`${item.id}-${item.media_type ?? "m"}`} data={item} />)
                ) : (
                    <p className="col-span-full text-sm text-gray-500">No items found.</p>
                )}
            </div>
        </section>
    );
}



export function ItemCard({ data }: { data: TmdbItem }) {

    const router = useRouter()

    function handleClick(item: TmdbItem) {
        const media = item.media_type === 'movie' ? "movie" : 'tv'
        const id = item.id

        console.log(item)

        // navigate
        router.push(`/${media}/${id}`)

    }

    const title = data.title || data.name || "Untitled";
    const date = data.release_date || data.first_air_date || "Unknown";
    const year = date ? new Date(date).getFullYear() : "-";
    const rating = typeof data.vote_average === "number" ? data.vote_average.toFixed(1) : "0.0";
    const lang = (data.original_language || "en").toUpperCase();
    const mediaType = (data.media_type === "movie") ? "Movie" : "TV"


    const posterSrc = data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null;

    return (
        <button
            onClick={() => handleClick(data)}
            className="rounded-sm overflow-hidden shadow text-primary/90 cursor-pointer">

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
            </div>

            <div className="py-2 outline min-h-10">
                <h3 className="text-center text-xs sm:text-base h-fit font-semibold truncate ">{title}</h3>

                <div className="flex items-center justify-between mt-2 text-[10px] sm:text-xs text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <span className="font-medium">⭐</span>
                        <span className="font-semibold">{rating}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[10px] sm:text-xs">{lang}</span>
                        <span>•</span>
                        <span className="text-[10px] sm:text-xs">{year}</span>
                    </div>
                </div>
            </div>
        </button>
    );
}