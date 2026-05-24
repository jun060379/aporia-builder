import { useState } from 'react';
import { STAT_NAMES } from '../data/stats';
import { ABILITY_NAMES } from '../data/abilities';
import { PROFICIENCY_NAMES } from '../data/proficiencies';
import { normalizeFormula } from '../utils/calcSkill';

function CopyBlock({ title, text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold text-slate-500 tracking-wide uppercase min-w-0 truncate">{title}</h3>
        <button
          onClick={handleCopy}
          className={`text-[11px] px-3 py-1 rounded-lg font-medium transition-all shrink-0 border ${
            copied
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
          }`}
        >
          {copied ? '복사됨 ✓' : '복사'}
        </button>
      </div>
      <pre className="bg-slate-800 rounded-xl text-xs text-slate-100 whitespace-pre-wrap overflow-x-auto leading-relaxed border border-slate-700 p-4 font-mono">
        {text}
      </pre>
    </div>
  );
}

function buildSkillText(sk) {
  const effectLines = (sk.effects ?? [])
    .filter(e => e.confirmed)
    .map(e => e.generatedText)
    .filter(Boolean);

  const effectBlock = effectLines.length > 0
    ? '효과:\n' + effectLines.join('\n')
    : '효과:\n없음';

  return [
    '!스킬신청',
    `이름: ${sk.name}`,
    `계통: ${sk.tradition}`,
    `계열: ${sk.series}`,
    `랭크: ${sk.rank}`,
    `계산식: ${normalizeFormula(sk.formula)}`,
    effectBlock,
    `조건: ${sk.condition}`,
    `대가: ${sk.cost}`,
    `설명: ${sk.description}`,
  ].join('\n');
}

export default function ApplicationText({ char, stats, abilities, proficiencies, skills }) {
  const charText = [
    '!캐릭터신청',
    `이름: ${char.name}`,
    `종족: ${char.race}`,
    ...STAT_NAMES.map(s => `${s}: ${stats[s]}`),
    ...ABILITY_NAMES.map(a => `${a}: ${abilities[a]}`),
    ...PROFICIENCY_NAMES.map(p => `${p}: ${proficiencies[p]}`),
    `이면침식: ${char.erosion || '0'}`,
  ].join('\n');

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-indigo-100/70 shadow-lg shadow-violet-100/20 p-5 space-y-5">
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-violet-300 font-mono tracking-widest">—</span>
        <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">신청 텍스트</h2>
      </div>

      <CopyBlock title="캐릭터 신청" text={charText} />

      {skills.length > 0 && (
        <div className="space-y-4">
          <div className="border-t border-slate-100 pt-1" />
          {skills.map(sk => (
            <CopyBlock
              key={sk.id}
              title={`${sk.name || '(이름 없음)'} · ${sk.tradition} · ${sk.series} · ${sk.rank}`}
              text={buildSkillText(sk)}
            />
          ))}
        </div>
      )}

      {skills.length === 0 && (
        <p className="text-xs text-slate-400 italic">스킬을 추가하면 스킬 신청 텍스트가 여기에 표시됩니다.</p>
      )}
    </div>
  );
}
