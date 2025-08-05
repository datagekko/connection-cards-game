import { useState, useCallback, useEffect } from 'react';
import { GameMode, Question, SessionConfig, SessionMood, CustomQuestion } from '../types';
import { QUESTIONS, ENERGY_QUESTION_MAPPING } from '../constants';

interface QuestionSession {
  usedQuestions: Set<string>;
  sessionId: string;
  startTime: number;
}

const STORAGE_KEY = 'connection-cards-session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Utility function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// A curated list of light, funny icebreaker questions for the First Date mode. These should always
// appear at the beginning of a new First Date session to help break the ice before any deeper
// or more sexual prompts are shown.
const FIRST_DATE_ICEBREAKER_QUESTIONS: string[] = [
  "Would you rather go on a great date with someone who disappears or a boring date with someone who won’t stop texting you?",
  "What's your spirit animal? Why?",
  "You can delete one dating behavior from the planet. What vanishes?",
  "Is there a song that immediately lifts your mood? Which one?",
  "If there was a Google review for dating you, what would it say?",
];

// Ensure that the first five questions for the First Date mode are always the light ice-breakers
// defined above. The rest of the questions are shuffled and appended afterwards.
const ensureIcebreakersFirst = (questions: Question[]): Question[] => {
  const icebreakers = questions.filter(q => FIRST_DATE_ICEBREAKER_QUESTIONS.includes(q.text));
  const others = questions.filter(q => !FIRST_DATE_ICEBREAKER_QUESTIONS.includes(q.text));

  // In case fewer than five icebreakers are available (e.g. they were all used), fall back to
  // whatever icebreakers remain and proceed with the rest.
  const selectedIcebreakers = shuffleArray(icebreakers).slice(0, 5);

  return [...selectedIcebreakers, ...shuffleArray(others)];
};

// Helper function to apply mood filtering to questions
const applyMoodFilter = (questions: Question[], mood: SessionMood): Question[] => {
  return questions.filter(question => {
    // For now, use simple keyword matching - can be enhanced with ML later
    const text = question.text.toLowerCase();
    
    switch (mood) {
      case SessionMood.Chill:
        return !text.includes('crazy') && !text.includes('wild') && !text.includes('insane');
      case SessionMood.Deep:
        return text.includes('feel') || text.includes('think') || text.includes('believe') || 
               text.includes('value') || text.includes('meaning') || text.includes('life');
      case SessionMood.Wild:
        return text.includes('dare') || text.includes('crazy') || text.includes('wild') || 
               text.includes('never') || text.includes('boldest');
      case SessionMood.Funny:
        return text.includes('weird') || text.includes('funny') || text.includes('ridiculous') ||
               text.includes('embarrassing') || text.includes('hilarious');
      default:
        return true;
    }
  });
};

// Helper function to apply energy-based filtering to questions
const applyEnergyFilter = (questions: Question[], energyLevel: number): Question[] => {
  return questions.filter(question => {
    const questionEnergy = getQuestionEnergyRequirement(question);
    // Match questions to energy level (±2 tolerance)
    return Math.abs(questionEnergy - energyLevel) <= 2;
  });
};

// Helper function to calculate question energy requirement
const getQuestionEnergyRequirement = (question: Question): number => {
  let energy = 5; // Default
  const text = question.text.toLowerCase();
  
  // Adjust based on question characteristics
  if (text.length > 100) energy += 1; // Long questions need focus
  if (text.includes('wild') || text.includes('crazy') || text.includes('dare')) energy += 2;
  if (text.includes('chill') || text.includes('relax') || text.includes('simple')) energy -= 1;
  if (text.includes('deep') || text.includes('meaning') || text.includes('philosophy')) energy += 1;
  
  return Math.max(1, Math.min(10, energy));
};

export const useQuestionManager = (customQuestions: CustomQuestion[] = []) => {
  const [session, setSession] = useState<QuestionSession>(() => {
    // Initialize or load session from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const now = Date.now();
        
        // Check if session is still valid (within 24 hours)
        if (now - parsed.startTime < SESSION_DURATION) {
          return {
            usedQuestions: new Set(parsed.usedQuestions),
            sessionId: parsed.sessionId,
            startTime: parsed.startTime
          };
        }
      } catch (error) {
        console.warn('Failed to parse stored session:', error);
      }
    }
    
    // Create new session
    return {
      usedQuestions: new Set<string>(),
      sessionId: Math.random().toString(36).substr(2, 9),
      startTime: Date.now()
    };
  });

  // Save session to localStorage whenever it changes
  useEffect(() => {
    const sessionData = {
      usedQuestions: Array.from(session.usedQuestions),
      sessionId: session.sessionId,
      startTime: session.startTime
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
  }, [session]);

  const getAvailableQuestions = useCallback((mode: GameMode, config?: SessionConfig, energyLevel?: number): Question[] => {
    // Combine regular questions with approved custom questions
    const approvedCustomQuestions = customQuestions.filter(q => q.approved);
    const allQuestions = [...QUESTIONS, ...approvedCustomQuestions];
    
    // Filter questions by mode and exclude used ones
    const modeQuestions = allQuestions.filter(q => q.mode === mode);
    let availableQuestions = modeQuestions.filter(q => !session.usedQuestions.has(q.text));
    
    // Apply mood filtering if config is provided
    if (config?.mood && availableQuestions.length > 5) {
      const moodFiltered = applyMoodFilter(availableQuestions, config.mood);
      if (moodFiltered.length > 0) {
        availableQuestions = moodFiltered;
      }
    }
    
    // Apply energy filtering if energy level is provided
    if (energyLevel && availableQuestions.length > 5) {
      const energyFiltered = applyEnergyFilter(availableQuestions, energyLevel);
      if (energyFiltered.length > 0) {
        availableQuestions = energyFiltered;
      }
    }
    
    // If no questions available for this mode, return all mode questions
    // This prevents the app from breaking when all questions are exhausted
    if (availableQuestions.length === 0) {
      console.warn(`All questions for ${mode} have been used. Allowing repeats.`);
      return shuffleArray(modeQuestions);
    }
    
    if (mode === GameMode.FirstDate) {
      return ensureIcebreakersFirst(availableQuestions);
    }

    return shuffleArray(availableQuestions);
  }, [session.usedQuestions, customQuestions]);

  const markQuestionAsUsed = useCallback((questionText: string) => {
    setSession(prev => ({
      ...prev,
      usedQuestions: new Set(prev.usedQuestions).add(questionText)
    }));
  }, []);

  const getSessionStats = useCallback(() => {
    const approvedCustomQuestions = customQuestions.filter(q => q.approved);
    const allQuestions = [...QUESTIONS, ...approvedCustomQuestions];
    const totalQuestions = allQuestions.length;
    const usedCount = session.usedQuestions.size;
    const remainingCount = totalQuestions - usedCount;
    
    const modeStats = Object.values(GameMode).map(mode => {
      const modeQuestions = allQuestions.filter(q => q.mode === mode);
      const usedInMode = modeQuestions.filter(q => session.usedQuestions.has(q.text)).length;
      const remainingInMode = modeQuestions.length - usedInMode;
      
      return {
        mode,
        total: modeQuestions.length,
        used: usedInMode,
        remaining: remainingInMode
      };
    });
    
    return {
      total: totalQuestions,
      used: usedCount,
      remaining: remainingCount,
      sessionId: session.sessionId,
      startTime: session.startTime,
      modeStats,
      customQuestionsCount: approvedCustomQuestions.length
    };
  }, [session, customQuestions]);

  const clearSession = useCallback(() => {
    const newSession = {
      usedQuestions: new Set<string>(),
      sessionId: Math.random().toString(36).substr(2, 9),
      startTime: Date.now()
    };
    setSession(newSession);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    getAvailableQuestions,
    markQuestionAsUsed,
    getSessionStats,
    clearSession,
    sessionId: session.sessionId
  };
};