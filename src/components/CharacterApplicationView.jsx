import { useMemo, useState } from 'react';
import { STAT_NAMES } from '../data/stats';
import { ABILITY_NAMES } from '../data/abilities';
import { PROFICIENCY_NAMES } from '../data/proficiencies';
import { calcAllActions } from '../utils/calcAction';
import { normalizeFormula } from '../utils/calcSkill';

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

function MiniStatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-2 py-2 text-center">
      <div className="text-[10px] text-slate-400 tracking-wider">{label}</div>
      <div className="text-base font-semibold text-slate-800 mt-0.5">{value ?? '-'}</div>
    </div>
  );
}

function TagCard({ label, value, dim }) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-xs ${
        dim
          ? 'border-slate-100 bg-slate-50 text-slate-400'
          : 'border-indigo-100 bg-indigo-50/60 text-slate-700'
      }`}
    >
      <span className="truncate">{label}</span>
      <span className={`shrink-0 ml-2 font-semibold ${dim ? 'text-slate-400' : 'text-indigo-700'}`}>
        {value ?? 0}
      </span>
    </div>
  );
}

function CollapsibleCode({ openLabel, closeLabel, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-xs text-violet-600 hover:underline"
      >
        {open ? closeLabel : openLabel}
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
}

export default function CharacterApplicationView({ application }) {
  const payload = application?.payload ?? {};
  const outputText = application?.output_text || '';

  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
  const char = isObj(payload.char) ? payload.char : {};
  const stats = isObj(payload.stats) ? payload.stats : null;
  // payload spec describes both "features" (the spec wording) and the actual builder field "abilities".
  const abilities = isObj(payload.abilities) ? payload.abilities : (isObj(payload.features) ? payload.features : null);
  const proficiencies = isObj(payload.proficiencies) ? payload.proficiencies : null;
  const skills = Array.isArray(payload.skills)
    ? payload.skills.filter((s) => s && typeof s === 'object')
    : null;

  // 액션 계산: payload에 결과가 들어있으면 그걸 쓰고, 없으면 stats/abilities/proficiencies가 있을 때 계산.
  const actions = useMemo(() => {
    if (Array.isArray(payload.calculatedActions)) return payload.calculatedActions;
    if (stats && abilities && proficiencies) {
      try {
        return calcAllActions(stats, abilities, proficiencies);
      } catch {
        return null;
      }
    }
    return null;
  }, [payload.calculatedActions, stats, abilities, proficiencies]);

  const [showZeroAbility, setShowZeroAbility] = useState(false);
  const [showZeroProf, setShowZeroProf] = useState(false);

  const name = char.name || payload.name || '(이름 없음)';
  const race = char.race || payload.species || '-';
  const level = char.level ?? payload.level ?? '-';
  const erosion = char.erosion ?? payload.erosion ?? '0';

  return (
    <div className="space-y-5">
      {/* 기본 정보 */}
      <Section title="기본 정보">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <MiniStatCard label="이름" value={name} />
          <MiniStatCard label="종족" value={race} />
          <MiniStatCard label="레벨" value={`Lv.${level}`} />
          <MiniStatCard label="이면침식" value={erosion} />
        </div>
      </Section>

      {/* 스탯 */}
      {stats && (
        <Section title="스탯">
          <div className="grid grid-cols-5 gap-2">
            {STAT_NAMES.map((s) => (
              <MiniStatCard key={s} label={s} value={stats[s] ?? 'E'} />
            ))}
          </div>
        </Section>
      )}

      {/* 기능 */}
      {abilities && (
        <Section
          title="기능"
          right={
            <button
              type="button"
              onClick={() => setShowZeroAbility((v) => !v)}
              className="text-[11px] text-slate-500 hover:text-slate-700"
            >
              {showZeroAbility ? '0값 숨기기' : '전체 수치 보기'}
            </button>
          }
        >
          <AbilityGrid names={ABILITY_NAMES} values={abilities} showZero={showZeroAbility} emptyLabel="투자된 기능 없음" />
        </Section>
      )}

      {/* 숙련 */}
      {proficiencies && (
        <Section
          title="숙련"
          right={
            <button
              type="button"
              onClick={() => setShowZeroProf((v) => !v)}
              className="text-[11px] text-slate-500 hover:text-slate-700"
            >
              {showZeroProf ? '0값 숨기기' : '전체 수치 보기'}
            </button>
          }
        >
          <AbilityGrid names={PROFICIENCY_NAMES} values={proficiencies} showZero={showZeroProf} emptyLabel="투자된 숙련 없음" />
        </Section>
      )}

      {/* 주요 액션 */}
      {Array.isArray(actions) && actions.filter((a) => a && typeof a === 'object').length > 0 && (
        <Section title="주요 액션">
          <div className="space-y-1.5">
            {actions.filter((a) => a && typeof a === 'object').map((a, i) => {
              const r = (a.result && typeof a.result === 'object') ? a.result : a;
              const finalCoef = r?.finalCoef ?? a.finalCoef;
              const diceCount = r?.diceCount ?? a.diceCount;
              return (
                <div
                  key={a.name || a.action || i}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs"
                >
                  <span className="font-medium text-slate-700 truncate">{a.name || a.action || `액션 ${i + 1}`}</span>
                  <span className="shrink-0 ml-2 text-slate-500">
                    계수 <b className="text-slate-800">{typeof finalCoef === 'number' ? finalCoef.toFixed(1) : (finalCoef ?? '-')}</b>
                    <span className="mx-1.5 text-slate-300">·</span>
                    <b className="text-indigo-700">{diceCount ?? '-'}</b>d
                  </span>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* 스킬 */}
      <Section title="스킬">
        {!skills || skills.length === 0 ? (
          <p className="text-xs text-slate-400 italic">등록된 스킬 없음</p>
        ) : (
          <div className="space-y-2">
            {skills.map((sk, i) => (
              <SkillCard key={sk.id ?? i} sk={sk} />
            ))}
          </div>
        )}
      </Section>

      {/* 신청 원문 */}
      {outputText && (
        <CollapsibleCode openLabel="▸ 신청 원문 보기" closeLabel="▾ 신청 원문 숨기기">
          <pre className="bg-slate-800 text-slate-100 rounded-xl border border-slate-700 p-4 text-xs whitespace-pre-wrap overflow-x-auto leading-relaxed font-mono">
            {outputText}
          </pre>
        </CollapsibleCode>
      )}
    </div>
  );
}

function AbilityGrid({ names, values, showZero, emptyLabel }) {
  const items = names
    .map((n) => ({ n, v: Number(values?.[n] ?? 0) }))
    .filter((it) => showZero || it.v > 0);

  if (items.length === 0) {
    return <p className="text-xs text-slate-400 italic">{emptyLabel}</p>;
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
      {items.map(({ n, v }) => (
        <TagCard key={n} label={n} value={v} dim={v === 0} />
      ))}
    </div>
  );
}

function SkillCard({ sk }) {
  const effectLines = (sk?.effects ?? [])
    .filter((e) => e?.confirmed)
    .map((e) => e?.generatedText)
    .filter(Boolean);

  return (
    <div className="rounded-xl border border-indigo-100 bg-white/80 p-3 space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h5 className="text-sm font-semibold text-slate-800">{sk?.name || '(이름 없음)'}</h5>
        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
          {sk?.tradition && (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-slate-600">{sk.tradition}</span>
          )}
          {sk?.series && (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-slate-600">{sk.series}</span>
          )}
          {sk?.rank && (
            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-indigo-700">랭크 {sk.rank}</span>
          )}
        </div>
      </div>
      {sk?.formula != null && sk.formula !== '' && (
        <div className="text-[11px] text-slate-500">
          <span className="text-slate-400">계산식 </span>
          <code className="text-slate-700">{(() => {
            try { return normalizeFormula(String(sk.formula)); } catch { return String(sk.formula); }
          })()}</code>
        </div>
      )}
      {effectLines.length > 0 && (
        <div className="rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-1.5 text-[11px] text-slate-700 whitespace-pre-wrap">
          <div className="text-[10px] text-slate-400 mb-0.5">효과</div>
          {effectLines.join('\n')}
        </div>
      )}
      {(sk?.condition || sk?.cost || sk?.description) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[11px] text-slate-600">
          {sk?.condition && <div><span className="text-slate-400">조건 </span>{sk.condition}</div>}
          {sk?.cost && <div><span className="text-slate-400">대가 </span>{sk.cost}</div>}
          {sk?.description && <div className="sm:col-span-3"><span className="text-slate-400">설명 </span>{sk.description}</div>}
        </div>
      )}
    </div>
  );
}
