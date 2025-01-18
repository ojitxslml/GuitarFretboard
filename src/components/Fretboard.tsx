import React from 'react';
import { Note, Tuning } from '../types';
import { getNoteAtFret } from '../utils/notes';

type FretboardProps = {
  tuning: Tuning;
  highlightedNote?: {
    string: number;
    fret: number;
  };
  highlightedSearchNote?: {
    string: number;
    fret: number;
  };
  onFretClick?: (string: number, fret: number, note: Note) => void;
};

export const Fretboard: React.FC<FretboardProps> = ({ tuning, highlightedNote, highlightedSearchNote, onFretClick }) => {
  const frets = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px]">
        {tuning.strings.map((openNote, stringIndex) => (
          <div key={stringIndex} className="flex border-b border-gray-300">
            {frets.map((fret) => {
              const note = getNoteAtFret(openNote, fret);
              const isHighlighted = highlightedNote?.string === stringIndex && highlightedNote?.fret === fret;
              const isSearchHighlighted = highlightedSearchNote?.string === stringIndex && highlightedSearchNote?.fret === fret;

              return (
                <div
                  key={fret}
                  onClick={() => onFretClick?.(stringIndex, fret, note)}
                  className={`
                    flex-1 h-16 border-r border-gray-300 flex items-center justify-center cursor-pointer
                    ${fret === 0 ? 'border-l-2 border-l-gray-800' : ''}
                    ${isHighlighted ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}
                    ${isSearchHighlighted ? 'bg-green-500 text-white' : ''}
                  `}
                >
                  <span className="text-sm font-medium">{note}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
