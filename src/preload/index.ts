import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge, ipcRenderer } from 'electron';
import type { Settings, Movie, TvShow, Event } from '../shared/types';

// Custom APIs for renderer
const api = {
    getVersion: (): Promise<string> => ipcRenderer.invoke('get-version'),
    openLogFile: (): Promise<void> => ipcRenderer.invoke('open-log-file'),
    selectDirectory: (defaultPath?: string): Promise<string | null> =>
        ipcRenderer.invoke('select-directory', defaultPath),
    getSettings: (): Promise<Settings> => ipcRenderer.invoke('get-settings'),
    setSettings: (settings: Settings): Promise<void> =>
        ipcRenderer.invoke('set-settings', settings),
    openMovieFile: (filePath: string): Promise<void> =>
        ipcRenderer.invoke('open-movie-file', filePath),
    openTvShowFile: (filePath: string): Promise<void> =>
        ipcRenderer.invoke('open-tv-show-file', filePath),
    getRecentlyAdded: (): Promise<(Movie | TvShow)[]> =>
        ipcRenderer.invoke('get-recently-added'),
    getMovies: (): Promise<Movie[]> => ipcRenderer.invoke('get-movies'),
    getTvShows: (): Promise<TvShow[]> => ipcRenderer.invoke('get-tv-shows'),
    refetchPosters: (failedOnly?: boolean): Promise<void> =>
        ipcRenderer.invoke('refetch-posters', failedOnly),
    onEvent: (callback: (event: Event) => void) => {
        const listener = (_: Electron.IpcRendererEvent, event: Event): void =>
            callback(event);
        ipcRenderer.on('event', listener);
        return () => ipcRenderer.removeListener('event', listener);
    },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI);
        contextBridge.exposeInMainWorld('api', api);
    } catch (error) {
        console.error(error);
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI;
    // @ts-ignore (define in dts)
    window.api = api;
}
