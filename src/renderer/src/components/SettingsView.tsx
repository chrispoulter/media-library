import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    useSettingsQuery,
    useSaveSettingsMutation,
    useRefetchPostersMutation,
} from '../hooks/useMediaQueries';
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
            <p className="animate-pulse text-base font-medium text-gray-500 dark:text-gray-400">
                Loading...
            </p>
        );
    }

    if (loadError) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-900/20">
                <p className="font-medium text-red-700 dark:text-red-400">
                    Something went wrong
                </p>
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    {loadError.message}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 dark:text-white">
            <h2 className="text-2xl font-bold">Settings</h2>
            <p>Configure your application preferences here.</p>
            <form
                onSubmit={handleSubmit(onSaveSettings)}
                className="flex flex-col gap-4"
            >
                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="theme"
                        className="block text-sm font-medium"
                    >
                        Theme
                    </label>
                    <select
                        id="theme"
                        {...register('theme')}
                        disabled={isSaving}
                        className="w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System Default</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="moviesDirectory"
                        className="block text-sm font-medium"
                    >
                        Movie Directory
                    </label>
                    <div className="flex gap-2">
                        <input
                            id="moviesDirectory"
                            type="text"
                            placeholder="/path/to/movies"
                            {...register('moviesDirectory')}
                            disabled={isSaving}
                            className="w-full rounded border border-gray-400 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        <button
                            type="button"
                            disabled={isSaving}
                            className="cursor-pointer rounded border border-gray-400 px-3 py-2 hover:bg-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                            onClick={() => onOpenDirectory('moviesDirectory')}
                        >
                            Browse
                        </button>
                    </div>
                    {errors.moviesDirectory ? (
                        <p className="text-sm text-red-500 dark:text-red-400">
                            {errors.moviesDirectory.message}
                        </p>
                    ) : (
                        <p className="text-sm text-gray-400">
                            Full path to the movies directory.
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="tvShowsDirectory"
                        className="block text-sm font-medium"
                    >
                        TV Shows Directory
                    </label>
                    <div className="flex gap-2">
                        <input
                            id="tvShowsDirectory"
                            type="text"
                            placeholder="/path/to/tv-shows"
                            {...register('tvShowsDirectory')}
                            disabled={isSaving}
                            className="w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        <button
                            type="button"
                            disabled={isSaving}
                            className="cursor-pointer rounded border border-gray-400 px-3 py-2 hover:bg-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                            onClick={() => onOpenDirectory('tvShowsDirectory')}
                        >
                            Browse
                        </button>
                    </div>
                    {errors.tvShowsDirectory ? (
                        <p className="text-sm text-red-500 dark:text-red-400">
                            {errors.tvShowsDirectory.message}
                        </p>
                    ) : (
                        <p className="text-sm text-gray-400">
                            Full path to the TV shows directory.
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="tmdbApiKey"
                        className="block text-sm font-medium"
                    >
                        TMDb API Key
                    </label>
                    <input
                        id="tmdbApiKey"
                        type="password"
                        placeholder="Your TMDb API Key"
                        {...register('tmdbApiKey')}
                        disabled={isSaving}
                        className="w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <p className="text-sm text-gray-400">
                        Enter your TMDb API key to enable metadata fetching.
                    </p>
                </div>
                <div className="flex flex-row gap-2">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        {isSaving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
                {isSaveSuccess && (
                    <p className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-800/50 dark:bg-green-900/20 dark:text-green-400">
                        Settings saved successfully.
                    </p>
                )}
                {saveError && (
                    <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400">
                        {saveError.message}
                    </p>
                )}
            </form>

            <h2 className="mt-4 border-t border-gray-200 pt-4 text-2xl font-bold dark:border-gray-700">
                Maintenance
            </h2>
            <p>Tools for diagnosing and resetting application data.</p>

            <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-2">
                    <button
                        type="button"
                        className="cursor-pointer rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                        onClick={() => window.api.openLogFile()}
                    >
                        Open Log File
                    </button>
                    <button
                        type="button"
                        disabled={isRefetching}
                        onClick={onRefetchMissingPosters}
                        className="cursor-pointer rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
                    >
                        Refetch Missing Posters
                    </button>
                    <button
                        type="button"
                        disabled={isRefetching}
                        onClick={onRefetchAllPosters}
                        className="cursor-pointer rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
                    >
                        Refetch All Posters
                    </button>
                </div>
                {isRefetchSuccess && (
                    <p className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-800/50 dark:bg-green-900/20 dark:text-green-400">
                        Posters will be updated shortly.
                    </p>
                )}
                {refetchError && (
                    <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400">
                        {refetchError.message}
                    </p>
                )}
                {pendingRefetch !== null && (
                    <div className="flex flex-col gap-2 rounded border border-amber-200 bg-amber-50 px-3 py-3 dark:border-amber-800/50 dark:bg-amber-900/20">
                        <p className="text-sm text-amber-800 dark:text-amber-300">
                            {pendingRefetch
                                ? 'This will re-download posters that failed to load. Are you sure?'
                                : 'This will clear all cached posters and re-download them. Are you sure?'}
                        </p>
                        <div className="flex flex-row gap-2">
                            <button
                                type="button"
                                onClick={onConfirmRefetch}
                                className="cursor-pointer rounded bg-amber-600 px-3 py-1 text-sm text-white hover:bg-amber-700"
                            >
                                Confirm
                            </button>
                            <button
                                type="button"
                                onClick={onCancelRefetch}
                                className="cursor-pointer rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
