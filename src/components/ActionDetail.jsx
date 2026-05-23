import { calcAllActions, getDifficultyLabel } from '../utils/calcAction';

const DIFF_COLOR_MAP = {
  '입문':   'text-slate-400',
  '보통':   'text-emerald-400',
  '어려움': 'text-cyan-300',
  '고난도': 'text-amber-300',
  '초월':   'text-violet-300',
  '예외적': 'text-rose-300',
};

function diffColor(label) {
  return DIFF_COLOR_MAP[label] ?? 'text-slate-400';
}

export default function ActionDetail({ stats, abilities, proficiencies }) {
  const actions = calcAllActions(stats, abilities, proficiencies);

  return (
    <div className="bg-slate-900/70 backdrop-blur-sm rounded-2xl border border-white/10 p-5 shadow-xl shadow-black/30">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] text-slate-600 font-mono tracking-widest">—</span>
        <h2 className="text-sm font-semibold text-slate-300 tracking-wide uppercase">액션 상세</h2>
      </div>

      <div className="space-y-2">
        {actions.map(a => {
          const { base, multiplier, finalCoef, diceCount, expected } = a.result;
          const diff = getDifficultyLabel(expected);
          return (
            <div key={a.name} className="bg-slate-800/40 rounded-xl border border-white/6 p-3 space-y-1.5 hover:border-white/10 transition-colors">
              <div className="flex justify-between items-center">
                <span className={`font-semibold text-sm ${a.isDamage ? 'text-rose-300' : 'text-sky-300'}`}>
                  {a.name}
                </span>
                <span className={`text-xs font-semibold ${diffColor(diff.label)}`}>{diff.label}</span>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-slate-500 font-mono">
                <span>기초 {base.toFixed(1)}</span>
                <span>배율 ×{multiplier.toFixed(2)}</span>
                <span>계수 {finalCoef.toFixed(1)}</span>
                <span className="text-amber-300/70 font-semibold">{diceCount}d6 → {expected.toFixed(1)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
