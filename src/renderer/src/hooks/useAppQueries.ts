import { useEffect } from 'react';
import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationResult,
    type UseQueryResult,
} from '@tanstack/react-query';
import { applyTheme } from '../utils/theme';
import type { Movie, TvShow, Settings, Event } from '../../../shared/types';

const queryKeys = {
    version: ['version'] as const,
    settings: ['settings'] as const,
    movies: ['movies'] as const,
    tvShows: ['tv-shows'] as const,
    recentlyAdded: ['recently-added'] as const,
    events: ['events'] as const,
};

export const useVersionQuery = (): UseQueryResult<string> =>
    useQuery({
        queryKey: queryKeys.version,
        queryFn: () => window.api.getVersion(),
        staleTime: Infinity,
    });

export const useSettingsQuery = (): UseQueryResult<Settings> =>
    useQuery({
        queryKey: queryKeys.settings,
        queryFn: () => window.api.getSettings(),
        staleTime: Infinity,
    });

export const useSaveSettingsMutation = (): UseMutationResult<
    void,
    Error,
    Settings
> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (settings: Settings) => window.api.setSettings(settings),
        onSuccess: (_, settings) => {
            applyTheme(settings.theme);
            queryClient.setQueryData(queryKeys.settings, settings);
            queryClient.invalidateQueries({ queryKey: queryKeys.movies });
            queryClient.invalidateQueries({ queryKey: queryKeys.tvShows });
            queryClient.invalidateQueries({
                queryKey: queryKeys.recentlyAdded,
            });
        },
    });
};

export const useMoviesQuery = (): UseQueryResult<Movie[]> =>
    useQuery({
        queryKey: queryKeys.movies,
        queryFn: () => window.api.getMovies(),
        staleTime: Infinity,
    });

export const useTvShowsQuery = (): UseQueryResult<TvShow[]> =>
    useQuery({
        queryKey: queryKeys.tvShows,
        queryFn: () => window.api.getTvShows(),
        staleTime: Infinity,
    });

export const useRecentlyAddedQuery = (): UseQueryResult<(Movie | TvShow)[]> =>
    useQuery({
        queryKey: queryKeys.recentlyAdded,
        queryFn: () => window.api.getRecentlyAdded(),
        staleTime: Infinity,
    });

export const useRefetchPostersMutation = (): UseMutationResult<
    void,
    Error,
    boolean | undefined
> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (failedOnly?: boolean) =>
            window.api.refetchPosters(failedOnly),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.movies });
            queryClient.invalidateQueries({ queryKey: queryKeys.tvShows });
            queryClient.invalidateQueries({
                queryKey: queryKeys.recentlyAdded,
            });
        },
    });
};

export const useEventsQuery = (): UseQueryResult<Event | null> =>
    useQuery({
        queryKey: queryKeys.events,
        queryFn: () => null,
        staleTime: Infinity,
    });

export const useEventsListener = (): void => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const unsubscribe = window.api.onEvent((event: Event): void => {
            queryClient.setQueryData(queryKeys.events, event);

            switch (event.kind) {
                case 'poster-updated':
                    if (!event.posterUrl) {
                        break;
                    }

                    if (event.type === 'movie') {
                        queryClient.setQueryData<Movie[]>(
                            queryKeys.movies,
                            (old) =>
                                old?.map((m) =>
                                    event.title === m.title
                                        ? {
                                              ...m,
                                              posterUrl: event.posterUrl,
                                          }
                                        : m
                                )
                        );
                    }

                    if (event.type === 'tv-show') {
                        queryClient.setQueryData<TvShow[]>(
                            queryKeys.tvShows,
                            (old) =>
                                old?.map((s) =>
                                    event.title === s.title
                                        ? {
                                              ...s,
                                              posterUrl: event.posterUrl,
                                          }
                                        : s
                                )
                        );
                    }

                    queryClient.setQueryData<(Movie | TvShow)[]>(
                        queryKeys.recentlyAdded,
                        (old) =>
                            old?.map((r) =>
                                event.title === r.title
                                    ? { ...r, posterUrl: event.posterUrl }
                                    : r
                            )
                    );

                    break;
            }
        });

        return unsubscribe;
    }, [queryClient]);
};
