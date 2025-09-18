"use client";

import { Film } from "lucide-react";

export default function Footer() {
    return (
        <footer className="hidden sm:block w-full mt-20 border-t border-border h-fit ">
            <div className="w-full flex items-center justify-between p-4">
                {/* Logo */}
                <div className="flex items-center gap-2 text-gray-200">
                    <Film className="size-4 text-red-500" />
                    <span className="font-medium">BrokeBros</span>
                </div>

                <div className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} brokebros
                </div>
            </div>
        </footer>
    );
}
