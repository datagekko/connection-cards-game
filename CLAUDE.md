# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Local Development
```bash
npm install          # Install dependencies
npm run dev          # Start development server (Vite)
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Environment Setup
- Set `GEMINI_API_KEY` in `.env.local` (though currently unused in components)
- Project uses ES modules (type: "module" in package.json)

### Package Management
- Both npm and pnpm are supported, but npm is preferred for Vercel deployment
- Use npm commands for consistency with deployment configuration

## Architecture Overview

**Connection Cards** is a React-based couples card game with a simple, clean architecture:

### Core Structure
- **App.tsx** - Main state container managing game mode and questions data
- **GameSetup.tsx** - Mode selection interface (4 game modes)  
- **GameBoard.tsx** - Core game logic with turn-based gameplay
- **Card.tsx** - Reusable flip card component with CSS 3D animations
- **constants/questions.ts** - 125 questions across 4 relationship stages

### Technology Stack
- **React 19.1.0** with functional components and hooks
- **TypeScript 5.7.2** with strict configuration
- **Vite 6.2.0** for build tooling
- **Tailwind CSS** (loaded via CDN) for styling

### Data Flow Pattern
1. App maintains global state (gameMode, questions array)
2. Props flow down to child components
3. Event callbacks bubble up to update state
4. GameBoard manages local game state (current player, card flips)
5. Questions are filtered and shuffled based on selected mode

### State Management
- Uses React's built-in useState and useCallback patterns
- No external state management library
- Local state in GameBoard for game-specific logic
- Immutable updates with React state setters

## Key Implementation Details

### Question System
- Questions organized by 4 modes: "First Date", "Second Date", "Third Date", "Love Birds"
- Array filtering and shuffling happens in App.tsx
- 125 total questions with varied intimacy levels

### Component Relationships
```
App (state container)
├── GameSetup (calls onModeSelect)
└── GameBoard (receives questions, calls onRestart)
    ├── Card (receives flip state and content)
    └── Icons (HeartIcon, RefreshCwIcon)
```

### Styling Approach
- Utility-first CSS with Tailwind classes
- Responsive design with mobile-first breakpoints (sm:, md:, lg:)
- CSS 3D transforms for card flip animations (700ms duration)
- Color-coded game modes with gradient backgrounds

### TypeScript Configuration
- Strict mode enabled with comprehensive linting
- React JSX transform configured
- ES2020 target with modern browser support
- Path aliases: `@/*` maps to project root

## Deployment

### Vercel Configuration
- Configured in `vercel.json` for automatic deployment
- Uses npm (not pnpm) for Vercel compatibility
- Framework: Vite, Output: dist/, Build: npm run build

### Build Process
- Vite handles bundling and optimization
- TypeScript compilation integrated
- Environment variables exposed via vite.config.ts

## Development Guidelines

### Branch Strategy
- Create new branches for features/improvements: `git checkout -b feature-name`
- Work on dedicated branches before merging to main