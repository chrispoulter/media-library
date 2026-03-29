import log from 'electron-log/main';
import Store from 'electron-store';
import type { MediaType } from '../shared/types';

const store = new Store<Record<string, string | null>>({
    name: 'posters',
    defaults: {},
});

export const getPosterUrl = (
    type: MediaType,
    key: string
): string | null | undefined => store.get(`${type}:${key}`);

export const setPosterUrl = (
    type: MediaType,
    key: string,
    posterUrl: string | null | undefined
): void => {
    try {
        if (posterUrl === undefined) {
            store.delete(`${type}:${key}`);
            return;
        }

        store.set(`${type}:${key}`, posterUrl);
    } catch (error) {
        log.error('Failed to save poster url:', error);
    }
};

export const clearPosterUrls = async (failedOnly?: boolean): Promise<void> => {
    try {
        if (!failedOnly) {
            return store.clear();
        }

        const keys = Object.keys(store.store ?? {});

        for (const key of keys) {
            if (store.get(key) === null) {
                store.delete(key);
            }
        }
    } catch (error) {
        log.error('Failed to clear poster urls:', error);
    }
};
