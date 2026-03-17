import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    useSettingsQuery,
    useSaveSettingsMutation,
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
    const { data: settings, isLoading, error: loadError } = useSettingsQuery();

    const {
        mutate,
        isPending,
        isSuccess,
        error: saveError,
    } = useSaveSettingsMutation();

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

    const onSaveSettings = (data: Settings): void => mutate(data);

    const onOpenDirectory = async (
        field: 'moviesDirectory' | 'tvShowsDirectory'
    ): Promise<void> => {
        const currentPath = getValues(field) || undefined;
        const selectedPath = await window.api.selectDirectory(currentPath);

        if (selectedPath) {
            setValue(field, selectedPath, { shouldValidate: true });
        }
    };

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
        <div className="dark:text-white">
            <h2 className="mb-4 text-2xl font-bold">Settings</h2>
            <p className="mb-4">Configure your application preferences here.</p>
            <form onSubmit={handleSubmit(onSaveSettings)}>
                <div className="mb-4">
                    <label
                        htmlFor="theme"
                        className="mb-1 block text-sm font-medium"
                    >
                        Theme
                    </label>
                    <select
                        id="theme"
                        {...register('theme')}
                        disabled={isPending}
                        className="mb-1 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System Default</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="moviesDirectory"
                        className="mb-1 block text-sm font-medium"
                    >
                        Movie Directory
                    </label>
                    <div className="mb-1 flex gap-2">
                        <input
                            id="moviesDirectory"
                            type="text"
                            placeholder="/path/to/movies"
                            {...register('moviesDirectory')}
                            disabled={isPending}
                            className="w-full rounded border border-gray-400 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        <button
                            type="button"
                            disabled={isPending}
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
                <div className="mb-4">
                    <label
                        htmlFor="tvShowsDirectory"
                        className="mb-1 block text-sm font-medium"
                    >
                        TV Shows Directory
                    </label>
                    <div className="mb-1 flex gap-2">
                        <input
                            id="tvShowsDirectory"
                            type="text"
                            placeholder="/path/to/tv-shows"
                            {...register('tvShowsDirectory')}
                            disabled={isPending}
                            className="w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        <button
                            type="button"
                            disabled={isPending}
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
                <div className="mb-4">
                    <label
                        htmlFor="tmdbApiKey"
                        className="mb-1 block text-sm font-medium"
                    >
                        TMDb API Key
                    </label>
                    <input
                        id="tmdbApiKey"
                        type="password"
                        placeholder="Your TMDb API Key"
                        {...register('tmdbApiKey')}
                        disabled={isPending}
                        className="mb-1 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <p className="text-sm text-gray-400">
                        Enter your TMDb API key to enable metadata fetching.
                    </p>
                </div>
                <div className="flex flex-row gap-3">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        {isPending ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
                {isSuccess && (
                    <p className="mt-3 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-800/50 dark:bg-green-900/20 dark:text-green-400">
                        Settings saved successfully.
                    </p>
                )}
                {saveError && (
                    <p className="mt-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400">
                        {saveError.message}
                    </p>
                )}
            </form>
            <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
                <h3 className="mb-1 text-lg font-semibold">Maintenance</h3>
                <p className="mb-4 text-sm text-gray-400">
                    Tools for diagnosing and resetting application data.
                </p>
                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        className="cursor-pointer rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                        onClick={() => window.api.openLogFile()}
                    >
                        Open Log File
                    </button>
                    <button
                        type="button"
                        className="cursor-pointer rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
                        onClick={() => {}}
                    >
                        Clear Poster Store
                    </button>
                    <button
                        type="button"
                        className="cursor-pointer rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
                        onClick={() => {}}
                    >
                        Refetch Failed Posters
                    </button>
                    <button
                        type="button"
                        className="cursor-pointer rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
                        onClick={() => {}}
                    >
                        Refetch All Posters
                    </button>
                </div>
            </div>
        </div>
    );
};
