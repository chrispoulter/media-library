import defaultMoviePoster from '../../assets/default-movie.svg';
import { PlayIcon } from '../ui/SvgIcons';
import { relativeTime } from '../../utils/time';
import type { Movie } from '../../../../shared/types';

type MovieCardProps = {
    movie: Movie;
    showAddedDate?: boolean;
};

export const MovieCard = ({
    movie,
    showAddedDate,
}: MovieCardProps): React.JSX.Element => {
    return (
        <button
            type="button"
            onClick={() => window.api.openMovieFile(movie.filePath)}
            className="flex w-full cursor-pointer items-center gap-4 rounded bg-white p-2 text-left shadow-sm transition-all duration-150 hover:bg-zinc-50 hover:shadow-md dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
        >
            <img
                src={movie.posterUrl || defaultMoviePoster}
                alt={movie.title}
                className="h-auto w-full max-w-8 rounded"
                onError={(e) => {
                    e.currentTarget.src = defaultMoviePoster;
                    e.currentTarget.onerror = null;
                }}
            />
            <div className="truncate">
                <h3 className="font-bold text-zinc-900 dark:text-white">
                    {movie.title}
                </h3>
                {showAddedDate && (
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {relativeTime(movie.addedAt)}
                    </span>
                )}
            </div>
            <div className="ml-auto flex items-center gap-2">
                <span className="min-w-14 rounded bg-purple-500 px-2 py-1 text-center text-xs text-white">
                    Movie
                </span>
                <span className="min-w-14 rounded bg-zinc-500 px-2 py-1 text-center text-xs text-white uppercase">
                    {movie.fileExtension}
                </span>
                <PlayIcon className="h-5 w-5 text-zinc-500 dark:text-zinc-300" />
            </div>
        </button>
    );
};
