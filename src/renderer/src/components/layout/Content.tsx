import { RecentlyAddedView } from '../RecentlyAddedView';
import { MoviesView } from '../movies/MoviesView';
import { TvShowsView } from '../tv-shows/TvShowsView';
import { SettingsView } from '../SettingsView';

type ContentProps = {
    view: string;
};

export const Content = ({ view }: ContentProps): React.JSX.Element => {
    let activeView: React.JSX.Element;

    switch (view) {
        case 'movies':
            activeView = <MoviesView />;
            break;
        case 'tv-shows':
            activeView = <TvShowsView />;
            break;
        case 'settings':
            activeView = <SettingsView />;
            break;
        case 'recently-added':
        default:
            activeView = <RecentlyAddedView />;
            break;
    }

    return (
        <main key={view} className="flex-1 overflow-auto p-4 dark:bg-gray-900">
            {activeView}
        </main>
    );
};
