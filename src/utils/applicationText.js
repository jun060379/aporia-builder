import { STAT_NAMES } from '../data/stats';
import { ABILITY_NAMES } from '../data/abilities';
import { PROFICIENCY_NAMES } from '../data/proficiencies';
import { normalizeFormula } from './calcSkill';
import { getSkillEffectText } from '../data/skillRanks';

export function buildCharacterText({ char, stats, abilities, proficiencies }) {
  return [
    '!캐릭터신청',
    `이름: ${char.name}`,
    ...(char.fullName ? [`풀네임: ${char.fullName}`] : []),
    `종족: ${char.race}`,
    `소속: ${char.faction || '무소속'}`,
    ...STAT_NAMES.map((s) => `${s}: ${stats[s]}`),
    ...ABILITY_NAMES.map((a) => `${a}: ${abilities[a]}`),
    ...PROFICIENCY_NAMES.map((p) => `${p}: ${proficiencies[p]}`),
    `이면침식: ${char.erosion || '0'}`,
  ].join('\n');
}

export function buildSkillText(sk) {
  const effectText = getSkillEffectText(sk);
  const effectBlock = effectText
    ? '효과:\n' + effectText
    : '효과:\n없음';

  return [
    '!스킬신청',
    `이름: ${sk.name}`,
    `계통: ${sk.tradition}`,
    `계열: ${sk.series}`,
    `랭크: ${sk.rank}`,
    `계산식: ${normalizeFormula(sk.formula)}`,
    effectBlock,
    `조건: ${sk.condition}`,
    `대가: ${sk.cost}`,
    `설명: ${sk.description}`,
  ].join('\n');
}

export function buildPassiveText(p) {
  return [
    '!패시브등록',
    `key: ${p.key}`,
    `이름: ${p.이름}`,
    `소유타입: ${p.소유타입}`,
    `소유키: ${p.소유키}`,
    `해금레벨: ${p.해금레벨}`,
    `분류: ${p.분류}`,
    `효과코드: ${p.효과코드}`,
    `수치: ${p.수치}`,
    `최대: ${p.최대}`,
    `발동: ${p.발동}`,
    `판정: ${p.판정}`,
    `조건: ${p.조건}`,
    `효과: ${p.효과}`,
    `설명: ${p.설명}`,
    `메모: ${p.메모}`,
  ].join('\n');
}

export function buildFullApplicationText({ char, stats, abilities, proficiencies, skills, passives }) {
  const parts = [buildCharacterText({ char, stats, abilities, proficiencies })];
  (skills || []).forEach((sk) => parts.push(buildSkillText(sk)));
  (passives || []).forEach((p) => parts.push(buildPassiveText(p)));
  return parts.join('\n\n');
}
