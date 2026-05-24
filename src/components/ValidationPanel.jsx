import { validateFormula, validateFormulaStructure, hasTargetReference, getEffectWarnings } from '../utils/calcSkill';
import { calcAllActions } from '../utils/calcAction';
import { RANK_MAP } from '../data/skillRanks';

const HIGH_RANKS = ['S', 'U', 'EX'];

function buildIssues(char, remaining, skills, stats, abilities, proficiencies, editingSkill) {
  const issues = [];

  // 1. 성장예산 초과
  if (remaining < 0) {
    issues.push({ type: 'err', label: '성장예산 초과', detail: `${Math.abs(remaining)}pt 초과. 왼쪽 패널 → 성장예산을 확인하세요.` });
  } else {
    issues.push({ type: 'ok', label: `성장예산 정상`, detail: `잔여 ${remaining}pt` });
  }

  // 2. 스킬 포함 예상 초과
  if (editingSkill) {
    const editingCost = RANK_MAP[editingSkill.rank] ?? 1;
    if (remaining - editingCost < 0) {
      issues.push({
        type: 'warn',
        label: '스킬 포함 예산 초과 예상',
        detail: '현재 작성 중인 스킬까지 승인될 경우 성장예산을 초과합니다.',
      });
    }
  }

  // 3. 캐릭터 이름
  if (!char.name?.trim()) {
    issues.push({ type: 'err', label: '캐릭터 이름 없음', detail: '기본 정보 탭에서 이름을 입력하세요.' });
  } else {
    issues.push({ type: 'ok', label: `캐릭터 이름 확인됨`, detail: char.name });
  }

  // 4. 주력 액션 기대값 / 핵심 기능·숙련 체크
  if (stats && abilities && proficiencies) {
    const allActions = calcAllActions(stats, abilities, proficiencies);
    const maxExpected = Math.max(...allActions.map(a => a.result.expected));
    if (maxExpected < 15) {
      issues.push({
        type: 'warn',
        label: '주력 액션 낮음',
        detail: '주력 액션이 낮습니다. 초보자라면 프리셋 사용을 권장합니다.',
      });
    } else {
      const bestAction = allActions.reduce((best, a) =>
        a.result.expected > best.result.expected ? a : best
      );
      const allMultZero = bestAction.mult.every(({ key }) => {
        if (key.endsWith('숙련')) return (proficiencies[key] ?? 0) === 0;
        return (abilities[key] ?? 0) === 0;
      });
      if (allMultZero) {
        issues.push({
          type: 'warn',
          label: '핵심 기능·숙련 미배분',
          detail: '선택한 액션의 핵심 기능 또는 숙련이 낮습니다.',
        });
      }
    }
  }

  if (skills.length === 0) return issues;

  // 5. 스킬명 비어 있음
  const noName = skills.filter(sk => !sk.name?.trim());
  if (noName.length > 0) {
    issues.push({ type: 'warn', label: `이름 없는 스킬 ${noName.length}개`, detail: '스킬 메이커에서 스킬 이름을 입력하세요.' });
  }

  // 6. 계산식 경고
  skills.forEach(sk => {
    const n = sk.name?.trim() || '(이름 없음)';
    if (!sk.formula?.trim()) {
      issues.push({ type: 'warn', label: `계산식 없음 [${n}]`, detail: '계산식이 비어 있습니다. 스킬 메이커에서 계산식을 입력하세요.' });
    } else {
      const msgs = [...validateFormula(sk.formula), ...validateFormulaStructure(sk.formula)];
      msgs.forEach(m => issues.push({ type: 'warn', label: `계산식 경고 [${n}]`, detail: m }));
    }
  });

  // 7. 대상 참조 — 조건 미명시
  skills.forEach(sk => {
    if (hasTargetReference(sk.formula ?? '') && !/대상/.test(sk.condition ?? '')) {
      const n = sk.name?.trim() || '(이름 없음)';
      issues.push({
        type: 'warn',
        label: `대상 참조 — 조건 미명시 [${n}]`,
        detail: '조건 칸에 "대상 지정 필요" 문구를 추가하세요.',
      });
    }
  });

  // 8. 고랭크 심사 필요
  skills.forEach(sk => {
    if (HIGH_RANKS.includes(sk.rank)) {
      const n = sk.name?.trim() || '(이름 없음)';
      issues.push({
        type: 'warn',
        label: `${sk.rank} 랭크 — 운영진 심사 필요 [${n}]`,
        detail: 'S / U / EX 랭크는 신청 전 운영진과 사전 협의를 권장합니다.',
      });
    }
  });

  // 9. 효과 경고
  skills.forEach(sk => {
    const n = sk.name?.trim() || '(이름 없음)';
    (sk.effects ?? []).forEach(ef => {
      getEffectWarnings(ef)
        .forEach(w => issues.push({ type: 'warn', label: `[${n}] ${w}` }));
    });
  });

  return issues;
}

function IssueRow({ type, label, detail }) {
  const colors = {
    err:  { bg: 'bg-rose-50',    border: 'border-rose-200',   icon: '✕', iconCls: 'text-rose-500',    labelCls: 'text-rose-800',    detailCls: 'text-rose-600/70'   },
    warn: { bg: 'bg-amber-50',   border: 'border-amber-200',  icon: '!', iconCls: 'text-amber-500',   labelCls: 'text-amber-800',   detailCls: 'text-amber-600/70'  },
    ok:   { bg: 'bg-emerald-50', border: 'border-emerald-200',icon: '✓', iconCls: 'text-emerald-500', labelCls: 'text-emerald-800', detailCls: 'text-emerald-600/70'},
  };
  const c = colors[type] ?? colors.ok;
  return (
    <div className={`flex items-start gap-2.5 rounded-xl border px-3 py-2 ${c.bg} ${c.border}`}>
      <span className={`text-xs font-bold w-4 shrink-0 mt-0.5 ${c.iconCls}`}>{c.icon}</span>
      <div className="min-w-0">
        <p className={`text-xs font-semibold leading-snug ${c.labelCls}`}>{label}</p>
        {detail && <p className={`text-[11px] mt-0.5 leading-relaxed ${c.detailCls}`}>{detail}</p>}
      </div>
    </div>
  );
}

export default function ValidationPanel({ char, remaining, skills, stats, abilities, proficiencies, editingSkill }) {
  const issues = buildIssues(char, remaining, skills, stats, abilities, proficiencies, editingSkill);
  const errors   = issues.filter(i => i.type === 'err');
  const warnings = issues.filter(i => i.type === 'warn');
  const oks      = issues.filter(i => i.type === 'ok');
  const allClear = errors.length === 0 && warnings.length === 0;

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-lg shadow-violet-100/20 p-5 space-y-4">

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-violet-300 font-mono tracking-widest">—</span>
          <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">신청 전 검수</h2>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {errors.length > 0 && (
            <span className="text-[11px] bg-rose-50 border border-rose-200 text-rose-700 font-bold px-2 py-0.5 rounded-lg">
              오류 {errors.length}
            </span>
          )}
          {warnings.length > 0 && (
            <span className="text-[11px] bg-amber-50 border border-amber-200 text-amber-700 font-bold px-2 py-0.5 rounded-lg">
              경고 {warnings.length}
            </span>
          )}
          {allClear && (
            <span className="text-[11px] bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-2 py-0.5 rounded-lg">
              검수 통과 ✓
            </span>
          )}
        </div>
      </div>

      {allClear && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-center">
          <p className="text-sm font-bold text-emerald-700">모든 항목 이상 없음</p>
          <p className="text-[11px] text-emerald-600/70 mt-0.5">신청 텍스트를 복사해 신청 양식에 붙여넣으세요.</p>
        </div>
      )}

      {errors.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] text-rose-500 font-semibold uppercase tracking-widest">오류 — 수정 필요</p>
          {errors.map((item, i) => <IssueRow key={i} {...item} />)}
        </div>
      )}

      {warnings.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] text-amber-500 font-semibold uppercase tracking-widest">경고 — 확인 권장</p>
          {warnings.map((item, i) => <IssueRow key={i} {...item} />)}
        </div>
      )}

      {oks.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] text-emerald-500 font-semibold uppercase tracking-widest">정상</p>
          {oks.map((item, i) => <IssueRow key={i} {...item} />)}
        </div>
      )}
    </div>
  );
}
