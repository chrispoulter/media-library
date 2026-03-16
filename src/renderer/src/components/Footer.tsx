import { useVersionQuery } from '../hooks/useMediaQueries';

export const Footer = (): React.JSX.Element => {
    const { data: version } = useVersionQuery();

    return (
        <footer className="mt-auto bg-gray-800 p-4 text-center text-white">
            &copy; {new Date().getFullYear()} Media Library. All rights
            reserved.{' '}
            {version && (
                <span className="text-sm text-gray-400">v{version}</span>
            )}
        </footer>
    );
};
