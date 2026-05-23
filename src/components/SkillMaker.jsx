import { useState, useEffect } from 'react';
import { SKILL_TRADITIONS, SKILL_SERIES, SKILL_RANKS, defaultSkill } from '../data/skillRanks';
import { validateFormula, previewFormula, validateEffect } from '../utils/calcSkill';

const FORMULA_BUTTONS = [
  { label: 'd20', token: 'd20' },
  { label: '2d6', token: '2d6' },
  { label: '랭크', token: '랭크' },
  { label: '근력', token: '근력' },
  { label: '민첩', token: '민첩' },
  { label: '내구', token: '내구' },
  { label: '감각', token: '감각' },
  { label: '지능', token: '지능' },
  { label: '스택_이름', token: '스택_이름' },
  { label: '대상상태_상태_수치', token: '대상상태_상태_수치' },
];

const EFFECT_BUTTONS = [
  { label: '상태부여 대상', token: '상태템플릿부여 대상\n' },
  { label: '상태부여 자신', token: '상태템플릿부여 자신\n' },
  { label: '스택증가 자신', token: '스택증가 자신\n' },
  { label: '스택증가 대상', token: '스택증가 대상\n' },
  { label: '수치:', token: '수치:' },
  { label: '횟수:', token: '횟수:' },
  { label: '최대:', token: '최대:' },
  { label: '저항:가능', token: '저항:가능\n' },
  { label: '저항난이도:최종값', token: '저항난이도:최종값\n' },
];

export default function SkillMaker({ editingSkill, stats, onSave, onCancel }) {
  const [skill, setSkill] = useState(editingSkill || defaultSkill());

  useEffect(() => {
    setSkill(editingSkill || defaultSkill());
  }, [editingSkill]);

  const field = (key) => (e) => setSkill(s => ({ ...s, [key]: e.target.value }));

  const appendToField = (key, token) => {
    setSkill(s => ({ ...s, [key]: s[key] + token }));
  };

  const formulaErrors = validateFormula(skill.formula);
  const { value: formulaPreview, warnings: formulaWarnings } = previewFormula(skill.formula, stats, skill.rank);
  const effectWarnings = validateEffect(skill.effect);

  const inputClass = "w-full bg-gray-700 text-white rounded px-2 py-1 text-sm border border-gray-600 focus:border-yellow-400 outline-none";
  const selectClass = "bg-gray-700 text-white rounded px-2 py-1 text-sm border border-gray-600 focus:border-yellow-400 outline-none";

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <h2 className="text-lg font-bold text-yellow-400">
        {editingSkill ? '스킬 편집' : '스킬 메이커'}
      </h2>

      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1 col-span-2">
          <span className="text-xs text-gray-400">스킬 이름</span>
          <input className={inputClass} value={skill.name} onChange={field('name')} placeholder="스킬 이름" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">계통</span>
          <select className={selectClass} value={skill.tradition} onChange={field('tradition')}>
            {SKILL_TRADITIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">계열</span>
          <select className={selectClass} value={skill.series} onChange={field('series')}>
            {SKILL_SERIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>

        <label className="flex flex-col gap-1 col-span-2">
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
        </label>
      </div>

      <div className="space-y-1">
        <span className="text-xs text-gray-400">계산식</span>
        <div className="flex flex-wrap gap-1 mb-1">
          {FORMULA_BUTTONS.map(({ label, token }) => (
            <button
              key={label}
              onClick={() => appendToField('formula', token)}
              className="px-2 py-0.5 bg-gray-600 hover:bg-gray-500 text-gray-200 rounded text-xs border border-gray-500 hover:border-yellow-500 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
        <input
          className={inputClass}
          value={skill.formula}
          onChange={field('formula')}
          placeholder="예: 랭크 + 근력 * 2"
        />
        {formulaErrors.length > 0 && (
          <div className="text-xs text-red-400 space-y-0.5">
            {formulaErrors.map((e, i) => <p key={i}>⚠ {e}</p>)}
          </div>
        )}
        {formulaWarnings.length > 0 && formulaErrors.length === 0 && (
          <div className="text-xs text-yellow-500 space-y-0.5">
            {formulaWarnings.map((w, i) => <p key={i}>ℹ {w}</p>)}
          </div>
        )}
        {formulaPreview !== null && formulaErrors.length === 0 && (
          <div className="text-xs text-green-400">
            기대값 프리뷰: <span className="font-bold">{formulaPreview}</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <span className="text-xs text-gray-400">효과</span>
        <div className="flex flex-wrap gap-1 mb-1">
          {EFFECT_BUTTONS.map(({ label, token }) => (
            <button
              key={label}
              onClick={() => appendToField('effect', token)}
              className="px-2 py-0.5 bg-gray-600 hover:bg-gray-500 text-gray-200 rounded text-xs border border-gray-500 hover:border-blue-500 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
        <textarea
          className={`${inputClass} h-20 resize-none`}
          value={skill.effect}
          onChange={field('effect')}
          placeholder="효과 설명"
        />
        {effectWarnings.length > 0 && (
          <div className="text-xs space-y-0.5">
            {effectWarnings.map((w, i) => (
              <p key={i} className={w.includes('운영진') ? 'text-orange-400' : 'text-yellow-400'}>
                ⚠ {w}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">조건</span>
          <input className={inputClass} value={skill.condition} onChange={field('condition')} placeholder="발동 조건" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">대가</span>
          <input className={inputClass} value={skill.cost} onChange={field('cost')} placeholder="사용 대가" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">설명</span>
          <textarea
            className={`${inputClass} h-16 resize-none`}
            value={skill.description}
            onChange={field('description')}
            placeholder="스킬 설명"
          />
        </label>
      </div>

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
    </div>
  );
}
