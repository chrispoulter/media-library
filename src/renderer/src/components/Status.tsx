import { useEventsQuery } from '@renderer/hooks/useMediaQueries';

export const Status = (): React.JSX.Element | null => {
    const { data: event } = useEventsQuery();

    let message: string | undefined = undefined;

    switch (event?.kind) {
        case 'poster-updated':
            message = event.posterUrl
                ? `Poster updated for "${event.title}"`
                : `Failed to fetch poster for "${event.title}"`;
            break;
    }

    if (!message) {
        return null;
    }

    return (
        <div className="mt-4 mb-1 truncate border-t border-gray-300 pt-4 text-xs text-gray-500 dark:border-gray-600 dark:text-gray-400">
            {message}
        </div>
    );
};
