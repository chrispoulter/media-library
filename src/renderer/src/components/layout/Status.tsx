import clsx from 'clsx';
import { useEventsQuery } from '../../hooks/useAppQueries';

export const Status = (): React.JSX.Element | null => {
    const { data: event } = useEventsQuery();

    let isSuccess: boolean | undefined = undefined;
    let message: string | undefined = undefined;

    switch (event?.kind) {
        case 'poster-updated':
            if (event.posterUrl) {
                isSuccess = true;
                message = `Poster updated for "${event.title}"`;
            } else {
                isSuccess = false;
                message = `Failed to fetch poster for "${event.title}"`;
            }
            break;
    }

    if (!message) {
        return null;
    }

    return (
        <p
            className={clsx(
                'truncate text-xs',
                isSuccess
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-500 dark:text-red-400'
            )}
        >
            {message}
        </p>
    );
};
