import { mkdir, rm, utimes, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = dirname(__dirname);
const testMediaRoot = join(repoRoot, 'test-media');
const moviesRoot = join(testMediaRoot, 'movies');
const tvShowsRoot = join(testMediaRoot, 'tv-shows');

const FILE_BYTES = Buffer.from('sample media placeholder\n', 'utf8');
const START_AT = new Date('2026-03-12T09:00:00Z').getTime();
const STEP_MS = 1000 * 60 * 60 * 6;

const movies = [
    { folder: 'D', file: 'Dune - Part Two (2024).mkv' },
    { folder: 'E', file: 'Everything Everywhere All at Once (2022).webm' },
    { folder: 'M', file: 'Mad Max - Fury Road (2015).mp4' },
    { folder: 'M', file: 'Not a video file.txt' },
    { folder: 'P', file: 'Parasite (2019).mkv' },
    { folder: 'S', file: 'Spider-Man - Into the Spider-Verse (2018).m4v' },
    { folder: 'T', file: 'The Matrix (1999).mkv' },
    { folder: 'T', file: 'The Unknown Movie (1999).mkv' },
];

const tvShows = [
    {
        folder: 'Breaking Bad',
        episodes: [
            'Breaking Bad S01E01.mkv',
            'Breaking Bad S01E02.mkv',
            'Breaking Bad S01E03.mkv',
            'Breaking Bad S02E01.mp4',
            'Breaking Bad S02E02.mp4',
        ],
    },
    {
        folder: 'Stranger Things',
        episodes: [
            'Stranger Things S01E01.mkv',
            'Stranger Things S01E02.mkv',
            'Stranger Things S02E01.mp4',
            'Stranger Things S04E01.mkv',
        ],
    },
    {
        folder: 'The Bear',
        episodes: [
            'The Bear S01E01.m4v',
            'The Bear S01E02.m4v',
            'The Bear S02E01.mov',
        ],
    },
    {
        folder: 'Severance',
        episodes: [
            'Severance S01E01.mkv',
            'Severance S01E02.mkv',
            'Severance S02E01.avi',
        ],
    },
];

const setTimestamp = async (filePath, index) => {
    const timestamp = new Date(START_AT - index * STEP_MS);
    await utimes(filePath, timestamp, timestamp);
};

const createPlaceholderFile = async (filePath, index) => {
    await writeFile(filePath, FILE_BYTES);
    await setTimestamp(filePath, index);
};

const generate = async () => {
    await rm(testMediaRoot, { recursive: true, force: true });
    await mkdir(moviesRoot, { recursive: true });
    await mkdir(tvShowsRoot, { recursive: true });

    let fileIndex = 0;

    for (const movie of movies) {
        const folderPath = join(moviesRoot, movie.folder);
        const filePath = join(folderPath, movie.file);

        await mkdir(folderPath, { recursive: true });
        await createPlaceholderFile(filePath, fileIndex);
        fileIndex += 1;
    }

    for (const show of tvShows) {
        const folderPath = join(tvShowsRoot, show.folder);
        await mkdir(folderPath, { recursive: true });

        for (const episode of show.episodes) {
            const filePath = join(folderPath, episode);
            await createPlaceholderFile(filePath, fileIndex);
            fileIndex += 1;
        }
    }

    console.log(`Sample media library created at ${testMediaRoot}`);
    console.log(`Movies directory: ${moviesRoot}`);
    console.log(`TV shows directory: ${tvShowsRoot}`);
    console.log(
        `Created ${fileIndex} placeholder media files with staggered modified times.`
    );
};

generate().catch((error) => {
    console.error('Failed to generate sample media library:', error);
    process.exitCode = 1;
});
