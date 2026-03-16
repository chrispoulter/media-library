import Store from 'electron-store';
import log from 'electron-log/main';

const store = new Store<Record<string, string | null>>({
    name: 'posters',
    defaults: {},
});

export const getPoster = (key: string): string | null | undefined =>
    store.get(key);

export const setPoster = (key: string, posterUrl: string | null): void => {
    try {
        store.set(key, posterUrl);
    } catch (error) {
        log.error('Failed to save poster:', error);
    }
};
