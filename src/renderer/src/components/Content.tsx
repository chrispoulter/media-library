import { RecentlyAddedView } from './RecentlyAddedView';
import { MoviesView } from './MoviesView';
import { TvShowsView } from './TvShowsView';
import { SettingsView } from './SettingsView';

type ContentProps = {
    view: string;
};

export const Content = ({ view }: ContentProps): React.JSX.Element => {
    return (
        <main className="flex-1 overflow-auto p-4 dark:bg-gray-900">
            {view === 'recently-added' && <RecentlyAddedView />}
            {view === 'movies' && <MoviesView />}
            {view === 'tv-shows' && <TvShowsView />}
            {view === 'settings' && <SettingsView />}
        </main>
    );
};
