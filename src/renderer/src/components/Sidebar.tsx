import clsx from 'clsx';

type SidebarProps = {
    view: string;
    setView: (view: string) => void;
};

export const Sidebar = ({ view, setView }: SidebarProps): React.JSX.Element => {
    return (
        <aside className="w-64 bg-gray-200 p-4 dark:bg-gray-700 dark:text-white">
            <nav>
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
        </aside>
    );
};
