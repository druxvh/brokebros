
import MovieDetail from '@/components/general/MovieDetails'
// import { getDetails } from '@/lib/tmdb'

export default async function Page({
    params
}: {
    params: Promise<{ id: string }>
}) {

    const { id } = await params
    // const data = await getDetails("movie", id)

    const baseUrl = "http://localhost:3000"

    const res = await fetch(`${baseUrl}/api/movie/${id}`, {
        next: { revalidate: 300 }
    }
    )

    if (!res.ok) {
        throw new Error("fetch failed")
    }

    const data = await res.json()

    return <MovieDetail movie={data} />
}
