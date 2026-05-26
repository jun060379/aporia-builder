import { useState, useEffect } from 'react';
import { SKILL_TRADITIONS, SKILL_SERIES, SKILL_RANKS, defaultSkill, makeEffect } from '../data/skillRanks';
import {
  validateFormula,
  validateFormulaStructure,
  previewFormula,
  hasTargetReference,
  getEffectWarnings,
} from '../utils/calcSkill';
import { STAT_NAMES } from '../data/stats';
import { ABILITY_NAMES } from '../data/abilities';
import { PROFICIENCY_NAMES } from '../data/proficiencies';
import FormulaBlockModal from './FormulaBlockModal';
import EffectBlockModal from './EffectBlockModal';

const EFFECT_TYPE_LABEL = {
  template:     '상태 템플릿 부여',
  custom:       '커스텀 상태 부여',
  statusRemove: '상태 해제',
  stack:        '스택 변경',
  free:         '자유 입력',
};

const OPERATORS = [
  { op: '+', label: '+', tip: '더하기' },
  { op: '-', label: '-', tip: '빼기' },
  { op: '*', label: '*', tip: '곱하기' },
  { op: '/', label: '/', tip: '나누기' },
  { op: '(',  label: '(',  tip: '묶음 시작' },
  { op: ')',  label: ')',  tip: '묶음 끝' },
];

const QUICK_COMBOS = [
  { label: '기본 공격식',       formula: 'd20 + 랭크 + 근력' },
  { label: '민첩 공격식',       formula: 'd20 + 랭크 + 민첩' },
  { label: '감각 공격식',       formula: 'd20 + 랭크 + 감각' },
  { label: '지능 판정식',       formula: 'd20 + 랭크 + 지능' },
  { label: '스택 강화식',       formula: 'd20 + 랭크 + 스택_이름 * 2' },
  { label: '대상 상태 강화식',  formula: 'd20 + 랭크 + 대상상태_상태_수치 * 2' },
];

const FORMULA_CATEGORIES = [
  { id: '기본',     tokens: ['d6', 'd20', '2d6', 'd100', '랭크'] },
  { id: '스탯',     tokens: STAT_NAMES },
  { id: '기능',     tokens: ABILITY_NAMES },
  { id: '숙련',     tokens: PROFICIENCY_NAMES },
  { id: '상태/스택', tokens: ['상태_출혈_수치', '대상상태_출혈_수치', '스택_혈인', '대상스택_표식'] },
  { id: '고급',     tokens: ['현재체력', '최대체력', '이면침식', '일상점'] },
];

const inputCls = "w-full min-w-0 bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 outline-none placeholder:text-slate-400 transition-colors";
const selectCls = "w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:border-violet-400 outline-none transition-colors";

function FormulaPreview({ formula, stats, rank, abilities, proficiencies }) {
  if (!formula.trim()) return null;
  const base = previewFormula(formula, stats, rank, {}, abilities, proficiencies);
  const hasDbVar = /이면침식/.test(formula);
  const 침식0 = hasDbVar ? previewFormula(formula, stats, rank, { 이면침식: 0 }, abilities, proficiencies) : null;
  const 침식6 = hasDbVar ? previewFormula(formula, stats, rank, { 이면침식: 6 }, abilities, proficiencies) : null;
  const 침식9 = hasDbVar ? previewFormula(formula, stats, rank, { 이면침식: 9 }, abilities, proficiencies) : null;
  const show = base.value !== null || base.warnings.length > 0;
  if (!show) return null;

  return (
    <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-3 space-y-2">
      <p className="text-[10px] text-indigo-400 uppercase tracking-widest">계산 미리보기</p>
      {hasDbVar ? (
        <div className="grid grid-cols-3 gap-2">
          {[[침식0, '침식 0'], [침식6, '침식 6'], [침식9, '침식 9']].map(([res, lbl]) => (
            <div key={lbl} className="bg-white rounded-lg p-2 text-center border border-indigo-100">
              <p className="text-[10px] text-slate-400 mb-0.5">{lbl}</p>
              <p className={`text-sm font-bold ${res?.value !== null ? 'text-emerald-600' : 'text-rose-600'}`}>
                {res?.value !== null ? res.value : '오류'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        base.value !== null && (
          <p className="text-sm text-emerald-700">기대값 <span className="font-bold">{base.value}</span></p>
        )
      )}
      {base.warnings.map((w, i) => (
        <p key={i} className="text-xs text-amber-600">⚠ {w}</p>
      ))}
      {base.infos.map((info, i) => (
        <p key={i} className="text-xs text-slate-400 italic">ℹ {info}</p>
      ))}
    </div>
  );
}

function EffectCard({ effect, index, total, onUpdate, onDelete, onMoveUp, onMoveDown }) {
  const [modalOpen, setModalOpen] = useState(false);
  const warnings = getEffectWarnings(effect);
  const hasText = !!effect.generatedText;

  const handleInsert = (type, params, text) => {
    onUpdate({ ...effect, type, params, generatedText: text });
    setModalOpen(false);
  };

  return (
    <div className={`rounded-xl border p-3 space-y-2 transition-colors ${
      effect.confirmed
        ? 'bg-emerald-50 border-emerald-200'
        : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] text-slate-400 font-mono shrink-0">효과 {index + 1}</span>
        {effect.type && (
          <span className="text-[11px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-200 shrink-0">
            {EFFECT_TYPE_LABEL[effect.type] ?? effect.type}
          </span>
        )}
        {effect.confirmed && (
          <span className="text-[11px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">확정됨</span>
        )}
        <div className="flex gap-1 ml-auto shrink-0">
          <button onClick={onMoveUp} disabled={index === 0}
            className="w-6 h-6 flex items-center justify-center rounded-lg bg-white hover:bg-slate-100 text-slate-400 text-xs border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">↑</button>
          <button onClick={onMoveDown} disabled={index === total - 1}
            className="w-6 h-6 flex items-center justify-center rounded-lg bg-white hover:bg-slate-100 text-slate-400 text-xs border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">↓</button>
          <button onClick={onDelete}
            className="w-6 h-6 flex items-center justify-center rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 text-xs border border-rose-200 transition-colors">✕</button>
        </div>
      </div>

      {hasText && (
        <div className={`rounded-lg p-2 text-xs font-mono break-all whitespace-pre-wrap ${
          effect.confirmed
            ? 'bg-white text-emerald-700 border border-emerald-200'
            : 'bg-white text-indigo-700 border border-indigo-100'
        }`}>
          {effect.generatedText}
        </div>
      )}

      {warnings.length > 0 && (
        <div className="space-y-0.5">
          {warnings.map((w, i) => (
            <p key={i} className="text-xs text-amber-600">⚠ {w}</p>
          ))}
        </div>
      )}

      {!effect.confirmed ? (
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setModalOpen(true)}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-lg text-xs font-medium transition-colors">
            블럭 선택
          </button>
          {hasText && (
            <button onClick={() => onUpdate({ ...effect, confirmed: true })}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-medium transition-colors">
              확정
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setModalOpen(true)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors">
            편집
          </button>
          <button onClick={() => onUpdate({ ...effect, confirmed: false })}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 rounded-lg text-xs font-medium transition-colors">
            확정 해제
          </button>
        </div>
      )}

      {modalOpen && (
        <EffectBlockModal
          initialType={effect.type || 'template'}
          initialParams={effect.params || {}}
          onInsert={handleInsert}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

const HELP_ITEMS = [
  { title: '기본 형식', desc: 'd20 + 랭크 + 스탯 (예: d20 + 랭크 + 근력)이 기본 판정식입니다.' },
  { title: '효과 줄 단위 처리', desc: '효과는 블럭 단위로 등록되며, 각 블럭이 독립적인 효과로 신청됩니다.' },
  { title: '자유 입력 검수', desc: '자유 입력(free) 효과는 운영진 수동 검수 대상입니다. 가능하면 템플릿을 사용하세요.' },
  { title: '대상 참조 변수', desc: '대상상태_ 또는 대상스택_ 변수를 쓰는 경우, 조건 칸에 "대상 지정 필요"를 명시해야 합니다.' },
  { title: '이면침식 변수', desc: '이면침식 변수를 포함하면 침식 0/6/9 기대값이 미리보기에 자동 표시됩니다.' },
];

export default function SkillMaker({ editingSkill, stats, abilities, proficiencies, onSave, onCancel }) {
  const [skill, setSkill] = useState(() => {
    const s = editingSkill || defaultSkill();
    return { ...s, effects: s.effects ?? [] };
  });
  const [formulaModalOpen, setFormulaModalOpen] = useState(false);
  const [formulaCat, setFormulaCat] = useState('기본');
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const s = editingSkill || defaultSkill();
    setSkill({ ...s, effects: s.effects ?? [] });
  }, [editingSkill]);

  const field = (key) => (e) => setSkill(s => ({ ...s, [key]: e.target.value }));

  const insertFormula = (token) => {
    setSkill(s => {
      const prev = s.formula;
      const sep = prev.length > 0 && !prev.endsWith(' ') ? ' ' : '';
      return { ...s, formula: prev + sep + token };
    });
    setFormulaModalOpen(false);
  };

  const appendOperator = (op) => {
    setSkill(s => ({ ...s, formula: s.formula + ` ${op} ` }));
  };

  const applyQuickCombo = (formula) => {
    setSkill(s => ({ ...s, formula }));
  };

  const addEffect = () => {
    setSkill(s => ({ ...s, effects: [...s.effects, makeEffect()] }));
  };

  const updateEffect = (id, updated) => {
    setSkill(s => ({ ...s, effects: s.effects.map(e => e.id === id ? updated : e) }));
  };

  const deleteEffect = (id) => {
    setSkill(s => ({ ...s, effects: s.effects.filter(e => e.id !== id) }));
  };

  const moveEffect = (idx, dir) => {
    setSkill(s => {
      const next = [...s.effects];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return s;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return { ...s, effects: next };
    });
  };

  const tokenErrors     = validateFormula(skill.formula);
  const structureWarns  = validateFormulaStructure(skill.formula);
  const needsTarget     = hasTargetReference(skill.formula);
  const allFormulaIssues = [...tokenErrors, ...structureWarns];

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-lg shadow-violet-100/20 p-5 space-y-4">

      {/* Header */}
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-violet-300 font-mono tracking-widest">05</span>
            <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
              {editingSkill ? '스킬 편집' : '스킬 메이커'}
            </h2>
            {editingSkill && (
              <span className="text-[11px] text-violet-700 bg-violet-50 border border-violet-200 rounded px-1.5 py-0.5">편집 중</span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">스킬의 판정식과 효과를 신청 양식에 맞춰 제작합니다.</p>
        </div>
        <button
          onClick={() => setHelpOpen(v => !v)}
          className={`shrink-0 text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-colors ${
            helpOpen
              ? 'bg-amber-50 border-amber-200 text-amber-700'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-amber-300 hover:text-amber-600'
          }`}
        >
          {helpOpen ? '도움말 닫기' : '? 도움말'}
        </button>
      </div>

      {/* 도움말 박스 */}
      {helpOpen && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
          <p className="text-[10px] text-amber-600 font-semibold uppercase tracking-widest">스킬 메이커 도움말</p>
          <ul className="space-y-2">
            {HELP_ITEMS.map(({ title, desc }) => (
              <li key={title} className="flex gap-2 text-xs">
                <span className="text-amber-500 shrink-0 mt-0.5">•</span>
                <span>
                  <span className="font-semibold text-amber-800">{title}:</span>{' '}
                  <span className="text-amber-700 leading-relaxed">{desc}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 스킬명 */}
      <label className="flex flex-col gap-1">
        <span className="text-[11px] text-slate-500 tracking-wide">스킬 이름</span>
        <input className={inputCls} value={skill.name} onChange={field('name')} placeholder="스킬 이름" />
      </label>

      {/* 계통 / 계열 */}
      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">계통</span>
          <select className={selectCls} value={skill.tradition} onChange={field('tradition')}>
            {SKILL_TRADITIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">계열</span>
          <select className={selectCls} value={skill.series} onChange={field('series')}>
            {SKILL_SERIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>

      {/* 랭크 */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-slate-500 tracking-wide">랭크</span>
        <div className="flex flex-wrap gap-1">
          {SKILL_RANKS.map(({ rank, value }) => (
            <button
              key={rank}
              onClick={() => setSkill(s => ({ ...s, rank }))}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold border transition-all ${
                skill.rank === rank
                  ? 'bg-amber-400 text-white border-amber-400 shadow-sm shadow-amber-200/50'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50'
              }`}
            >
              {rank} <span className="opacity-50 font-normal">({value})</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 계산식 섹션 ── */}
      <div className="space-y-3 bg-slate-50 rounded-xl border border-slate-200 p-4">
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">계산식</span>

        <input
          className={`${inputCls}${allFormulaIssues.length > 0 ? ' border-amber-400 focus:border-amber-400 focus:ring-amber-400/20' : ''}`}
          value={skill.formula}
          onChange={field('formula')}
          placeholder="예: d20 + 랭크 + 근력"
        />

        {allFormulaIssues.length > 0 && (
          <div className="space-y-0.5">
            {allFormulaIssues.map((e, i) => (
              <p key={i} className="text-xs text-amber-600">⚠ {e}</p>
            ))}
          </div>
        )}
        {needsTarget && (
          <p className="text-xs text-amber-600">⚠ 이 계산식은 대상 지정이 필요합니다. 사용 예: !스킬 스킬명 대상:대상별명</p>
        )}

        {/* 빠른 삽입 (카테고리별) */}
        <div className="space-y-2">
          <p className="text-[10px] text-slate-400 tracking-widest uppercase">빠른 삽입</p>
          <div className="flex flex-wrap gap-1">
            {FORMULA_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFormulaCat(cat.id)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-medium border transition-colors ${
                  formulaCat === cat.id
                    ? 'bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-200/50'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-violet-300 hover:text-violet-700'
                }`}
              >
                {cat.id}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {FORMULA_CATEGORIES.find(c => c.id === formulaCat)?.tokens.map(token => (
              <button
                key={token}
                onClick={() => insertFormula(token)}
                className="px-2 py-1 bg-white hover:bg-violet-50 border border-slate-200 hover:border-violet-300 text-slate-600 hover:text-violet-700 rounded-lg text-[11px] font-mono transition-colors"
              >
                {token}
              </button>
            ))}
          </div>
          {formulaCat === '상태/스택' && (
            <p className="text-[10px] text-amber-600">⚠ 예시 토큰입니다. 직접 편집하거나 아래 고급 블럭 선택기로 커스텀하세요.</p>
          )}
          {formulaCat === '고급' && (
            <p className="text-[10px] text-amber-600">⚠ 고급 변수는 캐릭터 DB를 참조합니다. 운영진 검수 대상입니다.</p>
          )}
          <button
            onClick={() => setFormulaModalOpen(true)}
            className="text-[11px] px-2.5 py-1 bg-white border border-dashed border-slate-300 text-slate-400 hover:text-violet-700 hover:border-violet-300 hover:bg-violet-50 rounded-lg transition-colors"
          >
            + 고급 블럭 선택기
          </button>
        </div>

        {/* 연산자 */}
        <div className="space-y-1.5">
          <p className="text-[10px] text-slate-400 tracking-widest uppercase">연산자</p>
          <div className="flex flex-wrap gap-1.5">
            {OPERATORS.map(({ op, label, tip }) => (
              <button
                key={op}
                onClick={() => appendOperator(op)}
                title={tip}
                className="min-w-[2.75rem] px-2 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 hover:border-violet-300 text-slate-700 font-mono font-bold rounded-lg text-sm transition-colors"
              >
                {label}
                <span className="block text-slate-400 font-sans font-normal" style={{ fontSize: '9px', lineHeight: '1.2' }}>{tip}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 빠른 조합 */}
        <div className="space-y-1.5">
          <p className="text-[10px] text-slate-400 tracking-widest uppercase">빠른 조합</p>
          <div className="flex flex-wrap gap-1">
            {QUICK_COMBOS.map(({ label, formula }) => (
              <button
                key={label}
                onClick={() => applyQuickCombo(formula)}
                title={formula}
                className="px-2 py-1 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-500 hover:text-indigo-700 rounded-lg text-xs transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 italic">누르면 현재 계산식이 교체됩니다.</p>
        </div>

        <FormulaPreview formula={skill.formula} stats={stats} rank={skill.rank} abilities={abilities} proficiencies={proficiencies} />
      </div>

      {/* ── 효과 목록 ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500 tracking-wide">효과 목록</span>
          <span className="text-[11px] text-slate-400 font-mono">{skill.effects.length}개</span>
        </div>

        {skill.effects.length === 0 && (
          <p className="text-xs text-slate-400 italic py-1">효과가 없습니다. 아래 버튼으로 추가하세요.</p>
        )}

        <div className="space-y-2">
          {skill.effects.map((ef, idx) => (
            <EffectCard
              key={ef.id}
              effect={ef}
              index={idx}
              total={skill.effects.length}
              onUpdate={(updated) => updateEffect(ef.id, updated)}
              onDelete={() => deleteEffect(ef.id)}
              onMoveUp={() => moveEffect(idx, -1)}
              onMoveDown={() => moveEffect(idx, 1)}
            />
          ))}
        </div>

        <button
          onClick={addEffect}
          className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl border border-dashed border-slate-300 hover:border-indigo-300 text-sm transition-colors"
        >
          + 효과 추가
        </button>
      </div>

      {/* 조건 / 대가 / 설명 */}
      <label className="flex flex-col gap-1">
        <span className="text-[11px] text-slate-500 tracking-wide">조건</span>
        <input className={inputCls} value={skill.condition} onChange={field('condition')} placeholder="발동 조건 (예: 대상에게 공격 적중 시)" />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] text-slate-500 tracking-wide">대가</span>
        <input className={inputCls} value={skill.cost} onChange={field('cost')} placeholder="사용 대가 (예: 이면침식 +1)" />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] text-slate-500 tracking-wide">설명</span>
        <textarea
          className={`${inputCls} h-16 resize-none`}
          value={skill.description}
          onChange={field('description')}
          placeholder="스킬 설명"
        />
      </label>

      {/* 저장 */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onSave(skill)}
          className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm shadow-violet-200"
        >
          {editingSkill ? '스킬 수정' : '스킬 추가'}
        </button>
        {editingSkill && (
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 rounded-xl text-sm transition-colors"
          >
            취소
          </button>
        )}
      </div>

      {formulaModalOpen && (
        <FormulaBlockModal
          onInsert={insertFormula}
          onClose={() => setFormulaModalOpen(false)}
        />
      )}
    </div>
  );
}
