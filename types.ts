export const gameModes = ['First Date', 'Second Date', 'Third Date', 'Love Birds'] as const;
export type GameMode = typeof gameModes[number];

export interface Question {
  question: string;
  mode: GameMode;
  category?: string;
}

export type Player = 'Player 1' | 'Player 2';
