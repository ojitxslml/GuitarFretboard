import { Note, NoteValue, Octave } from "../types";

export function noteToValue(note: Note): [NoteValue, Octave] {
  // Mapeo de las notas (A, A#, B, C, etc.) a sus valores NoteValue
  const noteValues: Record<string, NoteValue> = {
    'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
};

  // Extraemos la nota (letra) y la octava
  const noteLetter = note.slice(0, -1); // La parte de la letra (ej. 'C')
  const octave = parseInt(note.slice(-1)) as Octave; // La octava (ej. '4')

  // Verificar que la octava sea válida (1-7)
  if (octave < 1 || octave > 7) {
    throw new Error(`Invalid octave: ${octave}. Octave must be between 1 and 7.`);
  }

  // Obtener el NoteValue correspondiente
  const noteValue = noteValues[noteLetter];

  if (noteValue === undefined) {
    throw new Error(`Invalid note letter: ${noteLetter}`);
  }

  return [noteValue, octave];
}
