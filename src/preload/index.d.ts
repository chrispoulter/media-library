import { ElectronAPI } from '@electron-toolkit/preload';
import type { Settings, Movie, TvShow, Event } from '../shared/types';

declare global {
    interface Window {
        electron: ElectronAPI;
        api: {
            getVersion: () => Promise<string>;
            openLogFile: () => Promise<void>;
            selectDirectory: (defaultPath?: string) => Promise<string | null>;
            getSettings: () => Promise<Settings>;
            setSettings: (settings: Settings) => Promise<void>;
            openMoveFile: (filePath: string) => Promise<void>;
            openTvShowFile: (filePath: string) => Promise<void>;
            getRecentlyAdded: () => Promise<(Movie | TvShow)[]>;
            getMovies: () => Promise<Movie[]>;
            getTvShows: () => Promise<TvShow[]>;
            refetchPosters: (failedOnly?: boolean) => Promise<void>;
            onEvent: (callback: (event: Event) => void) => () => void;
        };
    }
}
