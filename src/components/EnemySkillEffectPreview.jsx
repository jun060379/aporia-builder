import { EFFECT_PREFIXES, isEffectAutoApplicable } from '../lib/enemyText';

function lineOk(line) {
  const t = (line || '').trim();
  if (!t) return null;
  return EFFECT_PREFIXES.some((p) => t.startsWith(p));
}

export default function EnemySkillEffectPreview({ value }) {
  const text = String(value ?? '');
  const lines = text.split('\n');
  const nonEmpty = lines.filter((l) => l.trim().length > 0);

  if (nonEmpty.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-400 italic">
        효과 없음
      </div>
    );
  }

  const allOk = isEffectAutoApplicable(text) && nonEmpty.every((l) => lineOk(l));

  return (
    <div className="space-y-1.5">
      <div
        className={`rounded-lg border px-3 py-2 text-[11px] ${
          allOk
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : 'border-amber-200 bg-amber-50 text-amber-700'
        }`}
      >
        {allOk
          ? '자동 적용 가능한 효과 문법입니다.'
          : '자동 적용 가능한 효과 문법이 아닙니다.'}
      </div>
      <div className="rounded-lg border border-slate-200 bg-white divide-y divide-slate-100">
        {lines.map((line, i) => {
          const ok = lineOk(line);
          if (ok === null) {
            return (
              <div key={i} className="px-3 py-1.5 text-[11px] text-slate-300 font-mono">
                (빈 줄)
              </div>
            );
          }
          return (
            <div
              key={i}
              className="px-3 py-1.5 text-[11px] font-mono flex items-start gap-2"
            >
              <span className={ok ? 'text-emerald-600' : 'text-amber-600'}>{ok ? '✓' : '!'}</span>
              <code className={ok ? 'text-slate-700' : 'text-amber-700'}>{line}</code>
            </div>
          );
        })}
      </div>
    </div>
  );
}
