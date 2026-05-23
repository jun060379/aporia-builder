import { ACTIONS } from '../data/actions';
import { getStatValue } from '../data/stats';

export function calcActionResult(action, stats, abilities, proficiencies) {
  const statVal = (name) => getStatValue(stats[name] ?? 'E');
  const abilityVal = (name) => abilities[name] ?? 0;
  const profVal = (name) => proficiencies[name] ?? 0;

  const getKeyVal = (key) => {
    if (key.endsWith('숙련')) return profVal(key);
    return abilityVal(key);
  };

  const base = action.base.reduce((sum, { stat, coef }) => sum + statVal(stat) * coef, 0);
  const multSum = action.mult.reduce((sum, { key, coef }) => sum + getKeyVal(key) * coef, 0);
  const multiplier = 1 + multSum;
  const finalCoef = base * multiplier;
  const diceCount = Math.max(1, Math.ceil(finalCoef / 5));
  const expected = diceCount * 3.5;

  return { base, multiplier, finalCoef, diceCount, expected };
}

export function getDifficultyLabel(expected) {
  if (expected >= 90) return { label: '예외적', color: 'text-purple-400' };
  if (expected >= 70) return { label: '초월',   color: 'text-red-400' };
  if (expected >= 50) return { label: '고난도', color: 'text-orange-400' };
  if (expected >= 35) return { label: '어려움', color: 'text-yellow-400' };
  if (expected >= 25) return { label: '보통',   color: 'text-green-400' };
  return { label: '입문', color: 'text-gray-400' };
}

export function calcAllActions(stats, abilities, proficiencies) {
  return ACTIONS.map(action => ({
    ...action,
    result: calcActionResult(action, stats, abilities, proficiencies),
  }));
}
