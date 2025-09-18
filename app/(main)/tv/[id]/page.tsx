'use client'

import Loader from '@/components/general/Loader'
import TVDetail from '@/components/general/TVDetails'
import { useQuery } from '@tanstack/react-query'
import { use } from 'react'

export default function Page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = use(params)

    const { data, isLoading, error } = useQuery({
        queryKey: ['tv', id],
        queryFn: async ({ signal }) => {
            const res = await fetch(`/api/tv/${id}`, { signal })
            if (!res.ok) throw new Error("TV fetch failed")
            return res.json()
        },
        staleTime: 1000 * 60 * 60,
    })
    if (isLoading) return <Loader />
    if (error) return <div>Error: {(error as Error).message}</div>

    // If no data, return not found
    if (!data) return <div>TV show not found</div>

    return <TVDetail tv={data} />
}
