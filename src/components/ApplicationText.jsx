import { useState } from 'react';
import { STAT_NAMES } from '../data/stats';
import { ABILITY_NAMES } from '../data/abilities';
import { PROFICIENCY_NAMES } from '../data/proficiencies';

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
        <h3 className="text-xs font-semibold text-slate-400 tracking-wide uppercase min-w-0 truncate">{title}</h3>
        <button
          onClick={handleCopy}
          className={`text-[11px] px-3 py-1 rounded-lg font-medium transition-all shrink-0 border ${
            copied
              ? 'bg-emerald-900/40 text-emerald-300 border-emerald-800/40'
              : 'bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 border-slate-700/50'
          }`}
        >
          {copied ? '복사됨 ✓' : '복사'}
        </button>
      </div>
      <pre className="bg-slate-950/80 rounded-xl text-xs text-cyan-100/80 whitespace-pre-wrap overflow-x-auto leading-relaxed border border-cyan-900/30 p-4 font-mono">
        {text}
      </pre>
    </div>
  );
}

function buildSkillText(sk) {
  const effectLines = (sk.effects ?? [])
    .map(e => e.generatedText)
    .filter(Boolean);
  const effectBlock = effectLines.length > 0
    ? '효과:\n' + effectLines.join('\n')
    : '효과:';

  return [
    '!스킬신청',
    `이름: ${sk.name}`,
    `계통: ${sk.tradition}`,
    `계열: ${sk.series}`,
    `랭크: ${sk.rank}`,
    `계산식: ${sk.formula}`,
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
    `경험치: ${char.exp}`,
    ...STAT_NAMES.map(s => `${s}: ${stats[s]}`),
    ...ABILITY_NAMES.map(a => `${a}: ${abilities[a]}`),
    ...PROFICIENCY_NAMES.map(p => `${p}: ${proficiencies[p]}`),
    `일상점: ${char.dailyPoints}`,
    `이면침식: ${char.erosion}`,
  ].join('\n');

  return (
    <div className="bg-slate-900/70 backdrop-blur-sm rounded-2xl border border-white/10 p-5 shadow-xl shadow-black/30 space-y-5">
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-slate-600 font-mono tracking-widest">—</span>
        <h2 className="text-sm font-semibold text-slate-300 tracking-wide uppercase">신청 텍스트</h2>
      </div>

      <CopyBlock title="캐릭터 신청" text={charText} />

      {skills.length > 0 && (
        <div className="space-y-4">
          <div className="border-t border-white/8 pt-1" />
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
        <p className="text-xs text-slate-600 italic">스킬을 추가하면 스킬 신청 텍스트가 여기에 표시됩니다.</p>
      )}
    </div>
  );
}
