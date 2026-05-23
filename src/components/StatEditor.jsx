import { STAT_NAMES, STAT_GRADES, getStatCost, getStatValue } from '../data/stats';

export default function StatEditor({ stats, onChange }) {
  const grades = STAT_GRADES.map(g => g.grade);

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-lg shadow-violet-100/20 p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] text-violet-300 font-mono tracking-widest">02</span>
        <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">스탯</h2>
      </div>

      <div className="space-y-3">
        {STAT_NAMES.map(name => (
          <div key={name} className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-slate-700 w-10 shrink-0 font-medium">{name}</span>
            <div className="flex gap-1 flex-wrap flex-1">
              {grades.map(g => (
                <button
                  key={g}
                  onClick={() => onChange({ ...stats, [name]: g })}
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold border transition-all duration-100 ${
                    stats[name] === g
                      ? 'bg-amber-400 text-white border-amber-400 shadow-sm shadow-amber-200/60'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-slate-400 shrink-0 w-24 text-right font-mono">
              {getStatValue(stats[name])} / {getStatCost(stats[name])}pt
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
