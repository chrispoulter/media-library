import { useState } from 'react';
import { useRecentlyAddedQuery } from '../hooks/useMediaQueries';
import { useDebounce } from '../hooks/useDebounce';
import { SearchBar } from './SearchBar';
import { MovieCard } from './MovieCard';
import { TvShowCard } from './TvShowCard';
import { MovieCardSkeleton } from './MovieCardSkeleton';
import { ErrorMessage } from './ErrorMessage';

export const RecentlyAddedView = (): React.JSX.Element => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search);
    const searchLower = debouncedSearch.toLowerCase();

    const { data: recentlyAdded, isLoading, error } = useRecentlyAddedQuery();

    const filtered = recentlyAdded?.filter((item) =>
        item.title.toLowerCase().includes(searchLower)
    );

    return (
        <section className="flex flex-col gap-4 dark:text-white">
            <h2 className="text-2xl font-bold">Recently Added</h2>
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
                <ErrorMessage error={error} />
            ) : !filtered?.length ? (
                <p className="text-gray-500">
                    {search
                        ? 'No items match your search.'
                        : 'No recently added items found. Check your Movies and TV Shows folders in Settings.'}
                </p>
            ) : (
                <div className="flex flex-col gap-2">
                    {filtered.map((item, index) => {
                        if ('seasons' in item) {
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
        </section>
    );
};
