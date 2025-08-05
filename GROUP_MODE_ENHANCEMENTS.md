# Group Mode Enhancements - Technical Implementation Plan

## Overview

This document outlines the technical implementation plan for six major enhancements to the Connection Cards game's group mode. Each feature is designed to boost engagement through personalization, dynamic gameplay, and improved social interaction while maintaining compatibility with the existing React + TypeScript + Vite architecture.

## Current Architecture Analysis

**Key Files:**
- `App.tsx` - Main application state and game flow management
- `types.ts` - Core TypeScript definitions 
- `constants.ts` - Question bank and game configuration
- `hooks/useQuestionManager.ts` - Question selection and session tracking
- `components/GameScreen.tsx` - Primary gameplay interface
- `components/PlayerSetupScreen.tsx` - Group configuration interface

**Architecture Patterns:**
- React functional components with hooks
- Local state management with useState/useCallback
- localStorage for session persistence
- Custom hooks for complex logic encapsulation

---

## 1. Mood Selection System

### **Goal**
Allow players to select session vibes (Chill, Deep, Wild, Funny) that influence question curation algorithms.

### **UI/UX Adjustments**
- Add mood selection step in `PlayerSetupScreen.tsx:43-98` after player configuration
- Create mood selector component with emoji indicators and descriptions
- Display selected mood in `GameScreen.tsx:78` header badge

### **Component/State Changes**

**New Types** (`types.ts:1-25`):
```typescript
export enum SessionMood {
  Chill = 'Chill',
  Deep = 'Deep', 
  Wild = 'Wild',
  Funny = 'Funny'
}

export interface SessionConfig {
  mood: SessionMood;
  intensity: number; // 1-10 scale
}
```

**Enhanced Player Setup** (`PlayerSetupScreen.tsx`):
```typescript
// Add after line 12
const [sessionConfig, setSessionConfig] = useState<SessionConfig>({
  mood: SessionMood.Chill,
  intensity: 5
});

// Add mood selection UI before start button
<MoodSelector 
  selectedMood={sessionConfig.mood}
  onMoodChange={(mood) => setSessionConfig(prev => ({...prev, mood}))}
/>
```

**App.tsx Integration**:
```typescript
// Update line 23 startGameWithPlayers signature
const startGameWithPlayers = useCallback((mode: GameMode, playersList: Player[], config: SessionConfig) => {
  const availableQuestions = questionManager.getAvailableQuestions(mode, config);
  // ... rest of implementation
}, [questionManager]);
```

**New Component** (`components/MoodSelector.tsx`):
```typescript
interface MoodSelectorProps {
  selectedMood: SessionMood;
  onMoodChange: (mood: SessionMood) => void;
}

const MOOD_CONFIG = {
  [SessionMood.Chill]: { emoji: '😌', color: 'from-blue-500 to-cyan-400' },
  [SessionMood.Deep]: { emoji: '🤔', color: 'from-purple-600 to-indigo-500' },
  [SessionMood.Wild]: { emoji: '🔥', color: 'from-red-500 to-orange-400' },
  [SessionMood.Funny]: { emoji: '😂', color: 'from-yellow-500 to-pink-400' }
};
```

### **Logic or Hook Enhancements**

**Enhanced Question Manager** (`hooks/useQuestionManager.ts:88-105`):
```typescript
const getAvailableQuestions = useCallback((mode: GameMode, config?: SessionConfig): Question[] => {
  const modeQuestions = QUESTIONS.filter(q => q.mode === mode);
  let availableQuestions = modeQuestions.filter(q => !session.usedQuestions.has(q.text));
  
  // Apply mood filtering
  if (config?.mood) {
    availableQuestions = applyMoodFilter(availableQuestions, config.mood);
  }
  
  return shuffleArray(availableQuestions);
}, [session.usedQuestions]);

const applyMoodFilter = (questions: Question[], mood: SessionMood): Question[] => {
  // Filter based on question content, tags, or metadata
  return questions.filter(q => {
    const moodTags = getMoodTags(q.text);
    return moodTags.includes(mood);
  });
};
```

### **Data Structure or Constants Modifications**

**Enhanced Question Schema** (`constants.ts:12-174`):
```typescript
export interface Question {
  text: string;
  mode: GameMode;
  type: QuestionType;
  moodTags: SessionMood[]; // NEW: Multiple moods per question
  intensity: number; // NEW: 1-10 intensity rating
}

// Example updated question
{ 
  text: "What's your spirit animal? Why?", 
  mode: GameMode.FirstDate, 
  type: QuestionType.Question,
  moodTags: [SessionMood.Chill, SessionMood.Funny],
  intensity: 3
}
```

### **Scalability Tips**
- Use mood tags array for questions that fit multiple vibes
- Create mood intensity scoring algorithm for dynamic filtering
- Consider mood transitions (start Chill, progress to Deep)
- Cache mood-filtered questions to avoid re-computation

---

## 2. Custom Question Bank

### **Goal** 
Enable players to submit and save custom questions integrated with the existing question system.

### **UI/UX Adjustments**
- Add "Add Custom Question" button in `PlayerSetupScreen.tsx`
- Create modal component for question submission with mood/intensity selection
- Display custom questions with special styling in `Card.tsx:17-20`

### **Component/State Changes**

**New Hook** (`hooks/useCustomQuestions.ts`):
```typescript
interface CustomQuestion extends Question {
  id: string;
  authorId: number;
  createdAt: number;
  approved: boolean;
}

export const useCustomQuestions = () => {
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);
  
  const addCustomQuestion = useCallback((question: Omit<CustomQuestion, 'id' | 'createdAt'>) => {
    const newQuestion: CustomQuestion = {
      ...question,
      id: nanoid(),
      createdAt: Date.now()
    };
    
    setCustomQuestions(prev => [...prev, newQuestion]);
    // Save to localStorage
    localStorage.setItem('custom-questions', JSON.stringify([...customQuestions, newQuestion]));
  }, [customQuestions]);
  
  return { customQuestions, addCustomQuestion, removeCustomQuestion };
};
```

**Question Input Modal** (`components/CustomQuestionModal.tsx`):
```typescript
interface CustomQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: Partial<CustomQuestion>) => void;
  currentPlayer: Player;
}

const CustomQuestionModal: React.FC<CustomQuestionModalProps> = ({ isOpen, onClose, onSubmit, currentPlayer }) => {
  const [questionText, setQuestionText] = useState('');
  const [selectedMoods, setSelectedMoods] = useState<SessionMood[]>([]);
  const [intensity, setIntensity] = useState(5);
  
  const handleSubmit = () => {
    onSubmit({
      text: questionText,
      mode: GameMode.GroupMode,
      type: QuestionType.Question,
      moodTags: selectedMoods,
      intensity,
      authorId: currentPlayer.id,
      approved: true // Auto-approve for group sessions
    });
    onClose();
    setQuestionText('');
  };
  
  // Modal UI with form validation
};
```

### **Logic or Hook Enhancements**

**Enhanced Question Manager Integration**:
```typescript
// In useQuestionManager.ts
const getAvailableQuestions = useCallback((mode: GameMode, config?: SessionConfig): Question[] => {
  // Combine regular + custom questions
  const allQuestions = [...QUESTIONS, ...customQuestions.filter(q => q.approved)];
  const modeQuestions = allQuestions.filter(q => q.mode === mode);
  
  // Apply existing filtering logic
  return applyFilters(modeQuestions, config);
}, [session.usedQuestions, customQuestions]);
```

### **Data Structure or Constants Modifications**

**Custom Question Storage**:
```typescript
// localStorage schema
interface CustomQuestionStorage {
  questions: CustomQuestion[];
  version: string;
  lastModified: number;
}

// Migration utility for version updates
const migrateCustomQuestions = (stored: any): CustomQuestion[] => {
  // Handle version compatibility
};
```

### **Scalability Tips**
- Implement question moderation system for public use
- Add question templates/categories for easier creation  
- Consider cloud sync for persistent custom question banks
- Add question rating/voting system for community curation

---

## 3. Relationship Mapping System

### **Goal**
Define player relationships to influence question appropriateness and selection algorithms.

### **UI/UX Adjustments**
- Add relationship definition step in `PlayerSetupScreen.tsx` with matrix interface
- Show relationship indicators in `PlayerDisplay.tsx:12-25`
- Filter questions based on relationship context

### **Component/State Changes**

**Enhanced Types**:
```typescript
export enum RelationshipType {
  BestFriends = 'Best Friends',
  Colleagues = 'Colleagues', 
  NewAcquaintances = 'New Acquaintances',
  Family = 'Family',
  RomanticPartners = 'Romantic Partners',
  Roommates = 'Roommates'
}

export interface PlayerRelationship {
  playerId1: number;
  playerId2: number;
  relationship: RelationshipType;
  intimacyLevel: number; // 1-10 scale
}

export interface EnhancedPlayer extends Player {
  relationships: PlayerRelationship[];
  comfortLevel: number; // Personal comfort with intimate questions
}
```

**Relationship Matrix Component** (`components/RelationshipMatrix.tsx`):
```typescript
interface RelationshipMatrixProps {
  players: EnhancedPlayer[];
  relationships: PlayerRelationship[];
  onRelationshipChange: (rel: PlayerRelationship) => void;
}

const RelationshipMatrix: React.FC<RelationshipMatrixProps> = ({ players, relationships, onRelationshipChange }) => {
  return (
    <div className="grid gap-4">
      {players.map((player1, i) => 
        players.slice(i + 1).map(player2 => (
          <RelationshipSelector
            key={`${player1.id}-${player2.id}`}
            player1={player1}
            player2={player2}
            currentRelation={findRelationship(relationships, player1.id, player2.id)}
            onChange={onRelationshipChange}
          />
        ))
      )}
    </div>
  );
};
```

### **Logic or Hook Enhancements**

**Relationship-Aware Question Filtering**:
```typescript
// In useQuestionManager.ts
const applyRelationshipFilter = (questions: Question[], currentPlayer: EnhancedPlayer, allPlayers: EnhancedPlayer[]): Question[] => {
  return questions.filter(question => {
    const questionIntimacy = getQuestionIntimacyLevel(question);
    const groupIntimacyLevel = calculateGroupIntimacyLevel(currentPlayer, allPlayers);
    
    return questionIntimacy <= groupIntimacyLevel;
  });
};

const calculateGroupIntimacyLevel = (currentPlayer: EnhancedPlayer, allPlayers: EnhancedPlayer[]): number => {
  const relationships = getPlayerRelationships(currentPlayer, allPlayers);
  const minIntimacy = Math.min(...relationships.map(r => r.intimacyLevel));
  return Math.min(minIntimacy, currentPlayer.comfortLevel);
};
```

### **Data Structure or Constants Modifications**

**Question Intimacy Ratings**:
```typescript
// Add to constants.ts
export const QUESTION_INTIMACY_LEVELS = {
  1: 'Surface level - appropriate for strangers',
  5: 'Personal - good friends level', 
  8: 'Intimate - close relationships',
  10: 'Very intimate - romantic partners'
};

// Enhanced question schema
export interface Question {
  // ... existing fields
  intimacyLevel: number;
  appropriateRelationships: RelationshipType[];
}
```

### **Scalability Tips**
- Create relationship templates for common group dynamics
- Implement learning algorithms that adjust intimacy based on group comfort
- Add relationship evolution (acquaintances → friends over multiple sessions)
- Consider asymmetric relationships (A considers B a best friend, but not vice versa)

---

## 4. Hot Seat Mode

### **Goal**
Create focused gameplay where one player receives rapid-fire questions from the group.

### **UI/UX Adjustments**
- Add mode toggle in `GameScreen.tsx:74-99`
- Create special "Hot Seat" UI with timer and rapid question display
- Highlight hot seat player with special styling in `PlayerDisplay.tsx`

### **Component/State Changes**

**Enhanced Game State** (`App.tsx:13-22`):
```typescript
export enum GameplayMode {
  Normal = 'normal',
  HotSeat = 'hot-seat'
}

// Add to App state
const [gameplayMode, setGameplayMode] = useState<GameplayMode>(GameplayMode.Normal);
const [hotSeatPlayer, setHotSeatPlayer] = useState<Player | null>(null);
const [hotSeatTimer, setHotSeatTimer] = useState<number>(0);
const [hotSeatQuestionCount, setHotSeatQuestionCount] = useState<number>(0);
```

**Hot Seat Component** (`components/HotSeatMode.tsx`):
```typescript
interface HotSeatModeProps {
  hotSeatPlayer: Player;
  questions: Question[];
  onQuestionComplete: () => void;
  onModeEnd: () => void;
  timeLimit: number; // seconds per question
}

const HotSeatMode: React.FC<HotSeatModeProps> = ({ hotSeatPlayer, questions, onQuestionComplete, onModeEnd, timeLimit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [isActive, setIsActive] = useState(false);
  
  // Timer logic with useEffect
  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleNextQuestion();
          return timeLimit;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isActive, timeRemaining]);
  
  const handleNextQuestion = () => {
    onQuestionComplete();
    if (currentQuestionIndex >= questions.length - 1) {
      onModeEnd();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeRemaining(timeLimit);
    }
  };
  
  return (
    <div className="hot-seat-container">
      <div className="timer-display">
        <CircularProgress value={(timeRemaining / timeLimit) * 100} />
        <span>{timeRemaining}s</span>
      </div>
      
      <div className="hot-seat-player">
        <div className="spotlight-effect">
          <PlayerAvatar player={hotSeatPlayer} size="large" />
          <h2>{hotSeatPlayer.name} is in the Hot Seat!</h2>
        </div>
      </div>
      
      <Card 
        question={questions[currentQuestionIndex]?.text || ''} 
        isFlipped={true}
        onFlip={handleNextQuestion}
        isWildcard={false}
        variant="hot-seat"
      />
      
      <div className="hot-seat-controls">
        <button onClick={handleNextQuestion}>Skip Question</button>
        <button onClick={onModeEnd}>End Hot Seat</button>
      </div>
    </div>
  );
};
```

### **Logic or Hook Enhancements**

**Hot Seat Question Generation**:
```typescript
// New hook: useHotSeatMode.ts
export const useHotSeatMode = () => {
  const generateHotSeatQuestions = useCallback((targetPlayer: Player, allPlayers: Player[], questionPool: Question[]): Question[] => {
    // Generate personalized rapid-fire questions
    const rapidQuestions = questionPool
      .filter(q => q.intimacyLevel <= 6) // Keep it appropriate for rapid fire
      .filter(q => q.text.includes('you')) // Personal questions work best
      .slice(0, 10); // Limit to 10 questions per hot seat round
      
    return shuffleArray(rapidQuestions);
  }, []);
  
  const selectNextHotSeatPlayer = useCallback((players: Player[], currentHotSeat: Player | null): Player => {
    const availablePlayers = players.filter(p => p.id !== currentHotSeat?.id);
    return availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
  }, []);
  
  return { generateHotSeatQuestions, selectNextHotSeatPlayer };
};
```

### **Data Structure or Constants Modifications**

**Hot Seat Configuration**:
```typescript
// Add to constants.ts
export const HOT_SEAT_CONFIG = {
  DEFAULT_TIME_LIMIT: 30, // seconds per question
  MIN_QUESTIONS: 5,
  MAX_QUESTIONS: 15,
  RAPID_FIRE_DELAY: 2000 // ms between questions in rapid mode
};

// Hot seat appropriate questions
export const HOT_SEAT_QUESTION_FILTERS = {
  maxIntimacyLevel: 6,
  requirePersonalPronouns: true,
  excludeComplexQuestions: true
};
```

### **Scalability Tips**
- Add different hot seat variants (lightning round, deep dive, funny focus)
- Implement player nomination system for hot seat selection
- Add group voting on best answers during hot seat rounds
- Create hot seat statistics and achievements

---

## 5. Player Request System

### **Goal**
Allow players to request specific topics with "I dare you to ask me about..." functionality.

### **UI/UX Adjustments**
- Add topic request button in `GameScreen.tsx` footer
- Create topic selection modal with predefined categories
- Show active requests in player display with special indicators

### **Component/State Changes**

**Request Types**:
```typescript
export enum RequestTopic {
  Love = 'Love & Relationships',
  Career = 'Career & Ambitions', 
  Family = 'Family & Childhood',
  Dreams = 'Dreams & Aspirations',
  Fears = 'Fears & Insecurities',
  Fun = 'Fun & Entertainment',
  Deep = 'Deep Thoughts',
  Secrets = 'Secrets & Confessions'
}

export interface PlayerRequest {
  id: string;
  playerId: number;
  topic: RequestTopic;
  specificPrompt?: string; // Optional custom prompt
  createdAt: number;
  fulfilled: boolean;
}
```

**Request Modal Component**:
```typescript
interface TopicRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: Omit<PlayerRequest, 'id' | 'createdAt' | 'fulfilled'>) => void;
  currentPlayer: Player;
}

const TopicRequestModal: React.FC<TopicRequestModalProps> = ({ isOpen, onClose, onSubmit, currentPlayer }) => {
  const [selectedTopic, setSelectedTopic] = useState<RequestTopic | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  
  const handleSubmit = () => {
    if (!selectedTopic) return;
    
    onSubmit({
      playerId: currentPlayer.id,
      topic: selectedTopic,
      specificPrompt: customPrompt.trim() || undefined
    });
    
    onClose();
    setSelectedTopic(null);
    setCustomPrompt('');
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="topic-request-modal">
        <h3>What do you dare them to ask you about?</h3>
        
        <div className="topic-grid">
          {Object.values(RequestTopic).map(topic => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`topic-button ${selectedTopic === topic ? 'selected' : ''}`}
            >
              {getTopicEmoji(topic)} {topic}
            </button>
          ))}
        </div>
        
        <textarea
          placeholder="Optional: Add a specific prompt or context..."
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          className="custom-prompt-input"
        />
        
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit} disabled={!selectedTopic}>
            Submit Request
          </button>
        </div>
      </div>
    </Modal>
  );
};
```

### **Logic or Hook Enhancements**

**Request Management Hook**:
```typescript
// hooks/usePlayerRequests.ts
export const usePlayerRequests = () => {
  const [requests, setRequests] = useState<PlayerRequest[]>([]);
  
  const addRequest = useCallback((request: Omit<PlayerRequest, 'id' | 'createdAt' | 'fulfilled'>) => {
    const newRequest: PlayerRequest = {
      ...request,
      id: nanoid(),
      createdAt: Date.now(),
      fulfilled: false
    };
    
    setRequests(prev => [...prev, newRequest]);
  }, []);
  
  const fulfillRequest = useCallback((requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, fulfilled: true } : req
    ));
  }, []);
  
  const getActiveRequests = useCallback((playerId?: number) => {
    return requests.filter(req => 
      !req.fulfilled && (playerId ? req.playerId === playerId : true)
    );
  }, [requests]);
  
  const generateRequestedQuestions = useCallback((request: PlayerRequest, questionPool: Question[]): Question[] => {
    // Filter questions by topic using keyword matching or categorization
    const topicKeywords = getTopicKeywords(request.topic);
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
        intimacyLevel: 7,
        appropriateRelationships: [RelationshipType.BestFriends]
      };
      return [customQuestion, ...shuffleArray(matchingQuestions).slice(0, 4)];
    }
    
    return shuffleArray(matchingQuestions).slice(0, 5);
  }, []);
  
  return {
    requests,
    addRequest,
    fulfillRequest,
    getActiveRequests, 
    generateRequestedQuestions
  };
};
```

**Request-Aware Question Selection**:
```typescript
// Enhanced useQuestionManager.ts
const getAvailableQuestions = useCallback((mode: GameMode, config?: SessionConfig, activeRequests?: PlayerRequest[]): Question[] => {
  let questions = getBaseQuestions(mode, config);
  
  // Prioritize requested topics
  if (activeRequests && activeRequests.length > 0) {
    const requestedQuestions = activeRequests.flatMap(request => 
      generateRequestedQuestions(request, questions)
    );
    
    // Mix requested questions with regular questions (70% requested, 30% regular)
    const regularQuestions = questions.filter(q => 
      !requestedQuestions.some(rq => rq.text === q.text)
    );
    
    questions = [
      ...requestedQuestions.slice(0, Math.floor(requestedQuestions.length * 0.7)),
      ...shuffleArray(regularQuestions).slice(0, Math.floor(regularQuestions.length * 0.3))
    ];
  }
  
  return shuffleArray(questions);
}, []);
```

### **Data Structure or Constants Modifications**

**Topic Keywords Mapping**:
```typescript
// Add to constants.ts
export const TOPIC_KEYWORDS: Record<RequestTopic, string[]> = {
  [RequestTopic.Love]: ['love', 'relationship', 'partner', 'dating', 'romance', 'crush'],
  [RequestTopic.Career]: ['work', 'job', 'career', 'ambition', 'goal', 'professional'],
  [RequestTopic.Family]: ['family', 'parent', 'sibling', 'childhood', 'home'],
  [RequestTopic.Dreams]: ['dream', 'aspiration', 'hope', 'future', 'wish'],
  [RequestTopic.Fears]: ['fear', 'scary', 'afraid', 'insecurity', 'worry'],
  [RequestTopic.Fun]: ['fun', 'hobby', 'entertainment', 'enjoy', 'favorite'],
  [RequestTopic.Deep]: ['meaning', 'purpose', 'believe', 'value', 'philosophy'],
  [RequestTopic.Secrets]: ['secret', 'never told', 'confession', 'hidden']
};

export const TOPIC_EMOJIS: Record<RequestTopic, string> = {
  [RequestTopic.Love]: '💕',
  [RequestTopic.Career]: '💼', 
  [RequestTopic.Family]: '👨‍👩‍👧‍👦',
  [RequestTopic.Dreams]: '✨',
  [RequestTopic.Fears]: '😰',
  [RequestTopic.Fun]: '🎉',
  [RequestTopic.Deep]: '🤔',
  [RequestTopic.Secrets]: '🤫'
};
```

### **Scalability Tips**
- Add machine learning for better topic-question matching
- Implement request expiration (auto-clear after X questions)
- Allow players to vote on fulfilling requests
- Create request analytics to improve topic categorization

---

## 6. Energy Level Adaptation

### **Goal**
Dynamically adjust question intensity based on session length, player interaction, and time of day.

### **UI/UX Adjustments**
- Add subtle energy level indicator in `GameScreen.tsx` header
- Provide energy override controls for manual adjustment
- Show energy-based recommendations in question selection

### **Component/State Changes**

**Energy Tracking Types**:
```typescript
export interface SessionEnergy {
  level: number; // 1-10 scale (1=low energy, 10=high energy)
  trend: 'increasing' | 'decreasing' | 'stable';
  factors: EnergyFactor[];
  lastUpdated: number;
}

export interface EnergyFactor {
  type: 'time_of_day' | 'session_length' | 'interaction_rate' | 'question_complexity' | 'player_engagement';
  value: number;
  weight: number;
}

export interface InteractionMetrics {
  questionsAnswered: number;
  averageResponseTime: number;
  wildcardUsage: number;
  sessionStartTime: number;
  lastInteractionTime: number;
}
```

**Energy Monitor Hook**:
```typescript
// hooks/useEnergyLevel.ts
export const useEnergyLevel = (players: Player[]) => {
  const [sessionEnergy, setSessionEnergy] = useState<SessionEnergy>({
    level: 5,
    trend: 'stable',
    factors: [],
    lastUpdated: Date.now()
  });
  
  const [interactionMetrics, setInteractionMetrics] = useState<InteractionMetrics>({
    questionsAnswered: 0,
    averageResponseTime: 30000, // 30 seconds default
    wildcardUsage: 0,
    sessionStartTime: Date.now(),
    lastInteractionTime: Date.now()
  });
  
  const calculateEnergyLevel = useCallback(() => {
    const factors: EnergyFactor[] = [
      calculateTimeOfDayFactor(),
      calculateSessionLengthFactor(interactionMetrics.sessionStartTime),
      calculateInteractionRateFactor(interactionMetrics),
      calculateEngagementFactor(interactionMetrics)
    ];
    
    const weightedScore = factors.reduce((sum, factor) => 
      sum + (factor.value * factor.weight), 0
    ) / factors.reduce((sum, factor) => sum + factor.weight, 0);
    
    const newLevel = Math.max(1, Math.min(10, Math.round(weightedScore)));
    const trend = newLevel > sessionEnergy.level ? 'increasing' : 
                  newLevel < sessionEnergy.level ? 'decreasing' : 'stable';
    
    setSessionEnergy({
      level: newLevel,
      trend,
      factors,
      lastUpdated: Date.now()
    });
  }, [interactionMetrics, sessionEnergy.level]);
  
  const calculateTimeOfDayFactor = (): EnergyFactor => {
    const hour = new Date().getHours();
    let value = 5; // Default mid-energy
    
    if (hour >= 19 && hour <= 23) value = 8; // Evening - high energy  
    else if (hour >= 12 && hour <= 18) value = 6; // Afternoon - medium-high
    else if (hour >= 6 && hour <= 11) value = 4; // Morning - medium-low
    else value = 3; // Late night/early morning - low
    
    return { type: 'time_of_day', value, weight: 0.2 };
  };
  
  const calculateSessionLengthFactor = (startTime: number): EnergyFactor => {
    const sessionMinutes = (Date.now() - startTime) / (1000 * 60);
    let value = 5;
    
    if (sessionMinutes < 15) value = 7; // Fresh start - higher energy
    else if (sessionMinutes < 45) value = 6; // Sweet spot
    else if (sessionMinutes < 90) value = 4; // Getting tired
    else value = 3; // Long session - lower energy
    
    return { type: 'session_length', value, weight: 0.3 };
  };
  
  const calculateInteractionRateFactor = (metrics: InteractionMetrics): EnergyFactor => {
    const timeSinceLastInteraction = Date.now() - metrics.lastInteractionTime;
    const avgTimePerQuestion = metrics.averageResponseTime;
    
    let value = 5;
    if (timeSinceLastInteraction < avgTimePerQuestion * 0.8) value = 8; // Quick responses
    else if (timeSinceLastInteraction < avgTimePerQuestion * 1.2) value = 6; // Normal pace
    else value = 3; // Slow responses
    
    return { type: 'interaction_rate', value, weight: 0.3 };
  };
  
  const calculateEngagementFactor = (metrics: InteractionMetrics): EnergyFactor => {
    const wildcardRate = metrics.wildcardUsage / Math.max(1, metrics.questionsAnswered);
    let value = 5;
    
    if (wildcardRate > 0.3) value = 3; // Too many wildcards = disengagement
    else if (wildcardRate > 0.1) value = 7; // Some wildcards = good engagement
    else value = 5; // No wildcards = neutral
    
    return { type: 'player_engagement', value, weight: 0.2 };
  };
  
  const updateInteractionMetrics = useCallback((type: 'question_answered' | 'wildcard_used', responseTime?: number) => {
    setInteractionMetrics(prev => {
      const updates: Partial<InteractionMetrics> = {
        lastInteractionTime: Date.now()
      };
      
      if (type === 'question_answered') {
        updates.questionsAnswered = prev.questionsAnswered + 1;
        if (responseTime) {
          updates.averageResponseTime = (prev.averageResponseTime * prev.questionsAnswered + responseTime) / updates.questionsAnswered;
        }
      } else if (type === 'wildcard_used') {
        updates.wildcardUsage = prev.wildcardUsage + 1;
      }
      
      return { ...prev, ...updates };
    });
  }, []);
  
  // Recalculate energy every 30 seconds or after interactions
  useEffect(() => {
    const interval = setInterval(calculateEnergyLevel, 30000);
    return () => clearInterval(interval);
  }, [calculateEnergyLevel]);
  
  useEffect(() => {
    calculateEnergyLevel();
  }, [interactionMetrics]);
  
  return {
    sessionEnergy,
    updateInteractionMetrics,
    forceEnergyRecalculation: calculateEnergyLevel
  };
};
```

### **Logic or Hook Enhancements**

**Energy-Aware Question Selection**:
```typescript
// Enhanced useQuestionManager.ts
const applyEnergyFilter = (questions: Question[], energyLevel: number): Question[] => {
  return questions.filter(question => {
    const questionEnergy = getQuestionEnergyRequirement(question);
    
    // Match questions to energy level (±2 tolerance)
    return Math.abs(questionEnergy - energyLevel) <= 2;
  });
};

const getQuestionEnergyRequirement = (question: Question): number => {
  let energy = 5; // Default
  
  // Adjust based on question characteristics
  if (question.intimacyLevel > 7) energy += 2; // High intimacy needs energy
  if (question.text.length > 100) energy += 1; // Long questions need focus
  if (question.moodTags.includes(SessionMood.Wild)) energy += 2;
  if (question.moodTags.includes(SessionMood.Chill)) energy -= 1;
  
  return Math.max(1, Math.min(10, energy));
};
```

**Energy Display Component**:
```typescript
// components/EnergyIndicator.tsx
interface EnergyIndicatorProps {
  sessionEnergy: SessionEnergy;
  onEnergyOverride?: (newLevel: number) => void;
}

const EnergyIndicator: React.FC<EnergyIndicatorProps> = ({ sessionEnergy, onEnergyOverride }) => {
  const getEnergyColor = (level: number) => {
    if (level <= 3) return 'text-blue-400'; // Low energy - calm
    if (level <= 6) return 'text-green-400'; // Medium energy
    return 'text-red-400'; // High energy
  };
  
  const getEnergyEmoji = (level: number) => {
    if (level <= 3) return '😴';
    if (level <= 6) return '😊'; 
    return '🔥';
  };
  
  return (
    <div className="energy-indicator">
      <div className={`energy-display ${getEnergyColor(sessionEnergy.level)}`}>
        <span className="energy-emoji">{getEnergyEmoji(sessionEnergy.level)}</span>
        <span className="energy-level">Energy: {sessionEnergy.level}/10</span>
        <span className={`energy-trend ${sessionEnergy.trend === 'increasing' ? 'text-green-400' : sessionEnergy.trend === 'decreasing' ? 'text-red-400' : 'text-gray-400'}`}>
          {sessionEnergy.trend === 'increasing' ? '↗️' : sessionEnergy.trend === 'decreasing' ? '↘️' : '→'}
        </span>
      </div>
      
      {onEnergyOverride && (
        <div className="energy-controls">
          <button onClick={() => onEnergyOverride(Math.max(1, sessionEnergy.level - 1))}>➖</button>
          <button onClick={() => onEnergyOverride(Math.min(10, sessionEnergy.level + 1))}>➕</button>
        </div>
      )}
    </div>
  );
};
```

### **Data Structure or Constants Modifications**

**Energy Configuration**:
```typescript
// Add to constants.ts
export const ENERGY_CONFIG = {
  UPDATE_INTERVAL: 30000, // 30 seconds
  FACTORS: {
    TIME_OF_DAY_WEIGHT: 0.2,
    SESSION_LENGTH_WEIGHT: 0.3,
    INTERACTION_RATE_WEIGHT: 0.3,
    ENGAGEMENT_WEIGHT: 0.2
  },
  THRESHOLDS: {
    LOW_ENERGY: 3,
    MEDIUM_ENERGY: 6,
    HIGH_ENERGY: 8
  }
};

// Energy-based question recommendations
export const ENERGY_QUESTION_MAPPING = {
  LOW: { maxIntimacy: 4, preferredMoods: [SessionMood.Chill] },
  MEDIUM: { maxIntimacy: 7, preferredMoods: [SessionMood.Chill, SessionMood.Deep] },
  HIGH: { maxIntimacy: 10, preferredMoods: [SessionMood.Wild, SessionMood.Funny] }
};
```

### **Scalability Tips**
- Add machine learning to improve energy prediction accuracy
- Implement player-specific energy profiles
- Create energy-based game mode recommendations
- Add group energy synchronization (some players high energy, others low)
- Consider biometric integration (heart rate, voice analysis) for advanced energy detection

---

## Architecture Integration Summary

### **Global State Management**
Consider implementing React Context for cross-component state:

```typescript
// contexts/GameContext.tsx
interface GameContextValue {
  sessionConfig: SessionConfig;
  customQuestions: CustomQuestion[];
  playerRequests: PlayerRequest[];
  relationshipMap: PlayerRelationship[];
  sessionEnergy: SessionEnergy;
  gameplayMode: GameplayMode;
}

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Consolidate all game state management
  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};
```

### **Data Persistence Strategy**
Enhance localStorage with versioned schema:

```typescript
// utils/storage.ts
interface StorageSchema {
  version: string;
  customQuestions: CustomQuestion[];
  playerProfiles: EnhancedPlayer[];
  sessionHistory: SessionSummary[];
  energyCalibration: EnergyCalibrationData;
}

export const storage = {
  save: <T>(key: string, data: T) => localStorage.setItem(key, JSON.stringify(data)),
  load: <T>(key: string): T | null => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  },
  migrate: (oldVersion: string, newVersion: string) => {
    // Handle schema migrations
  }
};
```

## Implementation Priority

### **Phase 1 (Foundation)**
1. **Mood Selection System** - Establishes filtering framework
2. **Energy Level Adaptation** - Creates dynamic gameplay foundation

### **Phase 2 (Content)**
3. **Custom Question Bank** - Enables content expansion
4. **Player Request System** - Adds personalization layer

### **Phase 3 (Advanced)**
5. **Relationship Mapping** - Complex social dynamics
6. **Hot Seat Mode** - Alternative gameplay mode

## Testing Strategy

### **Unit Tests**
- Question filtering algorithms
- Energy calculation functions
- Relationship mapping logic
- Custom question validation

### **Integration Tests**
- Component interaction flows
- localStorage persistence
- Hook integration
- State management

### **User Experience Tests**
- Mood selection impacts on question curation
- Energy adaptation responsiveness
- Hot seat mode engagement
- Custom question submission flow

This implementation plan provides a comprehensive roadmap for enhancing the Connection Cards group mode while maintaining architectural integrity and ensuring scalable, maintainable code.