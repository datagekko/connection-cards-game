# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server (requires GEMINI_API_KEY in .env.local)
- `npm run build` - Build the application for production
- `npm run preview` - Preview the built application

## Git Workflow

**IMPORTANT**: Always create a new branch for feature development. Never work directly on the main branch.

**NOTE**: This guideline was established after initial development. Historical commits may show direct main branch work, but all future development should follow the branching strategy below.

### Creating a New Feature Branch
```bash
# Create and switch to a new feature branch
git checkout -b feature/your-feature-name

# Alternative: Create branch from specific commit
git checkout -b feature/your-feature-name main
```

### Common Branch Naming Conventions
- `feature/session-management` - New features
- `feature/question-bank-expansion` - Content/question additions
- `fix/duplicate-questions` - Bug fixes
- `refactor/question-storage` - Code refactoring
- `docs/update-readme` - Documentation updates
- `content/add-new-questions` - Content updates and question additions

### Development Workflow
1. **Start New Feature**: `git checkout -b feature/your-feature-name`
2. **Make Changes**: Implement your feature with regular commits
3. **Test**: Run `npm run build` to ensure no errors
4. **Push Branch**: `git push -u origin feature/your-feature-name`
5. **Create Pull Request**: Use GitHub to create PR from feature branch to main
6. **Code Review**: Wait for review and approval
7. **Merge**: Merge PR into main branch
8. **Cleanup**: Delete feature branch after merge

### Emergency Hotfixes
For critical fixes that need immediate deployment:
```bash
# Create hotfix branch from main
git checkout -b hotfix/critical-fix-name main

# Make minimal changes and test
npm run build

# Push and create PR immediately
git push -u origin hotfix/critical-fix-name
```

### Branch Management Commands
```bash
# List all branches
git branch -a

# Switch to existing branch
git checkout branch-name

# Delete local branch (after merge)
git branch -d feature/your-feature-name

# Delete remote branch
git push origin --delete feature/your-feature-name
```

## Environment Setup

The application requires a Gemini API key to be set in `.env.local`:
```
GEMINI_API_KEY=your_api_key_here
```

## Content Management

### Question Bank Structure
Questions are stored in `constants.ts` and organized by game mode:
- **First Date**: Light & fun icebreakers (~30 questions)
- **Second Date**: Slightly deeper prompts (~25 questions)
- **Third Date**: Emotional and intimate questions (~25 questions)
- **Love Birds**: For established couples (~30 questions)
- **Group Mode**: Spicy, humorous & open-ended including "Would You Rather" questions (~60 questions)

### Adding New Questions
When adding questions to the question bank:
1. **Create content branch**: `git checkout -b content/add-new-questions`
2. **Edit constants.ts**: Add questions to appropriate mode section
3. **Follow question format**:
   ```typescript
   { text: "Your question text here?", mode: GameMode.ModeName, type: QuestionType.Question }
   ```
4. **Test thoroughly**: Ensure questions appear correctly in all modes
5. **Build and verify**: Run `npm run build` to check for errors

### Question Guidelines
- **Be inclusive**: Questions should work for all relationship types
- **Vary difficulty**: Mix light and deep questions within each mode
- **Avoid duplicates**: Check existing questions before adding new ones
- **Consider flow**: Think about question progression and user experience

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
- **Session Management** - Tracks used questions across modes to prevent duplicates within 24-hour sessions (localStorage-based)
- **Wildcard System** - Players start with 3 wildcards to replace questions with custom ones
- **Player Management** - Turn-based system with current player tracking
- **Visual Feedback** - Card flip animations, confetti effects, and haptic feedback
- **Session Statistics** - Shows question usage analytics and allows session reset

### State Management

The app uses React hooks for state management:
- Game state transitions (mode-selection → player-setup → in-game)
- Question shuffling and progression with cross-mode deduplication
- Player turn management
- Wildcard usage tracking
- Session-based question tracking via localStorage (24-hour persistence)

### Component Architecture

- **GameScreen** - Main game interface with card flipping and player controls
- **Card** - Animated card component for displaying questions
- **PlayerDisplay** - Shows current player and turn information
- **WildcardDisplay** - Manages wildcard usage interface
- **PlayerSetupScreen** - Multi-player configuration for Group Mode
- **SessionStats** - Displays question usage analytics and session management
- **ModeSelectionScreen** - Game mode selection with session status

### Hook Architecture

- **useQuestionManager** - Centralized question management with session tracking
  - Prevents duplicate questions across modes within 24-hour sessions
  - Manages localStorage persistence for session data
  - Provides session statistics and reset functionality

### Path Aliases

The project uses `@/*` aliases that resolve to the root directory for cleaner imports.

## Troubleshooting

### Common Issues

1. **Session not persisting**: Check browser localStorage - sessions expire after 24 hours
2. **Questions repeating**: Clear session via the stats panel or localStorage manually
3. **Build errors**: Ensure all TypeScript types are correct in constants.ts
4. **Missing API key**: Verify GEMINI_API_KEY is set in .env.local (development only)

### Development Tips

- **Testing question changes**: Clear localStorage to reset session and test new questions
- **Debugging session state**: Use browser dev tools to inspect localStorage key `connection-cards-session`
- **Question count verification**: Check SessionStats component for accurate question counts per mode