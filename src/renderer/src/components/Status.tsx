import { useQuery } from '@tanstack/react-query';
import { MediaEvent } from 'src/shared/types';

export const Status = (): React.JSX.Element | null => {
    const { data: mediaEvent } = useQuery<MediaEvent | undefined>({
        queryKey: ['media-event'],
    });

    let message: string | undefined = undefined;

    switch (mediaEvent?.kind) {
        case 'poster-updated':
            message = mediaEvent.posterUrl
                ? `Poster updated for "${mediaEvent.title}"`
                : `Failed to fetch poster for "${mediaEvent.title}"`;
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
