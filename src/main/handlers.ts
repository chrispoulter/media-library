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

    ipcMain.handle('open-move-file', (_, filePath: string) => {
        const { moviesDirectory } = getSettings();
        if (moviesDirectory && filePath.startsWith(moviesDirectory)) {
            return shell.openPath(filePath);
        }

        return dialog.showErrorBox(
            'Invalid File',
            'The selected file is not in the movies directory.'
        );
    });

    ipcMain.handle('open-tv-show-file', (_, filePath: string) => {
        const { tvShowsDirectory } = getSettings();

        if (tvShowsDirectory && filePath.startsWith(tvShowsDirectory)) {
            return shell.openPath(filePath);
        }

        return dialog.showErrorBox(
            'Invalid File',
            'The selected file is not in the TV shows directory.'
        );
    });

    ipcMain.handle('get-recently-added', () => getRecentlyAdded());
    ipcMain.handle('get-movies', () => getMovies());
    ipcMain.handle('get-tv-shows', () => getTvShows());
};
