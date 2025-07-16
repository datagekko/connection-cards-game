import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { Question, Player, CustomQuestion, GameState } from '../types';
import { Card } from './Card';
import { HeartIcon, RefreshCwIcon } from './icons';

interface GameBoardProps {
  questions: Question[];
  onRestart: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ questions, onRestart }) => {
  const [currentPlayer, setCurrentPlayer] = useState<Player>('Player 1');
  const [questionIndex, setQuestionIndex] = useState(-1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    roundNumber: 0,
    customQuestions: [],
    usedCustomQuestions: { 'Player 1': 0, 'Player 2': 0 }
  });
  const [showWildCardPrompt, setShowWildCardPrompt] = useState(false);
  const [customQuestionInput, setCustomQuestionInput] = useState('');

  const currentQuestion = useMemo(() => {
    if (questionIndex >= 0 && questionIndex < questions.length) {
      return questions[questionIndex];
    }
    return null;
  }, [questionIndex, questions]);

  const handleCardClick = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);

    if (!isFlipped) { // Revealing a new question
      setQuestionIndex(prev => prev + 1);
      setIsFlipped(true);
      setGameState(prev => ({ ...prev, roundNumber: prev.roundNumber + 1 }));
    } else { // Hiding question, switching player
      setIsFlipped(false);
      // Wait for flip back animation to complete before changing player
      setTimeout(() => {
        setCurrentPlayer(prev => (prev === 'Player 1' ? 'Player 2' : 'Player 1'));
      }, 350); // half of the card transition duration
    }

    // Allow new clicks after transition ends
    setTimeout(() => {
        setIsTransitioning(false);
    }, 700);
  }, [isFlipped, isTransitioning]);

  // Auto-reveal after round one
  useEffect(() => {
    if (gameState.roundNumber > 1 && !isFlipped && !isTransitioning && !isGameOver) {
      const timer = setTimeout(() => {
        handleCardClick();
      }, 1000); // Auto-reveal after 1 second
      
      return () => clearTimeout(timer);
    }
  }, [gameState.roundNumber, isFlipped, isTransitioning, handleCardClick, isGameOver]);

  const handleWildCard = useCallback(() => {
    if (gameState.usedCustomQuestions[currentPlayer] >= 3) return;
    setShowWildCardPrompt(true);
  }, [gameState.usedCustomQuestions, currentPlayer]);

  const submitCustomQuestion = useCallback(() => {
    if (customQuestionInput.trim() && gameState.usedCustomQuestions[currentPlayer] < 3) {
      const newCustomQuestion: CustomQuestion = {
        id: Date.now().toString(),
        question: customQuestionInput.trim(),
        createdBy: currentPlayer
      };
      
      setGameState(prev => ({
        ...prev,
        customQuestions: [...prev.customQuestions, newCustomQuestion],
        usedCustomQuestions: {
          ...prev.usedCustomQuestions,
          [currentPlayer]: prev.usedCustomQuestions[currentPlayer] + 1
        }
      }));
      
      setCustomQuestionInput('');
      setShowWildCardPrompt(false);
    }
  }, [customQuestionInput, currentPlayer, gameState.usedCustomQuestions]);
  
  const isGameOver = useMemo(() => questionIndex >= questions.length, [questionIndex, questions.length]);

  const cardFront = useMemo(() => {
    const isAutoReveal = gameState.roundNumber > 1;
    return (
        <div className="text-center p-4">
            <div className="text-5xl mb-4">💌</div>
            <h3 className="text-3xl font-bold mb-2">
              {isAutoReveal ? 'Auto-Revealing...' : 'Tap to Reveal'}
            </h3>
            <p className="text-slate-500">
              {isAutoReveal ? 'Next question coming up!' : "It's your turn!"}
            </p>
        </div>
    );
  }, [gameState.roundNumber]);

  const cardBack = useMemo(() => {
    if (isGameOver) {
        return (
            <div className="text-center p-4">
                <h3 className="text-2xl font-bold mb-4">That's All!</h3>
                <p className="text-slate-600 mb-8">Hope you learned something new about each other.</p>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRestart();
                    }}
                    className="bg-pink-500 text-white font-bold py-3 px-6 rounded-full hover:bg-pink-600 transition-colors flex items-center justify-center mx-auto"
                >
                    <RefreshCwIcon className="w-5 h-5 mr-2"/>
                    Play Again
                </button>
            </div>
        );
    }
    return (
        <p className="text-2xl font-semibold text-center leading-relaxed">
            {currentQuestion?.question}
        </p>
    );
  }, [isGameOver, currentQuestion, onRestart]);

  return (
    <div className="flex flex-col items-center justify-center w-full animate-fade-in">
        <div className="mb-8 h-12 flex flex-col items-center justify-center">
            { !isGameOver && (
                <div className="flex items-center space-x-4 text-2xl font-semibold bg-slate-800/50 px-6 py-2 rounded-full shadow-lg">
                    <span className={`transition-all duration-300 ${currentPlayer === 'Player 1' ? 'text-sky-400 scale-110' : 'text-slate-400 opacity-60'}`}>Player 1</span>
                    <HeartIcon className={`w-6 h-6 transition-all duration-500 ${currentPlayer === 'Player 1' ? 'text-sky-400' : 'text-pink-400'}`} />
                    <span className={`transition-all duration-300 ${currentPlayer === 'Player 2' ? 'text-pink-400 scale-110' : 'text-slate-400 opacity-60'}`}>Player 2</span>
                </div>
            )}
        </div>
      
      <Card
        isFlipped={isFlipped || isGameOver}
        onClick={isGameOver ? () => {} : handleCardClick}
        frontContent={cardFront}
        backContent={cardBack}
      />

      {!isGameOver && (
        <div className="mt-6 flex flex-col items-center">
          <button
            onClick={handleWildCard}
            disabled={gameState.usedCustomQuestions[currentPlayer] >= 3}
            className={`px-4 py-2 rounded-full font-semibold transition-colors ${
              gameState.usedCustomQuestions[currentPlayer] >= 3
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}
          >
            Wild Card ({3 - gameState.usedCustomQuestions[currentPlayer]} left)
          </button>
        </div>
      )}

      {showWildCardPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-white">Create Your Question</h3>
            <textarea
              value={customQuestionInput}
              onChange={(e) => setCustomQuestionInput(e.target.value)}
              placeholder="What would you like to ask?"
              className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-yellow-500 focus:outline-none"
              rows={3}
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowWildCardPrompt(false)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
              >
                Cancel
              </button>
              <button
                onClick={submitCustomQuestion}
                disabled={!customQuestionInput.trim()}
                className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Add Question
              </button>
            </div>
          </div>
        </div>
      )}

       <button
        onClick={onRestart}
        className="mt-8 text-slate-400 hover:text-white transition-colors flex items-center"
       >
        <RefreshCwIcon className="w-4 h-4 mr-2"/>
        Start Over
       </button>
    </div>
  );
};
