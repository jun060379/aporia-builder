import { useMemo, useState } from 'react';
import { createApplication } from '../lib/applications';
import {
  ENEMY_SKILL_CATEGORIES,
  ENEMY_SKILL_RANKS,
  ENEMY_OWNER_TYPES,
  ENEMY_TARGET_MODES,
  buildEnemySkillText,
  isEffectAutoApplicable,
} from '../lib/enemyText';
import EffectRowsEditor from './EffectRowsEditor.jsx';
import EnemySkillEffectPreview from './EnemySkillEffectPreview.jsx';
import ConditionEditor from './ConditionEditor.jsx';

const RANK_VALUES = [
  ['F', 1], ['E', 10], ['D', 20], ['C', 30],
  ['B', 40], ['A', 50], ['S', 70], ['U', 80], ['EX', 100],
];

function Field({ label, required, hint, children }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-slate-600">
        {label}{required && <span className="text-rose-500"> *</span>}
      </span>
      {children}
      {hint && <span className="block text-[11px] text-slate-400">{hint}</span>}
    </label>
  );
}

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200';

export default function EnemySkillForm() {
  const [skillKey, setSkillKey] = useState('');
  const [name, setName] = useState('');
  const [ownerType, setOwnerType] = useState('global');
  const [ownerKey, setOwnerKey] = useState('*');
  const [category, setCategory] = useState('화력');
  const [rank, setRank] = useState('E');
  const [formula, setFormula] = useState('d20 + 랭크');
  const [effect, setEffect] = useState('');
  const [targetMode, setTargetMode] = useState('required');
  const [condition, setCondition] = useState('');
  const [memo, setMemo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const keyHasSpace = useMemo(() => /\s/.test(skillKey), [skillKey]);

  const previewPayload = useMemo(() => ({
    skill_key: skillKey.trim(),
    owner_type: ownerType,
    owner_key: ownerKey.trim(),
    name: name.trim(),
    category,
    rank,
    formula: formula.trim(),
    effect,
    target_mode: targetMode,
    condition,
    memo,
  }), [skillKey, ownerType, ownerKey, name, category, rank, formula, effect, targetMode, condition, memo]);

  const previewOutput = useMemo(() => {
    try { return buildEnemySkillText(previewPayload); } catch { return ''; }
  }, [previewPayload]);

  function reset() {
    setSkillKey('');
    setName('');
    setOwnerType('global');
    setOwnerKey('*');
    setCategory('화력');
    setRank('E');
    setFormula('d20 + 랭크');
    setEffect('');
    setTargetMode('required');
    setCondition('');
    setMemo('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setNotice('');

    const sk = skillKey.trim();
    const nm = name.trim();
    if (!sk) return setError('key를 입력해주세요.');
    if (/\s/.test(sk)) return setError('key에 공백을 사용할 수 없습니다.');
    if (!nm) return setError('이름을 입력해주세요.');
    if (!category) return setError('계열을 선택해주세요.');
    if (!rank) return setError('랭크를 선택해주세요.');
    if (!formula.trim()) return setError('계산식을 입력해주세요.');
    if (!targetMode) return setError('대상(target_mode)을 선택해주세요.');
    if ((ownerType === 'template' || ownerType === 'enemy') && !ownerKey.trim()) {
      return setError(`소유 타입이 ${ownerType}일 때는 소유 키를 입력해야 합니다.`);
    }
    if (!isEffectAutoApplicable(effect)) {
      return setError('자동 적용 가능한 효과 문법이 아닙니다.');
    }

    const payload = { ...previewPayload, skill_key: sk, name: nm, formula: formula.trim() };
    const outputText = buildEnemySkillText(payload);

    setSubmitting(true);
    try {
      const { error: err } = await createApplication({
        type: 'enemy_skill',
        title: nm,
        payload,
        outputText,
      });
      if (err) {
        setError(err.message || '신청 저장에 실패했습니다.');
        return;
      }
      setNotice('에너미 스킬 신청이 접수되었습니다.');
      reset();
    } catch (ex) {
      setError(ex?.message || '신청 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 기본 정보 */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">기본 정보</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="key (skill_key)" required hint="공백 불가. 영문/숫자/언더스코어 권장.">
            <input
              value={skillKey}
              onChange={(e) => setSkillKey(e.target.value)}
              className={`${inputCls} ${keyHasSpace ? 'border-rose-400' : ''}`}
              placeholder="ex) shadow_lash"
              autoComplete="off"
            />
            {keyHasSpace && <span className="text-[11px] text-rose-600">공백은 사용할 수 없습니다.</span>}
          </Field>
          <Field label="이름" required>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </Field>
          <Field label="소유 타입 (owner_type)">
            <select value={ownerType} onChange={(e) => setOwnerType(e.target.value)} className={inputCls}>
              {ENEMY_OWNER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field
            label="소유 키 (owner_key)"
            required={ownerType !== 'global'}
            hint={ownerType === 'global' ? '전역 스킬은 보통 *' : '템플릿/에너미 key 입력'}
          >
            <input value={ownerKey} onChange={(e) => setOwnerKey(e.target.value)} className={inputCls} />
          </Field>
          <Field label="계열 (category)" required>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
              {ENEMY_SKILL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="랭크 (rank)" required>
            <select value={rank} onChange={(e) => setRank(e.target.value)} className={inputCls}>
              {ENEMY_SKILL_RANKS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="대상 (target_mode)" required>
            <select value={targetMode} onChange={(e) => setTargetMode(e.target.value)} className={inputCls}>
              {ENEMY_TARGET_MODES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
        </div>
      </section>

      {/* 계산식 */}
      <section className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">계산식</h3>
        <Field label="계산식 (formula)" required>
          <input
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            className={inputCls}
            placeholder="ex) d20 + 랭크"
          />
        </Field>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-600 space-y-1">
          <div className="font-medium text-slate-700">계산식 예시</div>
          <div className="font-mono text-slate-600">d20 + 랭크 · 3d6 + 랭크 · 5d6 + 3</div>
          <div className="text-slate-500 mt-1">
            랭크 값: {RANK_VALUES.map(([r, v]) => `${r}=${v}`).join(', ')}
          </div>
        </div>
      </section>

      {/* 효과 제작 */}
      <section className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">효과 제작</h3>
        <EffectRowsEditor value={effect} onChange={setEffect} />
        <div>
          <div className="text-[11px] font-medium text-slate-500 mb-1">효과 미리보기</div>
          <EnemySkillEffectPreview value={effect} />
        </div>
      </section>

      {/* 조건 */}
      <section className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">발동 조건 (선택)</h3>
        <ConditionEditor value={condition} onChange={setCondition} />
      </section>

      {/* 메모 */}
      <section>
        <Field label="메모 (memo)">
          <textarea value={memo} onChange={(e) => setMemo(e.target.value)} rows={2} className={inputCls} />
        </Field>
      </section>

      {/* 등록 명령어 미리보기 */}
      <section className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">등록 명령어 미리보기</h3>
        <pre className="bg-slate-800 text-slate-100 rounded-xl border border-slate-700 p-3 text-[11px] whitespace-pre-wrap overflow-x-auto leading-relaxed font-mono">
          {previewOutput}
        </pre>
      </section>

      {error && (
        <p className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">{error}</p>
      )}
      {notice && (
        <p className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-700">{notice}</p>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-violet-200 hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98] transition disabled:opacity-60"
        >
          {submitting ? '신청 중...' : '에너미 스킬 신청'}
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={submitting}
          className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 active:scale-[0.98] transition disabled:opacity-60"
        >
          초기화
        </button>
      </div>
    </form>
  );
}
