import log from 'electron-log/main';
import { getSettings } from './settingsStore';

type TmdbMovieResult = {
    poster_path: string | null;
};

type TmdbTvResult = {
    poster_path: string | null;
};

type TmdbSearchResponse<T> = {
    results: T[];
};

const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w300';
const FETCH_TIMEOUT_MS = 3_000;

const parseQueryAndYear = (title: string): { query: string; year: string } => {
    const match = title.match(/(.*?)(?:\s*\((\d{4})\))?$/);

    if (match) {
        return { query: match[1].replace(/\./g, ' ').trim(), year: match[2] };
    }

    return { query: title, year: '' };
};

export const getPosterUrlForMovie = async (
    title: string
): Promise<string | null> => {
    log.info('Fetching poster for movie:', title);

    const { tmdbApiKey } = getSettings();

    if (!tmdbApiKey) {
        return null;
    }

    const { query, year } = parseQueryAndYear(title);
    const params = new URLSearchParams({ query, year });

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
        const response = await fetch(
            `${API_URL}/search/movie?${params.toString()}`,
            {
                headers: { Authorization: `Bearer ${tmdbApiKey}` },
                signal: controller.signal,
            }
        );

        if (!response.ok) {
            throw new Error(
                `TMDb responded with ${response.status} ${response.statusText}`
            );
        }

        const data: TmdbSearchResponse<TmdbMovieResult> = await response.json();

        if (data.results && data.results.length > 0) {
            const posterPath = data.results[0].poster_path;
            return posterPath ? `${IMAGE_URL}${posterPath}` : null;
        }

        return null;
    } catch (error) {
        log.error('Error fetching movie poster:', error);
        return null;
    } finally {
        clearTimeout(id);
    }
};

export const getPosterUrlForTvShow = async (
    title: string
): Promise<string | null> => {
    log.info('Fetching poster for tv show:', title);

    const { tmdbApiKey } = getSettings();

    if (!tmdbApiKey) {
        return null;
    }

    const { query, year } = parseQueryAndYear(title);
    const params = new URLSearchParams({ query, year });

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
        const response = await fetch(
            `${API_URL}/search/tv?${params.toString()}`,
            {
                headers: { Authorization: `Bearer ${tmdbApiKey}` },
                signal: controller.signal,
            }
        );

        if (!response.ok) {
            throw new Error(
                `TMDb responded with ${response.status} ${response.statusText}`
            );
        }

        const data: TmdbSearchResponse<TmdbTvResult> = await response.json();

        if (data.results && data.results.length > 0) {
            const posterPath = data.results[0].poster_path;
            return posterPath ? `${IMAGE_URL}${posterPath}` : null;
        }

        return null;
    } catch (error) {
        log.error('Error fetching tv show poster:', error);
        return null;
    } finally {
        clearTimeout(id);
    }
};
