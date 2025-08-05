import { useState, useCallback, useEffect } from 'react';
import { SessionEnergy, EnergyFactor, InteractionMetrics, Player } from '../types';
import { ENERGY_CONFIG } from '../constants';

export const useEnergyLevel = (players: Player[]) => {
  const [sessionEnergy, setSessionEnergy] = useState<SessionEnergy>({
    level: 5,
    trend: 'stable',
    factors: [],
    lastUpdated: Date.now()
  });
  
  const [interactionMetrics, setInteractionMetrics] = useState<InteractionMetrics>({
    questionsAnswered: 0,
    averageResponseTime: 30000,
    wildcardUsage: 0,
    sessionStartTime: Date.now(),
    lastInteractionTime: Date.now()
  });
  
  const [manualOffset, setManualOffset] = useState(0);
  
  const calculateTimeOfDayFactor = useCallback((): EnergyFactor => {
    const hour = new Date().getHours();
    let value = 5;
    
    if (hour >= 19 && hour <= 23) value = 8; // Evening - high energy  
    else if (hour >= 12 && hour <= 18) value = 6; // Afternoon - medium-high
    else if (hour >= 6 && hour <= 11) value = 4; // Morning - medium-low
    else value = 3; // Late night/early morning - low
    
    return { type: 'time_of_day', value, weight: ENERGY_CONFIG.FACTORS.TIME_OF_DAY_WEIGHT };
  }, []);
  
  const calculateSessionLengthFactor = useCallback((startTime: number): EnergyFactor => {
    const sessionMinutes = (Date.now() - startTime) / (1000 * 60);
    let value = 5;
    
    if (sessionMinutes < 15) value = 7; // Fresh start - higher energy
    else if (sessionMinutes < 45) value = 6; // Sweet spot
    else if (sessionMinutes < 90) value = 4; // Getting tired
    else value = 3; // Long session - lower energy
    
    return { type: 'session_length', value, weight: ENERGY_CONFIG.FACTORS.SESSION_LENGTH_WEIGHT };
  }, []);
  
  const calculateInteractionRateFactor = useCallback((metrics: InteractionMetrics): EnergyFactor => {
    const timeSinceLastInteraction = Date.now() - metrics.lastInteractionTime;
    const avgTimePerQuestion = metrics.averageResponseTime;
    
    let value = 5;
    if (timeSinceLastInteraction < avgTimePerQuestion * 0.8) value = 8; // Quick responses
    else if (timeSinceLastInteraction < avgTimePerQuestion * 1.2) value = 6; // Normal pace
    else value = 3; // Slow responses
    
    return { type: 'interaction_rate', value, weight: ENERGY_CONFIG.FACTORS.INTERACTION_RATE_WEIGHT };
  }, []);
  
  const calculateEngagementFactor = useCallback((metrics: InteractionMetrics): EnergyFactor => {
    const wildcardRate = metrics.wildcardUsage / Math.max(1, metrics.questionsAnswered);
    let value = 5;
    
    if (wildcardRate > 0.3) value = 3; // Too many wildcards = disengagement
    else if (wildcardRate > 0.1) value = 7; // Some wildcards = good engagement
    else value = 5; // No wildcards = neutral
    
    return { type: 'player_engagement', value, weight: ENERGY_CONFIG.FACTORS.ENGAGEMENT_WEIGHT };
  }, []);
  
  const calculateEnergyLevel = useCallback(() => {
    const factors: EnergyFactor[] = [
      calculateTimeOfDayFactor(),
      calculateSessionLengthFactor(interactionMetrics.sessionStartTime),
      calculateInteractionRateFactor(interactionMetrics),
      calculateEngagementFactor(interactionMetrics)
    ];
    
    const weightedScore = factors.reduce((sum, factor) => 
      sum + (factor.value * factor.weight), 0
    ) / factors.reduce((sum, factor) => sum + factor.weight, 0);
    
    const baseLevel = Math.max(1, Math.min(10, Math.round(weightedScore)));
    const newLevel = Math.max(1, Math.min(10, baseLevel + manualOffset));
    const trend = newLevel > sessionEnergy.level ? 'increasing' : 
                  newLevel < sessionEnergy.level ? 'decreasing' : 'stable';
    
    setSessionEnergy({
      level: newLevel,
      trend,
      factors,
      lastUpdated: Date.now()
    });
  }, [interactionMetrics, sessionEnergy.level, calculateTimeOfDayFactor, calculateSessionLengthFactor, calculateInteractionRateFactor, calculateEngagementFactor, manualOffset]);

  /**
   * Manually override the current energy level (via +/- buttons).
   * This immediately updates state and resets the trend to "stable".
   */
  const overrideEnergyLevel = useCallback((level: number) => {
    setManualOffset((prevOffset: number) => {
      const desiredOffset = level - sessionEnergy.level;
      return Math.max(-9, Math.min(9, prevOffset + desiredOffset));
    });
    setSessionEnergy((prev: SessionEnergy) => ({
      ...prev,
      level: Math.max(1, Math.min(10, level)),
      trend: 'stable',
      lastUpdated: Date.now()
    }));
  }, [sessionEnergy.level]);
  
  const updateInteractionMetrics = useCallback((type: 'question_answered' | 'wildcard_used', responseTime?: number) => {
    setInteractionMetrics((prev: InteractionMetrics) => {
      const updates: Partial<InteractionMetrics> = {
        lastInteractionTime: Date.now()
      };
      
      if (type === 'question_answered') {
        updates.questionsAnswered = prev.questionsAnswered + 1;
        if (responseTime) {
          updates.averageResponseTime = (prev.averageResponseTime * prev.questionsAnswered + responseTime) / (prev.questionsAnswered + 1);
        }
      } else if (type === 'wildcard_used') {
        updates.wildcardUsage = prev.wildcardUsage + 1;
      }
      
      return { ...prev, ...updates };
    });
  }, []);
  
  // Recalculate energy every 30 seconds or after interactions
  useEffect(() => {
    const interval = setInterval(calculateEnergyLevel, ENERGY_CONFIG.UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [calculateEnergyLevel]);
  
  useEffect(() => {
    calculateEnergyLevel();
  }, [interactionMetrics]);
  
  return {
    sessionEnergy,
    updateInteractionMetrics,
    forceEnergyRecalculation: calculateEnergyLevel,
    overrideEnergyLevel
  };
};