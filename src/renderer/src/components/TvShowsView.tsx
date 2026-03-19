import React from 'react';
import { useTvShowsQuery } from '../hooks/useMediaQueries';
import { useDebounce } from '../hooks/useDebounce';
import { AlphabetBar } from './AlphabetBar';
import { SearchBar } from './SearchBar';
import { TvShowCard } from './TvShowCard';
import { TvShowCardSkeleton } from './TvShowCardSkeleton';
import { groupItemsByAlphabet } from '../utils/alphabeticalSections';

export const TvShowsView = (): React.JSX.Element => {
    const [search, setSearch] = React.useState('');
    const debouncedSearch = useDebounce(search);
    const { data: tvShows, isLoading, error } = useTvShowsQuery();

    const filtered = tvShows?.filter((show) =>
        show.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
    const sections = React.useMemo(
        () => groupItemsByAlphabet(filtered ?? [], (show) => show.title),
        [filtered]
    );

    const availableLetters = new Set(sections.map((section) => section.label));

    return (
        <div className="dark:text-white">
            <h2 className="mb-4 text-2xl font-bold">TV Shows</h2>
            <SearchBar
                placeholder="Search TV shows..."
                value={search}
                onChange={setSearch}
            />
            {filtered?.length && (
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
            ) : !filtered?.length ? (
                <div className="text-gray-500">
                    {search
                        ? 'No shows match your search.'
                        : 'No TV shows found. Check your TV Shows folder in Settings.'}
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {sections.map((section) => (
                        <section
                            key={section.label}
                            id={`letter-${section.label}`}
                            className="flex scroll-mt-4 flex-col gap-2"
                        >
                            <div className="flex items-center gap-3">
                                <h3 className="text-sm font-semibold tracking-[0.3em] text-gray-500 uppercase dark:text-gray-400">
                                    {section.label}
                                </h3>
                                <div className="h-px flex-1 bg-gray-300 dark:bg-gray-600" />
                            </div>
                            {section.items.map((show) => (
                                <TvShowCard key={show.title} tvShow={show} />
                            ))}
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
};
