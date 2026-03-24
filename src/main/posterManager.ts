import { BrowserWindow } from 'electron';
import log from 'electron-log/main';
import { setPosterUrl } from './posterStore';
import { getSettings } from './settingsStore';
import { fetchPosterUrl } from './tmdbFetcher';
import type { Event } from '../shared/types';

export type QueueItem = { type: 'movie' | 'tv-show'; title: string };

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

const processItem = async ({ title, type }: QueueItem): Promise<void> => {
    let posterUrl: string | null | undefined;

    switch (type) {
        case 'movie':
            posterUrl = await fetchPosterUrl('movie', title);
            break;

        case 'tv-show':
            posterUrl = await fetchPosterUrl('tv', title);
            break;
    }

    setPosterUrl(type, title, posterUrl);

    broadcast({ kind: 'poster-updated', type, title, posterUrl });
};

const broadcast = (event: Event): void =>
    BrowserWindow.getAllWindows().forEach((win) =>
        win.webContents.send('event', event)
    );
