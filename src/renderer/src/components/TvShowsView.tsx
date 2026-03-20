import React from 'react';
import { useTvShowsQuery } from '../hooks/useMediaQueries';
import { useDebounce } from '../hooks/useDebounce';
import { SearchBar } from './SearchBar';
import { AlphabetBar } from './AlphabetBar';
import { TvShowCard } from './TvShowCard';
import { TvShowCardSkeleton } from './TvShowCardSkeleton';
import { Divider } from './Divider';

export const TvShowsView = (): React.JSX.Element => {
    const [search, setSearch] = React.useState('');
    const debouncedSearch = useDebounce(search);
    const searchLower = debouncedSearch.toLowerCase();

    const { data: tvShows, isLoading, error } = useTvShowsQuery();

    const { items, availableLetters } = React.useMemo(() => {
        if (!tvShows) {
            return {
                items: undefined,
                availableLetters: undefined,
            };
        }

        const filtered = tvShows.filter((show) =>
            show.title.toLowerCase().includes(searchLower)
        );

        let lastLetter = '';
        const availableLetters = new Set<string>();

        const items = filtered.map((tvShow) => {
            const letter = tvShow.title[0]?.toUpperCase() ?? '#';
            const showDivider = letter !== lastLetter;

            lastLetter = letter;
            availableLetters.add(letter);

            return { tvShow, letter, showDivider };
        });

        return {
            items,
            availableLetters,
        };
    }, [tvShows, searchLower]);

    return (
        <div className="dark:text-white">
            <h2 className="mb-4 text-2xl font-bold">TV Shows</h2>
            <SearchBar
                placeholder="Search TV shows..."
                value={search}
                onChange={setSearch}
            />
            {!!availableLetters?.size && (
                <AlphabetBar availableLetters={availableLetters} />
            )}
            {isLoading ? (
                <div className="flex flex-col gap-2">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <TvShowCardSkeleton key={i} />
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
                        ? 'No shows match your search.'
                        : 'No TV shows found. Check your TV Shows folder in Settings.'}
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {items.map(({ tvShow, letter, showDivider }) => {
                        return (
                            <React.Fragment key={tvShow.title}>
                                {showDivider && <Divider letter={letter} />}
                                <TvShowCard tvShow={tvShow} />
                            </React.Fragment>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
