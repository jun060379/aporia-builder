import { getStatValue } from '../data/stats';
import { getRankValue } from '../data/skillRanks';

const STAT_NAMES = ['근력', '민첩', '내구', '감각', '지능'];

const ALLOWED_TOKEN_RE = new RegExp(
  [
    '\\d+(\\.\\d+)?',
    '2d6',
    'd20',
    'd6',
    '랭크',
    '근력', '민첩', '내구', '감각', '지능',
    '스택_[가-힣a-zA-Z0-9_]+',
    '대상상태_[가-힣a-zA-Z0-9_]+',
    '[+\\-*/()]',
    '\\s+',
  ].join('|'),
  'g'
);

export function validateFormula(formula) {
  if (!formula.trim()) return [];
  const errors = [];
  const cleaned = formula.trim();
  const matched = cleaned.match(ALLOWED_TOKEN_RE)?.join('') ?? '';
  if (matched.replace(/\s/g, '') !== cleaned.replace(/\s/g, '')) {
    errors.push('허용되지 않은 토큰이 포함되어 있습니다.');
  }
  return errors;
}

export function previewFormula(formula, stats, rank) {
  if (!formula.trim()) return { value: null, warnings: [] };

  const warnings = [];
  let expr = formula.trim();

  expr = expr.replace(/2d6/g, '7');
  expr = expr.replace(/d20/g, '10.5');
  expr = expr.replace(/d6/g, '3.5');
  expr = expr.replace(/랭크/g, String(getRankValue(rank)));

  for (const s of STAT_NAMES) {
    const re = new RegExp(s, 'g');
    if (re.test(expr)) {
      expr = expr.replace(new RegExp(s, 'g'), String(getStatValue(stats[s] ?? 'E')));
    }
  }

  const hasVar = /스택_|대상상태_/.test(expr);
  if (hasVar) {
    expr = expr.replace(/스택_[가-힣a-zA-Z0-9_]+/g, '0');
    expr = expr.replace(/대상상태_[가-힣a-zA-Z0-9_]+/g, '0');
    warnings.push('스택/대상상태 변수는 0으로 처리되었습니다.');
  }

  try {
    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + expr + ')')();
    if (typeof result !== 'number' || !isFinite(result)) {
      return { value: null, warnings: [...warnings, '계산 결과가 유효하지 않습니다.'] };
    }
    return { value: Math.round(result * 100) / 100, warnings };
  } catch {
    return { value: null, warnings: [...warnings, '계산식 오류: 수식을 확인해주세요.'] };
  }
}

const AUTO_COMMANDS = ['상태템플릿부여', '스택증가'];
const NUMERIC_KEYWORDS = ['수치:', '횟수:', '최대:'];

export function validateEffect(effect) {
  const warnings = [];
  if (!effect.trim()) return warnings;

  const hasAutoCmd = AUTO_COMMANDS.some(cmd => effect.includes(cmd));
  const hasNumeric = NUMERIC_KEYWORDS.some(kw => effect.includes(kw));
  const hasStatStack = AUTO_COMMANDS.some(cmd => effect.includes(cmd));

  if (hasStatStack && !hasNumeric) {
    warnings.push('상태/스택 효과인데 수치, 횟수, 최대값이 없습니다.');
  }

  if (!hasAutoCmd) {
    warnings.push('운영진 수동 검수 대상입니다.');
  }

  return warnings;
}
