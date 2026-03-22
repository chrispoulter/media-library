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
        <div className="truncate text-center text-xs text-gray-500 dark:text-gray-400">
            {message}
        </div>
    );
};
