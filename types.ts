
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

export interface Question {
  text: string;
  mode: GameMode;
  type: QuestionType;
}

export interface Player {
  id: number;
  name: string;
}
