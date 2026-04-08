interface DividerProps {
    id?: string;
    label: string;
}

export const Divider = ({ id, label }: DividerProps): React.JSX.Element => (
    <h3
        id={id}
        className="mt-2 mb-2 border-b border-zinc-200 pb-1 text-xs font-semibold tracking-wider text-zinc-400 uppercase dark:border-zinc-700 dark:text-zinc-500"
    >
        {label}
    </h3>
);
