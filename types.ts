export const gameModes = ['First Date', 'Second Date', 'Third Date', 'Love Birds', 'Friends'] as const;
export type GameMode = typeof gameModes[number];

export interface Question {
  question: string;
  mode: GameMode;
  category?: string;
  isWildCard?: boolean;
}

export interface CustomQuestion {
  id: string;
  question: string;
  createdBy: Player;
}

export interface GameState {
  roundNumber: number;
  customQuestions: CustomQuestion[];
  usedCustomQuestions: { [key in Player]: number };
}

export type Player = 'Player 1' | 'Player 2';
