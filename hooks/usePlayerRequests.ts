import { useState, useCallback } from 'react';
import { PlayerRequest, RequestTopic, Question, GameMode, QuestionType, SessionMood } from '../types';
import { TOPIC_KEYWORDS } from '../constants';

// Utility function to generate unique IDs
const generateId = (): string => Math.random().toString(36).substr(2, 9);

// Utility function to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const usePlayerRequests = () => {
  const [requests, setRequests] = useState<PlayerRequest[]>([]);

  const addRequest = useCallback((request: Omit<PlayerRequest, 'id' | 'createdAt' | 'fulfilled'>) => {
    const newRequest: PlayerRequest = {
      ...request,
      id: generateId(),
      createdAt: Date.now(),
      fulfilled: false
    };
    
    setRequests(prev => [...prev, newRequest]);
    return newRequest;
  }, []);

  const fulfillRequest = useCallback((requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, fulfilled: true } : req
    ));
  }, []);

  const removeRequest = useCallback((requestId: string) => {
    setRequests(prev => prev.filter(req => req.id !== requestId));
  }, []);

  const getActiveRequests = useCallback((playerId?: number) => {
    return requests.filter(req => 
      !req.fulfilled && (playerId ? req.playerId === playerId : true)
    );
  }, [requests]);

  const getPlayerRequests = useCallback((playerId: number) => {
    return requests.filter(req => req.playerId === playerId);
  }, [requests]);

  const generateRequestedQuestions = useCallback((request: PlayerRequest, questionPool: Question[]): Question[] => {
    // Filter questions by topic using keyword matching
    const topicKeywords = TOPIC_KEYWORDS[request.topic] || [];
    const matchingQuestions = questionPool.filter(q => 
      topicKeywords.some(keyword => 
        q.text.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    // If custom prompt provided, create custom question
    if (request.specificPrompt) {
      const customQuestion: Question = {
        text: request.specificPrompt,
        mode: GameMode.GroupMode,
        type: QuestionType.Question,
        moodTags: [SessionMood.Deep],
        intimacyLevel: 7
      };
      return [customQuestion, ...shuffleArray(matchingQuestions).slice(0, 4)];
    }

    return shuffleArray(matchingQuestions).slice(0, 5);
  }, []);

  const hasActiveRequest = useCallback((playerId: number) => {
    return requests.some(req => req.playerId === playerId && !req.fulfilled);
  }, [requests]);

  const getNextRequestToFulfill = useCallback((): PlayerRequest | null => {
    const activeRequests = requests.filter(req => !req.fulfilled);
    if (activeRequests.length === 0) return null;
    
    // Return oldest request
    return activeRequests.reduce((oldest, current) => 
      current.createdAt < oldest.createdAt ? current : oldest
    );
  }, [requests]);

  const clearFulfilledRequests = useCallback(() => {
    setRequests(prev => prev.filter(req => !req.fulfilled));
  }, []);

  const clearAllRequests = useCallback(() => {
    setRequests([]);
  }, []);

  return {
    requests,
    addRequest,
    fulfillRequest,
    removeRequest,
    getActiveRequests,
    getPlayerRequests,
    generateRequestedQuestions,
    hasActiveRequest,
    getNextRequestToFulfill,
    clearFulfilledRequests,
    clearAllRequests
  };
};