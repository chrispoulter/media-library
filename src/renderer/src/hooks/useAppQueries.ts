import { useEffect } from 'react';
import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationResult,
    type UseQueryResult,
} from '@tanstack/react-query';
import log from 'electron-log/renderer';
import type { Movie, TvShow, Settings, Event } from '../../../shared/types';
import { applyTheme } from '../utils/theme';

export const useVersionQuery = (): UseQueryResult<string> =>
    useQuery({
        queryKey: ['version'],
        queryFn: () => window.api.getVersion(),
        staleTime: Infinity,
    });

export const useSettingsQuery = (): UseQueryResult<Settings> =>
    useQuery({
        queryKey: ['settings'],
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
            queryClient.setQueryData(['settings'], settings);
            queryClient.invalidateQueries({ queryKey: ['movies'] });
            queryClient.invalidateQueries({ queryKey: ['tv-shows'] });
            queryClient.invalidateQueries({ queryKey: ['recently-added'] });
        },
    });
};

export const useMoviesQuery = (): UseQueryResult<Movie[]> =>
    useQuery({
        queryKey: ['movies'],
        queryFn: () => window.api.getMovies(),
        staleTime: Infinity,
    });

export const useTvShowsQuery = (): UseQueryResult<TvShow[]> =>
    useQuery({
        queryKey: ['tv-shows'],
        queryFn: () => window.api.getTvShows(),
        staleTime: Infinity,
    });

export const useRecentlyAddedQuery = (): UseQueryResult<(Movie | TvShow)[]> =>
    useQuery({
        queryKey: ['recently-added'],
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
            queryClient.invalidateQueries({ queryKey: ['movies'] });
            queryClient.invalidateQueries({ queryKey: ['tv-shows'] });
            queryClient.invalidateQueries({ queryKey: ['recently-added'] });
        },
    });
};

export const useEventsQuery = (): UseQueryResult<Event | null> =>
    useQuery({
        queryKey: ['events'],
        queryFn: () => null,
        staleTime: Infinity,
    });

export const useEventsListener = (): void => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const unsubscribe = window.api.onEvent((event: Event): void => {
            log.debug('Event received:', event);

            queryClient.setQueryData(['events'], event);

            switch (event.kind) {
                case 'poster-updated':
                    if (!event.posterUrl) {
                        break;
                    }

                    if (event.type === 'movie') {
                        queryClient.setQueryData<Movie[]>(['movies'], (old) =>
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
                            ['tv-shows'],
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
                        ['recently-added'],
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
