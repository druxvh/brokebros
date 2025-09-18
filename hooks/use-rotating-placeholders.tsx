'use client'

import { useEffect, useState } from "react"

// custom hook for cycling placeholders
export default function useRotatingPlaceholders(values: string[], delay = 2500) {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const id = setInterval(() => {
            setIndex((prev) => (prev + 1) % values.length)
        }, delay)
        return () => clearInterval(id)
    }, [values, delay])

    return values[index]
}