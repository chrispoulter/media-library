import React from 'react';
import { useRecentlyAddedQuery } from '../hooks/useMediaQueries';
import { useDebounce } from '../hooks/useDebounce';
import { SearchBar } from './SearchBar';
import { MovieCard } from './MovieCard';
import { TvShowCard } from './TvShowCard';
import { MovieCardSkeleton } from './MovieCardSkeleton';

export const RecentlyAddedView = (): React.JSX.Element => {
    const [search, setSearch] = React.useState('');
    const debouncedSearch = useDebounce(search);
    const { data: recentlyAdded, isLoading, error } = useRecentlyAddedQuery();

    const filtered = recentlyAdded?.filter((item) =>
        item.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    return (
        <div className="dark:text-white">
            <h2 className="mb-4 text-2xl font-bold">Recently Added</h2>
            <SearchBar
                placeholder="Search recently added..."
                value={search}
                onChange={setSearch}
            />
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
            ) : !filtered?.length ? (
                <div className="text-gray-500">
                    {search
                        ? 'No items match your search.'
                        : 'No recently added items found. Check your Movies and TV Shows folders in Settings.'}
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {filtered.map((item, index) => {
                        if ('episodes' in item) {
                            return (
                                <TvShowCard
                                    key={index}
                                    tvShow={item}
                                    showAddedDate
                                />
                            );
                        } else {
                            return (
                                <MovieCard
                                    key={index}
                                    movie={item}
                                    showAddedDate
                                />
                            );
                        }
                    })}
                </div>
            )}
        </div>
    );
};
