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

export const SKILL_TRADITIONS = ['마술', '주술', '신성', '마법', '혈계', '요력', '특수'];
export const SKILL_SERIES = ['화력', '방호', '치유', '재생', '간섭', '강화', '특수'];

export function makeEffect(overrides = {}) {
  return {
    id: Date.now() + Math.random(),
    type: null,
    params: {},
    generatedText: '',
    confirmed: false,
    ...overrides,
  };
}

export function defaultSkill() {
  return {
    id: Date.now(),
    name: '',
    tradition: '마술',
    series: '화력',
    rank: 'F',
    formula: '',
    효과: '',           // 줄=효과(한 줄 = "조건 => 효과") 문자열. 신규 표준.
    effects: [],        // 레거시(블럭카드) — 로드 시 효과 문자열로 마이그레이션.
    condition: '',
    cost: '',
    description: '',
  };
}

// 레거시 effects[] 배열을 줄=효과 문자열로 변환.
// 확정(confirmed) 효과의 generatedText를 줄바꿈으로 결합.
export function effectsToText(effects) {
  if (!Array.isArray(effects)) return '';
  return effects
    .filter((e) => e && e.confirmed && e.generatedText)
    .map((e) => String(e.generatedText).trim())
    .filter(Boolean)
    .join('\n');
}

// 스킬 객체에서 효과 텍스트를 얻는다. 신규 `효과` 필드 우선, 없으면 레거시 effects[] 변환.
export function getSkillEffectText(skill) {
  if (!skill) return '';
  const direct = String(skill.효과 || '').trim();
  if (direct) return direct;
  return effectsToText(skill.effects);
}
