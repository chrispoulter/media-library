import clsx from 'clsx';
import { Status } from './Status';
import { Footer } from './Footer';
import { ClockIcon, FilmIcon, TvIcon, CogIcon } from './SvgIcons';

type SidebarProps = {
    view: string;
    setView: (view: string) => void;
};

export const Sidebar = ({ view, setView }: SidebarProps): React.JSX.Element => {
    return (
        <div className="flex w-64 flex-col gap-4 bg-gray-200 p-4 dark:bg-gray-700 dark:text-white">
            <h1 className="text-xl font-bold">Media Library</h1>
            <div className="mb-auto flex flex-col gap-2">
                <button
                    onClick={() => setView('recently-added')}
                    className={clsx(
                        'flex w-full cursor-pointer items-center gap-3 rounded px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600',
                        view === 'recently-added' &&
                            'bg-gray-300 dark:bg-gray-600'
                    )}
                >
                    <ClockIcon className="h-5 w-5" />
                    Recently Added
                </button>
                <button
                    onClick={() => setView('movies')}
                    className={clsx(
                        'flex w-full cursor-pointer items-center gap-3 rounded px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600',
                        view === 'movies' && 'bg-gray-300 dark:bg-gray-600'
                    )}
                >
                    <FilmIcon className="h-5 w-5" />
                    Movies
                </button>
                <button
                    onClick={() => setView('tv-shows')}
                    className={clsx(
                        'flex w-full cursor-pointer items-center gap-3 rounded px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600',
                        view === 'tv-shows' && 'bg-gray-300 dark:bg-gray-600'
                    )}
                >
                    <TvIcon className="h-5 w-5" />
                    TV Shows
                </button>
                <button
                    onClick={() => setView('settings')}
                    className={clsx(
                        'flex w-full cursor-pointer items-center gap-3 rounded px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600',
                        view === 'settings' && 'bg-gray-300 dark:bg-gray-600'
                    )}
                >
                    <CogIcon className="h-5 w-5" />
                    Settings
                </button>
            </div>
            <Status />
            <Footer />
        </div>
    );
};
