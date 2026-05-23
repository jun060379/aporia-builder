import { getStatValue } from '../data/stats';
import { getRankValue } from '../data/skillRanks';
import { ABILITY_NAMES } from '../data/abilities';
import { PROFICIENCY_NAMES } from '../data/proficiencies';

const STAT_NAMES = ['근력', '민첩', '내구', '감각', '지능'];
const DB_VARS = ['현재체력', '최대체력', '이면침식', '일상점'];

const ALLOWED_TOKEN_RE = new RegExp(
  [
    '\\d+(\\.\\d+)?',
    '2d6', 'd20', 'd6',
    '랭크',
    '대상상태_[가-힣a-zA-Z0-9_]+',
    '대상스택_[가-힣a-zA-Z0-9_]+',
    '상태_[가-힣a-zA-Z0-9_]+',
    '스택_[가-힣a-zA-Z0-9_]+',
    '현재체력', '최대체력', '이면침식', '일상점',
    '근력', '민첩', '내구', '감각', '지능',
    ...ABILITY_NAMES,
    ...PROFICIENCY_NAMES,
    '[+\\-*/()]',
    '\\s+',
  ].join('|'),
  'g'
);

export function validateFormula(formula) {
  if (!formula.trim()) return [];
  const cleaned = formula.trim();
  const matched = cleaned.match(ALLOWED_TOKEN_RE)?.join('') ?? '';
  if (matched.replace(/\s/g, '') !== cleaned.replace(/\s/g, '')) {
    return ['허용되지 않은 토큰이 포함되어 있습니다.'];
  }
  return [];
}

export function hasTargetReference(formula) {
  return /대상상태_|대상스택_/.test(formula);
}

export function previewFormula(formula, stats, rank) {
  if (!formula.trim()) return { value: null, warnings: [], infos: [] };

  const warnings = [];
  const infos = [];
  let expr = formula.trim();

  expr = expr.replace(/2d6/g, '7');
  expr = expr.replace(/d20/g, '10.5');
  expr = expr.replace(/d6/g, '3.5');
  expr = expr.replace(/랭크/g, String(getRankValue(rank)));

  for (const s of STAT_NAMES) {
    if (expr.includes(s)) {
      expr = expr.replace(new RegExp(s, 'g'), String(getStatValue(stats[s] ?? 'E')));
    }
  }

  for (const a of ABILITY_NAMES) {
    if (expr.includes(a)) {
      expr = expr.replace(new RegExp(a, 'g'), '0');
      infos.push(`${a}는 실제 사용 시 캐릭터 기능 수치를 참조합니다.`);
    }
  }

  for (const p of PROFICIENCY_NAMES) {
    if (expr.includes(p)) {
      expr = expr.replace(new RegExp(p, 'g'), '0');
      infos.push(`${p}는 실제 사용 시 캐릭터 숙련 수치를 참조합니다.`);
    }
  }

  const hasStateRef = /상태_|대상상태_/.test(expr);
  const hasStackRef = /스택_|대상스택_/.test(expr);
  const hasDbRef = DB_VARS.some(v => expr.includes(v));

  if (hasStateRef) {
    expr = expr.replace(/(?:대상)?상태_[가-힣a-zA-Z0-9_]+/g, '0');
    infos.push('상태 참조 변수는 실제 사용 시 현재 상태/스택을 참조합니다.');
  }
  if (hasStackRef) {
    expr = expr.replace(/(?:대상)?스택_[가-힣a-zA-Z0-9_]+/g, '0');
    if (!hasStateRef) infos.push('스택 참조 변수는 실제 사용 시 현재 스택값을 참조합니다.');
  }
  if (hasDbRef) {
    for (const v of DB_VARS) {
      expr = expr.replace(new RegExp(v, 'g'), '0');
    }
    infos.push('DB 변수는 실제 사용 시 캐릭터 DB 값을 참조합니다.');
    warnings.push('고급 DB 변수 사용 — 운영진 검수 대상입니다.');
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
