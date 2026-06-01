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

const ACTION_CATEGORIES = [
  { label: '피해 액션', accent: 'rose',   names: ['참격', '관통', '타격', '격투', '사격'] },
  { label: '대응 액션', accent: 'indigo', names: ['방어', '회피', '저항'] },
  { label: '탐색 액션', accent: 'teal',   names: ['조사', '해석', '은신', '추적'] },
  { label: '사회 액션', accent: 'violet', names: ['설득', '기만', '협박'] },
];

const ACCENT = {
  rose:   { title: 'text-rose-500',   divider: 'border-rose-100' },
  indigo: { title: 'text-indigo-500', divider: 'border-indigo-100' },
  teal:   { title: 'text-teal-500',   divider: 'border-teal-100' },
  violet: { title: 'text-violet-500', divider: 'border-violet-100' },
};

function Section({ category, actions }) {
  const catActions = category.names
    .map(n => actions.find(a => a.name === n))
    .filter(Boolean);
  if (!catActions.length) return null;

  const { title: titleCls, divider: dividerCls } = ACCENT[category.accent] ?? ACCENT.indigo;

  return (
    <div>
      <div className={`flex items-center gap-2 mb-2 pb-1.5 border-b ${dividerCls}`}>
        <h3 className={`text-xs font-semibold tracking-widest uppercase ${titleCls}`}>{category.label}</h3>
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
            {catActions.map(a => {
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

export default function ActionTable({ stats, abilities, proficiencies }) {
  const actions = calcAllActions(stats, abilities, proficiencies);

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-indigo-100/70 shadow-lg shadow-violet-100/20 p-5">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-[10px] text-violet-300 font-mono tracking-widest">—</span>
        <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">액션 계산</h2>
      </div>
      <div className="space-y-5">
        {ACTION_CATEGORIES.map(cat => (
          <Section key={cat.label} category={cat} actions={actions} />
        ))}
      </div>
    </div>
  );
}
