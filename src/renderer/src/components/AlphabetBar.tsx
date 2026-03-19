import clsx from 'clsx';
import { ALPHABETICAL_SECTION_LABELS } from '../utils/alphabeticalSections';

type AlphabetBarProps = {
    availableLabels: string[];
    onJump: (label: string) => void;
};

export const AlphabetBar = ({
    availableLabels,
    onJump,
}: AlphabetBarProps): React.JSX.Element => {
    const availableLabelSet = new Set(availableLabels);

    return (
        <nav aria-label="Jump to letter" className="mb-4 overflow-x-auto pb-1">
            <div className="flex min-w-max items-center gap-1.5">
                {ALPHABETICAL_SECTION_LABELS.map((label) => {
                    const isAvailable = availableLabelSet.has(label);

                    return (
                        <button
                            key={label}
                            type="button"
                            onClick={() => onJump(label)}
                            disabled={!isAvailable}
                            aria-label={`Jump to ${label} section`}
                            className={clsx(
                                'flex h-8 w-8 items-center justify-center rounded border text-xs font-semibold transition-colors',
                                isAvailable
                                    ? 'cursor-pointer border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:border-gray-500 dark:hover:bg-gray-600'
                                    : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500'
                            )}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};
