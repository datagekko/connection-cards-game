# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server (requires GEMINI_API_KEY in .env.local)
- `npm run build` - Build the application for production
- `npm run preview` - Preview the built application

## Environment Setup

The application requires a Gemini API key to be set in `.env.local`:
```
GEMINI_API_KEY=your_api_key_here
```

## Architecture Overview

This is a React-based connection card game built with TypeScript and Vite. The application helps couples and groups build connections through conversation prompts.

### Core Components Structure

- **App.tsx** - Main application component managing game state and flow
- **types.ts** - TypeScript definitions for GameMode, Question, Player, and QuestionType
- **constants.ts** - Game data including questions for each mode and configuration

### Game Flow

1. **Mode Selection** - Users choose from 5 game modes (First Date, Second Date, Third Date, Love Birds, Group Mode)
2. **Player Setup** - For Group Mode, users can configure multiple players
3. **Game Play** - Players take turns receiving question cards with wildcard functionality

### Key Features

- **Question Cards** - Each mode has different question sets with varying intimacy levels
- **Wildcard System** - Players start with 3 wildcards to replace questions with custom ones
- **Player Management** - Turn-based system with current player tracking
- **Visual Feedback** - Card flip animations, confetti effects, and haptic feedback

### State Management

The app uses React hooks for state management:
- Game state transitions (mode-selection → player-setup → in-game)
- Question shuffling and progression
- Player turn management
- Wildcard usage tracking

### Component Architecture

- **GameScreen** - Main game interface with card flipping and player controls
- **Card** - Animated card component for displaying questions
- **PlayerDisplay** - Shows current player and turn information
- **WildcardDisplay** - Manages wildcard usage interface
- **PlayerSetupScreen** - Multi-player configuration for Group Mode

### Path Aliases

The project uses `@/*` aliases that resolve to the root directory for cleaner imports.