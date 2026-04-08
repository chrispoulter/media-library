import { BrowserWindow } from 'electron';
import log from 'electron-log/main';
import Store from 'electron-store';

interface WindowState {
    width: number;
    height: number;
    x: number | undefined;
    y: number | undefined;
    isMaximized: boolean;
}

const store = new Store<WindowState>({
    name: 'window-state',
    defaults: {
        width: 1280,
        height: 730,
        x: undefined,
        y: undefined,
        isMaximized: false,
    },
});

export const getWindowState = (): WindowState => store.store;

export const setWindowState = (win: BrowserWindow): void => {
    const isMaximized = win.isMaximized();
    const bounds = isMaximized ? win.getNormalBounds() : win.getBounds();

    try {
        store.store = {
            width: bounds.width,
            height: bounds.height,
            x: bounds.x,
            y: bounds.y,
            isMaximized,
        };
    } catch (error) {
        log.error('Failed to save window state:', error);
    }
};
