
import React, { useState, useCallback, useEffect } from 'react';
import { GameMode, Player, Question, QuestionType } from '../types';
import Card from './Card';
import PlayerDisplay from './PlayerDisplay';
import WildcardDisplay from './WildcardDisplay';

interface GameScreenProps {
  gameMode: GameMode;
  question: Question;
  currentPlayer: Player;
  players: Player[];
  wildcardCounts: { [key: number]: number };
  onNextQuestion: () => void;
  onUseWildcard: () => void;
  onReset: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
  gameMode,
  question,
  currentPlayer,
  players,
  wildcardCounts,
  onNextQuestion,
  onUseWildcard,
  onReset
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInitialFlip, setIsInitialFlip] = useState(true);

  const handleFlip = useCallback(() => {
    if (isAnimating || !question) return;

    if (isInitialFlip) {
      setIsAnimating(true);
      setIsFlipped(true);
      if (navigator.vibrate) navigator.vibrate(100);
      setIsInitialFlip(false);
      setTimeout(() => setIsAnimating(false), 600); // match animation duration
    } else {
      setIsAnimating(true);
      setIsFlipped(false); // Flip back
      if (navigator.vibrate) navigator.vibrate(50);
      setTimeout(() => {
        onNextQuestion();
        // The card now has new props (question), so React will re-render it.
        // We flip it forward again to show the new question.
        setIsFlipped(true);
        if (navigator.vibrate) navigator.vibrate(100);
        setTimeout(() => setIsAnimating(false), 300); // Allow animation to finish
      }, 300); // Wait for flip-back to be half-way
    }
  }, [isAnimating, onNextQuestion, isInitialFlip, question]);

  if (!question) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-3xl font-bold text-white mb-4">You've finished all the cards!</h2>
        <p className="text-slate-400 mb-8">Hope you learned something new.</p>
        <button
          onClick={onReset}
          className="px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg shadow-md hover:bg-pink-700 transition-colors"
        >
          Play Again
        </button>
      </div>
    );
  }

  const canUseWildcard = wildcardCounts[currentPlayer.id] > 0 && isFlipped && !isAnimating && question.type !== QuestionType.Wildcard;

  return (
    <div className="w-full h-screen flex flex-col items-center justify-between p-4 sm:p-8">
      <header className="w-full max-w-2xl flex justify-between items-center">
        <button onClick={onReset} className="text-slate-400 hover:text-white transition-colors">&larr; Change Mode</button>
        <div className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium">{gameMode}</div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center w-full">
        <PlayerDisplay players={players} currentPlayerId={currentPlayer.id} />
        <Card
          question={question.text}
          isFlipped={isFlipped}
          onFlip={handleFlip}
          isWildcard={question.type === QuestionType.Wildcard}
        />
      </main>

      <footer className="w-full max-w-md h-20 flex items-center justify-center">
        <WildcardDisplay
            count={wildcardCounts[currentPlayer.id]}
            onUse={onUseWildcard}
            disabled={!canUseWildcard}
        />
      </footer>
    </div>
  );
};

export default GameScreen;
