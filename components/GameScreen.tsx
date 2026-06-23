import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { GameMode, Player, Question, QuestionType } from '../types';
import Card from './Card';
import PlayerDisplay from './PlayerDisplay';
import WildcardDisplay from './WildcardDisplay';

interface GameScreenProps {
  gameMode: GameMode;
  question?: Question;
  currentPlayer: Player;
  players: Player[];
  wildcardCounts: { [key: number]: number };
  currentQuestionIndex: number;
  totalQuestions: number;
  onNextQuestion: () => void;
  onUseWildcard: () => void;
  onReset: () => void;
}

const FLIP_DURATION_MS = 700;
const HALF_FLIP_DURATION_MS = FLIP_DURATION_MS / 2;

type CardFace = 'front' | 'back';

const GameScreen: React.FC<GameScreenProps> = ({
  gameMode,
  question,
  currentPlayer,
  players,
  wildcardCounts,
  currentQuestionIndex,
  totalQuestions,
  onNextQuestion,
  onUseWildcard,
  onReset
}) => {
  const [rotation, setRotation] = useState(0);
  const [questionFace, setQuestionFace] = useState<CardFace>('front');
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasRevealedCard, setHasRevealedCard] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Tap the card when you are ready.');

  const currentPlayerPosition = Math.max(players.findIndex(player => player.id === currentPlayer?.id), 0);
  const nextPlayer = players[(currentPlayerPosition + 1) % players.length] ?? currentPlayer;
  const currentQuestionNumber = Math.min(currentQuestionIndex + 1, totalQuestions);
  const progressPercent = totalQuestions > 0 ? (currentQuestionNumber / totalQuestions) * 100 : 0;

  useEffect(() => {
    if (!question || !currentPlayer) return;

    if (hasRevealedCard) {
      setStatusMessage(`${currentPlayer.name}, take your time. Tap the card when the conversation feels complete.`);
    } else {
      setStatusMessage(`${currentPlayer.name}, tap the card to reveal your first prompt.`);
    }
  }, [question?.text, currentPlayer, hasRevealedCard]);

  const handleFlip = useCallback(() => {
    if (isAnimating || !question) return;

    setIsAnimating(true);
    setRotation(prevRotation => prevRotation + 180);

    if (!hasRevealedCard) {
      if (navigator.vibrate) navigator.vibrate(100);
      setHasRevealedCard(true);
      setTimeout(() => setIsAnimating(false), FLIP_DURATION_MS);
      return;
    }

    setStatusMessage(`Passing the card to ${nextPlayer.name}...`);
    if (navigator.vibrate) navigator.vibrate(50);
    setTimeout(() => {
      onNextQuestion();
      setQuestionFace(prevFace => prevFace === 'front' ? 'back' : 'front');
      if (navigator.vibrate) navigator.vibrate(100);
    }, HALF_FLIP_DURATION_MS);
    setTimeout(() => setIsAnimating(false), FLIP_DURATION_MS);
  }, [isAnimating, onNextQuestion, hasRevealedCard, question, nextPlayer.name]);

  const canUseWildcard = Boolean(
    question &&
    wildcardCounts[currentPlayer.id] > 0 &&
    hasRevealedCard &&
    !isAnimating &&
    question.type !== QuestionType.Wildcard
  );

  const handleUseWildcard = useCallback(() => {
    if (!canUseWildcard) return;

    setStatusMessage(`${currentPlayer.name}, make up a question that feels fun and kind.`);
    onUseWildcard();
  }, [canUseWildcard, currentPlayer.name, onUseWildcard]);

  const cardActionLabel = useMemo(() => {
    if (!hasRevealedCard) return `Reveal prompt for ${currentPlayer.name}`;
    return `Draw the next card for ${nextPlayer.name}`;
  }, [currentPlayer.name, hasRevealedCard, nextPlayer.name]);

  if (!question) {
    const answeredCount = Math.min(currentQuestionIndex, totalQuestions);

    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gradient-to-br from-gray-900 via-slate-950 to-black">
        <div className="max-w-md rounded-3xl border border-white/10 bg-white/[0.05] p-8 shadow-2xl shadow-black/30">
          <p className="text-pink-200/80 text-sm font-semibold uppercase tracking-[0.25em] mb-3">Session complete</p>
          <h2 className="text-3xl font-bold text-white mb-4">You finished this deck.</h2>
          <p className="text-slate-300 mb-6">
            You answered {answeredCount} card{answeredCount === 1 ? '' : 's'} in {gameMode}. Take a moment to share one thing you want to remember from the conversation.
          </p>
          <button
            type="button"
            onClick={onReset}
            className="min-h-12 px-6 py-3 bg-pink-600 text-white font-semibold rounded-xl shadow-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 focus:ring-offset-gray-950 transition-colors"
          >
            Choose another mode
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-between gap-4 p-4 sm:p-8 bg-gradient-to-br from-gray-900 via-slate-950 to-black">
      <header className="w-full max-w-2xl space-y-3">
        <div className="flex justify-between items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="min-h-10 rounded-full px-3 py-2 text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-950 transition-colors"
          >
            &larr; Modes
          </button>
          <div className="px-3 py-1.5 bg-white/10 rounded-full text-sm font-medium text-white">{gameMode}</div>
        </div>

        <div aria-label={`Question ${currentQuestionNumber} of ${totalQuestions}`}>
          <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Card {currentQuestionNumber} of {totalQuestions}</span>
            <span>Next: {nextPlayer.name}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </header>

      <main className="flex w-full flex-grow flex-col items-center justify-center">
        <PlayerDisplay players={players} currentPlayerId={currentPlayer.id} />
        <p className="mb-4 min-h-6 px-4 text-center text-sm text-slate-300" aria-live="polite">
          {statusMessage}
        </p>
        <Card
          question={question.text}
          rotation={rotation}
          questionFace={questionFace}
          onFlip={handleFlip}
          isWildcard={question.type === QuestionType.Wildcard}
          actionLabel={cardActionLabel}
        />
        <p className="mt-4 text-center text-xs text-slate-500">
          {hasRevealedCard ? 'Tap the card for the next prompt.' : 'Tap or press Enter to reveal.'}
        </p>
      </main>

      <footer className="w-full max-w-md pb-1 flex items-center justify-center">
        <WildcardDisplay
          count={wildcardCounts[currentPlayer.id]}
          onUse={handleUseWildcard}
          disabled={!canUseWildcard}
        />
      </footer>
    </div>
  );
};

export default GameScreen;
