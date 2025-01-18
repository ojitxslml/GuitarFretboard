import React, { useState } from 'react';
import { Music } from 'lucide-react';
import { Tuning } from './types';
import { STANDARD_TUNINGS } from './utils/notes';
import { Fretboard } from './components/Fretboard';
import { TuningSelector } from './components/TuningSelector';
import { GameMode } from './components/GameMode';

function App() {
  const [tuning, setTuning] = useState<Tuning>(STANDARD_TUNINGS[0]);
  const [isGameMode, setIsGameMode] = useState(false);
  const [lastGuess, setLastGuess] = useState<{ correct: boolean; message: string } | null>(null);

  const handleNoteGuess = (correct: boolean) => {
    setLastGuess({
      correct,
      message: correct ? 'Correct! 🎸' : 'Try again! 🎼',
    });

    setTimeout(() => setLastGuess(null), 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Music className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Guitar Fretboard Trainer</h1>
            </div>
            <button
              onClick={() => setIsGameMode(!isGameMode)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isGameMode ? 'Practice Mode' : 'Game Mode'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Tuning Settings</h2>
            <TuningSelector currentTuning={tuning} onTuningChange={setTuning} />
          </section>

          {isGameMode ? (
            <section className="bg-white p-6 rounded-lg shadow">
              <GameMode tuning={tuning} onNoteGuess={handleNoteGuess} />
              {lastGuess && (
                <div
                  className={`mt-4 p-4 rounded-md text-center ${
                    lastGuess.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {lastGuess.message}
                </div>
              )}
            </section>
          ) : (
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Fretboard</h2>
              <Fretboard tuning={tuning} />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;