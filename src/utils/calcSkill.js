import { getStatValue } from '../data/stats';
import { getRankValue } from '../data/skillRanks';
import { ABILITY_NAMES } from '../data/abilities';
import { PROFICIENCY_NAMES } from '../data/proficiencies';

const STAT_NAMES = ['근력', '민첩', '내구', '감각', '지능'];
const DB_VARS = ['현재체력', '최대체력', '이면침식', '일상점'];

// ── × → * 정규화 ──────────────────────────────────────────
export function normalizeFormula(formula) {
  return formula.replace(/×/g, '*');
}

// ── 허용 토큰 정규식 (순서 중요: 구체 → 일반) ────────────
const ALLOWED_TOKEN_RE = new RegExp(
  [
    '\\d+d\\d+',                            // XdY (2d6, 3d4, 10d6)
    'd\\d+',                                // dY  (d6, d20, d100)
    '\\d+(\\.\\d+)?',                       // numbers
    '랭크',
    '대상상태_[가-힣a-zA-Z0-9_]+',
    '대상스택_[가-힣a-zA-Z0-9_]+',
    '상태_[가-힣a-zA-Z0-9_]+',
    '스택_[가-힣a-zA-Z0-9_]+',
    ...DB_VARS,
    ...STAT_NAMES,
    ...ABILITY_NAMES,
    ...PROFICIENCY_NAMES,
    '[+\\-*/()]',
    '\\s+',
  ].join('|'),
  'g'
);

export function validateFormula(formula) {
  if (!formula.trim()) return [];
  const normalized = normalizeFormula(formula.trim());
  const matched = normalized.match(ALLOWED_TOKEN_RE)?.join('') ?? '';
  if (matched.replace(/\s/g, '') !== normalized.replace(/\s/g, '')) {
    return ['허용되지 않은 토큰이 포함되어 있습니다.'];
  }
  return [];
}

export function validateFormulaStructure(formula) {
  if (!formula.trim()) return [];
  const f = normalizeFormula(formula.trim());
  const warns = [];

  if (/[+\-*/]\s*$/.test(f)) {
    warns.push('계산식이 연산자로 끝납니다.');
  }
  if (/[+\-*/]\s*[+\-*/]/.test(f)) {
    warns.push('연산자가 연속되어 있습니다.');
  }

  let depth = 0;
  let bad = false;
  for (const ch of f) {
    if (ch === '(') depth++;
    if (ch === ')') { depth--; if (depth < 0) { bad = true; break; } }
  }
  if (bad) warns.push('괄호가 잘못 닫혔습니다.');
  else if (depth > 0) warns.push('괄호가 닫히지 않았습니다.');

  if (/\(\s*\)/.test(f)) {
    warns.push('빈 괄호가 있습니다.');
  }

  return warns;
}

export function hasTargetReference(formula) {
  return /대상상태_|대상스택_/.test(formula);
}

export function previewFormula(formula, stats, rank, dbOverrides = {}) {
  if (!formula.trim()) return { value: null, warnings: [], infos: [] };

  const warnings = [];
  const infos = [];

  // 1. × → *
  let expr = normalizeFormula(formula.trim());

  // 2. XdY → X*(Y+1)/2,  dY → (Y+1)/2
  expr = expr.replace(/(\d+)d(\d+)/g, (_, x, y) =>
    String(Number(x) * (Number(y) + 1) / 2)
  );
  expr = expr.replace(/d(\d+)/g, (_, y) =>
    String((Number(y) + 1) / 2)
  );

  // 3. 랭크
  expr = expr.replace(/랭크/g, String(getRankValue(rank)));

  // 4. 스탯
  for (const s of STAT_NAMES) {
    if (expr.includes(s)) {
      expr = expr.replace(new RegExp(s, 'g'), String(getStatValue(stats[s] ?? 'E')));
    }
  }

  // 5. 기능
  for (const a of ABILITY_NAMES) {
    if (expr.includes(a)) {
      expr = expr.replace(new RegExp(a, 'g'), '0');
    }
  }

  // 6. 숙련
  for (const p of PROFICIENCY_NAMES) {
    if (expr.includes(p)) {
      expr = expr.replace(new RegExp(p, 'g'), '0');
    }
  }

  // 7. 상태/스택 참조 → 0
  const hasStateRef = /상태_|대상상태_/.test(expr);
  const hasStackRef = /스택_|대상스택_/.test(expr);
  if (hasStateRef || hasStackRef) {
    expr = expr.replace(/(?:대상)?상태_[가-힣a-zA-Z0-9_]+/g, '0');
    expr = expr.replace(/(?:대상)?스택_[가-힣a-zA-Z0-9_]+/g, '0');
    infos.push('상태/스택 참조 변수는 실제 사용 시 DB의 현재 값을 참조합니다. 빌더 프리뷰에서는 0으로 계산됩니다.');
  }

  // 8. 고급 DB 변수
  const hasDbRef = DB_VARS.some(v => expr.includes(v));
  if (hasDbRef) {
    for (const v of DB_VARS) {
      const val = dbOverrides[v] ?? 0;
      expr = expr.replace(new RegExp(v, 'g'), String(val));
    }
    infos.push('고급 변수는 캐릭터 DB의 숫자형 필드를 참조합니다. 운영진 검수 대상입니다.');
    warnings.push('고급 DB 변수 사용 — 운영진 검수 대상입니다.');
  }

  // 9. 대상 참조 경고
  if (hasTargetReference(formula)) {
    warnings.push('이 계산식은 대상 지정이 필요합니다. 사용 예: !스킬 스킬명 대상:대상별명');
  }

  try {
    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + expr + ')')();
    if (typeof result !== 'number' || !isFinite(result)) {
      return { value: null, warnings: [...warnings, '계산 결과가 유효하지 않습니다.'], infos };
    }
    return { value: Math.round(result * 100) / 100, warnings, infos };
  } catch {
    return { value: null, warnings: [...warnings, '계산식 오류: 수식을 확인해주세요.'], infos };
  }
}

export function getEffectWarnings(effect) {
  const warnings = [];
  if (!effect.generatedText) return warnings;

  const { type, params } = effect;
  if (type === 'free' || type === 'custom') {
    warnings.push('운영진 수동 검수 대상입니다.');
  }
  if (type === 'template') {
    const name = params.templateName === '직접입력' ? params.customTemplateName : params.templateName;
    if (name === '출혈' && !params.value && !params.count) {
      warnings.push('출혈에는 수치 또는 횟수를 입력하는 것을 권장합니다.');
    }
    if (name === '구속' && params.resist !== 'possible') {
      warnings.push('구속 상태에는 저항 설정을 권장합니다.');
    }
  }
  if (type === 'stack' && (params.changeType === '증가' || params.changeType === '설정') && !params.max) {
    warnings.push('최대값 설정을 권장합니다.');
  }
  return warnings;
}
