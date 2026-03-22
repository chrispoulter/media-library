import { useVersionQuery } from '../hooks/useMediaQueries';

export const Footer = (): React.JSX.Element | null => {
    const { data: version } = useVersionQuery();

    if (!version) {
        return null;
    }

    return (
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Media Library{' '}
            {version && <>v{version}</>}
        </div>
    );
};
