import React from 'react';
import { useMoviesQuery } from '../hooks/useMediaQueries';
import { useDebounce } from '../hooks/useDebounce';
import { SearchBar } from './SearchBar';
import { AlphabetBar } from './AlphabetBar';
import { MovieCard } from './MovieCard';
import { MovieCardSkeleton } from './MovieCardSkeleton';
import { Divider } from './Divider';

export const MoviesView = (): React.JSX.Element => {
    const [search, setSearch] = React.useState('');
    const debouncedSearch = useDebounce(search);
    const searchLower = debouncedSearch.toLowerCase();

    const { data: movies, isLoading, error } = useMoviesQuery();

    const { items, availableLetters } = React.useMemo(() => {
        if (!movies) {
            return {
                items: undefined,
                availableLetters: undefined,
            };
        }

        const filtered = movies.filter((movie) =>
            movie.title.toLowerCase().includes(searchLower)
        );

        let lastLetter = '';
        const availableLetters = new Set<string>();

        const items = filtered.map((movie) => {
            const letter = movie.title[0]?.toUpperCase() ?? '#';
            const showDivider = letter !== lastLetter;

            lastLetter = letter;
            availableLetters.add(letter);

            return { movie, letter, showDivider };
        });

        return {
            items,
            availableLetters,
        };
    }, [movies, searchLower]);

    return (
        <div className="dark:text-white">
            <h2 className="mb-4 text-2xl font-bold">Movies</h2>
            <SearchBar
                placeholder="Search movies..."
                value={search}
                onChange={setSearch}
            />
            {!!availableLetters?.size && (
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
                    {items.map(({ movie, letter, showDivider }) => {
                        return (
                            <React.Fragment key={movie.filePath}>
                                {showDivider && <Divider letter={letter} />}
                                <MovieCard movie={movie} />
                            </React.Fragment>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
