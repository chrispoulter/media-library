import { useEffect, useState } from 'react';
import { Content } from './components/Content';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { useSettingsQuery, usePosterUpdates } from './hooks/useMediaQueries';
import { applyTheme } from './utils/theme';

function App(): React.JSX.Element {
    const [view, setView] = useState('recently-added');
    const { data: settings } = useSettingsQuery();

    usePosterUpdates();

    useEffect(() => {
        if (settings) {
            applyTheme(settings.theme);
        }
    }, [settings]);

    return (
        <div className="flex h-screen flex-col">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar view={view} setView={setView} />
                <Content view={view} />
            </div>
            <Footer />
        </div>
    );
}

export default App;
