import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    useSettingsQuery,
    useSaveSettingsMutation,
    useRefetchPostersMutation,
} from '../hooks/useAppQueries';
import { ErrorMessage } from './ui/ErrorMessage';
import type { Settings } from '../../../shared/types';

const directoryPathSchema = z.string().refine(
    (v) => {
        if (!v.trim()) {
            return true;
        }

        return window.electron.process.platform === 'win32'
            ? /^[a-zA-Z]:[/\\]|^\\\\[^\\]+\\/.test(v)
            : v.startsWith('/');
    },
    {
        message:
            window.electron.process.platform === 'win32'
                ? 'Enter a full Windows path (e.g. C:\\Users\\me\\Movies or \\\\server\\share)'
                : 'Enter an absolute path starting with / (e.g. /home/me/Movies)',
    }
);

const settingsSchema = z.object({
    theme: z.enum(['light', 'dark', 'system']),
    moviesDirectory: directoryPathSchema,
    tvShowsDirectory: directoryPathSchema,
    tmdbApiKey: z.string(),
});

export const SettingsView = (): React.JSX.Element => {
    const [pendingRefetch, setPendingRefetch] = useState<boolean | null>(null);

    const { data: settings, isLoading, error: loadError } = useSettingsQuery();

    const {
        mutate: saveSettings,
        isPending: isSaving,
        isSuccess: isSaveSuccess,
        error: saveError,
    } = useSaveSettingsMutation();

    const {
        mutate: refetchPosters,
        isPending: isRefetching,
        isSuccess: isRefetchSuccess,
        error: refetchError,
    } = useRefetchPostersMutation();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<Settings>({ resolver: zodResolver(settingsSchema) });

    useEffect(() => {
        if (settings) {
            reset(settings);
        }
    }, [settings, reset]);

    const onOpenDirectory = async (
        field: 'moviesDirectory' | 'tvShowsDirectory'
    ): Promise<void> => {
        const currentPath = getValues(field) || undefined;
        const selectedPath = await window.api.selectDirectory(currentPath);

        if (selectedPath) {
            setValue(field, selectedPath, { shouldValidate: true });
        }
    };

    const onSaveSettings = (data: Settings): void => saveSettings(data);

    const onRefetchMissingPosters = (): void => setPendingRefetch(true);

    const onRefetchAllPosters = (): void => setPendingRefetch(false);

    const onConfirmRefetch = (): void => {
        if (pendingRefetch === null) {
            return;
        }

        refetchPosters(pendingRefetch);
        setPendingRefetch(null);
    };

    const onCancelRefetch = (): void => setPendingRefetch(null);

    if (isLoading) {
        return (
            <p className="animate-pulse text-sm text-zinc-500 dark:text-zinc-400">
                Loading...
            </p>
        );
    }

    if (loadError) {
        return <ErrorMessage error={loadError} />;
    }

    return (
        <section className="flex flex-col gap-4 dark:text-white">
            <h2 className="text-xl font-semibold">Settings</h2>
            <p>Configure your application preferences here.</p>
            <form
                onSubmit={handleSubmit(onSaveSettings)}
                className="flex flex-col gap-4"
            >
                <div className="flex flex-col gap-1">
                    <label htmlFor="theme" className="block text-sm">
                        Theme
                    </label>
                    <select
                        {...register('theme')}
                        id="theme"
                        disabled={isSaving}
                        className="w-full rounded border border-zinc-300 p-2 focus-visible:border-sky-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus-visible:border-sky-400"
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System Default</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="moviesDirectory" className="block text-sm">
                        Movie Directory
                    </label>
                    <div className="flex gap-2">
                        <input
                            {...register('moviesDirectory')}
                            id="moviesDirectory"
                            type="text"
                            placeholder="/path/to/movies"
                            disabled={isSaving}
                            className="w-full rounded border border-zinc-300 p-2 focus-visible:border-sky-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus-visible:border-sky-400"
                        />
                        <button
                            type="button"
                            disabled={isSaving}
                            className="cursor-pointer rounded border border-zinc-300 bg-white px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
                            onClick={() => onOpenDirectory('moviesDirectory')}
                        >
                            Browse
                        </button>
                    </div>
                    {errors.moviesDirectory ? (
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {errors.moviesDirectory.message}
                        </p>
                    ) : (
                        <p className="text-xs text-zinc-500">
                            Full path to the movies directory.
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="tvShowsDirectory" className="block text-sm">
                        TV Shows Directory
                    </label>
                    <div className="flex gap-2">
                        <input
                            {...register('tvShowsDirectory')}
                            id="tvShowsDirectory"
                            type="text"
                            placeholder="/path/to/tv-shows"
                            disabled={isSaving}
                            className="w-full rounded border border-zinc-300 p-2 focus-visible:border-sky-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus-visible:border-sky-400"
                        />
                        <button
                            type="button"
                            disabled={isSaving}
                            className="cursor-pointer rounded border border-zinc-300 bg-white px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
                            onClick={() => onOpenDirectory('tvShowsDirectory')}
                        >
                            Browse
                        </button>
                    </div>
                    {errors.tvShowsDirectory ? (
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {errors.tvShowsDirectory.message}
                        </p>
                    ) : (
                        <p className="text-xs text-zinc-500">
                            Full path to the TV shows directory.
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="tmdbApiKey" className="block text-sm">
                        TMDb API Key
                    </label>
                    <input
                        {...register('tmdbApiKey')}
                        id="tmdbApiKey"
                        type="password"
                        placeholder="Your TMDb API Key"
                        disabled={isSaving}
                        className="w-full rounded border border-zinc-300 p-2 focus-visible:border-sky-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus-visible:border-sky-400"
                    />
                    <p className="text-xs text-zinc-500">
                        Enter your TMDb API key to enable metadata fetching.
                    </p>
                </div>
                <div className="flex flex-row gap-2">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="cursor-pointer rounded bg-sky-600 px-4 py-2 text-sm text-white hover:bg-sky-700 dark:hover:bg-sky-500"
                    >
                        {isSaving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
                {isSaveSuccess && (
                    <p
                        role="status"
                        className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-800/50 dark:bg-green-900/30 dark:text-green-400"
                    >
                        Settings saved successfully.
                    </p>
                )}
                {saveError && (
                    <p
                        role="alert"
                        className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/30 dark:text-red-400"
                    >
                        {saveError.message}
                    </p>
                )}
            </form>

            <h2 className="mt-4 border-t border-zinc-200 pt-4 text-base font-semibold dark:border-zinc-700">
                Maintenance
            </h2>
            <p>Tools for diagnosing and resetting application data.</p>

            <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-2">
                    <button
                        type="button"
                        className="cursor-pointer rounded border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-800 hover:bg-zinc-50 dark:border dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
                        onClick={() => window.api.openLogFile()}
                    >
                        Open Log File
                    </button>
                    <button
                        type="button"
                        disabled={isRefetching}
                        onClick={onRefetchMissingPosters}
                        className="cursor-pointer rounded border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
                    >
                        Refetch Missing Posters
                    </button>
                    <button
                        type="button"
                        disabled={isRefetching}
                        onClick={onRefetchAllPosters}
                        className="cursor-pointer rounded border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
                    >
                        Refetch All Posters
                    </button>
                </div>
                {isRefetchSuccess && (
                    <p
                        role="status"
                        className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-800/50 dark:bg-green-900/30 dark:text-green-400"
                    >
                        Posters will be updated shortly.
                    </p>
                )}
                {refetchError && (
                    <p
                        role="alert"
                        className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/30 dark:text-red-400"
                    >
                        {refetchError.message}
                    </p>
                )}
                {pendingRefetch !== null && (
                    <div
                        role="alert"
                        className="flex flex-col gap-2 rounded border border-zinc-200 bg-zinc-50 px-3 py-3 dark:border-zinc-600 dark:bg-zinc-800/50"
                    >
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">
                            {pendingRefetch
                                ? 'This will re-download posters that failed to load. Are you sure?'
                                : 'This will clear all cached posters and re-download them. Are you sure?'}
                        </p>
                        <div className="flex flex-row gap-2">
                            <button
                                type="button"
                                onClick={onConfirmRefetch}
                                className="cursor-pointer rounded bg-sky-600 px-3 py-1 text-sm text-white hover:bg-sky-700 dark:hover:bg-sky-500"
                            >
                                Confirm
                            </button>
                            <button
                                type="button"
                                onClick={onCancelRefetch}
                                className="cursor-pointer rounded border border-zinc-300 bg-white px-3 py-1 text-sm hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
