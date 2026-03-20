import clsx from 'clsx';

const ALL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');

type AlphabetBarProps = {
    availableLetters?: Set<string>;
};

export const AlphabetBar = ({
    availableLetters,
}: AlphabetBarProps): React.JSX.Element => {
    return (
        <nav aria-label="Jump to letter" className="mb-4 overflow-x-auto pb-1">
            <div className="flex min-w-max items-center gap-1.5">
                {ALL_LETTERS.map((l) => {
                    const active = availableLetters?.has(l);

                    return (
                        <button
                            key={l}
                            type="button"
                            onClick={() => {
                                const sectionElement = document.getElementById(
                                    `letter-${l}`
                                );

                                sectionElement?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start',
                                });
                            }}
                            disabled={!active}
                            aria-label={`Jump to ${l} section`}
                            className={clsx(
                                'flex h-8 w-8 items-center justify-center rounded border text-xs font-semibold transition-colors',
                                active
                                    ? 'cursor-pointer border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:border-gray-500 dark:hover:bg-gray-600'
                                    : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500'
                            )}
                        >
                            {l}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};
