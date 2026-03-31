import { BrowserWindow } from 'electron';
import log from 'electron-log/main';
import { setPosterUrl } from './posterStore';
import { getSettings } from './settingsStore';
import { fetchPosterUrl } from './tmdbFetcher';
import type { Event, MediaType } from '../shared/types';

export type QueueItem = { type: MediaType; title: string };

const queue: QueueItem[] = [];
let isProcessing = false;

export const enqueuePosters = (items: QueueItem[]): void => {
    log.debug('Enqueuing posters:', items);

    const { tmdbApiKey } = getSettings();

    if (!tmdbApiKey) {
        return;
    }

    const unqueuedItems = items.filter(
        (item) =>
            !queue.some(
                (queuedItem) =>
                    queuedItem.type === item.type &&
                    queuedItem.title === item.title
            )
    );

    if (!unqueuedItems.length) {
        return;
    }

    queue.push(...unqueuedItems);

    if (!isProcessing) {
        processQueue();
    }
};

export const clearQueue = (): void => {
    log.debug('Clearing poster queue');
    queue.length = 0;
};

const processQueue = async (): Promise<void> => {
    isProcessing = true;

    while (queue.length > 0) {
        const item = queue.shift();

        if (item) {
            await processItem(item);
        }

        if (queue.length > 0) {
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
    }

    isProcessing = false;
};

const processItem = async ({ type, title }: QueueItem): Promise<void> => {
    const posterUrl = await fetchPosterUrl(type, title);
    setPosterUrl(type, title, posterUrl);
    broadcast({ kind: 'poster-updated', type, title, posterUrl });
};

const broadcast = (event: Event): void => {
    const mainWindow = BrowserWindow.getAllWindows()[0];
    mainWindow.webContents.send('event', event);
};
