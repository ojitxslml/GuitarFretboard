import { Note, Tuning } from '../types';

export const ALL_NOTES: Note[] = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

export const STANDARD_TUNINGS: Tuning[] = [
  {
    name: 'Standard 6-string (E)',
    strings: ['E', 'B', 'G', 'D', 'A', 'E'],
  },
  {
    name: 'Standard 7-string (B)',
    strings: ['E', 'B', 'G', 'D', 'A', 'E', 'B'],
  },
  {
    name: 'Standard 8-string (F#)',
    strings: ['E', 'B', 'G', 'D', 'A', 'E', 'B', 'F#'],
  },
];

export const getNoteAtFret = (openNote: Note, fret: number): Note => {
  const startIndex = ALL_NOTES.indexOf(openNote);
  const noteIndex = (startIndex + fret) % ALL_NOTES.length;
  return ALL_NOTES[noteIndex];
};