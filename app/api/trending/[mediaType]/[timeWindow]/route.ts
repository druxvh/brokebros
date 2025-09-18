import { NextRequest, NextResponse } from "next/server";

// This is an internal API route that proxies requests to the TMDB API for trending media.
const baseUrl = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const bearerToken = process.env.TMDB_API_READ_ACCESS_TOKEN as string;

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ mediaType: string, timeWindow: string }> }
) {
    if (!bearerToken) {
        return NextResponse.json({ message: "Missing TMDB bearer token" }, { status: 500 });
    }

    const { mediaType, timeWindow } = await params;

    // Validate
    const allowedMedia = ["movie", "tv"];
    const allowedWindow = ["day", "week"];

    if (!allowedMedia.includes(mediaType) || !allowedWindow.includes(timeWindow)) {
        return NextResponse.json({ message: "Invalid mediaType or timeWindow" }, { status: 400 });
    }

    // build safe path and avoid double slashes
    const encodedMediaType = encodeURIComponent(mediaType);
    const encodedTimeWindow = encodeURIComponent(timeWindow);
    const url = `${baseUrl}/trending/${encodedMediaType}/${encodedTimeWindow}`;

    try {

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${bearerToken}`
            },
        })

        if (!res.ok) {
            return NextResponse.json(
                { message: 'TMDB responded with error', status: res.status },
                { status: 502 }
            );
        }
        const data = await res.json();

        // return with cache headers (s-maxage for CDN, stale-while-revalidate for UX)
        return NextResponse.json(data, {
            status: 200,
            headers: {
                "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300", // 1 min CDN, 5 min stale
            },
        });
    } catch (err) {
        console.error('TMDB proxy error', err);
        return NextResponse.json({ message: 'Proxy fetch failed', error: String(err) }, { status: 502 });
    }
}