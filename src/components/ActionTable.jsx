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

export default function ActionTable({ stats, abilities, proficiencies }) {
  const actions = calcAllActions(stats, abilities, proficiencies);
  const damage = actions.filter(a => a.isDamage);
  const other  = actions.filter(a => !a.isDamage);

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-indigo-100/70 shadow-lg shadow-violet-100/20 p-5">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-[10px] text-violet-300 font-mono tracking-widest">—</span>
        <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">액션 계산</h2>
      </div>
      <div className="space-y-5">
        <Section title="피해 액션" accent="rose" actions={damage} />
        <Section title="비피해 액션" accent="indigo" actions={other} />
      </div>
    </div>
  );
}

function Section({ title, accent, actions }) {
  const titleCls = accent === 'rose' ? 'text-rose-500' : 'text-indigo-500';
  const dividerCls = accent === 'rose' ? 'border-rose-100' : 'border-indigo-100';

  return (
    <div>
      <div className={`flex items-center gap-2 mb-2 pb-1.5 border-b ${dividerCls}`}>
        <h3 className={`text-xs font-semibold tracking-widest uppercase ${titleCls}`}>{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] text-slate-400 uppercase tracking-wider">
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
                <tr key={a.name} className="border-t border-slate-100 hover:bg-violet-50/60 transition-colors">
                  <td className="py-2 pr-3 text-slate-800 font-medium">{a.name}</td>
                  <td className="py-2 pr-3 text-right text-slate-500 font-mono text-xs">{diceCount}d6</td>
                  <td className="py-2 pr-3 text-right text-slate-600 font-mono">{expected.toFixed(1)}</td>
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
