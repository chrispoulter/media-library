import Store from 'electron-store';
import log from 'electron-log/main';

const store = new Store<Record<string, string | null>>({
    name: 'posters',
    defaults: {},
});

export const getPosterUrl = (
    type: 'movie' | 'tv-show',
    key: string
): string | null | undefined => store.get(`${type}:${key}`);

export const setPosterUrl = (
    type: 'movie' | 'tv-show',
    key: string,
    posterUrl: string | null
): void => {
    try {
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
