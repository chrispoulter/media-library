import { useVersionQuery } from '../../hooks/useAppQueries';

export const Footer = (): React.JSX.Element | null => {
    const { data: version } = useVersionQuery();

    if (!version) {
        return null;
    }

    return (
        <footer className="border-t border-gray-300 pt-4 text-center text-xs text-gray-500 dark:border-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Media Library{' '}
            {version && <>v{version}</>}
        </footer>
    );
};
