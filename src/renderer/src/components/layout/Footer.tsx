import { useVersionQuery } from '../../hooks/useAppQueries';

export const Footer = (): React.JSX.Element | null => {
    const { data: version } = useVersionQuery();

    if (!version) {
        return null;
    }

    return (
        <footer className="flex justify-between text-center text-xs text-zinc-500 dark:text-zinc-400">
            <p>&copy; Chris Poulter {new Date().getFullYear()}</p>
            {version && <p>v{version}</p>}
        </footer>
    );
};
