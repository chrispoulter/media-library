export type Movie = {
    title: string;
    posterUrl: string | undefined | null;
    filePath: string;
    fileExtension: string;
    addedAt: number;
};

export type TvShowEpisode = {
    title: string;
    filePath: string;
    fileExtension: string;
    addedAt: number;
};

export type TvShow = {
    title: string;
    posterUrl: string | undefined | null;
    episodes: TvShowEpisode[];
    seasonCount: number;
    episodeCount: number;
    latestAddedAt: number;
};

export type Poster = {
    type: 'movie' | 'tv-show';
    title: string;
    posterUrl: string | undefined | null;
};

export type QueueStatus = {
    total: number;
    remaining: number;
    isProcessing: boolean;
};

export type Settings = {
    theme: 'light' | 'dark' | 'system';
    moviesDirectory: string;
    tvShowsDirectory: string;
    tmdbApiKey: string;
};
