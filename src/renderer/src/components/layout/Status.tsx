import { useEventsQuery } from '../../hooks/useAppQueries';

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
        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
            {message}
        </p>
    );
};
