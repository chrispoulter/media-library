import * as Tooltip from '@radix-ui/react-tooltip';

type PosterImageProps = {
    src: string | null | undefined;
    alt: string;
    fallbackSrc: string;
};

export const PosterImage = ({
    src,
    alt,
    fallbackSrc,
}: PosterImageProps): React.JSX.Element => {
    const resolvedSrc = src || fallbackSrc;

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
        e.currentTarget.src = fallbackSrc;
        e.currentTarget.onerror = null;
    };

    const sharedProps = { src: resolvedSrc, alt, onError: handleError };
    const smallClass = 'h-auto w-full max-w-8 rounded';
    const largeClass = 'm-2 h-auto w-40 rounded';

    if (!src) {
        return <img {...sharedProps} className={smallClass} />;
    }

    return (
        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <img {...sharedProps} className={smallClass} />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content side="right">
                        <img {...sharedProps} className={largeClass} />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
};
