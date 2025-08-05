
import React, { useState, useCallback } from 'react';
import { GameMode, Question, Player, SessionConfig, SessionMood } from './types';
import { WILDCARD_QUESTION, INITIAL_WILDCARDS } from './constants';
import { useQuestionManager } from './hooks/useQuestionManager';
import { useEnergyLevel } from './hooks/useEnergyLevel';
import { useCustomQuestions } from './hooks/useCustomQuestions';
import useExitIntent from './hooks/useExitIntent';
import ModeSelectionScreen from './components/ModeSelectionScreen';
import GameScreen from './components/GameScreen';
import Confetti from './components/Confetti';
import PlayerSetupScreen from './components/PlayerSetupScreen';
import ExitIntentModal from './components/ExitIntentModal';

const App: React.FC = () => {
  const { showModal, setShowModal } = useExitIntent();
  const customQuestionsManager = useCustomQuestions();
  const questionManager = useQuestionManager(customQuestionsManager.customQuestions);
  const [gameState, setGameState] = useState<'mode-selection' | 'player-setup' | 'in-game'>('mode-selection');
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // Track how many questions have been answered since the last energy-based refresh
  const [questionsSinceEnergyCheck, setQuestionsSinceEnergyCheck] = useState(0);
  
  const [players, setPlayers] = useState<Player[]>([{ id: 1, name: "Player 1" }, { id: 2, name: "Player 2" }]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [wildcardCounts, setWildcardCounts] = useState<{ [key: number]: number }>({});
  const [showConfetti, setShowConfetti] = useState(false);
  
  // New state for enhanced features
  const [sessionConfig, setSessionConfig] = useState<SessionConfig>({
    mood: SessionMood.Chill,
    intensity: 5
  });
  
  const energyManager = useEnergyLevel(players);

  const startGameWithPlayers = useCallback((mode: GameMode, playersList: Player[], config?: SessionConfig) => {
    if (config) {
      setSessionConfig(config);
    }
    
    const availableQuestions = questionManager.getAvailableQuestions(
      mode,
      config || sessionConfig,
      energyManager.sessionEnergy.level
    );
    setQuestions(availableQuestions);
    setSelectedMode(mode);
    setPlayers(playersList);
    setCurrentQuestionIndex(0);
    setCurrentPlayerIndex(0);
    setQuestionsSinceEnergyCheck(0);
    
    const initialCounts: { [key: number]: number } = {};
    playersList.forEach(p => {
      initialCounts[p.id] = INITIAL_WILDCARDS;
    });
    setWildcardCounts(initialCounts);

    setGameState('in-game');
  }, [questionManager, sessionConfig, energyManager.sessionEnergy.level]);

  const handleModeSelect = useCallback((mode: GameMode) => {
    setSelectedMode(mode);
    if (mode === GameMode.GroupMode) {
      setGameState('player-setup');
      setPlayers([{ id: 1, name: 'Player 1' }, { id: 2, name: 'Player 2' }]);
    } else {
      startGameWithPlayers(mode, [{ id: 1, name: "Player 1" }, { id: 2, name: "Player 2" }]);
    }
  }, [startGameWithPlayers]);
  
  const handleGameStart = useCallback((configuredPlayers: Player[], config: SessionConfig) => {
      if (selectedMode) {
          startGameWithPlayers(selectedMode, configuredPlayers, config);
      }
  }, [selectedMode, startGameWithPlayers]);

  const handleNextQuestion = useCallback(() => {
    // Mark current question as used
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      questionManager.markQuestionAsUsed(currentQuestion.text);
      // Update energy metrics
      energyManager.updateInteractionMetrics('question_answered');
    }
    
    const answeredCount = questionsSinceEnergyCheck + 1;
    const shouldRefresh = answeredCount >= 6;

    if (shouldRefresh && selectedMode) {
      // Fetch a fresh set of questions that matches the *current* energy level
      const availableQuestions = questionManager.getAvailableQuestions(
        selectedMode,
        sessionConfig,
        energyManager.sessionEnergy.level
      );
      setQuestions(availableQuestions);
      setCurrentQuestionIndex(0);
      setQuestionsSinceEnergyCheck(0);
    } else {
      setCurrentQuestionIndex((prevIndex: number) => prevIndex + 1);
      setQuestionsSinceEnergyCheck(answeredCount);
    }

    setCurrentPlayerIndex((prevIndex: number) => (prevIndex + 1) % players.length);
  }, [players.length, questions, currentQuestionIndex, questionManager, energyManager, questionsSinceEnergyCheck, selectedMode, sessionConfig]);
  
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
      // Update energy metrics for wildcard usage
      energyManager.updateInteractionMetrics('wildcard_used');
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [currentPlayerIndex, players, wildcardCounts, currentQuestionIndex, energyManager]);


  const resetGame = useCallback(() => {
    setGameState('mode-selection');
    setSelectedMode(null);
    setQuestions([]);
    setPlayers([{ id: 1, name: "Player 1" }, { id: 2, name: "Player 2" }]);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const currentPlayer = players[currentPlayerIndex];

  if (gameState === 'mode-selection' || !selectedMode) {
    return <ModeSelectionScreen onModeSelect={handleModeSelect} questionManager={questionManager} />;
  }

  if (gameState === 'player-setup') {
    return <PlayerSetupScreen 
        initialPlayers={players}
        onStartGame={handleGameStart} 
        onBack={resetGame}
        onAddCustomQuestion={customQuestionsManager.addCustomQuestion}
        customQuestionsCount={customQuestionsManager.customQuestions.length}
    />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {showConfetti && <Confetti />}
      <ExitIntentModal show={showModal} onClose={() => setShowModal(false)} />
      <GameScreen
        key={selectedMode}
        gameMode={selectedMode}
        question={currentQuestion}
        currentPlayer={currentPlayer}
        players={players}
        wildcardCounts={wildcardCounts}
        sessionConfig={sessionConfig}
        sessionEnergy={energyManager.sessionEnergy}
        onNextQuestion={handleNextQuestion}
        onUseWildcard={handleUseWildcard}
        onReset={resetGame}
        onEnergyOverride={energyManager.overrideEnergyLevel}
      />
    </div>
  );
};

export default App;
