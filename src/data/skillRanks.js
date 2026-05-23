export const SKILL_RANKS = [
  { rank: 'F',  value: 1   },
  { rank: 'E',  value: 10  },
  { rank: 'D',  value: 20  },
  { rank: 'C',  value: 30  },
  { rank: 'B',  value: 40  },
  { rank: 'A',  value: 50  },
  { rank: 'S',  value: 70  },
  { rank: 'U',  value: 80  },
  { rank: 'EX', value: 100 },
];

export const RANK_MAP = Object.fromEntries(SKILL_RANKS.map(r => [r.rank, r.value]));

export function getRankValue(rank) {
  return RANK_MAP[rank] ?? 1;
}

export const SKILL_TRADITIONS = ['마술', '주술', '신성', '혈계', '요력', '초능력', '과학', '특수'];
export const SKILL_SERIES = ['화력', '방호', '치유', '재생', '간섭', '강화', '특수'];

export function defaultSkill() {
  return {
    id: Date.now(),
    name: '',
    tradition: '마술',
    series: '화력',
    rank: 'F',
    formula: '',
    effect: '',
    condition: '',
    cost: '',
    description: '',
  };
}
