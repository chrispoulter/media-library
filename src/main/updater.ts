import { app, dialog } from 'electron';
import log from 'electron-log/main';
import { autoUpdater } from 'electron-updater';

export const setupAutoUpdater = (): void => {
    if (!app.isPackaged) {
        log.warn('Auto updates are disabled');
        return;
    }

    // autoUpdater.forceDevUpdateConfig = true
    autoUpdater.logger = log;
    autoUpdater.autoDownload = false;

    autoUpdater.on('update-available', (info) => {
        dialog
            .showMessageBox({
                type: 'info',
                title: 'Update Available',
                message: `Version ${info.version} is available.`,
                detail: 'Would you like to download and install it now?',
                buttons: ['Download', 'Later'],
            })
            .then((result) => {
                if (result.response === 0) {
                    autoUpdater.downloadUpdate();
                }
            });
    });

    autoUpdater.on('update-downloaded', () => {
        dialog
            .showMessageBox({
                type: 'info',
                title: 'Update Ready',
                message: 'Update downloaded.',
                detail: 'The update will be installed when you restart the application. Restart now?',
                buttons: ['Restart Now', 'Later'],
            })
            .then((result) => {
                if (result.response === 0) {
                    autoUpdater.quitAndInstall();
                }
            });
    });

    autoUpdater.on('error', (error) => {
        log.error('Auto update error:', error);
    });

    setTimeout(() => autoUpdater.checkForUpdates(), 5000);
};
