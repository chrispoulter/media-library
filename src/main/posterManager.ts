import log from 'electron-log/main';
import { BrowserWindow } from 'electron';
import { Poster } from '../shared/types';
import { getPosterUrl, setPosterUrl } from './posterStore';
import { fetchPosterUrl } from './tmdbFetcher';

type QueueItem = { title: string; type: 'movie' | 'tv-show' };

const queue: QueueItem[] = [];
let isProcessing = false;

export const enqueuePoster = (
    title: string,
    type: 'movie' | 'tv-show'
): void => {
    log.info('Enqueuing poster image:', { type, title });

    const posterUrl = getPosterUrl(title);

    if (posterUrl !== undefined) {
        return;
    }

    if (queue.some((item) => item.title === title)) {
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
    log.info('Processing poster image:', { type, title });

    let posterUrl: string | null;

    switch (type) {
        case 'movie':
            posterUrl = await fetchPosterUrl(title, 'movie');
            break;

        case 'tv-show':
            posterUrl = await fetchPosterUrl(title, 'tv');
            break;
    }

    setPosterUrl(title, posterUrl);

    if (!posterUrl) {
        return;
    }

    // try {
    //   const postersDir = join(app.getPath('userData'), 'posters')
    //   await mkdir(postersDir, { recursive: true })

    //   const filePath = join(postersDir, `${title}.jpg`)

    //   const response = await fetch(posterUrl)

    //   if (!response.ok) {
    //     console.error('Failed to fetch poster image for', title, 'Status:', response.status)
    //     return
    //   }

    //   const arrayBuffer = await response.arrayBuffer()
    //   const buffer = Buffer.from(arrayBuffer)
    //   await writeFile(filePath, buffer)

    //   // posterUrl = `poster://${title}.jpg`
    //   // await setPosterUrl(title, posterUrl)

    //   console.log('Saved poster image for', title)
    // } catch (error) {
    //   console.error('Error fetching/saving poster image for', title, error)
    // }

    broadcastPosterUpdate({ title, type, posterUrl });
};

const broadcastPosterUpdate = (poster: Poster): void =>
    BrowserWindow.getAllWindows().forEach((win) =>
        win.webContents.send('poster-updated', poster)
    );
