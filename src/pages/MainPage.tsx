import { useState } from "react";
import { Tuning } from "../types";
import { STANDARD_TUNINGS } from "../utils/notes";
import { Fretboard } from "../components/Fretboard";
import { TuningSelector } from "../components/TuningSelector";

function MainPage() {
  const [tuning, setTuning] = useState<Tuning>(STANDARD_TUNINGS[0]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Tuning Settings</h2>
            <TuningSelector currentTuning={tuning} onTuningChange={setTuning} />
          </section>
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Fretboard</h2>
            <Fretboard tuning={tuning} />
          </section>
        </div>
      </main>
    </div>
  );
}

export default MainPage;
