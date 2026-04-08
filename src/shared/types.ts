export interface Settings {
    theme: 'light' | 'dark' | 'system';
    moviesDirectory: string;
    tvShowsDirectory: string;
    tmdbApiKey: string;
}

export type MediaType = 'movie' | 'tv-show';

export interface Movie {
    title: string;
    posterUrl: string | undefined | null;
    filePath: string;
    fileExtension: string;
    addedAt: number;
}

export interface TvShowEpisode {
    episodeNumber: number;
    filePath: string;
    fileExtension: string;
    addedAt: number;
}

export interface TvShowSeason {
    seasonNumber: number;
    episodes: TvShowEpisode[];
}

export interface TvShow {
    title: string;
    posterUrl: string | undefined | null;
    seasons: TvShowSeason[];
    latestAddedAt: number;
}

export interface Event {
    kind: 'poster-updated';
    type: MediaType;
    title: string;
    posterUrl: string | null | undefined;
}
