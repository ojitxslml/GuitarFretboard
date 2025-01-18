import React from 'react';
import { Note, Tuning } from '../types';
import { ALL_NOTES, STANDARD_TUNINGS } from '../utils/notes';

type TuningSelectorProps = {
  currentTuning: Tuning;
  onTuningChange: (tuning: Tuning) => void;
};

export const TuningSelector: React.FC<TuningSelectorProps> = ({ currentTuning, onTuningChange }) => {
  const [isCustom, setIsCustom] = React.useState(false);
  const [customStrings, setCustomStrings] = React.useState<Note[]>(currentTuning.strings);

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = STANDARD_TUNINGS.find((t) => t.name === e.target.value);
    if (selected) {
      setIsCustom(false);
      onTuningChange(selected);
    }
  };

  const handleCustomStringChange = (index: number, note: Note) => {
    const newStrings = [...customStrings];
    newStrings[index] = note;
    setCustomStrings(newStrings);
    onTuningChange({ name: 'Custom', strings: newStrings });
  };

  const handleStringCountChange = (count: number) => {
    const newStrings = Array(count).fill('E') as Note[];
    setCustomStrings(newStrings);
    onTuningChange({ name: 'Custom', strings: newStrings });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <select
          className="px-3 py-2 border rounded-md"
          value={isCustom ? 'custom' : currentTuning.name}
          onChange={(e) => {
            if (e.target.value === 'custom') {
              setIsCustom(true);
            } else {
              handlePresetChange(e);
            }
          }}
        >
          {STANDARD_TUNINGS.map((tuning) => (
            <option key={tuning.name} value={tuning.name}>
              {tuning.name}
            </option>
          ))}
          <option value="custom">Custom Tuning</option>
        </select>
      </div>

      {isCustom && (
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <label>Number of strings:</label>
            <select
              className="px-3 py-2 border rounded-md"
              value={customStrings.length}
              onChange={(e) => handleStringCountChange(Number(e.target.value))}
            >
              {[6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {customStrings.map((note, index) => (
              <div key={index} className="flex items-center gap-2">
                <label>String {index + 1}:</label>
                <select
                  className="px-3 py-2 border rounded-md"
                  value={note}
                  onChange={(e) => handleCustomStringChange(index, e.target.value as Note)}
                >
                  {ALL_NOTES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};