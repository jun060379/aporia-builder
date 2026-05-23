import { PROFICIENCY_NAMES, getProficiencyCost } from '../data/proficiencies';

function Stepper({ name, value, cost, onChange }) {
  return (
    <div className="flex items-center gap-1 py-1 border-b border-gray-700 last:border-0">
      <span className="text-sm text-gray-300 flex-1 min-w-0 truncate">{name}</span>
      <span className="text-xs text-gray-500 w-12 text-right shrink-0">비용:{cost}</span>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-6 h-6 rounded bg-gray-600 hover:bg-gray-500 text-white text-sm font-bold flex items-center justify-center"
          disabled={value <= 0}
        >−</button>
        <span className="w-5 text-center text-sm text-white font-semibold">{value}</span>
        <button
          onClick={() => onChange(Math.min(5, value + 1))}
          className="w-6 h-6 rounded bg-gray-600 hover:bg-gray-500 text-white text-sm font-bold flex items-center justify-center"
          disabled={value >= 5}
        >+</button>
      </div>
    </div>
  );
}

export default function ProficiencyEditor({ proficiencies, onChange }) {
  const update = (name, val) => onChange({ ...proficiencies, [name]: val });

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-2">
      <h2 className="text-lg font-bold text-yellow-400">숙련</h2>
      {PROFICIENCY_NAMES.map(name => (
        <Stepper
          key={name}
          name={name}
          value={proficiencies[name]}
          cost={getProficiencyCost(proficiencies[name])}
          onChange={(v) => update(name, v)}
        />
      ))}
    </div>
  );
}
