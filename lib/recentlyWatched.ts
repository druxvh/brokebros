"use client";

export interface RecentlyWatchedItem {
    id: number;
    mediaType: "movie" | "tv";
    title: string;
    name?: string;
    posterPath: string | null;
    backdropPath: string | null;
    season?: number;
    episode?: number;
    currentTime: number;
    duration?: number;
    watchedAt: number;
}

const STORAGE_KEY = "brokebros_recently_watched";
const MAX_ITEMS = 20;

export function getRecentlyWatched(): RecentlyWatchedItem[] {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function addToRecentlyWatched(item: Omit<RecentlyWatchedItem, "watchedAt">): void {
    if (typeof window === "undefined") return;
    try {
        const existing = getRecentlyWatched();
        const filtered = existing.filter(
            (i) => !(i.id === item.id && i.mediaType === item.mediaType)
        );
        const newItem: RecentlyWatchedItem = {
            ...item,
            watchedAt: Date.now(),
        };
        const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
        // Ignore localStorage errors
    }
}

export function removeFromRecentlyWatched(id: number, mediaType: "movie" | "tv", season?: number, episode?: number): void {
    if (typeof window === "undefined") return;
    try {
        const existing = getRecentlyWatched();
        const filtered = existing.filter(
            (i) => !(i.id === id && i.mediaType === mediaType && i.season === season && i.episode === episode)
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch {
        // Ignore localStorage errors
    }
}

export function clearRecentlyWatched(): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // Ignore localStorage errors
    }
}

export function formatWatchTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

export function getProgressPercentage(currentTime: number, duration?: number): number {
    if (!duration || duration <= 0) return 0;
    return Math.min(100, Math.max(0, (currentTime / duration) * 100));
}

export function isCompleted(currentTime: number, duration?: number, threshold = 0.9): boolean {
    if (!duration || duration <= 0) return false;
    return currentTime / duration >= threshold;
}