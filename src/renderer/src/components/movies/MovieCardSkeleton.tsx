export const MovieCardSkeleton = (): React.JSX.Element => (
    <div className="flex animate-pulse items-center gap-4 rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="h-12 w-8 shrink-0 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-6 w-48 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="ml-auto flex items-center gap-2">
            <div className="h-6 w-14 rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-6 w-14 rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-6 w-5 rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
    </div>
);
