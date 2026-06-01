import { useState } from 'react';
import { calcAllActions, getDifficultyLabel } from '../utils/calcAction';
import { getStatValue } from '../data/stats';

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

function fmt(n) {
  return n % 1 === 0 ? String(n) : n.toFixed(1);
}

function buildFormulaString(action) {
  const baseParts = action.base.map(({ stat, coef }) =>
    coef === 1 ? stat : `${stat} × ${coef}`
  );
  const baseStr = action.base.length > 1 ? `(${baseParts.join(' + ')})` : baseParts[0];
  const multParts = action.mult.map(({ key, coef }) => `${key} × ${coef}`);
  return `${baseStr} × (1 + ${multParts.join(' + ')})`;
}

function getKeyVal(key, abilities, proficiencies) {
  if (key.endsWith('숙련')) return proficiencies[key] ?? 0;
  return abilities[key] ?? 0;
}

function FormulaCard({ action, stats, abilities, proficiencies }) {
  const baseLines = action.base.map(({ stat, coef }) => {
    const grade = stats[stat] ?? 'E';
    const val = getStatValue(grade);
    const contrib = val * coef;
    return { stat, grade, val, coef, contrib };
  });
  const baseTotal = baseLines.reduce((s, l) => s + l.contrib, 0);

  const multLines = action.mult.map(({ key, coef }) => {
    const val = getKeyVal(key, abilities, proficiencies);
    const contrib = val * coef;
    return { key, val, coef, contrib };
  });
  const multTotal = 1 + multLines.reduce((s, l) => s + l.contrib, 0);
  const finalCoef = baseTotal * multTotal;
  const diceCount = Math.max(1, Math.ceil(finalCoef / 5));
  const expected = diceCount * 3.5;

  return (
    <div className="mt-2.5 space-y-2 text-xs">
      {/* 기초부 */}
      <div className="bg-amber-50 rounded-xl border border-amber-100 p-3">
        <p className="text-[10px] text-amber-500 font-semibold uppercase tracking-widest mb-2">기초부</p>
        <div className="space-y-1 font-mono">
          {baseLines.map(({ stat, grade, val, coef, contrib }) => (
            <div key={stat} className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-slate-600 break-all">
                {stat} <span className="text-amber-600">{grade}({val})</span> × {coef}
              </span>
              <span className="text-slate-700 font-semibold shrink-0">= {fmt(contrib)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between gap-2 border-t border-amber-200 pt-1 mt-1">
            <span className="text-amber-700 font-semibold">기초부 합계</span>
            <span className="text-amber-700 font-bold">= {baseTotal.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* 배율부 */}
      <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-3">
        <p className="text-[10px] text-indigo-500 font-semibold uppercase tracking-widest mb-2">배율부</p>
        <div className="space-y-1 font-mono">
          {multLines.map(({ key, val, coef, contrib }) => (
            <div key={key} className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-slate-600 break-all">{key} {val} × {coef}</span>
              <span className="text-slate-700 font-semibold shrink-0">= {contrib === 0 ? '0' : contrib.toFixed(3)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between gap-2 border-t border-indigo-200 pt-1 mt-1">
            <span className="text-indigo-700 font-semibold">배율부 합계</span>
            <span className="text-indigo-700 font-bold">= ×{multTotal.toFixed(3)}</span>
          </div>
        </div>
      </div>

      {/* 공식 */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-3">
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-1.5">공식</p>
        <p className="font-mono text-slate-600 text-[11px] break-words leading-relaxed">
          {buildFormulaString(action)}
        </p>
      </div>

      {/* 최종 계산 */}
      <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-3 font-mono space-y-1">
        <p className="text-[10px] text-emerald-500 font-semibold uppercase tracking-widest mb-1.5">최종 계산</p>
        <div className="flex justify-between gap-2">
          <span className="text-slate-500">최종계수</span>
          <span className="text-slate-700">= {finalCoef.toFixed(2)}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-slate-500">주사위</span>
          <span className="text-slate-700">= ceil({finalCoef.toFixed(2)} / 5) = {diceCount}d6</span>
        </div>
        <div className="flex justify-between gap-2 border-t border-emerald-200 pt-1 mt-1">
          <span className="text-emerald-700 font-semibold">기대값</span>
          <span className="text-amber-600 font-bold">= {diceCount} × 3.5 = {expected.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

function ActionCard({ action, isOpen, onToggle, stats, abilities, proficiencies }) {
  const { base, multiplier, finalCoef, diceCount, expected } = action.result;
  const diff = getDifficultyLabel(expected);

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden hover:border-violet-100 transition-colors">
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="min-w-0">
            <span className={`font-semibold text-sm ${action.isDamage ? 'text-rose-600' : 'text-indigo-600'}`}>
              {action.name}
            </span>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-slate-400 font-mono mt-1">
              <span>기초 {base.toFixed(1)}</span>
              <span>배율 ×{multiplier.toFixed(2)}</span>
              <span>계수 {finalCoef.toFixed(1)}</span>
              <span className="text-amber-600 font-semibold">{diceCount}d6 → {expected.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs font-semibold ${diffColor(diff.label)}`}>{diff.label}</span>
            <button
              onClick={onToggle}
              className={`text-[11px] px-2 py-0.5 rounded-lg border font-medium transition-colors whitespace-nowrap ${
                isOpen
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {isOpen ? '닫기 ▴' : '계산식 ▾'}
            </button>
          </div>
        </div>

        {isOpen && (
          <FormulaCard
            action={action}
            stats={stats}
            abilities={abilities}
            proficiencies={proficiencies}
          />
        )}
      </div>
    </div>
  );
}

export default function ActionDetail({ stats, abilities, proficiencies }) {
  const actions = calcAllActions(stats, abilities, proficiencies);
  const actionMap = Object.fromEntries(actions.map(a => [a.name, a]));
  const [openSet, setOpenSet] = useState(new Set());

  const toggle = (name) => setOpenSet(prev => {
    const next = new Set(prev);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    return next;
  });

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-indigo-100/70 shadow-lg shadow-violet-100/20 p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] text-violet-300 font-mono tracking-widest">—</span>
        <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">액션 상세</h2>
      </div>
      <p className="text-[11px] text-slate-500 mb-4 leading-relaxed bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
        스탯은 기초부에 영향을 줍니다. 기능과 숙련은 배율부에 영향을 줍니다. 숙련은 특정 액션의 전문성을 가장 강하게 반영합니다.
      </p>

      <div className="space-y-5">
        {ACTION_CATEGORIES.map(cat => {
          const catActions = cat.names.map(n => actionMap[n]).filter(Boolean);
          if (!catActions.length) return null;
          const { title: titleCls, divider: dividerCls } = ACCENT[cat.accent] ?? ACCENT.indigo;

          return (
            <div key={cat.label}>
              <div className={`flex items-center gap-2 mb-2 pb-1.5 border-b ${dividerCls}`}>
                <h3 className={`text-xs font-semibold tracking-widest uppercase ${titleCls}`}>{cat.label}</h3>
              </div>
              <div className="space-y-1.5">
                {catActions.map(a => (
                  <ActionCard
                    key={a.name}
                    action={a}
                    isOpen={openSet.has(a.name)}
                    onToggle={() => toggle(a.name)}
                    stats={stats}
                    abilities={abilities}
                    proficiencies={proficiencies}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
