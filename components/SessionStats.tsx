import React from 'react';
import type { SessionStatsSnapshot } from '../hooks/useQuestionManager';

interface SessionStatsProps {
  stats: SessionStatsSnapshot;
  onClearSession: () => void;
}

const SessionStats: React.FC<SessionStatsProps> = ({ stats, onClearSession }) => {
  const sessionDuration = Date.now() - stats.startTime;
  const hours = Math.floor(sessionDuration / (1000 * 60 * 60));
  const minutes = Math.floor((sessionDuration % (1000 * 60 * 60)) / (1000 * 60));
  const totalProgress = stats.total > 0 ? (stats.used / stats.total) * 100 : 0;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm" aria-label="Session statistics">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">Your session</h3>
          <p className="text-sm text-white/60">Fresh prompts reset automatically after 24 hours.</p>
        </div>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/70">
          {hours}h {minutes}m
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl bg-white/10 p-3 text-center">
          <div className="text-2xl font-bold text-white">{stats.used}</div>
          <div className="text-sm text-white/70">Answered</div>
        </div>
        <div className="rounded-xl bg-white/10 p-3 text-center">
          <div className="text-2xl font-bold text-white">{stats.remaining}</div>
          <div className="text-sm text-white/70">Fresh cards</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex justify-between text-sm text-white/70">
          <span>Overall progress</span>
          <span>{Math.round(totalProgress)}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-pink-400 to-purple-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {stats.modeStats.map(({ mode, total, used, remaining }) => {
          const progress = total > 0 ? (used / total) * 100 : 0;

          return (
            <div key={mode} className="text-sm">
              <div className="mb-1 flex justify-between items-center gap-3">
                <span className="text-white/85">{mode}</span>
                <span className="text-white/60">{remaining} left</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/10" aria-hidden="true">
                <div className="h-1.5 rounded-full bg-white/70" style={{ width: `${progress}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onClearSession}
        className="w-full rounded-xl bg-red-500/20 py-3 px-4 font-medium text-red-100 transition-colors hover:bg-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-gray-950"
      >
        Reset answered cards
      </button>
    </section>
  );
};

export default SessionStats;
