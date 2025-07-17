import { useState, useCallback, useEffect } from 'react';
import { GameMode, Question } from '../types';
import { QUESTIONS } from '../constants';

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

export const useQuestionManager = () => {
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

  const getAvailableQuestions = useCallback((mode: GameMode): Question[] => {
    // Filter questions by mode and exclude used ones
    const modeQuestions = QUESTIONS.filter(q => q.mode === mode);
    const availableQuestions = modeQuestions.filter(q => !session.usedQuestions.has(q.text));
    
    // If no questions available for this mode, return all mode questions
    // This prevents the app from breaking when all questions are exhausted
    if (availableQuestions.length === 0) {
      console.warn(`All questions for ${mode} have been used. Allowing repeats.`);
      return shuffleArray(modeQuestions);
    }
    
    return shuffleArray(availableQuestions);
  }, [session.usedQuestions]);

  const markQuestionAsUsed = useCallback((questionText: string) => {
    setSession(prev => ({
      ...prev,
      usedQuestions: new Set(prev.usedQuestions).add(questionText)
    }));
  }, []);

  const getSessionStats = useCallback(() => {
    const totalQuestions = QUESTIONS.length;
    const usedCount = session.usedQuestions.size;
    const remainingCount = totalQuestions - usedCount;
    
    const modeStats = Object.values(GameMode).map(mode => {
      const modeQuestions = QUESTIONS.filter(q => q.mode === mode);
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
      modeStats
    };
  }, [session]);

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