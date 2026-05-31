import { FACTION_OPTIONS } from './factions';

export const COMMON_SKILL_TYPES = [
  { value: 'global',  label: 'global (전체)' },
  { value: 'faction', label: 'faction (소속)' },
  { value: 'species', label: 'species (종족)' },
];

export const COMMON_UNLOCK_LEVELS = [1, 2, 4, 6, 8, 12];

export const COMMON_TARGET_SPECS = [
  { value: 'none',     label: 'none (대상 없음)' },
  { value: 'optional', label: 'optional (선택)' },
  { value: 'required', label: 'required (대상 자동 처리 필요)' },
];

export const COMMON_SPECIES_OPTIONS = ['인간', '마녀', '흡혈귀', '요괴', '반인', '기타'];

export const COMMON_SKILL_FACTIONS = [...FACTION_OPTIONS];

export const COMMON_SKILLS_HEADERS = [
  'key', '이름', '유형', '소속', '종족', '해금레벨',
  '계통', '계열', '랭크', '계산식', '효과', '대상',
  '조건', '대가', '설명', '메모',
];

export function defaultCommonSkill() {
  return {
    key: '',
    name: '',
    type: 'global',
    faction: '',
    species: '',
    unlockLevel: 1,
    tradition: '마술',
    series: '화력',
    rank: 'F',
    formula: '',
    effects: [],
    target: 'optional',
    condition: '',
    cost: '',
    description: '',
    memo: '',
  };
}

function tsvEscape(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\t/g, ' ').replace(/\r?\n/g, ' / ').trim();
}

export function buildEffectsText(effects) {
  if (!Array.isArray(effects)) return '';
  return effects
    .map((e) => String(e?.generatedText || '').trim())
    .filter(Boolean)
    .join('\n');
}

export function buildCommonSkillTSV(skill) {
  const effectsText = buildEffectsText(skill.effects);
  const row = [
    skill.key,
    skill.name,
    skill.type,
    skill.type === 'faction' ? skill.faction : '',
    skill.type === 'species' ? skill.species : '',
    skill.unlockLevel,
    skill.tradition,
    skill.series,
    skill.rank,
    skill.formula,
    effectsText,
    skill.target,
    skill.condition,
    skill.cost || '',
    skill.description,
    skill.memo,
  ];
  return row.map(tsvEscape).join('\t');
}

export function buildCommonSkillPreview(skill) {
  const lines = [
    '[공용 스킬]',
    `key: ${skill.key || '-'}`,
    `이름: ${skill.name || '-'}`,
    `유형: ${skill.type}`,
  ];
  if (skill.type === 'faction') lines.push(`소속: ${skill.faction || '-'}`);
  if (skill.type === 'species') lines.push(`종족: ${skill.species || '-'}`);
  lines.push(`해금레벨: ${skill.unlockLevel}`);
  lines.push(`계통/계열/랭크: ${skill.tradition} / ${skill.series} / ${skill.rank}`);
  lines.push(`계산식: ${skill.formula || '-'}`);
  const effectsText = buildEffectsText(skill.effects);
  if (effectsText) lines.push(`효과:\n${effectsText}`);
  lines.push(`대상: ${skill.target}`);
  if (skill.condition) lines.push(`조건: ${skill.condition}`);
  if (skill.cost) lines.push(`대가: ${skill.cost}`);
  if (skill.description) lines.push(`설명: ${skill.description}`);
  if (skill.memo) lines.push(`메모: ${skill.memo}`);
  return lines.join('\n');
}

export function validateCommonSkill(skill) {
  const errors = [];
  if (!skill.key?.trim()) errors.push('key는 필수입니다.');
  else if (!/^[a-z0-9_]+$/i.test(skill.key.trim())) {
    errors.push('key는 영문/숫자/언더스코어만 가능합니다.');
  }
  if (!skill.name?.trim()) errors.push('이름은 필수입니다.');
  if (!skill.type) errors.push('유형은 필수입니다.');
  if (skill.type === 'faction' && !skill.faction?.trim()) {
    errors.push('faction 유형은 소속이 필요합니다.');
  }
  if (skill.type === 'species' && !skill.species?.trim()) {
    errors.push('species 유형은 종족이 필요합니다.');
  }
  if (!COMMON_UNLOCK_LEVELS.includes(Number(skill.unlockLevel))) {
    errors.push('해금레벨은 1/2/4/6/8/12 중 하나여야 합니다.');
  }
  if (!skill.tradition) errors.push('계통은 필수입니다.');
  if (!skill.series) errors.push('계열은 필수입니다.');
  if (!skill.rank) errors.push('랭크는 필수입니다.');
  if (!skill.formula?.trim()) errors.push('계산식은 필수입니다.');
  if (!['none', 'optional', 'required'].includes(skill.target)) {
    errors.push('대상은 none/optional/required 중 하나여야 합니다.');
  }
  return errors;
}
