import { STAT_NAMES, STAT_GRADES, getStatCost, getStatValue } from '../data/stats';

export default function StatEditor({ stats, onChange }) {
  const grades = STAT_GRADES.map(g => g.grade);

  return (
    <div className="bg-slate-900/70 backdrop-blur-sm rounded-2xl border border-white/10 p-5 shadow-xl shadow-black/30">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] text-slate-600 font-mono tracking-widest">02</span>
        <h2 className="text-sm font-semibold text-slate-300 tracking-wide uppercase">스탯</h2>
      </div>

      <div className="space-y-3">
        {STAT_NAMES.map(name => (
          <div key={name} className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-slate-300 w-10 shrink-0 font-medium">{name}</span>
            <div className="flex gap-1 flex-wrap flex-1">
              {grades.map(g => (
                <button
                  key={g}
                  onClick={() => onChange({ ...stats, [name]: g })}
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold border transition-all duration-100 ${
                    stats[name] === g
                      ? 'bg-amber-400/80 text-slate-900 border-amber-400/60 shadow-sm shadow-amber-400/20'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:border-amber-400/40 hover:text-slate-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-slate-600 shrink-0 w-24 text-right font-mono">
              {getStatValue(stats[name])} / {getStatCost(stats[name])}pt
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
