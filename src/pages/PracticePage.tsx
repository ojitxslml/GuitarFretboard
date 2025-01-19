import { useState } from "react";
import { Tuning } from "../types";
import { STANDARD_TUNINGS } from "../utils/notes";
import { TuningSelector } from "../components/TuningSelector";
import { GameMode } from "../components/PracticeMode/PracticeMode";
import FeedbackMessage from "../components/PracticeMode/FeedbackMessage";

function PracticePage() {
  const [tuning, setTuning] = useState<Tuning>(STANDARD_TUNINGS[0]);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [showScore, setShowScore] = useState<boolean>(true); // Nuevo estado

  const handleNoteGuess = (isCorrect: boolean) => {
    setCorrect(isCorrect);
    // Clear state after 4s
    setTimeout(() => setCorrect(null), 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Tuning */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Tuning Settings</h2>
            <div className="flex items-center justify-between">
              <TuningSelector
                currentTuning={tuning}
                onTuningChange={setTuning}
              />
              {/* Toggle Score */}
              <div className="flex items-center space-x-2">
                <label htmlFor="toggle-score" className="text-sm font-medium">
                  Show Score
                </label>
                <input
                  type="checkbox"
                  id="toggle-score"
                  checked={showScore}
                  onChange={(e) => setShowScore(e.target.checked)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </section>

          {/* Practice */}
          <section className="bg-white p-6 rounded-lg shadow">
            <GameMode
              tuning={tuning}
              onNoteGuess={handleNoteGuess}
              showScore={showScore}
            />
            {showScore && <FeedbackMessage correct={correct} />}
          </section>
        </div>
      </main>
    </div>
  );
}

export default PracticePage;
