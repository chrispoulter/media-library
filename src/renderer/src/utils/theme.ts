import type { Settings } from '../../../shared/types';

export function applyTheme(theme: Settings['theme']): void {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    switch (theme) {
        case 'dark':
            root.classList.add('dark');
            break;

        case 'light':
            root.classList.remove('dark');
            break;

        case 'system':
        default:
            root.classList.toggle('dark', mediaQuery.matches);
            break;
    }
}
