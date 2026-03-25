export const DividerSkeleton = (): React.JSX.Element => {
    return (
        <div className="mt-2 mb-2 animate-pulse border-b border-zinc-200 pb-1 text-xs font-semibold tracking-wider text-zinc-400 uppercase dark:border-zinc-700 dark:text-zinc-500">
            <div className="h-6 w-8 rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
    );
};
