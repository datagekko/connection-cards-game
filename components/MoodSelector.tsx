import React from 'react';
import { SessionMood } from '../types';

interface MoodSelectorProps {
  selectedMood: SessionMood;
  onMoodChange: (mood: SessionMood) => void;
}

const MOOD_CONFIG = {
  [SessionMood.Chill]: { 
    emoji: '😌', 
    color: 'from-blue-500 to-cyan-400',
    description: 'Relaxed and easy-going vibes'
  },
  [SessionMood.Deep]: { 
    emoji: '🤔', 
    color: 'from-purple-600 to-indigo-500',
    description: 'Meaningful and thoughtful conversations'
  },
  [SessionMood.Wild]: { 
    emoji: '🔥', 
    color: 'from-red-500 to-orange-400',
    description: 'Bold and adventurous questions'
  },
  [SessionMood.Funny]: { 
    emoji: '😂', 
    color: 'from-yellow-500 to-pink-400',
    description: 'Light-hearted and humorous'
  }
};

const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onMoodChange }) => {
  return (
    <div className="mood-selector mb-8">
      <h3 className="text-xl font-semibold text-white mb-4 text-center">
        Choose Your Session Vibe
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(MOOD_CONFIG).map(([mood, config]) => (
          <button
            key={mood}
            onClick={() => onMoodChange(mood as SessionMood)}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-300
              ${selectedMood === mood 
                ? `bg-gradient-to-br ${config.color} border-white shadow-lg shadow-white/20 scale-105` 
                : 'bg-white/5 border-white/20 hover:border-white/40 hover:bg-white/10'
              }
            `}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{config.emoji}</div>
              <div className="font-semibold text-white text-lg">{mood}</div>
              <div className="text-sm text-slate-300 mt-1">{config.description}</div>
            </div>
            {selectedMood === mood && (
              <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;