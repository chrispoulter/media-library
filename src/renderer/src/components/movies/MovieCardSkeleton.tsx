export const MovieCardSkeleton = (): React.JSX.Element => (
    <div className="flex animate-pulse items-center gap-4 rounded bg-gray-200 p-2 shadow-sm dark:bg-zinc-800">
        <div className="h-12 w-8 shrink-0 rounded bg-gray-300 dark:bg-zinc-700" />
        <div className="h-6 w-48 rounded bg-gray-300 dark:bg-zinc-700" />
        <div className="ml-auto flex items-center gap-2">
            <div className="h-6 w-14 rounded bg-gray-300 dark:bg-zinc-700" />
            <div className="h-6 w-14 rounded bg-gray-300 dark:bg-zinc-700" />
            <div className="h-6 w-5 rounded bg-gray-300 dark:bg-zinc-700" />
        </div>
    </div>
);
