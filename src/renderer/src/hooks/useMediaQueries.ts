import { useEffect, useState } from 'react';
import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationResult,
    type UseQueryResult,
} from '@tanstack/react-query';
import log from 'electron-log/renderer';
import type {
    Movie,
    TvShow,
    Settings,
    Poster,
    QueueStatus,
} from '../../../shared/types';
import { applyTheme } from '../utils/theme';

export const useVersionQuery = (): UseQueryResult<string> =>
    useQuery({
        queryKey: ['version'],
        queryFn: () => window.api.getAppVersion(),
        staleTime: Infinity,
    });

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

export const useQueueStatus = (): QueueStatus => {
    const [status, setStatus] = useState<QueueStatus>({
        total: 0,
        remaining: 0,
        isProcessing: false,
    });

    useEffect(() => {
        window.api.getQueueStatus().then(setStatus);
        const unsubscribe = window.api.onQueueStatusUpdated(setStatus);
        return unsubscribe;
    }, []);

    return status;
};

export const usePosterUpdates = (): void => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const unsubscribe = window.api.onPosterUpdated((data: Poster): void => {
            log.debug('Poster updated:', data);

            if (data.type === 'movie') {
                queryClient.setQueryData<Movie[]>(['movies'], (old) =>
                    old?.map((m) =>
                        data.title === m.title
                            ? { ...m, posterUrl: data.posterUrl }
                            : m
                    )
                );
            }

            if (data.type === 'tv-show') {
                queryClient.setQueryData<TvShow[]>(['tv-shows'], (old) =>
                    old?.map((s) =>
                        data.title === s.title
                            ? { ...s, posterUrl: data.posterUrl }
                            : s
                    )
                );
            }

            queryClient.setQueryData<(Movie | TvShow)[]>(
                ['recently-added'],
                (old) =>
                    old?.map((r) =>
                        data.title === r.title
                            ? { ...r, posterUrl: data.posterUrl }
                            : r
                    )
            );
        });

        return unsubscribe;
    }, [queryClient]);
};
