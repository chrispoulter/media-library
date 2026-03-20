import React from 'react';
import { useTvShowsQuery } from '../hooks/useMediaQueries';
import { useDebounce } from '../hooks/useDebounce';
import { AlphabetBar } from './AlphabetBar';
import { SearchBar } from './SearchBar';
import { TvShowCard } from './TvShowCard';
import { TvShowCardSkeleton } from './TvShowCardSkeleton';

export const TvShowsView = (): React.JSX.Element => {
    const [search, setSearch] = React.useState('');
    const debouncedSearch = useDebounce(search);

    const { data: tvShows, isLoading, error } = useTvShowsQuery();

    const filtered = tvShows?.filter((show) =>
        show.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    let lastLetter = '';

    const items = filtered?.map((tvShow) => {
        const letter = tvShow.title[0]?.toUpperCase() ?? '#';
        const showDivider = letter !== lastLetter;
        lastLetter = letter;
        return { tvShow, letter, showDivider };
    });

    const availableLetters = new Set(items?.map((i) => i.letter));

    return (
        <div className="dark:text-white">
            <h2 className="mb-4 text-2xl font-bold">TV Shows</h2>
            <SearchBar
                placeholder="Search TV shows..."
                value={search}
                onChange={setSearch}
            />
            {!!availableLetters.size && (
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
                    {items.map(({ tvShow, letter, showDivider }, index) => {
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
                                <TvShowCard
                                    key={tvShow.title}
                                    tvShow={tvShow}
                                />
                            </React.Fragment>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
