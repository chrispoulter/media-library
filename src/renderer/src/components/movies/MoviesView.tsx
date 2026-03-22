import { Fragment, useMemo, useState } from 'react';
import { useMoviesQuery } from '../../hooks/useAppQueries';
import { useDebounce } from '../../hooks/useDebounce';
import { AlphabetBar } from '../ui/AlphabetBar';
import { Divider } from '../ui/Divider';
import { ErrorMessage } from '../ui/ErrorMessage';
import { SearchBar } from '../ui/SearchBar';
import { MovieCard } from './MovieCard';
import { MovieCardSkeleton } from './MovieCardSkeleton';

export const MoviesView = (): React.JSX.Element => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search);
    const searchLower = debouncedSearch.toLowerCase();

    const { data: movies, isLoading, error } = useMoviesQuery();

    const { items, availableLetters } = useMemo(() => {
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
        <section className="flex flex-col gap-4 dark:text-white">
            <h2 className="text-2xl font-bold">Movies</h2>
            <SearchBar
                placeholder="Search movies..."
                value={search}
                onChange={setSearch}
            />
            <AlphabetBar availableLetters={availableLetters} />
            {isLoading ? (
                <div className="flex flex-col gap-2">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <MovieCardSkeleton key={i} />
                    ))}
                </div>
            ) : error ? (
                <ErrorMessage error={error} />
            ) : !items?.length ? (
                <p className="text-gray-500">
                    {search
                        ? 'No movies match your search.'
                        : 'No movies found. Check your Movies folder in Settings.'}
                </p>
            ) : (
                <div className="flex flex-col gap-2">
                    {items.map(({ movie, letter, showDivider }) => {
                        return (
                            <Fragment key={movie.filePath}>
                                {showDivider && (
                                    <Divider
                                        id={`letter-${letter}`}
                                        label={letter}
                                    />
                                )}
                                <MovieCard movie={movie} />
                            </Fragment>
                        );
                    })}
                </div>
            )}
        </section>
    );
};
