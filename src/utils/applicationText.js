import { STAT_NAMES } from '../data/stats';
import { ABILITY_NAMES } from '../data/abilities';
import { PROFICIENCY_NAMES } from '../data/proficiencies';
import { normalizeFormula } from './calcSkill';

export function buildCharacterText({ char, stats, abilities, proficiencies }) {
  return [
    '!캐릭터신청',
    `이름: ${char.name}`,
    `종족: ${char.race}`,
    `소속: ${char.faction || '무소속'}`,
    ...STAT_NAMES.map((s) => `${s}: ${stats[s]}`),
    ...ABILITY_NAMES.map((a) => `${a}: ${abilities[a]}`),
    ...PROFICIENCY_NAMES.map((p) => `${p}: ${proficiencies[p]}`),
    `이면침식: ${char.erosion || '0'}`,
  ].join('\n');
}

export function buildSkillText(sk) {
  const effectLines = (sk.effects ?? [])
    .filter((e) => e.confirmed)
    .map((e) => e.generatedText)
    .filter(Boolean);

  const effectBlock = effectLines.length > 0
    ? '효과:\n' + effectLines.join('\n')
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

export function buildFullApplicationText({ char, stats, abilities, proficiencies, skills }) {
  const parts = [buildCharacterText({ char, stats, abilities, proficiencies })];
  (skills || []).forEach((sk) => parts.push(buildSkillText(sk)));
  return parts.join('\n\n');
}
