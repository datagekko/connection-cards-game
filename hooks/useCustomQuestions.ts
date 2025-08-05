import { useState, useCallback, useEffect } from 'react';
import { CustomQuestion, SessionMood, GameMode, QuestionType, RelationshipType } from '../types';

const CUSTOM_QUESTIONS_STORAGE_KEY = 'connection-cards-custom-questions';

// Utility function to generate unique IDs
const generateId = (): string => Math.random().toString(36).substr(2, 9);

export const useCustomQuestions = () => {
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);

  // Load custom questions from localStorage on initialization
  useEffect(() => {
    const stored = localStorage.getItem(CUSTOM_QUESTIONS_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCustomQuestions(parsed);
      } catch (error) {
        console.warn('Failed to parse stored custom questions:', error);
      }
    }
  }, []);

  // Save to localStorage whenever custom questions change
  useEffect(() => {
    localStorage.setItem(CUSTOM_QUESTIONS_STORAGE_KEY, JSON.stringify(customQuestions));
  }, [customQuestions]);

  const addCustomQuestion = useCallback((question: Omit<CustomQuestion, 'id' | 'createdAt'>) => {
    const newQuestion: CustomQuestion = {
      ...question,
      id: generateId(),
      createdAt: Date.now()
    };
    
    setCustomQuestions(prev => [...prev, newQuestion]);
    return newQuestion;
  }, []);

  const removeCustomQuestion = useCallback((questionId: string) => {
    setCustomQuestions(prev => prev.filter(q => q.id !== questionId));
  }, []);

  const updateCustomQuestion = useCallback((questionId: string, updates: Partial<Omit<CustomQuestion, 'id' | 'createdAt'>>) => {
    setCustomQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    ));
  }, []);

  const getCustomQuestionsByAuthor = useCallback((authorId: number) => {
    return customQuestions.filter(q => q.authorId === authorId);
  }, [customQuestions]);

  const getApprovedCustomQuestions = useCallback((mode?: GameMode) => {
    return customQuestions.filter(q => 
      q.approved && (mode ? q.mode === mode : true)
    );
  }, [customQuestions]);

  const clearAllCustomQuestions = useCallback(() => {
    setCustomQuestions([]);
    localStorage.removeItem(CUSTOM_QUESTIONS_STORAGE_KEY);
  }, []);

  return {
    customQuestions,
    addCustomQuestion,
    removeCustomQuestion,
    updateCustomQuestion,
    getCustomQuestionsByAuthor,
    getApprovedCustomQuestions,
    clearAllCustomQuestions
  };
};