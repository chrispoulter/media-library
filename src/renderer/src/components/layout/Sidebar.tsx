import clsx from 'clsx';
import { ClockIcon, FilmIcon, TvIcon, CogIcon } from '../ui/SvgIcons';
import { Status } from './Status';
import { Footer } from './Footer';

type SidebarProps = {
    view: string;
    setView: (view: string) => void;
};

const options = [
    { label: 'Recently Added', value: 'recently-added', icon: ClockIcon },
    { label: 'Movies', value: 'movies', icon: FilmIcon },
    { label: 'TV Shows', value: 'tv-shows', icon: TvIcon },
    { label: 'Settings', value: 'settings', icon: CogIcon },
];

export const Sidebar = ({ view, setView }: SidebarProps): React.JSX.Element => {
    return (
        <aside className="flex w-64 flex-col gap-4 border-r border-zinc-200 bg-zinc-100 p-4 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
            <header>
                <h1 className="text-xl font-semibold">Media Library</h1>
            </header>
            <nav
                aria-label="Main navigation"
                className="mb-auto flex flex-col gap-2"
            >
                {options.map(({ label, value, icon: Icon }) => (
                    <button
                        key={value}
                        onClick={() => setView(value)}
                        aria-current={view === value ? 'page' : undefined}
                        className={clsx(
                            'flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-800',
                            view === value && 'bg-zinc-200 dark:bg-zinc-800'
                        )}
                    >
                        <Icon className="h-5 w-5" />
                        {label}
                    </button>
                ))}
            </nav>
            <Status />
            <Footer />
        </aside>
    );
};
