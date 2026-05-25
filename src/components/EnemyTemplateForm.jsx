import { useMemo, useState } from 'react';
import { createApplication } from '../lib/applications';
import { ENEMY_ACTION_NAMES, buildEnemyTemplateText } from '../lib/enemyText';

const KEY_PATTERN = /^[A-Za-z0-9_]+$/;

function emptyActions() {
  return Object.fromEntries(ENEMY_ACTION_NAMES.map((n) => [n, 0]));
}

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

export default function EnemyTemplateForm() {
  const [templateKey, setTemplateKey] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [threat, setThreat] = useState('1');
  const [maxHp, setMaxHp] = useState('30');
  const [actions, setActions] = useState(emptyActions());
  const [rule, setRule] = useState('');
  const [signs, setSigns] = useState('');
  const [memo, setMemo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const keyHasSpace = useMemo(() => /\s/.test(templateKey), [templateKey]);
  const keyShapeWarn = useMemo(
    () => Boolean(templateKey) && !KEY_PATTERN.test(templateKey),
    [templateKey],
  );

  function setActionAt(name, raw) {
    const n = raw === '' ? 0 : Number(raw);
    setActions((prev) => ({ ...prev, [name]: Number.isFinite(n) ? n : 0 }));
  }

  function reset() {
    setTemplateKey('');
    setName('');
    setCategory('');
    setThreat('1');
    setMaxHp('30');
    setActions(emptyActions());
    setRule('');
    setSigns('');
    setMemo('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setNotice('');

    const tk = templateKey.trim();
    const nm = name.trim();
    const hp = Number(maxHp);
    const th = Number(threat || 0);

    if (!tk) return setError('key를 입력해주세요.');
    if (/\s/.test(tk)) return setError('key에 공백을 사용할 수 없습니다.');
    if (!nm) return setError('이름을 입력해주세요.');
    if (!Number.isFinite(hp) || hp < 1) return setError('체력은 1 이상의 숫자여야 합니다.');
    for (const an of ENEMY_ACTION_NAMES) {
      const v = Number(actions[an] ?? 0);
      if (!Number.isFinite(v) || v < 0) return setError(`${an} 수치는 0 이상의 숫자여야 합니다.`);
    }

    const payload = {
      template_key: tk,
      name: nm,
      category: category.trim(),
      threat: Number.isFinite(th) ? th : 1,
      max_hp: hp,
      actions: Object.fromEntries(ENEMY_ACTION_NAMES.map((n) => [n, Number(actions[n] ?? 0)])),
      rule,
      signs,
      memo,
    };
    const outputText = buildEnemyTemplateText(payload);

    setSubmitting(true);
    try {
      const { error: err } = await createApplication({
        type: 'enemy_template',
        title: nm,
        payload,
        outputText,
      });
      if (err) {
        setError(err.message || '신청 저장에 실패했습니다.');
        return;
      }
      setNotice('에너미 템플릿 신청이 접수되었습니다.');
      reset();
    } catch (ex) {
      setError(ex?.message || '신청 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">기본 정보</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            label="key (template_key)"
            required
            hint="영문/숫자/언더스코어 권장. 공백 불가."
          >
            <input
              value={templateKey}
              onChange={(e) => setTemplateKey(e.target.value)}
              className={`${inputCls} ${keyHasSpace ? 'border-rose-400' : ''}`}
              placeholder="ex) shadow_hound"
              autoComplete="off"
            />
            {keyHasSpace && <span className="text-[11px] text-rose-600">공백은 사용할 수 없습니다.</span>}
            {!keyHasSpace && keyShapeWarn && (
              <span className="text-[11px] text-amber-600">영문/숫자/언더스코어 사용을 권장합니다.</span>
            )}
          </Field>
          <Field label="이름" required>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </Field>
          <Field label="분류">
            <input value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls} />
          </Field>
          <Field label="위험도">
            <input
              type="number"
              min={0}
              value={threat}
              onChange={(e) => setThreat(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="체력 (max_hp)" required>
            <input
              type="number"
              min={1}
              value={maxHp}
              onChange={(e) => setMaxHp(e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">액션 수치</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
          {ENEMY_ACTION_NAMES.map((an) => (
            <label key={an} className="rounded-xl border border-slate-200 bg-white p-2 flex flex-col items-center gap-1">
              <span className="text-[11px] text-slate-500">{an}</span>
              <input
                type="number"
                min={0}
                value={actions[an]}
                onChange={(e) => setActionAt(an, e.target.value)}
                className="w-full text-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-200"
              />
            </label>
          ))}
        </div>
        <p className="text-[11px] text-slate-400">빈칸이면 0으로 저장됩니다.</p>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">서사 / 운영</h3>
        <Field label="규칙 (rule)">
          <textarea value={rule} onChange={(e) => setRule(e.target.value)} rows={3} className={inputCls} />
        </Field>
        <Field label="징후 (signs)">
          <textarea value={signs} onChange={(e) => setSigns(e.target.value)} rows={3} className={inputCls} />
        </Field>
        <Field label="메모 (memo)">
          <textarea value={memo} onChange={(e) => setMemo(e.target.value)} rows={3} className={inputCls} />
        </Field>
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
          {submitting ? '신청 중...' : '에너미 템플릿 신청'}
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
