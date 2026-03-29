import clsx from 'clsx';

const ALL_LETTERS = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

type AlphabetBarProps = {
    availableLetters?: Set<string>;
};

export const AlphabetBar = ({
    availableLetters,
}: AlphabetBarProps): React.JSX.Element => {
    return (
        <nav aria-label="Jump to letter" className="overflow-x-auto p-1">
            <div className="flex min-w-max items-center gap-1">
                {ALL_LETTERS.map((letter) => {
                    const active = availableLetters?.has(letter);

                    return (
                        <button
                            key={letter}
                            type="button"
                            onClick={() => {
                                const sectionElement = document.getElementById(
                                    `letter-${letter}`
                                );

                                sectionElement?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start',
                                });
                            }}
                            disabled={!active}
                            aria-label={`Jump to ${letter} section`}
                            className={clsx(
                                'flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition-colors',
                                active
                                    ? 'cursor-pointer border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-700'
                                    : 'cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400 opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500'
                            )}
                        >
                            {letter}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};
