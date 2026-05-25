import { useState } from 'react';
import { ENEMY_ACTION_NAMES } from '../lib/enemyText';

function MiniStatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-2 py-2 text-center">
      <div className="text-[10px] text-slate-400 tracking-wider">{label}</div>
      <div className="text-base font-semibold text-slate-800 mt-0.5">{value ?? '-'}</div>
    </div>
  );
}

function Section({ title, children, right }) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{title}</h4>
        {right}
      </div>
      {children}
    </section>
  );
}

function TextBlock({ value, emptyLabel }) {
  if (!value || !String(value).trim()) {
    return <p className="text-xs text-slate-400 italic">{emptyLabel}</p>;
  }
  return (
    <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-700 whitespace-pre-wrap">
      {value}
    </div>
  );
}

export default function EnemyTemplateApplicationView({ application }) {
  const p = application?.payload ?? {};
  const actions = (p.actions && typeof p.actions === 'object') ? p.actions : {};
  const outputText = application?.output_text || '';
  const [showZero, setShowZero] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const items = ENEMY_ACTION_NAMES
    .map((n) => ({ n, v: Number(actions[n] ?? 0) }))
    .filter((it) => showZero || it.v > 0);

  return (
    <div className="space-y-5">
      <Section title="기본 정보">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <MiniStatCard label="key" value={p.template_key || '-'} />
          <MiniStatCard label="이름" value={p.name || '-'} />
          <MiniStatCard label="분류" value={p.category || '-'} />
          <MiniStatCard label="위험도" value={p.threat ?? '-'} />
          <MiniStatCard label="체력" value={p.max_hp ?? '-'} />
        </div>
      </Section>

      <Section
        title="액션 수치"
        right={
          <button
            type="button"
            onClick={() => setShowZero((v) => !v)}
            className="text-[11px] text-slate-500 hover:text-slate-700"
          >
            {showZero ? '0값 숨기기' : '전체 수치 보기'}
          </button>
        }
      >
        {items.length === 0 ? (
          <p className="text-xs text-slate-400 italic">투자된 액션 수치 없음</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
            {items.map(({ n, v }) => (
              <div
                key={n}
                className={`flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-xs ${
                  v === 0 ? 'border-slate-100 bg-slate-50 text-slate-400' : 'border-indigo-100 bg-indigo-50/60 text-slate-700'
                }`}
              >
                <span className="truncate">{n}</span>
                <b className={`shrink-0 ml-2 ${v === 0 ? 'text-slate-400' : 'text-indigo-700'}`}>{v}</b>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="규칙"><TextBlock value={p.rule} emptyLabel="규칙 없음" /></Section>
      <Section title="징후"><TextBlock value={p.signs} emptyLabel="징후 없음" /></Section>
      <Section title="메모"><TextBlock value={p.memo} emptyLabel="메모 없음" /></Section>

      {outputText && (
        <div>
          <button
            type="button"
            onClick={() => setShowOutput((v) => !v)}
            className="text-xs text-violet-600 hover:underline"
          >
            {showOutput ? '▾ 등록 명령어 숨기기' : '▸ 등록 명령어 보기'}
          </button>
          {showOutput && (
            <pre className="mt-2 bg-slate-800 text-slate-100 rounded-xl border border-slate-700 p-4 text-xs whitespace-pre-wrap overflow-x-auto leading-relaxed font-mono">
              {outputText}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
