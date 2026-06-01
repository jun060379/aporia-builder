export const PROFICIENCY_NAMES = [
  '참격숙련', '관통숙련', '타격숙련', '격투숙련', '사격숙련',
  '회피숙련', '방어숙련', '저항숙련', '조사숙련', '해석숙련',
  '은신숙련', '추적숙련', '설득숙련', '기만숙련', '협박숙련',
];

export const PROFICIENCY_COSTS = [0, 3, 8, 14, 24, 38];

export function getProficiencyCost(value) {
  return PROFICIENCY_COSTS[value] ?? 0;
}

export function defaultProficiencies() {
  return Object.fromEntries(PROFICIENCY_NAMES.map(p => [p, 0]));
}
