import { useState, Fragment } from 'react';
import clsx from 'clsx';
import defaultTvShowPoster from '../assets/default-tv-show.svg';
import type { TvShow } from '../../../shared/types';
import { ChevronDown, ChevronUp, PlayIcon } from './SvgIcons';
import { relativeTime } from '../utils/time';

type TvShowCardProps = {
    tvShow: TvShow;
    showAddedDate?: boolean;
};

export const TvShowCard = ({
    tvShow,
    showAddedDate,
}: TvShowCardProps): React.JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);

    const seasons = tvShow.seasons.length;

    const episodes = tvShow.seasons.reduce(
        (acc, season) => acc + season.episodes.length,
        0
    );

    return (
        <div
            className={clsx(
                'flex flex-col gap-4 rounded p-2 shadow-sm transition-all duration-150 hover:bg-gray-300 hover:shadow-md dark:bg-gray-700 dark:text-white dark:hover:bg-gray-800',
                isOpen && 'bg-gray-300 shadow-md dark:bg-gray-800'
            )}
        >
            <div
                className="flex cursor-pointer items-center gap-4"
                onClick={() => setIsOpen(!isOpen)}
            >
                <img
                    src={tvShow.posterUrl || defaultTvShowPoster}
                    alt={tvShow.title}
                    className="h-auto w-full max-w-8 rounded"
                    onError={(e) => {
                        e.currentTarget.src = defaultTvShowPoster;
                        e.currentTarget.onerror = null;
                    }}
                />
                <div className="truncate">
                    <h3 className="font-bold">{tvShow.title}</h3>
                    {showAddedDate && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {relativeTime(tvShow.latestAddedAt)}
                        </span>
                    )}
                </div>

                <div className="ml-auto flex items-center gap-4">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {seasons} {seasons === 1 ? 'Season' : 'Seasons'} ·{' '}
                        {episodes} {episodes === 1 ? 'Episode' : 'Episodes'}
                    </span>
                    <span className="rounded bg-teal-500 p-1 px-2 py-1 text-xs text-nowrap text-white">
                        TV Show
                    </span>
                    {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    ) : (
                        <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    )}
                </div>
            </div>
            {isOpen && (
                <Fragment>
                    {tvShow.seasons.flatMap((season) => {
                        const seasonNumber = season.seasonNumber
                            .toString()
                            .padStart(2, '0');

                        return (
                            <Fragment key={season.seasonNumber}>
                                <div className="mt-4 mb-2 border-b border-gray-200 pb-1 text-lg font-bold text-gray-400 dark:border-gray-700 dark:text-gray-500">
                                    S{seasonNumber}
                                </div>
                                <div
                                    key={season.seasonNumber}
                                    className="flex flex-col gap-1"
                                >
                                    {season.episodes.map((episode) => {
                                        const episodeNumber =
                                            episode.episodeNumber
                                                .toString()
                                                .padStart(2, '0');

                                        return (
                                            <div
                                                key={episode.episodeNumber}
                                                onClick={() =>
                                                    window.api.openTvShowFile(
                                                        episode.filePath
                                                    )
                                                }
                                                className="flex cursor-pointer items-center gap-2 rounded bg-gray-100 p-2 transition-colors duration-150 hover:bg-gray-200 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                                            >
                                                <span className="truncate text-sm">
                                                    S{seasonNumber}E
                                                    {episodeNumber}
                                                </span>
                                                <small className="ml-auto rounded bg-gray-500 px-2 py-1 text-xs text-white uppercase">
                                                    {episode.fileExtension}
                                                </small>
                                                <PlayIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                            </div>
                                        );
                                    })}
                                </div>
                            </Fragment>
                        );
                    })}
                </Fragment>
            )}
        </div>
    );
};
