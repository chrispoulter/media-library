export type Settings = {
    theme: 'light' | 'dark' | 'system';
    moviesDirectory: string;
    tvShowsDirectory: string;
    tmdbApiKey: string;
};

export type MediaType = 'movie' | 'tv-show';

export type Movie = {
    title: string;
    posterUrl: string | undefined | null;
    filePath: string;
    fileExtension: string;
    addedAt: number;
};

export type TvShowEpisode = {
    episodeNumber: number;
    filePath: string;
    fileExtension: string;
    addedAt: number;
};

export type TvShowSeason = {
    seasonNumber: number;
    episodes: TvShowEpisode[];
};

export type TvShow = {
    title: string;
    posterUrl: string | undefined | null;
    seasons: TvShowSeason[];
    latestAddedAt: number;
};

export type Event = {
    kind: 'poster-updated';
    type: MediaType;
    title: string;
    posterUrl: string | null | undefined;
};
