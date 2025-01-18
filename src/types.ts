export type Note = 'A' | 'A#' | 'B' | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#';

export type Tuning = {
  name: string;
  strings: Note[];
};

export type GameMode = 'practice' | 'quiz';

export type GameState = {
  currentNote: {
    string: number;
    fret: number;
    note: Note;
  };
  score: number;
  attempts: number;
};