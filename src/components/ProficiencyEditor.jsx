import { PROFICIENCY_NAMES, getProficiencyCost } from '../data/proficiencies';

function Stepper({ name, value, cost, onChange }) {
  return (
    <div className="flex items-center gap-2 py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-700 flex-1 min-w-0 truncate">{name}</span>
      <span className="text-[11px] text-amber-600/70 font-mono w-12 text-right shrink-0">{cost}pt</span>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value <= 0}
          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold flex items-center justify-center border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >−</button>
        <span className="w-6 text-center text-sm text-slate-900 font-semibold">{value}</span>
        <button
          onClick={() => onChange(Math.min(5, value + 1))}
          disabled={value >= 5}
          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold flex items-center justify-center border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >+</button>
      </div>
    </div>
  );
}

export default function ProficiencyEditor({ proficiencies, onChange }) {
  const update = (name, val) => onChange({ ...proficiencies, [name]: val });

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-lg shadow-violet-100/20 p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] text-violet-300 font-mono tracking-widest">04</span>
        <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">숙련</h2>
      </div>
      <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">액션 판정의 안정성과 고점을 높입니다. 숙련 수치는 액션 배율에 영향을 줍니다.</p>
      <div>
        {PROFICIENCY_NAMES.map(name => {
          const v = Number(proficiencies[name]) || 0;
          return (
            <Stepper
              key={name}
              name={name}
              value={v}
              cost={getProficiencyCost(v)}
              onChange={(nv) => update(name, nv)}
            />
          );
        })}
      </div>
    </div>
  );
}
