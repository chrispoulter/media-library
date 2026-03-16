import { ElectronAPI } from '@electron-toolkit/preload';
import type { Settings, Movie, TvShow, Poster } from '../shared/types';

declare global {
    interface Window {
        electron: ElectronAPI;
        api: {
            getAppVersion: () => Promise<string>;
            openLogFile: () => Promise<void>;
            openFile: (filePath: string) => Promise<void>;
            getSettings: () => Promise<Settings>;
            setSettings: (settings: Settings) => Promise<void>;
            getRecentlyAdded: () => Promise<(Movie | TvShow)[]>;
            getMovies: () => Promise<Movie[]>;
            getTvShows: () => Promise<TvShow[]>;
            onPosterUpdated: (callback: (data: Poster) => void) => () => void;
        };
    }
}
