import { TmdbItem, TmdbResponse } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

const baseUrl = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const bearerToken = process.env.TMDB_API_READ_ACCESS_TOKEN as string;
// const apiKey = process.env.TMDB_API_KEY as string;
const type = "tv";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ category: string }> }
) {
    const { category } = await params

    if (!["popular", "top_rated", "on_the_air"].includes(category)) {
        return new Response(JSON.stringify({ message: "Invalid category" }), { status: 400 });
    }

    const url = `${baseUrl}/tv/${category}`;
    // const url = `${baseUrl}/${type}/${category}?api_key=${apiKey}`;

    try {
        const res = await fetch(url, {
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${bearerToken}`,
            },
            // server fetch revalidate in seconds
            next: { revalidate: 300 },
        });

        if (!res.ok) {
            return NextResponse.json(
                { message: "TMDB upstream error", status: res.status },
                { status: 502 }
            );
        }

        // parse original TMDB response
        const data = await res.json() as TmdbResponse<TmdbItem>

        // inject media_type into each result (preserve the original shape)
        const resultsWithMediaType = (data.results ?? []).map((item: TmdbItem) => ({
            ...item,
            media_type: item.media_type ?? type,
        }));

        const out = {
            ...data,
            results: resultsWithMediaType,
        };

        return NextResponse.json(out, {
            status: 200,
        });
    } catch (err) {
        console.error("[TMDB proxy] fetch failed", err);
        return NextResponse.json({ message: "Proxy fetch failed", error: String(err) }, { status: 502 });
    }
}
