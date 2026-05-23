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

export default function ActionTable({ stats, abilities, proficiencies }) {
  const actions = calcAllActions(stats, abilities, proficiencies);
  const damage = actions.filter(a => a.isDamage);
  const other  = actions.filter(a => !a.isDamage);

  return (
    <div className="bg-slate-900/70 backdrop-blur-sm rounded-2xl border border-white/10 p-5 shadow-xl shadow-black/30">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-[10px] text-slate-600 font-mono tracking-widest">—</span>
        <h2 className="text-sm font-semibold text-slate-300 tracking-wide uppercase">액션 계산</h2>
      </div>
      <div className="space-y-5">
        <Section title="피해 액션" accent="rose" actions={damage} />
        <Section title="비피해 액션" accent="sky" actions={other} />
      </div>
    </div>
  );
}

function Section({ title, accent, actions }) {
  const accentCls = accent === 'rose' ? 'text-rose-300/70 border-rose-500/20' : 'text-sky-300/70 border-sky-500/20';
  return (
    <div>
      <div className={`flex items-center gap-2 mb-2 pb-1.5 border-b ${accentCls}`}>
        <h3 className={`text-xs font-semibold tracking-widest uppercase ${accentCls.split(' ')[0]}`}>{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] text-slate-600 uppercase tracking-wider">
              <th className="text-left py-1.5 pr-3 font-medium">액션</th>
              <th className="text-right py-1.5 pr-3 font-medium">주사위</th>
              <th className="text-right py-1.5 pr-3 font-medium">기대값</th>
              <th className="text-right py-1.5 font-medium">난이도</th>
            </tr>
          </thead>
          <tbody>
            {actions.map(a => {
              const { diceCount, expected } = a.result;
              const diff = getDifficultyLabel(expected);
              return (
                <tr key={a.name} className="border-t border-white/5 hover:bg-white/3 transition-colors">
                  <td className="py-2 pr-3 text-slate-200 font-medium">{a.name}</td>
                  <td className="py-2 pr-3 text-right text-slate-400 font-mono text-xs">{diceCount}d6</td>
                  <td className="py-2 pr-3 text-right text-slate-300 font-mono">{expected.toFixed(1)}</td>
                  <td className={`py-2 text-right font-semibold text-xs ${diffColor(diff.label)}`}>{diff.label}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
