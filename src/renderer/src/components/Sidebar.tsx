import clsx from 'clsx';
import { useQueueStatus } from '../hooks/useMediaQueries';

type SidebarProps = {
    view: string;
    setView: (view: string) => void;
};

export const Sidebar = ({ view, setView }: SidebarProps): React.JSX.Element => {
    const { total, remaining, isProcessing } = useQueueStatus();
    const completed = total - remaining;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    const showQueue = isProcessing || remaining > 0;

    return (
        <aside className="flex w-64 flex-col bg-gray-200 p-4 dark:bg-gray-700 dark:text-white">
            <nav className="flex-1">
                <ul>
                    <li className="mb-2">
                        <button
                            onClick={() => setView('recently-added')}
                            className={clsx(
                                'w-full cursor-pointer rounded px-4 py-2 text-left hover:bg-gray-300 dark:hover:bg-gray-600',
                                {
                                    'bg-gray-300 dark:bg-gray-600':
                                        view === 'recently-added',
                                }
                            )}
                        >
                            Recently Added
                        </button>
                    </li>
                    <li className="mb-2">
                        <button
                            onClick={() => setView('movies')}
                            className={clsx(
                                'w-full cursor-pointer rounded px-4 py-2 text-left hover:bg-gray-300 dark:hover:bg-gray-600',
                                {
                                    'bg-gray-300 dark:bg-gray-600':
                                        view === 'movies',
                                }
                            )}
                        >
                            Movies
                        </button>
                    </li>
                    <li className="mb-2">
                        <button
                            onClick={() => setView('tv-shows')}
                            className={clsx(
                                'w-full cursor-pointer rounded px-4 py-2 text-left hover:bg-gray-300 dark:hover:bg-gray-600',
                                {
                                    'bg-gray-300 dark:bg-gray-600':
                                        view === 'tv-shows',
                                }
                            )}
                        >
                            TV Shows
                        </button>
                    </li>
                    <li className="mb-2">
                        <button
                            onClick={() => setView('settings')}
                            className={clsx(
                                'w-full cursor-pointer rounded px-4 py-2 text-left hover:bg-gray-300 dark:hover:bg-gray-600',
                                {
                                    'bg-gray-300 dark:bg-gray-600':
                                        view === 'settings',
                                }
                            )}
                        >
                            Settings
                        </button>
                    </li>
                </ul>
            </nav>
            {showQueue && (
                <div className="mt-4 border-t border-gray-300 pt-4 dark:border-gray-600">
                    <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Fetching posters</span>
                        <span>
                            {completed} / {total}
                        </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-300 dark:bg-gray-600">
                        <div
                            className="h-full rounded-full bg-blue-500 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}
        </aside>
    );
};
