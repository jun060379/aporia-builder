import { useMemo, useState } from 'react';
import ConditionEditor from './ConditionEditor.jsx';
import EffectRowsEditor from './EffectRowsEditor.jsx';
import { SKILL_TRADITIONS, SKILL_SERIES, SKILL_RANKS } from '../data/skillRanks';
import {
  COMMON_SKILL_TYPES,
  COMMON_UNLOCK_LEVELS,
  COMMON_TARGET_SPECS,
  COMMON_SPECIES_OPTIONS,
  COMMON_SKILL_FACTIONS,
  COMMON_SKILLS_HEADERS,
  defaultCommonSkill,
  buildCommonSkillTSV,
  buildCommonSkillPreview,
  validateCommonSkill,
} from '../data/commonSkills';
import { validateFormula, validateFormulaStructure, previewFormula } from '../utils/calcSkill';
import { STAT_NAMES } from '../data/stats';
import { ABILITY_NAMES } from '../data/abilities';
import { PROFICIENCY_NAMES } from '../data/proficiencies';
import FormulaBlockModal from './FormulaBlockModal';
import CostEditor from './CostEditor.jsx';

const inputCls = "w-full min-w-0 bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 outline-none placeholder:text-slate-400 transition-colors";
const selectCls = "w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:border-violet-400 outline-none transition-colors";

const FORMULA_CATEGORIES = [
  { id: '기본',     tokens: ['d6', 'd20', '2d6', 'd100', '랭크'] },
  { id: '스탯',     tokens: STAT_NAMES },
  { id: '기능',     tokens: ABILITY_NAMES },
  { id: '숙련',     tokens: PROFICIENCY_NAMES },
  { id: '상태/스택', tokens: ['상태_출혈_수치', '대상상태_출혈_수치', '스택_혈인', '대상스택_표식'] },
  { id: '고급',     tokens: ['현재체력', '최대체력', '이면침식', '일상점'] },
];

const PREVIEW_STATS = { 근력: 10, 민첩: 10, 내구: 10, 감각: 10, 지능: 10 };
const PREVIEW_ABILITIES = Object.fromEntries(ABILITY_NAMES.map((n) => [n, 5]));
const PREVIEW_PROFICIENCIES = Object.fromEntries(PROFICIENCY_NAMES.map((n) => [n, 5]));

export default function CommonSkillMaker() {
  const [skill, setSkill] = useState(() => defaultCommonSkill());
  const [formulaCat, setFormulaCat] = useState('기본');
  const [formulaModalOpen, setFormulaModalOpen] = useState(false);
  const [copyMsg, setCopyMsg] = useState('');

  const field = (key) => (e) => setSkill((s) => ({ ...s, [key]: e.target.value }));
  const setVal = (key, v) => setSkill((s) => ({ ...s, [key]: v }));

  const insertFormula = (token) => {
    setSkill((s) => {
      const prev = s.formula;
      const sep = prev.length > 0 && !prev.endsWith(' ') ? ' ' : '';
      return { ...s, formula: prev + sep + token };
    });
    setFormulaModalOpen(false);
  };

  const appendOperator = (op) => setSkill((s) => ({ ...s, formula: s.formula + ` ${op} ` }));

  const tokenErrors = validateFormula(skill.formula);
  const structureWarns = validateFormulaStructure(skill.formula);
  const validationErrors = useMemo(() => validateCommonSkill(skill), [skill]);
  const tsv = useMemo(() => buildCommonSkillTSV(skill), [skill]);
  const preview = useMemo(() => buildCommonSkillPreview(skill), [skill]);
  const formulaPreview = useMemo(() => {
    if (!skill.formula.trim()) return null;
    return previewFormula(skill.formula, PREVIEW_STATS, skill.rank, {}, PREVIEW_ABILITIES, PREVIEW_PROFICIENCIES);
  }, [skill.formula, skill.rank]);

  const copy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMsg(`${label} 복사됨`);
    } catch {
      setCopyMsg('복사 실패 — 직접 선택하세요');
    }
    setTimeout(() => setCopyMsg(''), 1800);
  };

  const reset = () => setSkill(defaultCommonSkill());

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-lg shadow-violet-100/20 p-5 space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] text-violet-300 font-mono tracking-widest">ADMIN</span>
          <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">공용 스킬 제작기</h2>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          COMMON_SKILLS 시트에 붙여넣을 행을 만듭니다. TSV/미리보기를 복사한 뒤 구글시트에 직접 추가하세요.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">key (식별자)</span>
          <input className={inputCls} value={skill.key} onChange={field('key')} placeholder="clock_magic_bullet" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">이름</span>
          <input className={inputCls} value={skill.name} onChange={field('name')} placeholder="마탄" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">유형</span>
          <select className={selectCls} value={skill.type} onChange={field('type')}>
            {COMMON_SKILL_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">해금레벨</span>
          <select className={selectCls} value={skill.unlockLevel} onChange={(e) => setVal('unlockLevel', Number(e.target.value))}>
            {COMMON_UNLOCK_LEVELS.map((lv) => <option key={lv} value={lv}>Lv.{lv}</option>)}
          </select>
        </label>
      </div>

      {skill.type === 'faction' && (
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">소속</span>
          <select className={selectCls} value={skill.faction} onChange={field('faction')}>
            <option value="">(선택)</option>
            {COMMON_SKILL_FACTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </label>
      )}

      {skill.type === 'species' && (
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">종족</span>
          <select className={selectCls} value={skill.species} onChange={field('species')}>
            <option value="">(선택)</option>
            {COMMON_SPECIES_OPTIONS.map((sp) => <option key={sp} value={sp}>{sp}</option>)}
          </select>
        </label>
      )}

      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">계통</span>
          <select className={selectCls} value={skill.tradition} onChange={field('tradition')}>
            {SKILL_TRADITIONS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">계열</span>
          <select className={selectCls} value={skill.series} onChange={field('series')}>
            {SKILL_SERIES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>

      <div className="space-y-1.5">
        <span className="text-[11px] text-slate-500 tracking-wide">랭크</span>
        <div className="flex flex-wrap gap-1">
          {SKILL_RANKS.map(({ rank, value }) => (
            <button
              key={rank}
              onClick={() => setVal('rank', rank)}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold border transition-all ${
                skill.rank === rank
                  ? 'bg-amber-400 text-white border-amber-400'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-amber-300'
              }`}
            >
              {rank} <span className="opacity-50 font-normal">({value})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 bg-slate-50 rounded-xl border border-slate-200 p-4">
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">계산식</span>
        <input
          className={`${inputCls}${tokenErrors.length + structureWarns.length > 0 ? ' border-amber-400' : ''}`}
          value={skill.formula}
          onChange={field('formula')}
          placeholder="예: d20 + 랭크 + 지능 + 이면학"
        />
        {[...tokenErrors, ...structureWarns].map((e, i) => (
          <p key={i} className="text-xs text-amber-600">⚠ {e}</p>
        ))}
        <div className="space-y-2">
          <p className="text-[10px] text-slate-400 tracking-widest uppercase">빠른 삽입</p>
          <div className="flex flex-wrap gap-1">
            {FORMULA_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFormulaCat(cat.id)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-medium border ${
                  formulaCat === cat.id
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-violet-300'
                }`}
              >
                {cat.id}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {FORMULA_CATEGORIES.find((c) => c.id === formulaCat)?.tokens.map((token) => (
              <button
                key={token}
                onClick={() => insertFormula(token)}
                className="px-2 py-1 bg-white border border-slate-200 hover:border-violet-300 text-slate-600 rounded-lg text-[11px] font-mono"
              >
                {token}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['+', '-', '*', '/', '(', ')'].map((op) => (
              <button
                key={op}
                onClick={() => appendOperator(op)}
                className="min-w-[2.25rem] px-2 py-1 bg-white border border-slate-200 text-slate-700 font-mono rounded-lg text-sm"
              >
                {op}
              </button>
            ))}
            <button
              onClick={() => setFormulaModalOpen(true)}
              className="text-[11px] px-2.5 py-1 bg-white border border-dashed border-slate-300 text-slate-400 rounded-lg"
            >
              + 고급 블럭
            </button>
          </div>
        </div>
        {formulaPreview && formulaPreview.value !== null && (
          <p className="text-xs text-emerald-700">
            기대값(스탯 10, 기능/숙련 5 가정): <span className="font-bold">{formulaPreview.value}</span>
          </p>
        )}
      </div>

      <div className="space-y-1">
        <span className="text-[11px] text-slate-500 tracking-wide">효과</span>
        <EffectRowsEditor
          value={skill.효과}
          onChange={(v) => setSkill((s) => ({ ...s, 효과: v }))}
        />
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] text-slate-500 tracking-wide">대상</span>
        <select className={selectCls} value={skill.target} onChange={field('target')}>
          {COMMON_TARGET_SPECS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </label>

      <div className="space-y-1">
        <span className="text-[11px] text-slate-500 tracking-wide">조건</span>
        <ConditionEditor
          value={skill.condition}
          onChange={(v) => setSkill((s) => ({ ...s, condition: v }))}
        />
      </div>

      <div className="space-y-1.5">
        <span className="text-[11px] text-slate-500 tracking-wide">대가</span>
        <CostEditor value={skill.cost} onChange={(v) => setSkill((s) => ({ ...s, cost: v }))} />
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] text-slate-500 tracking-wide">설명</span>
        <textarea className={`${inputCls} h-16 resize-none`} value={skill.description} onChange={field('description')} placeholder="스킬 설명" />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] text-slate-500 tracking-wide">메모 (운영자용)</span>
        <textarea className={`${inputCls} h-12 resize-none`} value={skill.memo} onChange={field('memo')} placeholder="운영자용 메모" />
      </label>

      {validationErrors.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
          <p className="text-[10px] text-amber-600 font-semibold uppercase tracking-widest">검증 오류</p>
          {validationErrors.map((e, i) => (
            <p key={i} className="text-xs text-amber-700">⚠ {e}</p>
          ))}
        </div>
      )}

      <div className="space-y-2 bg-slate-50 rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">출력</span>
          {copyMsg && <span className="text-[11px] text-emerald-600">{copyMsg}</span>}
        </div>
        <p className="text-[10px] text-slate-400">시트 헤더: <span className="font-mono break-all">{COMMON_SKILLS_HEADERS.join(' / ')}</span></p>
        <div>
          <p className="text-[10px] text-slate-400 tracking-widest uppercase mb-1">TSV (시트 한 줄)</p>
          <pre className="bg-white text-slate-700 rounded-lg border border-slate-200 p-2 text-[11px] font-mono whitespace-pre-wrap break-all max-h-32 overflow-y-auto">{tsv}</pre>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 tracking-widest uppercase mb-1">미리보기</p>
          <pre className="bg-white text-slate-700 rounded-lg border border-slate-200 p-2 text-[11px] font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">{preview}</pre>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => copy(tsv, 'TSV')}
            disabled={validationErrors.length > 0}
            className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            TSV 복사
          </button>
          <button
            onClick={() => copy(preview, '미리보기')}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium"
          >
            미리보기 복사
          </button>
          <button
            onClick={reset}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 rounded-lg text-xs font-medium ml-auto"
          >
            초기화
          </button>
        </div>
      </div>

      {formulaModalOpen && (
        <FormulaBlockModal onInsert={insertFormula} onClose={() => setFormulaModalOpen(false)} />
      )}
    </div>
  );
}
