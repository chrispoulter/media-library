type ErrorMessage = {
    error: Error;
};

export const ErrorMessage = ({ error }: ErrorMessage): React.JSX.Element => {
    return (
        <div
            role="alert"
            className="flex flex-col gap-1 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-900/20"
        >
            <p className="font-medium text-red-700 dark:text-red-400">
                Something went wrong
            </p>
            <p className="text-sm text-red-600 dark:text-red-500">
                {error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred'}
            </p>
        </div>
    );
};
