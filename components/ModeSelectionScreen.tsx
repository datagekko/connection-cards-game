import React, { useMemo, useState } from 'react';
import { GameMode } from '../types';
import { GAME_MODES } from '../constants';
import { HeartIcon } from './icons/HeartIcon';
import SessionStats from './SessionStats';
import type { SessionStatsSnapshot } from '../hooks/useQuestionManager';

interface ModeSelectionScreenProps {
  onModeSelect: (mode: GameMode) => void;
  sessionStats: SessionStatsSnapshot;
  onClearSession: () => void;
}

const MODE_META: Record<GameMode, { badge: string; helper: string; tone: string }> = {
  [GameMode.FirstDate]: {
    badge: 'Easy start',
    helper: 'Light prompts for warming up without pressure.',
    tone: 'from-rose-500/15 to-pink-500/5 border-rose-300/20'
  },
  [GameMode.SecondDate]: {
    badge: 'Go deeper',
    helper: 'For stories, values, dreams, and better follow-up questions.',
    tone: 'from-orange-500/15 to-rose-500/5 border-orange-300/20'
  },
  [GameMode.ThirdDate]: {
    badge: 'More intimate',
    helper: 'Slower, vulnerable questions when the vibe feels safe.',
    tone: 'from-purple-500/15 to-fuchsia-500/5 border-purple-300/20'
  },
  [GameMode.LoveBirds]: {
    badge: 'Couples',
    helper: 'For partners who want to reconnect and learn something new.',
    tone: 'from-pink-500/15 to-red-500/5 border-pink-300/20'
  },
  [GameMode.GroupMode]: {
    badge: 'Multiplayer',
    helper: 'Pass the phone around for funny, spicy group conversations.',
    tone: 'from-pink-500 to-purple-600 border-pink-400/50'
  }
};

const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({ onModeSelect, sessionStats, onClearSession }) => {
  const [showStats, setShowStats] = useState(false);
  const sessionProgress = sessionStats.total > 0 ? Math.round((sessionStats.used / sessionStats.total) * 100) : 0;
  const modeStatsByMode = useMemo(() => new Map(sessionStats.modeStats.map(stat => [stat.mode, stat])), [sessionStats.modeStats]);
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-gray-900 via-slate-950 to-black">
      <div className="w-full max-w-md">
        <header className="text-center mb-8 sm:mb-10">
          <HeartIcon className="w-16 h-16 mx-auto text-pink-500 mb-4" />
          <p className="text-pink-200/80 text-sm font-semibold uppercase tracking-[0.25em] mb-2">Playful prompts, real connection</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Connection Cards
          </h1>
          <p className="text-slate-300 mt-3 text-base sm:text-lg">
            Pick the vibe, pass the phone, and let the conversation unfold.
          </p>
          <p className="text-slate-500 mt-2 text-sm">Questions you answer are remembered for 24 hours.</p>
          
          {sessionStats.used > 0 && (
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">Session progress</p>
                  <p className="text-xs text-slate-400">{sessionStats.used} answered · {sessionStats.remaining} fresh cards left</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStats(!showStats)}
                  className="min-h-10 rounded-full px-3 py-2 text-sm font-medium text-pink-100 bg-pink-500/15 hover:bg-pink-500/25 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-950 transition"
                  aria-expanded={showStats}
                >
                  {showStats ? 'Hide' : 'Details'}
                </button>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-white/10" aria-hidden="true">
                <div className="h-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-500" style={{ width: `${sessionProgress}%` }} />
              </div>
            </div>
          )}
        </header>
        
        {showStats && (
          <div className="mb-6">
            <SessionStats
              stats={sessionStats}
              onClearSession={() => {
                onClearSession();
                setShowStats(false);
              }}
            />
          </div>
        )}

        <main aria-label="Choose a game mode" className="space-y-3 sm:space-y-4">
          {GAME_MODES.map(({ mode, description }) => {
            const meta = MODE_META[mode];
            const modeStats = modeStatsByMode.get(mode);
            const isGroupMode = mode === GameMode.GroupMode;
            const freshCount = modeStats?.remaining ?? 0;

            return (
              <button
                key={mode}
                type="button"
                onClick={() => onModeSelect(mode)}
                className={`relative w-full min-h-[112px] text-left p-5 rounded-2xl border shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-950 group ${
                  isGroupMode
                    ? `bg-gradient-to-r ${meta.tone} hover:shadow-purple-500/20 hover:scale-[1.01]`
                    : `bg-gradient-to-br ${meta.tone} hover:bg-white/10 hover:border-white/20`
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{mode}</h2>
                    <p className={isGroupMode ? 'text-pink-100/90' : 'text-slate-300'}>{description}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white">
                    {meta.badge}
                  </span>
                </div>
                <p className={isGroupMode ? 'mt-3 text-sm text-white/85' : 'mt-3 text-sm text-slate-400'}>{meta.helper}</p>
                {modeStats && (
                  <p className="mt-3 text-xs font-medium text-white/60">
                    {freshCount > 0 ? `${freshCount} fresh cards available` : 'All cards answered recently — repeats may appear'}
                  </p>
                )}
              </button>
            );
          })}
        </main>

        <footer className="text-center mt-10 text-slate-500 text-sm">
          <p>Built for connection. No scores, no pressure.</p>
        </footer>
      </div>
    </div>
  );
};

export default ModeSelectionScreen;
