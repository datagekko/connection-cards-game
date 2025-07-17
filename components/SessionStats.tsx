import React from 'react';
import { GameMode } from '../types';

interface SessionStatsProps {
  stats: {
    total: number;
    used: number;
    remaining: number;
    sessionId: string;
    startTime: number;
    modeStats: Array<{
      mode: GameMode;
      total: number;
      used: number;
      remaining: number;
    }>;
  };
  onClearSession: () => void;
}

const SessionStats: React.FC<SessionStatsProps> = ({ stats, onClearSession }) => {
  const sessionDuration = Date.now() - stats.startTime;
  const hours = Math.floor(sessionDuration / (1000 * 60 * 60));
  const minutes = Math.floor((sessionDuration % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-white mb-3">Session Statistics</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{stats.used}</div>
          <div className="text-sm text-white/70">Questions Used</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{stats.remaining}</div>
          <div className="text-sm text-white/70">Questions Remaining</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-white/70 mb-2">Session Duration: {hours}h {minutes}m</div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${(stats.used / stats.total) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {stats.modeStats.map(({ mode, total, used, remaining }) => (
          <div key={mode} className="flex justify-between items-center text-sm">
            <span className="text-white/80">{mode}</span>
            <span className="text-white/60">{used}/{total} used</span>
          </div>
        ))}
      </div>

      <button
        onClick={onClearSession}
        className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-200 py-2 px-4 rounded-lg transition-colors"
      >
        Clear Session & Reset Questions
      </button>
    </div>
  );
};

export default SessionStats;