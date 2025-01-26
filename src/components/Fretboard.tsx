import React, { useState } from "react";
import { Note, Tuning } from "../types";
import { getNoteAtFret } from "../utils/notes";
import { noteToValue } from "../utils/noteToValue";
import { AudioPlayer } from "../utils/audio";

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

export const Fretboard: React.FC<FretboardProps> = ({
  tuning,
  highlightedNote,
  highlightedSearchNote,
  onFretClick,
}) => {
  const frets = Array.from({ length: 12 }, (_, i) => i);
  const fretMarkers = [3, 5, 7, 9, 12]; // Traditional guitar fret markers

  const getAllMatchingNotes = (highlightedNote?: {
    string: number;
    fret: number;
  }) => {
    if (!highlightedNote) return [];
    const matchingNotes: { string: number; fret: number }[] = [];

    // Mark same notes in all strings
    tuning.strings.forEach((openNote, stringIndex) => {
      frets.forEach((fret) => {
        const note = getNoteAtFret(openNote, fret);
        if (
          note ===
          getNoteAtFret(
            tuning.strings[highlightedNote.string],
            highlightedNote.fret
          )
        ) {
          matchingNotes.push({ string: stringIndex, fret });
        }
      });
    });

    return matchingNotes;
  };

  const matchingNotes = getAllMatchingNotes(highlightedNote);

  const stringClasses = [
    "border-b",
    "border-b-[2px]",
    "border-b-[3px]",
    "border-b-[4px]",
    "border-b-[5px]",
    "border-b-[6px]",
    "border-b-[7px]",
    "border-b-[8px]",
  ];

  const [audioPlayer] = useState(() => new AudioPlayer());

  const handlePlayNote = (note: Note) => {
    const [noteValue, octave] = noteToValue(note);

    if (audioPlayer.samples && audioPlayer.audioContext) {
      audioPlayer.playNote(noteValue, octave);
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      {/* Fret markers */}
      <div className="min-w-[800px] flex mb-2">
        {frets.map((fret) => (
          <div key={fret} className="flex-1 flex justify-center">
            {fretMarkers.includes(fret) && (
              <div className={`
                w-4 h-4 rounded-full bg-gray-300
                ${fret === 12 ? 'relative after:content-[""] after:absolute after:left-6 after:w-4 after:h-4 after:rounded-full after:bg-gray-300' : ''}
              `} />
            )}
          </div>
        ))}
      </div>
      {/* Fretboard */}
      <div className="min-w-[800px]">
        {tuning.strings.map((openNote, stringIndex) => (
          <div
            key={stringIndex}
            className={`flex border-b border ${stringClasses[stringIndex]}`}
          >
            {frets.map((fret) => {
              const note = getNoteAtFret(openNote, fret);
              const isMatchingNote = matchingNotes.some(
                (m) => m.string === stringIndex && m.fret === fret
              );
              const isSearchHighlighted =
                highlightedSearchNote?.string === stringIndex &&
                highlightedSearchNote?.fret === fret;

              // Verify if is the string searched
              const isSearchString =
                highlightedSearchNote?.string === stringIndex;

              return (
                <div
                  key={fret}
                  onClick={() => {
                    handlePlayNote(note);
                    onFretClick?.(stringIndex, fret, note);
                  }}
                  className={`
                    flex-1 h-14 border-r border-gray-300 flex items-center justify-center cursor-pointer
                    ${fret === 0 ? "border-r-4 border-r-gray-800" : ""}
                    ${
                      isMatchingNote
                        ? isSearchString
                          ? "bg-blue-500 text-white"
                          : "bg-sky-300 text-white"
                        : "hover:bg-gray-100"
                    }
                    ${isSearchHighlighted ? "bg-green-500 text-white" : ""}
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