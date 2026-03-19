import React from 'react';
import { useMoviesQuery } from '../hooks/useMediaQueries';
import { useDebounce } from '../hooks/useDebounce';
import { AlphabetBar } from './AlphabetBar';
import { SearchBar } from './SearchBar';
import { MovieCard } from './MovieCard';
import { MovieCardSkeleton } from './MovieCardSkeleton';

export const MoviesView = (): React.JSX.Element => {
    const [search, setSearch] = React.useState('');
    const debouncedSearch = useDebounce(search);
    const { data: movies, isLoading, error } = useMoviesQuery();

    const filtered = movies?.filter((movie) =>
        movie.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    let lastLetter = '';

    const items = filtered?.map((movie) => {
        const letter = movie.title[0]?.toUpperCase() ?? '#';
        const showDivider = letter !== lastLetter;
        lastLetter = letter;
        return { movie, letter, showDivider };
    });

    const availableLetters = new Set(items?.map((i) => i.letter));

    return (
        <div className="dark:text-white">
            <h2 className="mb-4 text-2xl font-bold">Movies</h2>
            <SearchBar
                placeholder="Search movies..."
                value={search}
                onChange={setSearch}
            />
            {availableLetters.size && (
                <AlphabetBar availableLetters={availableLetters} />
            )}
            {isLoading ? (
                <div className="flex flex-col gap-2">
                    {Array.from({ length: 15 }).map((_, i) => (
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
            ) : !items?.length ? (
                <div className="text-gray-500">
                    {search
                        ? 'No movies match your search.'
                        : 'No movies found. Check your Movies folder in Settings.'}
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {items.map(({ movie, letter, showDivider }, index) => {
                        return (
                            <React.Fragment key={index}>
                                {showDivider && (
                                    <div
                                        id={`letter-${letter}`}
                                        className="mt-4 mb-2 border-b border-gray-200 pb-1 text-lg font-bold text-gray-400 dark:border-gray-700 dark:text-gray-500"
                                    >
                                        {letter}
                                    </div>
                                )}
                                <MovieCard movie={movie} />
                            </React.Fragment>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
