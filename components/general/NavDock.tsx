'use client'

import { FloatingDock } from "@/components/ui/floating-dock";
import { FilmSlateIcon, HouseSimpleIcon, TelevisionIcon } from "@phosphor-icons/react";

export function NavDock() {
    const links = [
        {
            title: "Home",
            icon: (
                <HouseSimpleIcon size={32} />
            ),
            href: "/",
        },

        {
            title: "Movies",
            icon: (
                <FilmSlateIcon size={32} />
            ),
            href: "/movie",
        },
        {
            title: "TV Shows",
            icon: (
                <TelevisionIcon size={32} />
            ),
            href: "/tv",
        },

    ];
    return (
        <div className="fixed bottom-12 w-full h-fit">
            <div className="w-full flex items-center justify-center">
                <FloatingDock
                    desktopClassName="flex bg-gray-800"
                    mobileClassName="hidden" // only for demo, remove for production
                    items={links}
                />
            </div>
        </div>
    );
}
