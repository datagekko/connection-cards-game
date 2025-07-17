# Connection Cards Game

A React-based connection card game built with TypeScript and Vite. This application helps couples and groups build connections through conversation prompts across different intimacy levels.

## Features

- **5 Game Modes**: First Date, Second Date, Third Date, Love Birds, and Group Mode
- **Wildcard System**: Players can replace questions with custom ones
- **Turn-based Gameplay**: Manages multiple players and turn rotation
- **Interactive Cards**: Animated card flipping with visual feedback
- **Responsive Design**: Works on desktop and mobile devices

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in `.env.local`:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Build for Production

```bash
npm run build
npm run preview
```

## Deploy to Vercel

This project is configured for easy deployment to Vercel:

1. Connect your GitHub repository to Vercel
2. Set the `GEMINI_API_KEY` environment variable in your Vercel dashboard
3. Deploy automatically on every push to main branch

## Environment Variables

- `GEMINI_API_KEY` - Required for API functionality
