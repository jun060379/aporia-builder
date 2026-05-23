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
        <h3 className="text-sm font-semibold text-gray-300 min-w-0 truncate">{title}</h3>
        <button
          onClick={handleCopy}
          className={`text-xs px-3 py-1 rounded font-medium transition-colors shrink-0 ${copied ? 'bg-green-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'}`}
        >
          {copied ? '복사됨!' : '복사'}
        </button>
      </div>
      <pre className="bg-gray-900 rounded p-3 text-xs text-gray-300 whitespace-pre-wrap overflow-x-auto leading-relaxed border border-gray-700">
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
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <h2 className="text-lg font-bold text-yellow-400">신청 텍스트</h2>
      <CopyBlock title="캐릭터 신청" text={charText} />
      {skills.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-400 border-t border-gray-700 pt-3">스킬 신청</h3>
          {skills.map(sk => (
            <CopyBlock
              key={sk.id}
              title={`${sk.name || '(이름 없음)'} [${sk.tradition}·${sk.series}·${sk.rank}]`}
              text={buildSkillText(sk)}
            />
          ))}
        </div>
      )}
      {skills.length === 0 && (
        <p className="text-xs text-gray-500">스킬을 추가하면 스킬 신청 텍스트가 여기에 표시됩니다.</p>
      )}
    </div>
  );
}
