
import * as React from 'react';
import { useState, useCallback } from 'react';
import { GameMode, Player, Question, QuestionType, SessionConfig, SessionEnergy } from '../types';
import Card from './Card';
import PlayerDisplay from './PlayerDisplay';
import WildcardDisplay from './WildcardDisplay';
import EnergyIndicator from './EnergyIndicator';

interface GameScreenProps {
  gameMode: GameMode;
  question: Question;
  currentPlayer: Player;
  players: Player[];
  wildcardCounts: { [key: number]: number };
  sessionConfig?: SessionConfig;
  sessionEnergy?: SessionEnergy;
  onNextQuestion: () => void;
  onUseWildcard: () => void;
  onReset: () => void;
  onEnergyOverride?: (newLevel: number) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
  gameMode,
  question,
  currentPlayer,
  players,
  wildcardCounts,
  sessionConfig,
  sessionEnergy,
  onNextQuestion,
  onUseWildcard,
  onReset,
  onEnergyOverride
}: GameScreenProps) => {
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
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-white mb-3">
            Do you enjoy this game?
          </h2>
          <p className="text-slate-300 mb-6">
            Dig deeper with journaling, a powerful tool to reflect and understand yourself.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://myjournalto.com/products/guided-journal"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg shadow-md hover:bg-pink-700 transition-all duration-300 transform hover:scale-105"
            >
              Try Journaling
            </a>
            <button
              onClick={onReset}
              className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:bg-slate-600 transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const canUseWildcard = wildcardCounts[currentPlayer.id] > 0 && isFlipped && !isAnimating && question.type !== QuestionType.Wildcard;

  return (
    <div className="w-full h-screen flex flex-col items-center justify-between p-4 sm:p-8">
      <header className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <button onClick={onReset} className="text-slate-400 hover:text-white transition-colors">&larr; Change Mode</button>
          <div className="flex items-center space-x-4">
            {gameMode === GameMode.GroupMode && sessionConfig && (
              <div className="px-3 py-1 bg-purple-500/20 rounded-full text-sm font-medium text-purple-300">
                {sessionConfig.mood} Mode
              </div>
            )}
            <div className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium">{gameMode}</div>
          </div>
        </div>
        {sessionEnergy && (
          <div className="flex justify-center">
            <EnergyIndicator 
              sessionEnergy={sessionEnergy} 
              onEnergyOverride={onEnergyOverride}
            />
          </div>
        )}
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

      <footer className="w-full max-w-md space-y-4">
        
        {/* Wildcard Display */}
        <div className="flex items-center justify-center h-20">
          <WildcardDisplay
              count={wildcardCounts[currentPlayer.id]}
              onUse={onUseWildcard}
              disabled={!canUseWildcard}
          />
        </div>
      </footer>

    </div>
  );
};

export default GameScreen;
