import { useState, useEffect } from 'react';
import { SKILL_TRADITIONS, SKILL_SERIES, SKILL_RANKS, defaultSkill, makeEffect } from '../data/skillRanks';
import { validateFormula, previewFormula, hasTargetReference, getEffectWarnings } from '../utils/calcSkill';
import FormulaBlockModal from './FormulaBlockModal';
import EffectBlockModal from './EffectBlockModal';

const EFFECT_TYPE_LABEL = {
  template:     '상태 템플릿 부여',
  custom:       '커스텀 상태 부여',
  statusRemove: '상태 해제',
  stack:        '스택 변경',
  free:         '자유 입력',
};

function EffectCard({ effect, index, total, onUpdate, onDelete, onMoveUp, onMoveDown }) {
  const [modalOpen, setModalOpen] = useState(false);
  const warnings = getEffectWarnings(effect);
  const hasText = !!effect.generatedText;

  const handleInsert = (type, params, text) => {
    onUpdate({ ...effect, type, params, generatedText: text });
    setModalOpen(false);
  };

  return (
    <div className={`rounded-lg border p-3 space-y-2 ${
      effect.confirmed ? 'bg-gray-700/40 border-green-800/60' : 'bg-gray-700/60 border-gray-600'
    }`}>
      {/* Header row */}
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-xs text-gray-400 shrink-0">효과 {index + 1}</span>
        {effect.type && (
          <span className="text-xs bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800/60 shrink-0">
            {EFFECT_TYPE_LABEL[effect.type] ?? effect.type}
          </span>
        )}
        {effect.confirmed && (
          <span className="text-xs bg-green-900/60 text-green-300 px-1.5 py-0.5 rounded border border-green-800/60 shrink-0">확정됨</span>
        )}
        <div className="flex gap-1 ml-auto shrink-0">
          <button onClick={onMoveUp} disabled={index === 0}
            className="w-6 h-6 flex items-center justify-center rounded bg-gray-600 hover:bg-gray-500 text-gray-300 text-xs disabled:opacity-30 disabled:cursor-not-allowed">↑</button>
          <button onClick={onMoveDown} disabled={index === total - 1}
            className="w-6 h-6 flex items-center justify-center rounded bg-gray-600 hover:bg-gray-500 text-gray-300 text-xs disabled:opacity-30 disabled:cursor-not-allowed">↓</button>
          <button onClick={onDelete}
            className="w-6 h-6 flex items-center justify-center rounded bg-red-900/60 hover:bg-red-800 text-red-300 text-xs">✕</button>
        </div>
      </div>

      {/* Generated text preview */}
      {hasText && (
        <div className={`rounded p-2 text-xs font-mono break-all whitespace-pre-wrap ${
          effect.confirmed ? 'bg-gray-900 text-green-300 border border-green-900/60' : 'bg-gray-800 text-blue-300 border border-gray-700'
        }`}>
          {effect.generatedText}
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="space-y-0.5">
          {warnings.map((w, i) => (
            <p key={i} className={`text-xs ${w.includes('운영진') ? 'text-orange-400' : 'text-yellow-400'}`}>⚠ {w}</p>
          ))}
        </div>
      )}

      {/* Action buttons */}
      {!effect.confirmed ? (
        <div className="flex flex-wrap gap-1">
          <button onClick={() => setModalOpen(true)}
            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-medium transition-colors">
            블럭 선택
          </button>
          {hasText && (
            <button onClick={() => onUpdate({ ...effect, confirmed: true })}
              className="px-3 py-1.5 bg-green-700 hover:bg-green-600 text-white rounded text-xs font-medium transition-colors">
              확정
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1">
          <button onClick={() => setModalOpen(true)}
            className="px-3 py-1.5 bg-blue-800 hover:bg-blue-700 text-blue-200 rounded text-xs font-medium transition-colors">
            편집
          </button>
          <button onClick={() => onUpdate({ ...effect, confirmed: false })}
            className="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-gray-200 rounded text-xs font-medium transition-colors">
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

  const formulaErrors   = validateFormula(skill.formula);
  const needsTarget     = hasTargetReference(skill.formula);
  const { value: formulaPreview, warnings: formulaWarnings, infos: formulaInfos }
    = previewFormula(skill.formula, stats, skill.rank);

  const inputCls  = "w-full bg-gray-700 text-white rounded px-2 py-1.5 text-sm border border-gray-600 focus:border-yellow-400 outline-none";
  const selectCls = "w-full bg-gray-700 text-white rounded px-2 py-1.5 text-sm border border-gray-600 focus:border-yellow-400 outline-none";

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <h2 className="text-lg font-bold text-yellow-400">
        {editingSkill ? '스킬 편집' : '스킬 메이커'}
      </h2>

      {/* 스킬명 */}
      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-400">스킬 이름</span>
        <input className={inputCls} value={skill.name} onChange={field('name')} placeholder="스킬 이름" />
      </label>

      {/* 계통 / 계열 */}
      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">계통</span>
          <select className={selectCls} value={skill.tradition} onChange={field('tradition')}>
            {SKILL_TRADITIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">계열</span>
          <select className={selectCls} value={skill.series} onChange={field('series')}>
            {SKILL_SERIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>

      {/* 랭크 */}
      <div className="space-y-1">
        <span className="text-xs text-gray-400">랭크</span>
        <div className="flex flex-wrap gap-1">
          {SKILL_RANKS.map(({ rank, value }) => (
            <button
              key={rank}
              onClick={() => setSkill(s => ({ ...s, rank }))}
              className={`px-2 py-0.5 rounded text-xs font-bold border transition-colors ${
                skill.rank === rank
                  ? 'bg-yellow-500 text-gray-900 border-yellow-400'
                  : 'bg-gray-700 text-gray-300 border-gray-600 hover:border-yellow-500'
              }`}
            >
              {rank} <span className="opacity-60">({value})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 계산식 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">계산식</span>
          <button
            onClick={() => setFormulaModalOpen(true)}
            className="px-2 py-1 bg-yellow-600 hover:bg-yellow-500 text-gray-900 font-semibold rounded text-xs transition-colors"
          >
            + 블럭 선택
          </button>
        </div>
        <input
          className={inputCls}
          value={skill.formula}
          onChange={field('formula')}
          placeholder="예: 랭크 + 근력 * 2 + d20"
        />
        {formulaErrors.length > 0 && (
          <div className="space-y-0.5">
            {formulaErrors.map((e, i) => <p key={i} className="text-xs text-red-400">⚠ {e}</p>)}
          </div>
        )}
        {needsTarget && formulaErrors.length === 0 && (
          <p className="text-xs text-orange-400">⚠ 대상 참조 포함 — 조건 칸에 "대상 지정 필요"를 추가하세요.</p>
        )}
        {formulaWarnings.length > 0 && formulaErrors.length === 0 && (
          <div className="space-y-0.5">
            {formulaWarnings.map((w, i) => <p key={i} className="text-xs text-orange-400">⚠ {w}</p>)}
          </div>
        )}
        {formulaInfos.map((info, i) => (
          <p key={i} className="text-xs text-gray-500 italic">ℹ {info}</p>
        ))}
        {formulaPreview !== null && formulaErrors.length === 0 && (
          <div className="text-xs text-green-400 bg-gray-900 rounded px-2 py-1 border border-gray-700">
            기대값 프리뷰: <span className="font-bold">{formulaPreview}</span>
          </div>
        )}
      </div>

      {/* 효과 목록 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">효과 목록</span>
          <span className="text-xs text-gray-500">{skill.effects.length}개</span>
        </div>

        {skill.effects.length === 0 && (
          <p className="text-xs text-gray-600 italic py-1">효과가 없습니다. 아래 버튼으로 추가하세요.</p>
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
          className="w-full py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded border border-dashed border-gray-500 hover:border-blue-400 text-sm transition-colors"
        >
          + 효과 추가
        </button>
      </div>

      {/* 조건 / 대가 / 설명 */}
      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-400">조건</span>
        <input className={inputCls} value={skill.condition} onChange={field('condition')} placeholder="발동 조건 (예: 대상에게 공격 적중 시)" />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-400">대가</span>
        <input className={inputCls} value={skill.cost} onChange={field('cost')} placeholder="사용 대가 (예: 이면침식 +1)" />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-400">설명</span>
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
          className="flex-1 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded text-sm transition-colors"
        >
          {editingSkill ? '스킬 수정' : '스킬 추가'}
        </button>
        {editingSkill && (
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm transition-colors"
          >
            취소
          </button>
        )}
      </div>

      {/* Formula Modal */}
      {formulaModalOpen && (
        <FormulaBlockModal
          onInsert={insertFormula}
          onClose={() => setFormulaModalOpen(false)}
        />
      )}
    </div>
  );
}
