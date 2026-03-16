import { useState } from 'react';
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

    return (
        <div className="flex flex-col gap-4 rounded bg-gray-200 p-2 shadow-sm transition-all duration-150 hover:bg-gray-300 hover:shadow-md dark:bg-gray-700 dark:text-white dark:hover:bg-gray-800">
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
                        {tvShow.seasonCount}{' '}
                        {tvShow.seasonCount === 1 ? 'Season' : 'Seasons'} ·{' '}
                        {tvShow.episodeCount}{' '}
                        {tvShow.episodeCount === 1 ? 'Episode' : 'Episodes'}
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
                <div className="flex flex-col gap-1">
                    {tvShow.episodes.map((episode, index) => (
                        <div
                            key={index}
                            onClick={() =>
                                window.api.openFile(episode.filePath)
                            }
                            className="flex cursor-pointer items-center gap-2 rounded bg-gray-100 p-2 transition-colors duration-150 hover:bg-gray-200 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                        >
                            <span className="truncate text-sm">
                                {episode.title}
                            </span>
                            <small className="ml-auto rounded bg-gray-500 px-2 py-1 text-xs text-white uppercase">
                                {episode.fileExtension}
                            </small>
                            <PlayIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
