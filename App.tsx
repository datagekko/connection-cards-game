
import React, { useState, useCallback } from 'react';
import { GameMode, Question, Player } from './types';
import { WILDCARD_QUESTION, INITIAL_WILDCARDS } from './constants';
import { useQuestionManager } from './hooks/useQuestionManager';
import ModeSelectionScreen from './components/ModeSelectionScreen';
import GameScreen from './components/GameScreen';
import Confetti from './components/Confetti';
import PlayerSetupScreen from './components/PlayerSetupScreen';

const App: React.FC = () => {
  const questionManager = useQuestionManager();
  const [gameState, setGameState] = useState<'mode-selection' | 'player-setup' | 'in-game'>('mode-selection');
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [players, setPlayers] = useState<Player[]>([{ id: 1, name: "Player 1" }, { id: 2, name: "Player 2" }]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [wildcardCounts, setWildcardCounts] = useState<{ [key: number]: number }>({});
  const [showConfetti, setShowConfetti] = useState(false);

  const startGameWithPlayers = useCallback((mode: GameMode, playersList: Player[]) => {
    const availableQuestions = questionManager.getAvailableQuestions(mode);
    setQuestions(availableQuestions);
    setSelectedMode(mode);
    setPlayers(playersList);
    setCurrentQuestionIndex(0);
    setCurrentPlayerIndex(0);
    
    const initialCounts: { [key: number]: number } = {};
    playersList.forEach(p => {
      initialCounts[p.id] = INITIAL_WILDCARDS;
    });
    setWildcardCounts(initialCounts);

    setGameState('in-game');
  }, [questionManager]);

  const handleModeSelect = useCallback((mode: GameMode) => {
    setSelectedMode(mode);
    if (mode === GameMode.GroupMode) {
      setGameState('player-setup');
      setPlayers([{ id: 1, name: 'Player 1' }, { id: 2, name: 'Player 2' }]);
    } else {
      startGameWithPlayers(mode, [{ id: 1, name: "Player 1" }, { id: 2, name: "Player 2" }]);
    }
  }, [startGameWithPlayers]);
  
  const handleGameStart = useCallback((configuredPlayers: Player[]) => {
      if (selectedMode) {
          startGameWithPlayers(selectedMode, configuredPlayers);
      }
  }, [selectedMode, startGameWithPlayers]);

  const handleNextQuestion = useCallback(() => {
    // Mark current question as used
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      questionManager.markQuestionAsUsed(currentQuestion.text);
    }
    
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    setCurrentPlayerIndex(prevIndex => (prevIndex + 1) % players.length);
  }, [players.length, questions, currentQuestionIndex, questionManager]);
  
  const handleUseWildcard = useCallback(() => {
    const currentPlayer = players[currentPlayerIndex];
    if (wildcardCounts[currentPlayer.id] > 0) {
      setWildcardCounts(prev => ({
        ...prev,
        [currentPlayer.id]: prev[currentPlayer.id] - 1
      }));
      setQuestions(prev => {
        const newQuestions = [...prev];
        newQuestions[currentQuestionIndex] = WILDCARD_QUESTION;
        return newQuestions;
      });
      setShowConfetti(true);
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [currentPlayerIndex, players, wildcardCounts, currentQuestionIndex]);


  const resetGame = useCallback(() => {
    setGameState('mode-selection');
    setSelectedMode(null);
    setQuestions([]);
    setPlayers([{ id: 1, name: "Player 1" }, { id: 2, name: "Player 2" }]);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const currentPlayer = players[currentPlayerIndex];

  if (gameState === 'mode-selection' || !selectedMode) {
    return <ModeSelectionScreen onModeSelect={handleModeSelect} />;
  }

  if (gameState === 'player-setup') {
    return <PlayerSetupScreen 
        initialPlayers={players}
        onStartGame={handleGameStart} 
        onBack={resetGame} 
    />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {showConfetti && <Confetti />}
      <GameScreen
        key={selectedMode}
        gameMode={selectedMode}
        question={currentQuestion}
        currentPlayer={currentPlayer}
        players={players}
        wildcardCounts={wildcardCounts}
        onNextQuestion={handleNextQuestion}
        onUseWildcard={handleUseWildcard}
        onReset={resetGame}
      />
    </div>
  );
};

export default App;
