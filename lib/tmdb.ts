'use server'

const baseUrl = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const bearerToken = process.env.TMDB_API_READ_ACCESS_TOKEN as string;
const apiKey = process.env.TMDB_API_KEY as string;

if (!apiKey) {
    throw new Error("TMDB_API_KEY environment variable is not set.");
}

export async function getTrending(
    mediaType: "movie" | "tv",
    timeWindow: "day" | "week"
) {
    // const res = await fetch(`/api/trending/${mediaType}/${timeWindow}`)
    const res = await fetch(`${baseUrl}/trending/${mediaType}/${timeWindow}`,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${bearerToken}`
            }
        }
    )
    if (!res.ok) throw new Error(`Trending fetch failed: ${res.status}`);
    return res.json();
}

export async function getTVShows(
    param: "popular" | "top_rated" | "on_the_air"
) {
    // const res = await fetch(`/api/tv/${param}`)
    const res = await fetch(`${baseUrl}/tv/${param}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            Authorization: `Bearer ${bearerToken}`
        }
    })
    if (!res.ok) throw new Error(`TV fetch failed: ${res.status}`);
    return res.json();
}

export async function getMovies(
    param: "popular" | "top_rated"
) {
    // const res = await fetch(`/api/movie/${param}`)
    const res = await fetch(`${baseUrl}/movie/${param}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            Authorization: `Bearer ${bearerToken}`
        }
    })
    if (!res.ok) throw new Error(`Movie fetch failed: ${res.status}`);
    return res.json();
}

export async function getDetails(
    mediaType: "movie" | "tv",
    id: string
) {
    // const res = await fetch(`${baseUrl}/${mediaType}/${id}?api_key=${apiKey}`, {
    const res = await fetch(`${baseUrl}/${mediaType}/${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            Authorization: `Bearer ${bearerToken}`
        }
    })
    if (!res.ok) throw new Error(`Details fetch failed: ${res.status}`);
    return res.json();
}

export async function getTrendingAll(timeWindow: "day" | "week") {

    const [movie, tv] = await Promise.all([
        getTrending("movie", timeWindow),
        getTrending("tv", timeWindow)
    ])

    // const data = [...(movie?.results ?? []), ...(tv?.results ?? [])].sort((a, b) => b.vote_average - a.vote_average)
    const data = [...(movie?.results ?? []), ...(tv?.results ?? [])]
    return data
}
