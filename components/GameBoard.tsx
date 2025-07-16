import React, { useState, useMemo, useCallback } from 'react';
import type { Question, Player } from '../types';
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
  
  const isGameOver = questionIndex >= questions.length;

  const cardFront = useMemo(() => {
    return (
        <div className="text-center p-4">
            <div className="text-5xl mb-4">💌</div>
            <h3 className="text-3xl font-bold mb-2">Tap to Reveal</h3>
            <p className="text-slate-500">It's your turn!</p>
        </div>
    );
  }, []);

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
