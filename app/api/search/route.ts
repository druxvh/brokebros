import { NextRequest, NextResponse } from "next/server";

const baseUrl = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const bearerToken = process.env.TMDB_API_READ_ACCESS_TOKEN as string;

export async function GET(req: NextRequest) {

    const query = req.nextUrl.searchParams.get('q');
    if (!query) {
        return NextResponse.json({ message: 'Missing query parameter' }, { status: 400 });
    }

    const url = `${baseUrl}/search/multi?query=${encodeURIComponent(
        query
    )}&include_adult=true`

    try {
        const res = await fetch(url, {
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
        // return Response.json(data, { status: 200 });
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        )
    }
}