"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
    FilmSlateIcon,
    HouseSimpleIcon,
    TelevisionIcon,
} from "@phosphor-icons/react"

type DockItem = {
    title: string
    href: string
    icon: React.ReactNode
}

export function NavDock() {
    const links: DockItem[] = [
        { title: "Home", icon: <HouseSimpleIcon size={24} />, href: "/" },
        { title: "Movies", icon: <FilmSlateIcon size={24} />, href: "/movie" },
        { title: "TV Shows", icon: <TelevisionIcon size={24} />, href: "/tv" },
    ]

    return (
        <div aria-hidden={false}>
            <FloatingDock
                items={links}
            />
        </div>
    )
}

export function FloatingDock({ items }: { items: DockItem[] }) {
    const pathname = usePathname() ?? '/'

    return (
        <>
            {/* Desktop pill (centered, inline) */}
            <div className="hidden md:flex fixed bottom-5 left-0 right-0 z-50 justify-center pointer-events-none">
                <nav
                    aria-label="Primary"
                    className="pointer-events-auto inline-flex items-center gap-2 rounded-2xl bg-muted/30 px-2 py-2 backdrop-blur-md shadow-lg"
                >
                    {items.map((it) => {
                        const active = pathname === it.href || pathname.startsWith(it.href + '/')
                        return (
                            <Link key={it.href} href={it.href} className="relative group">
                                <motion.button
                                    whileHover={{ y: -4, scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={cn(
                                        'w-12 h-12 flex items-center justify-center rounded-lg transition-colors outline-none',
                                        active
                                            ? 'bg-primary text-primary-foreground shadow-md'
                                            : 'text-muted-foreground hover:text-primary'
                                    )}
                                    aria-current={active ? 'page' : undefined}
                                >
                                    {it.icon}
                                </motion.button>

                                {/* Tooltip (pure CSS) */}
                                <span
                                    className="pointer-events-none absolute -top-10 left-1/2 w-max -translate-x-1/2 rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground opacity-0 scale-95 transition-all duration-150 group-hover:opacity-100 group-hover:scale-100 rounded-sm"
                                    role="tooltip"
                                >
                                    {it.title}
                                </span>
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* Mobile dock (bottom, full width) */}
            <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
                <motion.nav
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    aria-label="Primary mobile"
                    className="mx-auto flex w-full items-center justify-between rounded-t-xl bg-muted/30 px-3 py-2 backdrop-blur-md shadow-lg"
                >
                    {items.map((it) => {
                        const active = pathname === it.href || pathname.startsWith(it.href + '/')
                        return (
                            <Link key={it.href} href={it.href} className="flex-1">
                                <button
                                    aria-current={active ? 'page' : undefined}
                                    title={it.title}
                                    className={cn(
                                        'flex w-full flex-col items-center gap-1 rounded px-2 py-2 text-xs transition-colors',
                                        active ? 'text-primary' : 'text-muted-foreground'
                                    )}
                                >
                                    <span className="flex h-6 w-6 items-center justify-center">{it.icon}</span>
                                    <span className="text-[10px]">{it.title}</span>
                                </button>
                            </Link>
                        )
                    })}
                </motion.nav>
            </div>
        </>
    )
}