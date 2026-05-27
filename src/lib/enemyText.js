export const ENEMY_ACTION_NAMES = [
  '참격', '관통', '타격', '격투', '사격',
  '방어', '회피', '저항', '조사', '해석', '은신', '추적', '설득',
];

export const ENEMY_SKILL_CATEGORIES = ['화력', '방호', '치유', '재생', '간섭', '강화', '특수'];
export const ENEMY_SKILL_RANKS = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'U', 'EX'];
export const ENEMY_OWNER_TYPES = ['global', 'template', 'enemy'];
export const ENEMY_TARGET_MODES = ['none', 'optional', 'required'];

export const EFFECT_PREFIXES = ['상태템플릿부여', '스택증가', '스택감소', '피해', '회복'];

export function isEffectLineAutoApplicable(line) {
  const t = (line || '').trim();
  if (!t) return true;
  return EFFECT_PREFIXES.some((p) => t.startsWith(p));
}

export function isEffectAutoApplicable(effect) {
  const s = String(effect ?? '');
  if (!s.trim()) return true; // empty allowed
  return s.split('\n').every((line) => isEffectLineAutoApplicable(line));
}

export function buildEnemyTemplateText(p) {
  const a = p.actions || {};
  const parts = [
    `key:${p.template_key ?? ''}`,
    `이름:${p.name ?? ''}`,
    `분류:${p.category ?? ''}`,
    `위험도:${p.threat ?? ''}`,
    `체력:${p.max_hp ?? ''}`,
    ...ENEMY_ACTION_NAMES.map((n) => `${n}:${a[n] ?? 0}`),
    `규칙:${p.rule ?? ''}`,
    `징후:${p.signs ?? ''}`,
    `메모:${p.memo ?? ''}`,
  ];
  return `!에너미템플릿등록 ${parts.join(' ')}`;
}

export function buildEnemySkillText(p) {
  const parts = [
    `key:${p.skill_key ?? ''}`,
    `소유:${p.owner_type ?? ''}`,
    `소유키:${p.owner_key ?? ''}`,
    `이름:${p.name ?? ''}`,
    `계열:${p.category ?? ''}`,
    `랭크:${p.rank ?? ''}`,
    `계산식:${p.formula ?? ''}`,
    `효과:${p.effect ?? ''}`,
    `대상:${p.target_mode ?? ''}`,
    `조건:${p.condition ?? ''}`,
    `메모:${p.memo ?? ''}`,
  ];
  return `!에너미스킬등록 ${parts.join(' ')}`;
}
