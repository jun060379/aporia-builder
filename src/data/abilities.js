export const ABILITY_NAMES = [
  '무기술', '격투술', '사격술', '기동술', '방어술',
  '인내', '관찰', '추적술', '은밀행동', '지식', '이면학', '화술',
];

export const ABILITY_COSTS = [0, 2, 5, 10, 18, 30];

export function getAbilityCost(value) {
  return ABILITY_COSTS[value] ?? 0;
}

export function defaultAbilities() {
  return Object.fromEntries(ABILITY_NAMES.map(a => [a, 0]));
}
