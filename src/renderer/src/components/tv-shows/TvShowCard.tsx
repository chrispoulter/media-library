import { Fragment, useState } from 'react';
import defaultTvShowPoster from '../../assets/default-tv-show.svg';
import { Divider } from '../ui/Divider';
import { ChevronDown, ChevronUp, PlayIcon } from '../ui/SvgIcons';
import { relativeTime } from '../../utils/time';
import type { TvShow } from '../../../../shared/types';

type TvShowCardProps = {
    tvShow: TvShow;
    showAddedDate?: boolean;
};

export const TvShowCard = ({
    tvShow,
    showAddedDate,
}: TvShowCardProps): React.JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);

    const seasonCount = tvShow.seasons.length;

    const episodeCount = tvShow.seasons.reduce(
        (acc, season) => acc + season.episodes.length,
        0
    );

    return (
        <article className="flex flex-col gap-2">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                className="flex w-full cursor-pointer items-center gap-4 rounded bg-white p-2 text-left shadow-sm transition-all duration-150 hover:bg-zinc-50 hover:shadow-md dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
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
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                        {tvShow.title}
                    </h3>
                    {showAddedDate && (
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {relativeTime(tvShow.latestAddedAt)}
                        </span>
                    )}
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {seasonCount} {seasonCount === 1 ? 'Season' : 'Seasons'}{' '}
                        · {episodeCount}{' '}
                        {episodeCount === 1 ? 'Episode' : 'Episodes'}
                    </span>
                    <span className="min-w-14 rounded bg-teal-500 p-1 px-2 py-1 text-center text-xs text-nowrap text-white">
                        TV Show
                    </span>
                    {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-zinc-500 dark:text-zinc-300" />
                    ) : (
                        <ChevronDown className="h-5 w-5 text-zinc-500 dark:text-zinc-300" />
                    )}
                </div>
            </button>
            {isOpen && (
                <div className="mx-5 flex flex-col gap-1">
                    {tvShow.seasons.map((season, seasonIndex) => {
                        const seasonLabel = `S${season.seasonNumber.toString().padStart(2, '0')}`;
                        return (
                            <Fragment key={seasonIndex}>
                                <Divider label={seasonLabel} />
                                {season.episodes.map(
                                    (episode, episodeIndex) => {
                                        const episodeLabel = `E${episode.episodeNumber.toString().padStart(2, '0')}`;
                                        return (
                                            <button
                                                type="button"
                                                key={`${seasonIndex}-${episodeIndex}`}
                                                onClick={() =>
                                                    window.api.openTvShowFile(
                                                        episode.filePath
                                                    )
                                                }
                                                className="flex w-full cursor-pointer items-center gap-4 rounded bg-white p-2 text-left shadow-sm transition-all duration-150 hover:bg-zinc-50 hover:shadow-md dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                                            >
                                                <span className="truncate text-sm">
                                                    {tvShow.title} {seasonLabel}
                                                    {episodeLabel}
                                                </span>
                                                <span className="ml-auto min-w-14 rounded bg-zinc-500 px-2 py-1 text-center text-xs text-white uppercase">
                                                    {episode.fileExtension}
                                                </span>
                                                <PlayIcon className="h-5 w-5 text-zinc-500 dark:text-zinc-300" />
                                            </button>
                                        );
                                    }
                                )}
                            </Fragment>
                        );
                    })}
                </div>
            )}
        </article>
    );
};
