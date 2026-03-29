import { readdir, stat } from 'fs/promises';
import { extname, join } from 'path';
import log from 'electron-log/main';
import { enqueuePosters, type QueueItem } from './posterManager';
import { getPosterUrl } from './posterStore';
import { getSettings } from './settingsStore';
import type { Movie, TvShow, TvShowEpisode } from '../shared/types';

const VIDEO_EXTENSIONS = new Set([
    '.mp4',
    '.mkv',
    '.avi',
    '.mov',
    '.wmv',
    '.m4v',
    '.webm',
]);

const TV_EPISODE_PATTERN = /^(.*)\sS(\d{2})E(\d{2})(?:\b.*)?$/i;

const isVideoFile = (fileName: string): boolean => {
    const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    return VIDEO_EXTENSIONS.has(ext);
};

const parseMovieTitle = (fileName: string): string => {
    const nameWithoutExt = fileName.slice(0, fileName.lastIndexOf('.'));
    return nameWithoutExt.replace(/\./g, ' ');
};

const parseTvEpisode = (
    fileName: string
): {
    title: string;
    seasonNumber: number;
    episodeNumber: number;
} | null => {
    const match = TV_EPISODE_PATTERN.exec(fileName);

    if (!match) {
        return null;
    }

    const title = match[1].replace(/\./g, ' ').trim();
    const seasonNumber = parseInt(match[2], 10);
    const episodeNumber = parseInt(match[3], 10);

    return { title, seasonNumber, episodeNumber };
};

export const getMovies = async (): Promise<Movie[]> => {
    log.info('Scanning for movies');

    const { moviesDirectory, tmdbApiKey } = getSettings();

    if (!moviesDirectory) {
        return [];
    }

    const exists = await stat(moviesDirectory)
        .then((s) => s.isDirectory())
        .catch(() => false);

    if (!exists) {
        return [];
    }

    const entries = await readdir(moviesDirectory, {
        withFileTypes: true,
        recursive: true,
    });

    const moviePromises: Promise<Movie>[] = entries
        .filter((entry) => entry.isFile() && isVideoFile(entry.name))
        .map(async (entry) => {
            const filePath = join(entry.parentPath, entry.name);
            const title = parseMovieTitle(entry.name);
            const posterUrl = getPosterUrl('movie', title);
            const fileExtension = extname(entry.name);
            const { mtimeMs: addedAt } = await stat(filePath);

            return {
                title,
                posterUrl,
                filePath,
                fileExtension,
                addedAt,
            };
        });

    const movies = await Promise.all(moviePromises);

    if (tmdbApiKey) {
        const missingPosters: QueueItem[] = movies
            .filter((movie) => movie.posterUrl === undefined)
            .map((movie) => ({ type: 'movie', title: movie.title }));

        if (missingPosters.length) {
            enqueuePosters(missingPosters);
        }
    }

    return movies.sort((a, b) => a.title.localeCompare(b.title));
};

export const getTvShows = async (): Promise<TvShow[]> => {
    log.info('Scanning for tv shows');

    const { tvShowsDirectory, tmdbApiKey } = getSettings();

    if (!tvShowsDirectory) {
        return [];
    }

    const exists = await stat(tvShowsDirectory)
        .then((s) => s.isDirectory())
        .catch(() => false);

    if (!exists) {
        return [];
    }

    const entries = await readdir(tvShowsDirectory, {
        withFileTypes: true,
        recursive: true,
    });

    const episodePromises = entries
        .filter((entry) => entry.isFile() && isVideoFile(entry.name))
        .map(async (entry) => {
            const parsedEpisode = parseTvEpisode(entry.name);

            if (!parsedEpisode) {
                return null;
            }

            const filePath = join(entry.parentPath, entry.name);
            const fileExtension = extname(entry.name);
            const { mtimeMs: addedAt } = await stat(filePath);

            return { ...parsedEpisode, filePath, fileExtension, addedAt };
        });

    const episodes = await Promise.all(episodePromises);

    const tvShowMap = new Map<
        string,
        {
            title: string;
            posterUrl: string | null | undefined;
            seasons: Map<number, TvShowEpisode[]>;
            latestAddedAt: number;
        }
    >();

    for (const episode of episodes) {
        if (!episode) {
            continue;
        }

        const show = tvShowMap.get(episode.title);

        if (!show) {
            tvShowMap.set(episode.title, {
                title: episode.title,
                posterUrl: getPosterUrl('tv-show', episode.title),
                seasons: new Map([[episode.seasonNumber, [episode]]]),
                latestAddedAt: episode.addedAt,
            });

            continue;
        }

        const season = show.seasons.get(episode.seasonNumber);

        if (!season) {
            show.seasons.set(episode.seasonNumber, [
                {
                    episodeNumber: episode.episodeNumber,
                    filePath: episode.filePath,
                    fileExtension: episode.fileExtension,
                    addedAt: episode.addedAt,
                },
            ]);

            show.latestAddedAt = Math.max(show.latestAddedAt, episode.addedAt);
            continue;
        }

        season.push({
            episodeNumber: episode.episodeNumber,
            filePath: episode.filePath,
            fileExtension: episode.fileExtension,
            addedAt: episode.addedAt,
        });

        show.latestAddedAt = Math.max(show.latestAddedAt, episode.addedAt);
    }

    const tvShows = Array.from(tvShowMap.values()).map((show) => {
        const seasons = Array.from(show.seasons.entries())
            .map(([seasonNumber, episodes]) => ({
                seasonNumber,
                episodes: episodes.sort(
                    (a, b) => a.episodeNumber - b.episodeNumber
                ),
            }))
            .sort((a, b) => a.seasonNumber - b.seasonNumber);

        return {
            title: show.title,
            posterUrl: show.posterUrl,
            latestAddedAt: show.latestAddedAt,
            seasons,
        };
    });

    if (tmdbApiKey) {
        const missingPosters: QueueItem[] = tvShows
            .filter((show) => show.posterUrl === undefined)
            .map((show) => ({ type: 'tv-show', title: show.title }));

        if (missingPosters.length) {
            enqueuePosters(missingPosters);
        }
    }

    return tvShows.sort((a, b) => a.title.localeCompare(b.title));
};

export const getRecentlyAdded = async (): Promise<(Movie | TvShow)[]> => {
    log.info('Scanning for recently added');

    const [movies, tvShows] = await Promise.all([getMovies(), getTvShows()]);

    const items: { item: Movie | TvShow; addedAt: number }[] = [
        ...movies.map((movie) => ({ item: movie, addedAt: movie.addedAt })),
        ...tvShows.map((tvShow) => ({
            item: tvShow,
            addedAt: tvShow.latestAddedAt,
        })),
    ];

    return items
        .sort((a, b) => b.addedAt - a.addedAt)
        .slice(0, 30)
        .map(({ item }) => item);
};
