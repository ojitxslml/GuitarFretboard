import React, { useState, useEffect, useRef, useCallback } from "react";
import { Note, GameState } from "../types";
import { getNoteAtFret } from "../utils/notes";
import { PitchDetector } from "../utils/audioDetection";
import { Mic, MicOff } from "lucide-react";
import { Fretboard } from "./Fretboard";

type GameModeProps = {
  tuning: {
    strings: Note[];
  };
  onNoteGuess: (correct: boolean) => void;
};

export const GameMode: React.FC<GameModeProps> = ({ tuning, onNoteGuess }) => {
  const [gameState, setGameState] = useState<GameState>({
    currentNote: {
      string: 0,
      fret: 0,
      note: tuning.strings[0],
    },
    score: 0,
    attempts: 0,
  });

  const [isListening, setIsListening] = useState(false);
  const [currentPlayedNote, setCurrentPlayedNote] = useState<string>("");
  const [highlightedFret, setHighlightedFret] = useState<{
    string: number;
    fret: number;
  } | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);

  const pitchDetectorRef = useRef<PitchDetector | null>(null);
  const noteHistoryRef = useRef<string[]>([]); // History of detected notes
  const lastDetectionTimeRef = useRef<number>(0);
  const detectionCooldownRef = useRef<number>(1000); // 1 second cooldown

  const extractNoteName = (note: string): string => note.replace(/[0-9]/g, "");

  const updatePitch = useCallback(() => {
    if (!pitchDetectorRef.current || isWaiting) return;

    const frequency = pitchDetectorRef.current.getCurrentFrequency();
    if (frequency && frequency !== -1) {
      const note = pitchDetectorRef.current.frequencyToNoteForGuitar(frequency);
      if (note) {
        noteHistoryRef.current.push(note);
      }

      const now = Date.now();
      if (now - lastDetectionTimeRef.current >= detectionCooldownRef.current) {
        const mostFrequentNote = getMostFrequentNote(noteHistoryRef.current);
        if (mostFrequentNote) {
          const normalizedNote = extractNoteName(mostFrequentNote);
          setCurrentPlayedNote(normalizedNote);
          handleGuess(normalizedNote); // Llamar a la función de adivinanza si la nota es correcta
        }

        noteHistoryRef.current = noteHistoryRef.current.filter(
          (n, index) =>
            now - (noteHistoryRef.current[index] as any).timestamp < 1000
        );

        lastDetectionTimeRef.current = now;
      }
    }

    requestAnimationFrame(updatePitch);
  }, [gameState, isWaiting]);

  const getMostFrequentNote = (notes: string[]): string | null => {
    if (notes.length === 0) return null;

    const noteCounts: { [key: string]: number } = {};
    notes.forEach((note) => {
      noteCounts[note] = (noteCounts[note] || 0) + 1;
    });

    return Object.keys(noteCounts).reduce((a, b) =>
      noteCounts[a] > noteCounts[b] ? a : b
    );
  };

  const lastNoteRef = useRef<string>(gameState.currentNote.note);

  useEffect(() => {
    lastNoteRef.current = gameState.currentNote.note;
  }, [gameState.currentNote.note]);
  const handleGuess = useCallback(
    (guessedNote: string) => {
      if (isWaiting) return;

      const guessedNoteName = extractNoteName(guessedNote);
      const targetNoteName = extractNoteName(lastNoteRef.current);
      
      // Actualizar el estado del juego
      setGameState((prev) => ({
        ...prev,
        score: prev.score + (guessedNoteName === targetNoteName ? 1 : 0),
        attempts: prev.attempts + 1, // Siempre aumentar los intentos
      }));

      if (guessedNoteName !== targetNoteName) {
        const position = findNoteOnFretboard(guessedNoteName as Note);
        setHighlightedFret(position);
      }

      onNoteGuess(guessedNoteName === targetNoteName); // Notificar al componente padre si la adivinanza fue correcta o incorrecta

      if (guessedNoteName === targetNoteName) {
        setIsWaiting(true);
        setTimeout(generateNewNote, 500); // Generar una nueva nota después de un tiempo
      }
    },
    [isWaiting, onNoteGuess]
  );

  const generateNewNote = useCallback(() => {
    setIsWaiting(true);
    const string = Math.floor(Math.random() * tuning.strings.length);
    const fret = Math.floor(Math.random() * 12);
    const note = getNoteAtFret(tuning.strings[string], fret);

    setGameState((prev) => ({
      ...prev,
      currentNote: { string, fret, note },
    }));
    setHighlightedFret(null);

    setTimeout(() => setIsWaiting(false), 500);
  }, [tuning]);

  const toggleListening = async () => {
    if (isListening) {
      if (pitchDetectorRef.current) pitchDetectorRef.current.stop();
      setIsListening(false);
      setCurrentPlayedNote("");
    } else {
      try {
        if (!pitchDetectorRef.current) {
          pitchDetectorRef.current = new PitchDetector();
        }
        await pitchDetectorRef.current.start();
        setIsListening(true);
        updatePitch();
      } catch (error) {
        console.error("Failed to start audio input:", error);
        alert("Could not access microphone. Please check your permissions.");
      }
    }
  };

  const findNoteOnFretboard = (
    note: string
  ): { string: number; fret: number } => {
    for (let string = 0; string < tuning.strings.length; string++) {
      for (let fret = 0; fret < 12; fret++) {
        if (getNoteAtFret(tuning.strings[string], fret) === note) {
          return { string, fret };
        }
      }
    }
    return { string: 0, fret: 0 }; // Si no se encuentra la nota, retornar una posición por defecto
  };

  useEffect(() => {
    generateNewNote();
    return () => {
      if (pitchDetectorRef.current) pitchDetectorRef.current.stop();
    };
  }, [tuning, generateNewNote]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold">Find this note:</h3>
        <p className="text-3xl font-bold text-blue-600">
          String {gameState.currentNote.string + 1}, Fret{" "}
          {gameState.currentNote.fret}
        </p>
        <p className="text-lg mt-2">
          Target Note:{" "}
          <span className="font-bold">{gameState.currentNote.note}</span>
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <Fretboard
          tuning={tuning}
           highlightedNote={
            highlightedFret || {
              string: gameState.currentNote.string,
              fret: gameState.currentNote.fret,
            }
          }
          highlightedSearchNote={{
            string: gameState.currentNote.string,
            fret: gameState.currentNote.fret,
          }}
        />
      </div>

      {isWaiting && (
        <div className="text-center text-blue-600">Get ready...</div>
      )}

      <div className="flex justify-center space-x-4">
        <button
          onClick={toggleListening}
          disabled={isWaiting}
          className={`flex items-center px-4 py-2 rounded-md ${
            isListening
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          } ${isWaiting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isListening ? (
            <>
              <MicOff className="w-5 h-5 mr-2" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 mr-2" />
              Start Listening
            </>
          )}
        </button>
      </div>

      {isListening && currentPlayedNote && (
        <div className="text-center">
          <p className="text-lg">
            Currently playing:{" "}
            <span className="font-bold">{currentPlayedNote}</span>
          </p>
        </div>
      )}

      {!isListening && (
        <div className="grid grid-cols-4 gap-2">
          {[
            "A",
            "A#",
            "B",
            "C",
            "C#",
            "D",
            "D#",
            "E",
            "F",
            "F#",
            "G",
            "G#",
          ].map((note) => (
            <button
              key={note}
              onClick={() => handleGuess(note)}
              disabled={isWaiting}
              className={`px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 
                  ${isWaiting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {note}
            </button>
          ))}
        </div>
      )}

      <div className="text-center">
        <p className="text-lg">
          Score: {gameState.score} / {gameState.attempts}
        </p>
      </div>
    </div>
  );
};
