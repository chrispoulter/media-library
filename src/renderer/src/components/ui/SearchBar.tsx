import clsx from 'clsx';
import { SearchIcon, XIcon } from './SvgIcons';

type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
};

export const SearchBar = ({
    value,
    onChange,
    placeholder,
    disabled,
}: SearchBarProps): React.JSX.Element => {
    return (
        <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-400" />
            <input
                type="text"
                placeholder={placeholder}
                aria-label={placeholder ?? 'Search'}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={clsx(
                    'w-full rounded border p-2 pl-8 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400',
                    value && 'pr-8'
                )}
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    aria-label="Clear search"
                    disabled={disabled}
                >
                    <XIcon className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};
