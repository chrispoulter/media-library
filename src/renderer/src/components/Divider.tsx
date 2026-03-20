type DividerProps = {
    letter: string;
};

export const Divider = ({ letter }: DividerProps): React.JSX.Element => (
    <div
        id={`letter-${letter}`}
        className="mt-4 mb-2 border-b border-gray-200 pb-1 text-lg font-bold text-gray-400 dark:border-gray-700 dark:text-gray-500"
    >
        {letter}
    </div>
);
