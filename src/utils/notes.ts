import { Note, Tuning } from '../types';

// Notas con octavas (A0 a G#8)
export const ALL_NOTES: Note[] = [
  'A0', 'A#0', 'B0', 
  'C1', 'C#1', 'D1', 'D#1', 'E1', 'F1', 'F#1', 'G1', 'G#1',
  'A1', 'A#1', 'B1', 
  'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2',
  'A2', 'A#2', 'B2', 
  'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3',
  'A3', 'A#3', 'B3', 
  'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4',
  'A4', 'A#4', 'B4', 
  'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5',
  'A5', 'A#5', 'B5', 
  'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6',
  'A6', 'A#6', 'B6', 
  'C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7',
  'A7', 'A#7', 'B7',
  'C8'
];

// Actualización de afinaciones estándar con octavas
export const STANDARD_TUNINGS: Tuning[] = [
  {
    name: 'Standard 6-string (E)',
    strings: ['E4', 'B3', 'G3', 'D3', 'A2', 'E2'],
  },
  {
    name: 'Standard 7-string (B)',
    strings: ['E4', 'B3', 'G3', 'D3', 'A2', 'E2', 'B1'],
  },
  {
    name: 'Standard 8-string (F#)',
    strings: ['E4', 'B3', 'G3', 'D3', 'A2', 'E2', 'B1', 'F#1'],
  },
  {
    name: 'Drop D',
    strings: ['D2', 'B3', 'G3', 'D3', 'A2', 'E2'],
  },
  {
    name: 'Drop C',
    strings: ['C2', 'G3', 'C3', 'F3', 'A2', 'D2'],
  },
  {
    name: 'Drop B',
    strings: ['B1', 'F#3', 'B2', 'E3', 'G#3', 'C#3'],
  },
  {
    name: 'Drop A',
    strings: ['A1', 'E3', 'A2', 'D3', 'F#3', 'B2'],
  },
  {
    name: 'Open G',
    strings: ['D2', 'B3', 'G3', 'D3', 'G2', 'D2'],
  },
  {
    name: 'Open D',
    strings: ['D2', 'A2', 'F#3', 'D3', 'A2', 'D2'],
  },
  {
    name: 'Open C',
    strings: ['C2', 'G2', 'C3', 'G3', 'C3', 'E3'],
  },
  {
    name: 'Standard 9-string (C#)',
    strings: ['E4', 'B3', 'G3', 'D3', 'A2', 'E2', 'B1', 'F#1', 'C#1'],
  }
];

// Función para calcular la nota en el traste con octavas
export const getNoteAtFret = (openNote: Note, fret: number): Note => {
  const startIndex = ALL_NOTES.indexOf(openNote);
  if (startIndex === -1) {
    throw new Error(`Nota inicial inválida: ${openNote}`);
  }
  const noteIndex = (startIndex + fret) % ALL_NOTES.length;
  return ALL_NOTES[noteIndex];
};
