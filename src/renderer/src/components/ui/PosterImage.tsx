import * as Tooltip from '@radix-ui/react-tooltip';

interface PosterImageProps {
    src: string | null | undefined;
    alt: string;
    fallbackSrc: string;
}

export const PosterImage = ({
    src,
    alt,
    fallbackSrc,
}: PosterImageProps): React.JSX.Element => {
    const handleError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
        e.currentTarget.src = fallbackSrc;
        e.currentTarget.onerror = null;
    };

    if (!src) {
        return <img src={fallbackSrc} alt={alt} className="h-12 w-8 rounded" />;
    }

    return (
        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <img
                        src={src}
                        alt={alt}
                        onError={handleError}
                        className="h-12 w-8 rounded"
                    />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content side="right">
                        <img
                            src={src}
                            alt={alt}
                            onError={handleError}
                            className="m-2 h-60 w-40 rounded"
                        />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
};
