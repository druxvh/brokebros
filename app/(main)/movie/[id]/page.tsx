'use client'

import Loader from '@/components/general/Loader'
import MovieDetail from '@/components/general/MovieDetails'
import { useQuery } from '@tanstack/react-query'
import { use } from 'react'

export default function Page({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params)

    const { data, isLoading, error } = useQuery({
        queryKey: ['movie', id],
        queryFn: async ({ signal }) => {
            const res = await fetch(`/api/movie/${id}`, { signal })
            if (!res.ok) throw new Error("Movie fetch failed")
            return res.json()
        },
        staleTime: 1000 * 60 * 60,
    })
    if (isLoading) return <Loader />
    if (error) return <div>Error: {(error as Error).message}</div>

    // If no data, return not found
    if (!data) return <div>Movie not found</div>

    return <MovieDetail movie={data} />
}
