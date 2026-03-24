import { Fragment, useMemo, useState } from 'react';
import { useTvShowsQuery } from '../../hooks/useAppQueries';
import { useDebounce } from '../../hooks/useDebounce';
import { AlphabetBar } from '../ui/AlphabetBar';
import { Divider } from '../ui/Divider';
import { ErrorMessage } from '../ui/ErrorMessage';
import { SearchBar } from '../ui/SearchBar';
import { TvShowCard } from './TvShowCard';
import { TvShowCardSkeleton } from './TvShowCardSkeleton';

export const TvShowsView = (): React.JSX.Element => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search);
    const searchLower = debouncedSearch.toLowerCase();

    const { data: tvShows, isLoading, error } = useTvShowsQuery();

    const { items, availableLetters } = useMemo(() => {
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
            const firstChar = tvShow.title[0]?.toUpperCase() ?? '';
            const letter =
                firstChar >= 'A' && firstChar <= 'Z' ? firstChar : '#';
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
        <section className="flex flex-col gap-4 dark:text-white">
            <h2 className="text-xl font-semibold">TV Shows</h2>
            <SearchBar
                placeholder="Search TV shows..."
                value={search}
                onChange={setSearch}
            />
            <AlphabetBar availableLetters={availableLetters} />
            {isLoading ? (
                <div className="flex flex-col gap-2">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <TvShowCardSkeleton key={i} />
                    ))}
                </div>
            ) : error ? (
                <ErrorMessage error={error} />
            ) : !items?.length ? (
                <p className="text-zinc-500">
                    {search
                        ? 'No shows match your search.'
                        : 'No TV shows found. Check your TV Shows folder in Settings.'}
                </p>
            ) : (
                <div className="flex flex-col gap-2">
                    {items.map(({ tvShow, letter, showDivider }) => {
                        return (
                            <Fragment key={tvShow.title}>
                                {showDivider && (
                                    <Divider
                                        id={`letter-${letter}`}
                                        label={letter}
                                    />
                                )}
                                <TvShowCard tvShow={tvShow} />
                            </Fragment>
                        );
                    })}
                </div>
            )}
        </section>
    );
};
