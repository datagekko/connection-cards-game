import React from 'react';
import { SessionEnergy } from '../types';

interface EnergyIndicatorProps {
  sessionEnergy: SessionEnergy;
  onEnergyOverride?: (newLevel: number) => void;
}

const EnergyIndicator: React.FC<EnergyIndicatorProps> = ({ sessionEnergy, onEnergyOverride }) => {
  const getEnergyColor = (level: number) => {
    if (level <= 3) return 'text-blue-400'; // Low energy - calm
    if (level <= 6) return 'text-green-400'; // Medium energy
    return 'text-red-400'; // High energy
  };
  
  const getEnergyEmoji = (level: number) => {
    if (level <= 3) return '😴';
    if (level <= 6) return '😊'; 
    return '🔥';
  };
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '↗️';
      case 'decreasing': return '↘️';
      default: return '→';
    }
  };
  
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-green-400';
      case 'decreasing': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };
  
  return (
    <div className="energy-indicator flex items-center justify-between bg-white/5 rounded-lg px-4 py-2 border border-white/10">
      <div className={`flex items-center space-x-2 ${getEnergyColor(sessionEnergy.level)}`}>
        <span className="text-lg">{getEnergyEmoji(sessionEnergy.level)}</span>
        <span className="text-sm font-medium">Energy: {sessionEnergy.level}/10</span>
        <span className={`text-sm ${getTrendColor(sessionEnergy.trend)}`}>
          {getTrendIcon(sessionEnergy.trend)}
        </span>
      </div>
      
      {onEnergyOverride && (
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onEnergyOverride(Math.max(1, sessionEnergy.level - 1))}
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm transition-colors"
            title="Decrease energy"
          >
            ➖
          </button>
          <button
            onClick={() => onEnergyOverride(Math.min(10, sessionEnergy.level + 1))}
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm transition-colors"
            title="Increase energy"
          >
            ➕
          </button>
        </div>
      )}
    </div>
  );
};

export default EnergyIndicator;