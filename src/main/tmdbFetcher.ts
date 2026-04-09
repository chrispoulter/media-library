import log from 'electron-log/main';
import { getSettings } from './settingsStore';
import type { MediaType } from '../shared/types';

interface TmdbSearchResponse {
    results: {
        poster_path: string | null;
    }[];
}

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

export const fetchPosterUrl = async (
    type: MediaType,
    title: string
): Promise<string | null | undefined> => {
    log.info('Fetching poster:', { type, title });

    const { tmdbApiKey } = getSettings();

    if (!tmdbApiKey) {
        return undefined;
    }

    let endpoint: string;

    switch (type) {
        case 'movie':
            endpoint = 'movie';
            break;
        case 'tv-show':
            endpoint = 'tv';
            break;
        default:
            throw new Error(`Unsupported media type: ${type}`);
    }

    const { query, year } = parseQueryAndYear(title);
    const params = new URLSearchParams({ query, year });

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
        const response = await fetch(
            `${API_URL}/search/${endpoint}?${params.toString()}`,
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

        const data: TmdbSearchResponse = await response.json();
        const posterPath = data.results?.[0]?.poster_path;

        if (!posterPath) {
            log.warn('No poster found for:', { type, title });
            return null;
        }

        return `${IMAGE_URL}${posterPath}`;
    } catch (error) {
        log.error('Error fetching poster:', error);
        return null;
    } finally {
        clearTimeout(id);
    }
};
