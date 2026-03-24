# Media Library

A desktop application for organizing and browsing your personal collection of movies and TV shows. Built with Electron, React, and TypeScript.

## Features

- **Movies** — Browse your movie collection with real-time search filtering
- **TV Shows** — Browse TV shows with expandable episode and season listings
- **Recently Added** — View the most recently added items across both libraries
- **Settings** — Configure media directories, theme preference, and TMDb API key
- **Light / Dark / System theme** — Follows system preference or can be set manually
- **Persistent window state** — Position, size, and maximized state are saved across restarts
- **Direct playback** — Open any media file in your default player with one click

## Supported Formats

`mp4` `mkv` `avi` `mov` `wmv` `m4v` `webm`

## Tech Stack

| Layer         | Technology             |
| ------------- | ---------------------- |
| Desktop shell | Electron 40            |
| UI            | React 19 + TypeScript  |
| Build tooling | Vite 7 + electron-vite |
| Styling       | Tailwind CSS           |
| Packaging     | electron-builder       |
| Auto-update   | electron-updater       |

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Typecheck

```bash
npm run typecheck
```

### Lint & Format

```bash
npm run lint
npm run format
```

## Build

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux (AppImage, snap, deb)
npm run build:linux
```

## How Media Scanning Works

The app scans the directories you configure in Settings:

- **Movies** — every supported video file anywhere under the movies directory is scanned recursively, and the movie title is derived from the filename.
- **TV Shows** — every supported video file anywhere under the TV shows directory is scanned recursively; show titles and season/episode grouping are derived from filenames using the pattern `Show Name S01E02`.
- **Recently Added** — ordering is based on each media file's modified time (`mtime`).

## Sample Media Library

Generate a reusable sample library for manual testing:

```bash
npm run generate:sample-media
```

This creates the following folders in the repo:

- `test-media/movies`
- `test-media/tv-shows`

Point the app's Settings to these absolute paths:

- Movies: `{repo}/test-media/movies`
- TV Shows: `{repo}/test-media/tv-shows`

The generator creates placeholder files with supported video extensions and staggers their modified times so the Recently Added view has realistic data.

Settings and window state are persisted to `{userData}/settings.json` and `{userData}/window-state.json` respectively.

## Project Structure

```
src/
├── main/           # Electron main process (IPC, file scanning, settings)
├── preload/        # Secure IPC bridge exposed to the renderer
├── renderer/       # React application
│   └── src/
│       ├── components/   # Views and UI components
│       └── utils/        # Theme and time formatting helpers
└── shared/         # Shared TypeScript types
```
