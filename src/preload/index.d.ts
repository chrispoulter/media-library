import { ElectronAPI } from '@electron-toolkit/preload';
import type { Settings, Movie, TvShow, Poster } from '../shared/types';

declare global {
    interface Window {
        electron: ElectronAPI;
        api: {
            getAppVersion: () => Promise<string>;
            openLogFile: () => Promise<void>;
            selectDirectory: (defaultPath?: string) => Promise<string | null>;
            getSettings: () => Promise<Settings>;
            setSettings: (settings: Settings) => Promise<void>;
            openMoveFile: (filePath: string) => Promise<void>;
            openTvShowFile: (filePath: string) => Promise<void>;
            getRecentlyAdded: () => Promise<(Movie | TvShow)[]>;
            getMovies: () => Promise<Movie[]>;
            getTvShows: () => Promise<TvShow[]>;
            onPosterUpdated: (callback: (data: Poster) => void) => () => void;
        };
    }
}
