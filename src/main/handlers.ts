import { app, shell, ipcMain, dialog } from 'electron';
import log from 'electron-log/main';
import type { Settings } from '../shared/types';
import { getSettings, setSettings } from './settingsStore';
import { getMovies, getRecentlyAdded, getTvShows } from './mediaScanner';

export const registerHandlers = (): void => {
    ipcMain.handle('get-app-version', () => app.getVersion());
    ipcMain.handle('open-log-file', () =>
        shell.openPath(log.transports.file.getFile().path)
    );
    ipcMain.handle('open-file', (_, filePath: string) =>
        shell.openPath(filePath)
    );
    ipcMain.handle('select-directory', async (_, defaultPath?: string) => {
        const result = await dialog.showOpenDialog({
            properties: ['openDirectory'],
            ...(defaultPath ? { defaultPath } : {}),
        });
        return result.canceled ? null : result.filePaths[0];
    });
    ipcMain.handle('get-settings', () => getSettings());
    ipcMain.handle('set-settings', (_, settings: Settings) =>
        setSettings(settings)
    );
    ipcMain.handle('get-recently-added', () => getRecentlyAdded());
    ipcMain.handle('get-movies', () => getMovies());
    ipcMain.handle('get-tv-shows', () => getTvShows());

    // protocol.handle('poster', (request) => {
    //   const filePath = request.url.slice('poster://'.length).split('?')[0]

    //   return net.fetch(
    //     pathToFileURL(
    //       join(app.getPath('userData'), 'posters', decodeURIComponent(filePath))
    //     ).toString()
    //   )
    // })
};
