import { PROFICIENCY_NAMES, getProficiencyCost } from '../data/proficiencies';

function Stepper({ name, value, cost, onChange }) {
  return (
    <div className="flex items-center gap-2 py-2 border-b border-white/5 last:border-0">
      <span className="text-sm text-slate-300 flex-1 min-w-0 truncate">{name}</span>
      <span className="text-[11px] text-amber-200/50 font-mono w-12 text-right shrink-0">{cost}pt</span>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value <= 0}
          className="w-7 h-7 rounded-lg bg-slate-700/60 hover:bg-slate-600/60 text-slate-300 text-sm font-bold flex items-center justify-center disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >−</button>
        <span className="w-6 text-center text-sm text-slate-100 font-semibold">{value}</span>
        <button
          onClick={() => onChange(Math.min(5, value + 1))}
          disabled={value >= 5}
          className="w-7 h-7 rounded-lg bg-slate-700/60 hover:bg-slate-600/60 text-slate-300 text-sm font-bold flex items-center justify-center disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >+</button>
      </div>
    </div>
  );
}

export default function ProficiencyEditor({ proficiencies, onChange }) {
  const update = (name, val) => onChange({ ...proficiencies, [name]: val });

  return (
    <div className="bg-slate-900/70 backdrop-blur-sm rounded-2xl border border-white/10 p-5 shadow-xl shadow-black/30">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] text-slate-600 font-mono tracking-widest">04</span>
        <h2 className="text-sm font-semibold text-slate-300 tracking-wide uppercase">숙련</h2>
      </div>
      <div>
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
    </div>
  );
}
