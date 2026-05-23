import { calcAllActions, getDifficultyLabel } from '../utils/calcAction';

const DIFF_COLOR_MAP = {
  '입문':   'text-slate-500',
  '보통':   'text-emerald-600',
  '어려움': 'text-cyan-600',
  '고난도': 'text-amber-600',
  '초월':   'text-violet-600',
  '예외적': 'text-rose-600',
};

function diffColor(label) {
  return DIFF_COLOR_MAP[label] ?? 'text-slate-500';
}

export default function ActionDetail({ stats, abilities, proficiencies }) {
  const actions = calcAllActions(stats, abilities, proficiencies);

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-indigo-100/70 shadow-lg shadow-violet-100/20 p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] text-violet-300 font-mono tracking-widest">—</span>
        <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">액션 상세</h2>
      </div>

      <div className="space-y-2">
        {actions.map(a => {
          const { base, multiplier, finalCoef, diceCount, expected } = a.result;
          const diff = getDifficultyLabel(expected);
          return (
            <div key={a.name} className="bg-slate-50 rounded-xl border border-slate-100 p-3 space-y-1.5 hover:border-violet-100 hover:bg-violet-50/30 transition-colors">
              <div className="flex justify-between items-center">
                <span className={`font-semibold text-sm ${a.isDamage ? 'text-rose-600' : 'text-indigo-600'}`}>
                  {a.name}
                </span>
                <span className={`text-xs font-semibold ${diffColor(diff.label)}`}>{diff.label}</span>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-slate-400 font-mono">
                <span>기초 {base.toFixed(1)}</span>
                <span>배율 ×{multiplier.toFixed(2)}</span>
                <span>계수 {finalCoef.toFixed(1)}</span>
                <span className="text-amber-600 font-semibold">{diceCount}d6 → {expected.toFixed(1)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
