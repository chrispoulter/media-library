import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import { Settings, Movie, TvShow, MediaEvent } from '../shared/types';

// Custom APIs for renderer
const api = {
    getAppVersion: (): Promise<string> => ipcRenderer.invoke('get-app-version'),
    openLogFile: (): Promise<void> => ipcRenderer.invoke('open-log-file'),
    selectDirectory: (defaultPath?: string): Promise<string | null> =>
        ipcRenderer.invoke('select-directory', defaultPath),
    getSettings: (): Promise<Settings> => ipcRenderer.invoke('get-settings'),
    setSettings: (settings: Settings): Promise<void> =>
        ipcRenderer.invoke('set-settings', settings),
    openMoveFile: (filePath: string): Promise<void> =>
        ipcRenderer.invoke('open-move-file', filePath),
    openTvShowFile: (filePath: string): Promise<void> =>
        ipcRenderer.invoke('open-tv-show-file', filePath),
    getRecentlyAdded: (): Promise<(Movie | TvShow)[]> =>
        ipcRenderer.invoke('get-recently-added'),
    getMovies: (): Promise<Movie[]> => ipcRenderer.invoke('get-movies'),
    getTvShows: (): Promise<TvShow[]> => ipcRenderer.invoke('get-tv-shows'),
    refetchPosters: (failedOnly?: boolean): Promise<void> =>
        ipcRenderer.invoke('refetch-posters', failedOnly),
    onMediaEvent: (callback: (event: MediaEvent) => void) => {
        const listener = (
            _: Electron.IpcRendererEvent,
            event: MediaEvent
        ): void => callback(event);
        ipcRenderer.on('media-event', listener);
        return () => ipcRenderer.removeListener('media-event', listener);
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
