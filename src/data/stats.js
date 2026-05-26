export const STAT_NAMES = ['근력', '민첩', '내구', '감각', '지능'];

export const STAT_GRADES = [
  { grade: 'E', value: 3,  cost: 1  },
  { grade: 'D', value: 5,  cost: 3  },
  { grade: 'C', value: 10, cost: 7  },
  { grade: 'B', value: 20, cost: 13 },
  { grade: 'A', value: 30, cost: 30 },
  { grade: 'S', value: 40, cost: 55 },
];

export const GRADE_MAP = Object.fromEntries(STAT_GRADES.map(g => [g.grade, g]));

export function getStatValue(grade) {
  return GRADE_MAP[grade]?.value ?? 3;
}

export function getStatCost(grade) {
  return GRADE_MAP[grade]?.cost ?? 1;
}

export function defaultStats() {
  return Object.fromEntries(STAT_NAMES.map(s => [s, 'E']));
}
