"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useState, useRef } from "react";

export function useTVUrlState(tvId: number, totalSeasons: number, totalEpisodes: number) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [selectedSeason, setSelectedSeason] = useState<number>(1);
    const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
    const [isInitialized, setIsInitialized] = useState(false);
    const hasPushedDefaults = useRef(false);

    useEffect(() => {
        const seasonParam = searchParams.get("s");
        const episodeParam = searchParams.get("e");

        const hasParams = seasonParam !== null || episodeParam !== null;

        if (hasParams) {
            const season = seasonParam ? Math.max(1, Math.min(totalSeasons, parseInt(seasonParam, 10))) : 1;
            const episode = episodeParam ? Math.max(1, Math.min(totalEpisodes, parseInt(episodeParam, 10))) : 1;
            setSelectedSeason(season);
            setSelectedEpisode(episode);
        }

        if (!hasPushedDefaults.current) {
            hasPushedDefaults.current = true;
            const params = new URLSearchParams(searchParams.toString());
            const seasonToSet = hasParams
                ? Math.max(1, Math.min(totalSeasons, parseInt(seasonParam ?? "1", 10)))
                : 1;
            const episodeToSet = hasParams
                ? Math.max(1, Math.min(totalEpisodes, parseInt(episodeParam ?? "1", 10)))
                : 1;

            if (!hasParams || params.get("s") !== String(seasonToSet) || params.get("e") !== String(episodeToSet)) {
                params.set("s", String(seasonToSet));
                params.set("e", String(episodeToSet));
                router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            }
        }

        setIsInitialized(true);
    }, [searchParams, totalSeasons, totalEpisodes, router, pathname]);

    const updateUrl = useCallback((season: number, episode: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("s", season.toString());
        params.set("e", episode.toString());
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [router, pathname, searchParams]);

    const handleSeasonChange = useCallback((season: number) => {
        setSelectedSeason(season);
        setSelectedEpisode(1);
        updateUrl(season, 1);
    }, [updateUrl]);

    const handleEpisodeChange = useCallback((episode: number) => {
        setSelectedEpisode(episode);
        updateUrl(selectedSeason, episode);
    }, [updateUrl, selectedSeason]);

    return {
        selectedSeason,
        selectedEpisode,
        isInitialized,
        handleSeasonChange,
        handleEpisodeChange,
    };
}