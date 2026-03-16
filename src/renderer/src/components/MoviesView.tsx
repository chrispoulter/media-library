import React from 'react';
import { useMoviesQuery } from '../hooks/useMediaQueries';
import { SearchBar } from './SearchBar';
import { MovieCard } from './MovieCard';
import { MovieCardSkeleton } from './MovieCardSkeleton';

export const MoviesView = (): React.JSX.Element => {
    const [search, setSearch] = React.useState('');
    const { data: movies, isLoading, error } = useMoviesQuery();

    const filtered = movies?.filter((movie) =>
        movie.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="dark:text-white">
            <h2 className="mb-4 text-2xl font-bold">Movies</h2>
            <SearchBar
                placeholder="Search movies..."
                value={search}
                onChange={setSearch}
            />
            {isLoading ? (
                <div className="flex flex-col gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <MovieCardSkeleton key={i} />
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-900/20">
                    <p className="font-medium text-red-700 dark:text-red-400">
                        Something went wrong
                    </p>
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                        {error instanceof Error
                            ? error.message
                            : 'An unexpected error occurred'}
                    </p>
                </div>
            ) : !filtered?.length ? (
                <div className="text-gray-500">
                    {search
                        ? 'No movies match your search.'
                        : 'No movies found. Check your Movies folder in Settings.'}
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {filtered.map((movie, index) => (
                        <MovieCard key={index} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
};
