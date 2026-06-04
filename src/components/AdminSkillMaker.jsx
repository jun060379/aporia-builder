import { useState } from 'react';
import SkillMaker from './SkillMaker';
import { buildSkillText, buildPassiveText } from '../utils/applicationText';
import { STAT_NAMES } from '../data/stats';
import { ABILITY_NAMES } from '../data/abilities';
import { PROFICIENCY_NAMES } from '../data/proficiencies';

// 미리보기용 기본 스탯(스탯 10 / 기능·숙련 5) — 운영자 도구는 특정 캐릭터 컨텍스트가 없음.
const PREVIEW_STATS = Object.fromEntries(STAT_NAMES.map((n) => [n, 10]));
const PREVIEW_ABILITIES = Object.fromEntries(ABILITY_NAMES.map((n) => [n, 5]));
const PREVIEW_PROFICIENCIES = Object.fromEntries(PROFICIENCY_NAMES.map((n) => [n, 5]));

const inputCls = 'w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 outline-none placeholder:text-slate-400 transition-colors';

function CopyBlock({ title, text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-600">{title}</span>
        <button onClick={copy} className="shrink-0 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors">
          {copied ? '복사됨!' : '복사'}
        </button>
      </div>
      <pre className="bg-slate-800 text-slate-100 rounded-xl p-3 text-[11px] font-mono break-all whitespace-pre-wrap overflow-x-auto leading-relaxed">
        {text}
      </pre>
    </div>
  );
}

export default function AdminSkillMaker() {
  const [owner, setOwner] = useState('');
  const [skillText, setSkillText] = useState('');
  const [passiveText, setPassiveText] = useState('');

  const handleSaveSkill = (skill) => {
    const ownerLine = owner.trim() ? `소유자: ${owner.trim()}\n` : '';
    setSkillText(ownerLine + buildSkillText(skill));
    setPassiveText('');
  };
  const handleSavePassive = (p) => {
    setPassiveText(buildPassiveText(p));
    setSkillText('');
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 text-[11px] text-indigo-900 leading-relaxed">
        <p className="font-semibold text-indigo-700 mb-0.5">스킬 · 패시브 제작기 (운영자)</p>
        <p>풀 에디터로 직접 제작합니다. 작성 후 "스킬 추가/패시브 추가"를 누르면 등록용 신청텍스트가 아래에 생성됩니다.</p>
      </div>

      <label className="flex flex-col gap-1 max-w-sm">
        <span className="text-[11px] text-slate-500">소유자 (캐릭터 별명) — 스킬 등록 시</span>
        <input className={inputCls} value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="예: 호시노 스바루" />
      </label>

      <SkillMaker
        stats={PREVIEW_STATS}
        abilities={PREVIEW_ABILITIES}
        proficiencies={PREVIEW_PROFICIENCIES}
        onSave={handleSaveSkill}
        onCancel={() => {}}
        onSavePassive={handleSavePassive}
        onUpdatePassive={handleSavePassive}
        onCancelPassiveEdit={() => {}}
      />

      {skillText && <CopyBlock title="스킬 신청텍스트" text={skillText} />}
      {passiveText && <CopyBlock title="패시브 등록텍스트 / TSV" text={passiveText} />}
    </div>
  );
}
