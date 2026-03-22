import { useEffect, useState } from 'react';
import { Content } from './components/Content';
import { Sidebar } from './components/Sidebar';
import { useSettingsQuery, useEventsListener } from './hooks/useMediaQueries';
import { applyTheme } from './utils/theme';

function App(): React.JSX.Element {
    const [view, setView] = useState('recently-added');
    const { data: settings } = useSettingsQuery();

    useEventsListener();

    useEffect(() => {
        if (settings) {
            applyTheme(settings.theme);
        }
    }, [settings]);

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar view={view} setView={setView} />
            <Content view={view} />
        </div>
    );
}

export default App;
