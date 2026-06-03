import { useState } from 'react';
import { validateFormula, hasTargetReference } from '../utils/calcSkill';

function CheckItem({ auto, checked, onChange, label, detail, status }) {
  const statusCls =
    status === 'ok'   ? 'border-emerald-200 bg-emerald-50' :
    status === 'warn' ? 'border-amber-200 bg-amber-50' :
    status === 'err'  ? 'border-rose-200 bg-rose-50' :
    'border-slate-200 bg-white';

  const iconCls =
    status === 'ok'   ? 'text-emerald-600' :
    status === 'warn' ? 'text-amber-600' :
    status === 'err'  ? 'text-rose-600' :
    checked ? 'text-emerald-600' : 'text-slate-300';

  const icon =
    status === 'ok'  || (!auto && checked)   ? '✓' :
    status === 'err' || status === 'warn'     ? '!' : '○';

  return (
    <div className={`flex items-start gap-2.5 rounded-xl border px-3 py-2.5 transition-colors ${statusCls}`}>
      {auto ? (
        <span className={`text-sm font-bold w-4 shrink-0 mt-0.5 ${iconCls}`}>{icon}</span>
      ) : (
        <button
          onClick={onChange}
          className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors text-xs font-bold ${
            checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-indigo-400'
          }`}
        >
          {checked ? '✓' : ''}
        </button>
      )}
      <div className="min-w-0">
        <p className={`text-xs font-medium leading-snug ${
          status === 'err'  ? 'text-rose-700' :
          status === 'warn' ? 'text-amber-700' :
          status === 'ok' || checked ? 'text-emerald-700' : 'text-slate-600'
        }`}>{label}</p>
        {detail && <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{detail}</p>}
      </div>
    </div>
  );
}

export default function Checklist({ remaining, skills }) {
  const [manualChecks, setManualChecks] = useState({ targetCond: false, copied: false });
  const toggle = (key) => setManualChecks(p => ({ ...p, [key]: !p[key] }));

  const budgetOk = remaining >= 0;

  const skillsWithErrors = skills.filter(sk => validateFormula(sk.formula ?? '').length > 0);
  const formulaOk = skillsWithErrors.length === 0;

  const targetSkills = skills.filter(sk => hasTargetReference(sk.formula ?? ''));
  const targetConditionOk = targetSkills.length === 0 ||
    targetSkills.every(sk => (sk.condition ?? '').includes('대상'));

  const allOk = budgetOk && formulaOk &&
    (targetSkills.length === 0 || targetConditionOk) && manualChecks.copied;

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-lg shadow-violet-100/20 p-5">
      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-violet-300 font-mono tracking-widest">—</span>
          <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">신청 전 체크리스트</h2>
        </div>
        {allOk && (
          <span className="text-[11px] bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold px-2 py-0.5 rounded-lg">모두 통과 ✓</span>
        )}
      </div>

      <div className="space-y-2">
        <CheckItem
          auto
          status={budgetOk ? 'ok' : 'err'}
          label={budgetOk ? '성장예산 범위 내입니다.' : `성장예산 초과 (${Math.abs(remaining)}점 초과)`}
          detail={budgetOk ? `남은 예산: ${remaining}pt` : '왼쪽 패널 → 성장예산을 확인하세요.'}
        />

        <CheckItem
          auto
          status={formulaOk ? 'ok' : 'err'}
          label={formulaOk ? '스킬 계산식에 오류가 없습니다.' : `계산식 오류 (${skillsWithErrors.length}개 스킬)`}
          detail={formulaOk ? undefined : `오류 스킬: ${skillsWithErrors.map(s => s.name || '(이름 없음)').join(', ')}`}
        />

        {targetSkills.length > 0 && (
          <CheckItem
            auto
            status={targetConditionOk ? 'ok' : 'warn'}
            label={targetConditionOk
              ? '대상 참조 스킬에 조건이 명시되었습니다.'
              : '대상 참조 스킬의 조건 칸을 확인하세요.'}
            detail={`대상 참조 스킬: ${targetSkills.map(s => s.name || '(이름 없음)').join(', ')}`}
          />
        )}

        <CheckItem
          auto={false}
          checked={manualChecks.copied}
          onChange={() => toggle('copied')}
          status={manualChecks.copied ? 'ok' : undefined}
          label="신청 텍스트를 복사했습니다."
          detail="아래 신청 텍스트의 복사 버튼을 눌러 복사해주세요."
        />
      </div>
    </div>
  );
}
