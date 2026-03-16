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

export const deletePosterUrl = (type: 'movie' | 'tv-show', key: string): void =>
    store.delete(`${type}:${key}`);

export const getNullPosterKeys = (): {
    type: 'movie' | 'tv-show';
    title: string;
}[] =>
    (Object.entries(store.store) as [string, string | null][])
        .filter(([, v]) => v === null)
        .map(([k]) => {
            const [type, ...rest] = k.split(':');
            return { type: type as 'movie' | 'tv-show', title: rest.join(':') };
        });

export const clearPosterStore = (): void => store.clear();
