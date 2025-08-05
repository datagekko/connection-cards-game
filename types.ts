
export enum GameMode {
  FirstDate = 'First Date',
  SecondDate = 'Second Date',
  ThirdDate = 'Third Date',
  LoveBirds = 'Love Birds',
  GroupMode = 'Friends Mode',
}

export enum QuestionType {
  Question = 'question',
  Wildcard = 'wildcard',
}

export enum SessionMood {
  Chill = 'Chill',
  Deep = 'Deep', 
  Wild = 'Wild',
  Funny = 'Funny',
  All = 'All Questions'
}

export enum GameplayMode {
  Normal = 'normal',
  HotSeat = 'hot-seat'
}

export enum RelationshipType {
  BestFriends = 'Best Friends',
  Colleagues = 'Colleagues', 
  NewAcquaintances = 'New Acquaintances',
  Family = 'Family',
  RomanticPartners = 'Romantic Partners',
  Roommates = 'Roommates'
}

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

export interface Question {
  text: string;
  mode: GameMode;
  type: QuestionType;
  moodTags?: SessionMood[];
  intimacyLevel?: number;
  appropriateRelationships?: RelationshipType[];
  energyRequirement?: number;
}

export interface Player {
  id: number;
  name: string;
}

export interface EnhancedPlayer extends Player {
  relationships: PlayerRelationship[];
  comfortLevel: number;
}

export interface SessionConfig {
  mood: SessionMood;
  intensity: number;
}

export interface PlayerRelationship {
  playerId1: number;
  playerId2: number;
  relationship: RelationshipType;
  intimacyLevel: number;
}

export interface CustomQuestion extends Question {
  id: string;
  authorId: number;
  createdAt: number;
  approved: boolean;
}

export interface PlayerRequest {
  id: string;
  playerId: number;
  topic: RequestTopic;
  specificPrompt?: string;
  createdAt: number;
  fulfilled: boolean;
}

export interface SessionEnergy {
  level: number;
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
