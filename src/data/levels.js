export const LEVEL_TABLE = [
  { level: 1,  exp: 0,   budget: 65 },
  { level: 2,  exp: 6,   budget: 76 },
  { level: 3,  exp: 14,  budget: 88 },
  { level: 4,  exp: 25,  budget: 102 },
  { level: 5,  exp: 39,  budget: 118 },
  { level: 6,  exp: 56,  budget: 135 },
  { level: 7,  exp: 76,  budget: 153 },
  { level: 8,  exp: 100, budget: 170 },
  { level: 9,  exp: 128, budget: 187 },
  { level: 10, exp: 160, budget: 202 },
  { level: 11, exp: 196, budget: 216 },
  { level: 12, exp: 236, budget: 230 },
];

export function getLevelInfo(exp) {
  const num = parseInt(exp, 10) || 0;
  let current = LEVEL_TABLE[0];
  for (const row of LEVEL_TABLE) {
    if (num >= row.exp) current = row;
    else break;
  }
  return current;
}
