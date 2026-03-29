import { memo } from 'react';
import defaultMoviePoster from '../../assets/default-movie.svg';
import { PosterImage } from '../ui/PosterImage';
import { PlayIcon } from '../ui/SvgIcons';
import { relativeTime } from '../../utils/time';
import type { Movie } from '../../../../shared/types';

type MovieCardProps = {
    movie: Movie;
    showAddedDate?: boolean;
};

const MovieCardComponent = ({
    movie,
    showAddedDate,
}: MovieCardProps): React.JSX.Element => {
    return (
        <button
            type="button"
            onClick={() => window.api.openMovieFile(movie.filePath)}
            className="flex w-full cursor-pointer items-center gap-4 rounded-lg border border-zinc-200 bg-white p-2 text-left transition-all duration-150 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
        >
            <PosterImage
                src={movie.posterUrl}
                alt={movie.title}
                fallbackSrc={defaultMoviePoster}
            />
            <div className="truncate">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {movie.title}
                </h3>
                {showAddedDate && (
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {relativeTime(movie.addedAt)}
                    </span>
                )}
            </div>
            <div className="ml-auto flex items-center gap-2">
                <span className="min-w-14 rounded border border-violet-300 bg-violet-100 px-2 py-1 text-center text-xs text-violet-700 dark:border-violet-700/50 dark:bg-violet-900/20 dark:text-violet-300">
                    Movie
                </span>
                <span className="min-w-14 rounded border border-zinc-300 bg-zinc-100 px-2 py-1 text-center text-xs text-zinc-600 uppercase dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {movie.fileExtension}
                </span>
                <PlayIcon className="h-5 w-5 text-zinc-500 dark:text-zinc-300" />
            </div>
        </button>
    );
};

export const MovieCard = memo(MovieCardComponent);
