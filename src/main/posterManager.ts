import log from 'electron-log/main';
import { BrowserWindow } from 'electron';
import { Poster } from '../shared/types';
import { setPosterUrl } from './posterStore';
import { fetchPosterUrl } from './tmdbFetcher';

type QueueItem = { type: 'movie' | 'tv-show'; title: string };

const queue: QueueItem[] = [];
let isProcessing = false;

export const enqueuePoster = (
    type: 'movie' | 'tv-show',
    title: string
): void => {
    log.info('Enqueuing poster:', { type, title });

    if (queue.some((item) => item.type === type && item.title === title)) {
        return;
    }

    queue.push({ title, type });

    if (!isProcessing) {
        processQueue();
    }
};

const processQueue = async (): Promise<void> => {
    isProcessing = true;

    while (queue.length > 0) {
        const item = queue.shift();

        if (item) {
            await processItem(item);
        }

        if (queue.length > 0) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    isProcessing = false;
};

const processItem = async ({ title, type }: QueueItem): Promise<void> => {
    log.info('Processing poster:', { type, title });

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

    if (!posterUrl) {
        return;
    }

    broadcastPosterUpdate({ title, type, posterUrl });
};

const broadcastPosterUpdate = (poster: Poster): void =>
    BrowserWindow.getAllWindows().forEach((win) =>
        win.webContents.send('poster-updated', poster)
    );
