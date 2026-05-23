import { getStatCost } from '../data/stats';
import { getAbilityCost } from '../data/abilities';
import { getProficiencyCost } from '../data/proficiencies';
import { getRankValue } from '../data/skillRanks';

export function calcStatCost(stats) {
  return Object.values(stats).reduce((sum, grade) => sum + getStatCost(grade), 0);
}

export function calcAbilityCost(abilities) {
  return Object.values(abilities).reduce((sum, val) => sum + getAbilityCost(val), 0);
}

export function calcProficiencyCost(proficiencies) {
  return Object.values(proficiencies).reduce((sum, val) => sum + getProficiencyCost(val), 0);
}

export function calcSkillsCost(skills) {
  return skills.reduce((sum, sk) => sum + getRankValue(sk.rank), 0);
}

export function calcUsed(stats, abilities, proficiencies, skills) {
  return (
    calcStatCost(stats) +
    calcAbilityCost(abilities) +
    calcProficiencyCost(proficiencies) +
    calcSkillsCost(skills)
  );
}
