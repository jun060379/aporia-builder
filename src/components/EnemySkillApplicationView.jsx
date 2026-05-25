import { useState } from 'react';

function MiniStatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-2 py-2 text-center">
      <div className="text-[10px] text-slate-400 tracking-wider">{label}</div>
      <div className="text-base font-semibold text-slate-800 mt-0.5 break-all">{value ?? '-'}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="space-y-2">
      <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{title}</h4>
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

export default function EnemySkillApplicationView({ application }) {
  const p = application?.payload ?? {};
  const outputText = application?.output_text || '';
  const [showOutput, setShowOutput] = useState(false);

  return (
    <div className="space-y-5">
      <Section title="기본 정보">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <MiniStatCard label="key" value={p.skill_key || '-'} />
          <MiniStatCard label="이름" value={p.name || '-'} />
          <MiniStatCard label="소유 타입" value={p.owner_type || '-'} />
          <MiniStatCard label="소유 키" value={p.owner_key || '-'} />
          <MiniStatCard label="계열" value={p.category || '-'} />
          <MiniStatCard label="랭크" value={p.rank || '-'} />
          <MiniStatCard label="대상" value={p.target_mode || '-'} />
        </div>
      </Section>

      <Section title="계산식">
        {p.formula
          ? <code className="block rounded-lg bg-slate-100 border border-slate-200 px-3 py-2 text-xs text-slate-800 font-mono">{p.formula}</code>
          : <p className="text-xs text-slate-400 italic">계산식 없음</p>}
      </Section>

      <Section title="효과">
        <TextBlock value={p.effect} emptyLabel="효과 없음" />
      </Section>

      <Section title="메모">
        <TextBlock value={p.memo} emptyLabel="메모 없음" />
      </Section>

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
