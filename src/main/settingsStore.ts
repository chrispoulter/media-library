import log from 'electron-log/main';
import Store from 'electron-store';
import type { Settings } from '../shared/types';

const store = new Store<Settings>({
    name: 'settings',
    defaults: {
        theme: 'system',
        moviesDirectory: '',
        tvShowsDirectory: '',
        tmdbApiKey: '',
    },
});

export const getSettings = (): Settings => store.store;

export const setSettings = (settings: Settings): void => {
    try {
        store.store = settings;
    } catch (error) {
        log.error('Failed to save settings:', error);
    }
};
