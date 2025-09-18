import { NextRequest, NextResponse } from "next/server";

const baseUrl = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const bearerToken = process.env.TMDB_API_READ_ACCESS_TOKEN as string;

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;

    if (!id) {
        return NextResponse.json({ message: 'Invalid path' }, { status: 400 });
    }

    const url = `${baseUrl}/tv/${encodeURIComponent(id)}/recommendations`;

    try {

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${bearerToken}`
            },
            next: { revalidate: 300 }
        })

        if (!res.ok) {
            return NextResponse.json(
                { message: 'TMDB responded with error', status: res.status },
                { status: 502 }
            );
        }
        const data = await res.json();

        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        console.error('TMDB proxy error', err);
        return NextResponse.json({ message: 'Proxy fetch failed', error: String(err) }, { status: 502 });
    }
}