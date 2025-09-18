import TVDetail from '@/components/general/TVDetails'
// import { getDetails } from '@/lib/tmdb'

export default async function Page({ params }: { params: { id: string } }) {

    const { id } = await params

    // const data = await getDetails("tv", id)
    const baseUrl = "http://localhost:3000"

    const res = await fetch(`${baseUrl}/api/tv/${id}`, {
        next: { revalidate: 300 }
    })

    if (!res.ok) {
        throw new Error("fetch failed")
    }

    const data = await res.json()

    return <TVDetail tv={data} />
}
