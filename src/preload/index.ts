import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import { Settings, Movie, TvShow, Poster } from '../shared/types';

// Custom APIs for renderer
const api = {
    getAppVersion: (): Promise<string> => ipcRenderer.invoke('get-app-version'),
    openLogFile: (): Promise<void> => ipcRenderer.invoke('open-log-file'),
    openFile: (filePath: string): Promise<void> =>
        ipcRenderer.invoke('open-file', filePath),
    getSettings: (): Promise<Settings> => ipcRenderer.invoke('get-settings'),
    setSettings: (settings: Settings): Promise<void> =>
        ipcRenderer.invoke('set-settings', settings),
    getRecentlyAdded: (): Promise<(Movie | TvShow)[]> =>
        ipcRenderer.invoke('get-recently-added'),
    getMovies: (): Promise<Movie[]> => ipcRenderer.invoke('get-movies'),
    getTvShows: (): Promise<TvShow[]> => ipcRenderer.invoke('get-tv-shows'),
    onPosterUpdated: (callback: (data: Poster) => void) => {
        const listener = (_: Electron.IpcRendererEvent, data: Poster): void =>
            callback(data);
        ipcRenderer.on('poster-updated', listener);
        return () => ipcRenderer.removeListener('poster-updated', listener);
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
