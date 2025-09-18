'use client'

import { Button } from "../ui/button"
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "../ui/input"
import useRotatingPlaceholders from "@/hooks/use-rotating-placeholders"


const placeholders = [
    "Wednesday",
    "Alien: Earth",
    "The Girlfriend",
    "The Last of Us",
    "Shōgun",
    "The Terminal List: Dark Wolf",
    "Fool Me Once",
    "Peacemaker",
    "Dexter: Resurrection",
    "The Summer I Turned Pretty",
    "The Paper",
    "Only Murders in the Building",
    "Adolescence: Limited Series",
    "Stranger Things 4",
    "DAHMER: Monster: The Jeffrey Dahmer Story",
];

export default function Search() {
    const [query, setQuery] = useState("")
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const rotatingPlaceholder = useRotatingPlaceholders(placeholders, 3000)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = query.trim().replace(/\s+/g, " ");
        if (!trimmed) return
        setOpen(false)

        router.push(`/search?q=${encodeURIComponent(trimmed)}`)
        setQuery("")
    };

    return (
        <>

            <Button
                size={"icon"}
                variant={"ghost"}
                onClick={() => setOpen((p) => !p)}
            >
                {open ? <XIcon size={32} /> : <MagnifyingGlassIcon size={32} />}
            </Button>


            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="border-b px-4 py-8"
                    >
                        <form
                            onSubmit={handleSubmit}
                            className="max-w-3xl mx-auto flex items-center gap-2"
                        >
                            <div className="relative flex-1">
                                <Input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder=""
                                    className="flex-1 w-full truncate p-4 rounded-sm"
                                />
                                {/* Animated placeholder overlay */}
                                {query.length === 0 && (
                                    <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-muted-foreground text-sm">
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={rotatingPlaceholder}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.5 }}
                                                className="truncate"
                                            >
                                                {rotatingPlaceholder}
                                            </motion.span>
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                            <Button variant={"default"} type="submit">
                                <MagnifyingGlassIcon size={32} />
                            </Button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
