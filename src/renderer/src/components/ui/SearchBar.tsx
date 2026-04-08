import clsx from 'clsx';
import { SearchIcon, XIcon } from './SvgIcons';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export const SearchBar = ({
    value,
    onChange,
    placeholder,
    disabled,
}: SearchBarProps): React.JSX.Element => {
    return (
        <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-400" />
            <input
                type="text"
                placeholder={placeholder}
                aria-label={placeholder ?? 'Search'}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={clsx(
                    'w-full rounded-lg border border-zinc-300 p-2 pl-8 focus-visible:border-sky-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400 dark:focus-visible:border-sky-400',
                    value && 'pr-8'
                )}
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    aria-label="Clear search"
                    disabled={disabled}
                >
                    <XIcon className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};
