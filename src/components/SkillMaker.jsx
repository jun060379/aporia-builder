import { useState, useEffect } from 'react';
import { SKILL_TRADITIONS, SKILL_SERIES, SKILL_RANKS, defaultSkill, makeEffect } from '../data/skillRanks';
import {
  validateFormula,
  validateFormulaStructure,
  previewFormula,
  hasTargetReference,
  getEffectWarnings,
} from '../utils/calcSkill';
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

function FormulaPreview({ formula, stats, rank }) {
  if (!formula.trim()) return null;

  const base = previewFormula(formula, stats, rank);
  const hasDbVar = /이면침식/.test(formula);

  const침식0 = hasDbVar ? previewFormula(formula, stats, rank, { 이면침식: 0 }) : null;
  const침식6 = hasDbVar ? previewFormula(formula, stats, rank, { 이면침식: 6 }) : null;
  const침식9 = hasDbVar ? previewFormula(formula, stats, rank, { 이면침식: 9 }) : null;

  const show = base.value !== null || base.warnings.length > 0;
  if (!show) return null;

  return (
    <div className="bg-slate-950/60 rounded-xl border border-white/8 p-3 space-y-2">
      <p className="text-[10px] text-slate-600 uppercase tracking-widest">계산 미리보기</p>

      {hasDbVar ? (
        <div className="grid grid-cols-3 gap-2">
          {[[침식0, '침식 0'], [침식6, '침식 6'], [침식9, '침식 9']].map(([res, lbl]) => (
            <div key={lbl} className="bg-slate-800/60 rounded-lg p-2 text-center">
              <p className="text-[10px] text-slate-600 mb-0.5">{lbl}</p>
              <p className={`text-sm font-bold ${res?.value !== null ? 'text-emerald-400' : 'text-rose-400'}`}>
                {res?.value !== null ? res.value : '오류'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        base.value !== null && (
          <p className="text-sm text-emerald-400">기대값 <span className="font-bold">{base.value}</span></p>
        )
      )}

      {base.warnings.map((w, i) => (
        <p key={i} className={`text-xs ${w.includes('운영진') ? 'text-amber-400' : 'text-amber-300'}`}>⚠ {w}</p>
      ))}
      {base.infos.map((info, i) => (
        <p key={i} className="text-xs text-slate-600 italic">ℹ {info}</p>
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
        ? 'bg-emerald-950/30 border-emerald-800/40'
        : 'bg-slate-800/40 border-white/8'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] text-slate-600 font-mono shrink-0">효과 {index + 1}</span>
        {effect.type && (
          <span className="text-[11px] bg-cyan-950/50 text-cyan-300/80 px-1.5 py-0.5 rounded border border-cyan-800/30 shrink-0">
            {EFFECT_TYPE_LABEL[effect.type] ?? effect.type}
          </span>
        )}
        {effect.confirmed && (
          <span className="text-[11px] bg-emerald-950/50 text-emerald-300/80 px-1.5 py-0.5 rounded border border-emerald-800/30 shrink-0">확정됨</span>
        )}
        <div className="flex gap-1 ml-auto shrink-0">
          <button onClick={onMoveUp} disabled={index === 0}
            className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-700/50 hover:bg-slate-600/60 text-slate-400 text-xs disabled:opacity-20 disabled:cursor-not-allowed transition-colors">↑</button>
          <button onClick={onMoveDown} disabled={index === total - 1}
            className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-700/50 hover:bg-slate-600/60 text-slate-400 text-xs disabled:opacity-20 disabled:cursor-not-allowed transition-colors">↓</button>
          <button onClick={onDelete}
            className="w-6 h-6 flex items-center justify-center rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-400/80 text-xs transition-colors">✕</button>
        </div>
      </div>

      {/* Generated text */}
      {hasText && (
        <div className={`rounded-lg p-2 text-xs font-mono break-all whitespace-pre-wrap ${
          effect.confirmed
            ? 'bg-slate-950/60 text-emerald-300/90 border border-emerald-900/30'
            : 'bg-slate-900/60 text-cyan-300/80 border border-slate-700/40'
        }`}>
          {effect.generatedText}
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="space-y-0.5">
          {warnings.map((w, i) => (
            <p key={i} className={`text-xs ${w.includes('운영진') ? 'text-amber-400' : 'text-amber-300'}`}>⚠ {w}</p>
          ))}
        </div>
      )}

      {/* Actions */}
      {!effect.confirmed ? (
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setModalOpen(true)}
            className="px-3 py-1.5 bg-cyan-900/40 hover:bg-cyan-800/50 border border-cyan-800/40 text-cyan-300 rounded-lg text-xs font-medium transition-colors">
            블럭 선택
          </button>
          {hasText && (
            <button onClick={() => onUpdate({ ...effect, confirmed: true })}
              className="px-3 py-1.5 bg-emerald-900/40 hover:bg-emerald-800/50 border border-emerald-800/40 text-emerald-300 rounded-lg text-xs font-medium transition-colors">
              확정
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setModalOpen(true)}
            className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/60 border border-slate-600/40 text-slate-300 rounded-lg text-xs font-medium transition-colors">
            편집
          </button>
          <button onClick={() => onUpdate({ ...effect, confirmed: false })}
            className="px-3 py-1.5 bg-slate-700/40 hover:bg-slate-600/50 border border-slate-600/30 text-slate-400 rounded-lg text-xs font-medium transition-colors">
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

const inputCls = "w-full min-w-0 bg-slate-800/60 text-slate-100 rounded-lg px-3 py-1.5 text-sm border border-slate-700/50 focus:border-cyan-500/50 outline-none placeholder:text-slate-600 transition-colors";
const selectCls = "w-full bg-slate-800/60 text-slate-100 rounded-lg px-3 py-1.5 text-sm border border-slate-700/50 focus:border-cyan-500/50 outline-none transition-colors";

export default function SkillMaker({ editingSkill, stats, onSave, onCancel }) {
  const [skill, setSkill] = useState(() => {
    const s = editingSkill || defaultSkill();
    return { ...s, effects: s.effects ?? [] };
  });
  const [formulaModalOpen, setFormulaModalOpen] = useState(false);

  useEffect(() => {
    const s = editingSkill || defaultSkill();
    setSkill({ ...s, effects: s.effects ?? [] });
  }, [editingSkill]);

  const field = (key) => (e) => setSkill(s => ({ ...s, [key]: e.target.value }));

  const insertFormula = (token) => {
    setSkill(s => ({ ...s, formula: s.formula + token }));
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

  const tokenErrors    = validateFormula(skill.formula);
  const structureWarns = validateFormulaStructure(skill.formula);
  const needsTarget    = hasTargetReference(skill.formula);
  const allFormulaErrors = [...tokenErrors, ...structureWarns];

  return (
    <div className="bg-slate-900/70 backdrop-blur-sm rounded-2xl border border-white/10 p-5 shadow-xl shadow-black/30 space-y-4">

      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-slate-600 font-mono tracking-widest">05</span>
        <h2 className="text-sm font-semibold text-slate-300 tracking-wide uppercase">
          {editingSkill ? '스킬 편집' : '스킬 메이커'}
        </h2>
        {editingSkill && (
          <span className="ml-1 text-[11px] text-violet-300/70 bg-violet-900/20 border border-violet-800/30 rounded px-1.5 py-0.5">편집 중</span>
        )}
      </div>

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
                  ? 'bg-amber-400/80 text-slate-900 border-amber-400/60 shadow-sm shadow-amber-400/20'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:border-amber-400/40 hover:text-slate-200'
              }`}
            >
              {rank} <span className="opacity-50 font-normal">({value})</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 계산식 섹션 ── */}
      <div className="space-y-3 bg-slate-800/20 rounded-xl border border-white/8 p-4">
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">계산식</span>

        <input
          className={`${inputCls}${allFormulaErrors.length > 0 ? ' border-rose-500/50' : ''}`}
          value={skill.formula}
          onChange={field('formula')}
          placeholder="예: d20 + 랭크 + 근력"
        />

        {/* 검증 */}
        {allFormulaErrors.length > 0 && (
          <div className="space-y-0.5">
            {allFormulaErrors.map((e, i) => (
              <p key={i} className="text-xs text-rose-400">⚠ {e}</p>
            ))}
          </div>
        )}
        {needsTarget && allFormulaErrors.length === 0 && (
          <p className="text-xs text-amber-400">⚠ 대상 참조 포함 — 조건 칸에 "대상 지정 필요"를 추가하세요.</p>
        )}

        {/* 블럭 추가 */}
        <div className="space-y-1.5">
          <p className="text-[10px] text-slate-600 tracking-widest uppercase">블럭 추가</p>
          <button
            onClick={() => setFormulaModalOpen(true)}
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-200 rounded-lg text-xs font-semibold transition-colors"
          >
            블럭 선택
          </button>
        </div>

        {/* 연산자 */}
        <div className="space-y-1.5">
          <p className="text-[10px] text-slate-600 tracking-widest uppercase">연산자</p>
          <div className="flex flex-wrap gap-1.5">
            {OPERATORS.map(({ op, label, tip }) => (
              <button
                key={op}
                onClick={() => appendOperator(op)}
                title={tip}
                className="min-w-[2.75rem] px-2 py-1.5 bg-slate-800/60 hover:bg-slate-700/70 border border-slate-700/50 hover:border-amber-400/30 text-slate-300 font-mono font-bold rounded-lg text-sm transition-colors"
              >
                {label}
                <span className="block text-slate-600 font-sans font-normal" style={{ fontSize: '9px', lineHeight: '1.2' }}>{tip}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 빠른 조합 */}
        <div className="space-y-1.5">
          <p className="text-[10px] text-slate-600 tracking-widest uppercase">빠른 조합</p>
          <div className="flex flex-wrap gap-1">
            {QUICK_COMBOS.map(({ label, formula }) => (
              <button
                key={label}
                onClick={() => applyQuickCombo(formula)}
                title={formula}
                className="px-2 py-1 bg-slate-800/40 hover:bg-violet-900/30 border border-slate-700/40 hover:border-violet-600/40 text-slate-400 hover:text-violet-300 rounded-lg text-xs transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-700 italic">누르면 현재 계산식이 교체됩니다.</p>
        </div>

        {/* 미리보기 */}
        <FormulaPreview formula={skill.formula} stats={stats} rank={skill.rank} />
      </div>

      {/* ── 효과 목록 ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500 tracking-wide">효과 목록</span>
          <span className="text-[11px] text-slate-600 font-mono">{skill.effects.length}개</span>
        </div>

        {skill.effects.length === 0 && (
          <p className="text-xs text-slate-700 italic py-1">효과가 없습니다. 아래 버튼으로 추가하세요.</p>
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
          className="w-full py-1.5 bg-slate-800/40 hover:bg-slate-700/50 text-slate-500 hover:text-slate-300 rounded-xl border border-dashed border-slate-700/50 hover:border-cyan-700/40 text-sm transition-colors"
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
          className="flex-1 py-2 bg-amber-400/80 hover:bg-amber-400/90 text-slate-900 font-bold rounded-xl text-sm transition-colors shadow-sm shadow-amber-400/20"
        >
          {editingSkill ? '스킬 수정' : '스킬 추가'}
        </button>
        {editingSkill && (
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/60 border border-slate-600/40 text-slate-300 rounded-xl text-sm transition-colors"
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
