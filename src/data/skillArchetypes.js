import { ACTIONS } from './actions';

// ── 랭크별 기초부 계수 [주스탯계수, 부스탯계수]. (F는 미지정 → E 기준) ──
// SkillMaker의 빠른조합 액션식과 동일 규칙. 공격 아키타입에서 재사용.
export const PRESET_RANK_COEF = {
  F:  [1,   0.5 ],
  E:  [1,   0.5 ],
  D:  [1.3, 0.65],
  C:  [1.6, 0.8 ],
  B:  [1.9, 0.95],
  A:  [2.2, 1.1 ],
  S:  [2.5, 1.25],
  U:  [2.9, 1.4 ],
  EX: [3.2, 1.55],
};

// 액션의 스탯/기능/숙련 구조 + 선택 랭크 계수로
// "1d20 + 랭크 + ( 기초부 ) * ( 배율부 )" 계산식을 생성.
export function buildActionPresetFormula(action, rank) {
  if (!action) return '';
  const [c1, c2] = PRESET_RANK_COEF[rank] || PRESET_RANK_COEF.E;
  const b = action.base || [];
  const baseParts = [];
  if (b[0]) baseParts.push(`${b[0].stat} * ${c1}`);
  if (b[1]) baseParts.push(`${b[1].stat} * ${c2}`);
  const basePart = baseParts.join(' + ');
  const multPart = (action.mult || []).map(m => `${m.key} * ${m.coef}`).join(' + ');
  return `1d20 + 랭크 + ( ${basePart} ) * ( ${multPart} )`;
}

function actionByName(name) {
  return ACTIONS.find(a => a.name === name) || null;
}

// 비공격 아키타입(회복/버프/디버프)의 기본 발동 판정식. 편집 가능한 시작점.
function simpleRollFormula(stat) {
  return `1d20 + 랭크 + ${stat || '지능'}`;
}

const DAMAGE_ACTIONS = ACTIONS.filter(a => a.isDamage).map(a => a.name);
const STAT_OPTIONS = ['근력', '민첩', '내구', '감각', '지능'];
const ATTACK_STATUS = ['없음', '출혈', '구속', '취약', '쇠약'];
const DEBUFF_STATUS = ['취약', '쇠약', '구속'];
const BUFF_KINDS = [
  { value: 'judgment', label: '판정 보정 (+수치)' },
  { value: 'enhance',  label: '강화 상태 부여' },
];
// 판정보정 유형(비우면 전체). 자주 쓰는 범주/액션.
const JUDGMENT_TYPES = ['전체', ...DAMAGE_ACTIONS, '방어', '회피', '저항'];

// 효과 한 줄 빌더 헬퍼.
function templateLine(target, name, { value, count, resist } = {}) {
  let t = `상태템플릿부여 ${target} ${name}`;
  if (value)  t += ` 수치:${value}`;
  if (count)  t += ` 횟수:${count}`;
  if (resist) t += ' 저항:가능';
  return t;
}

// ── 아키타입 정의 ──────────────────────────────────────────────────────
// 각 아키타입: fields(쉬운 모드 입력), defaults(meta 초기값),
//   buildFormula(meta, rank), buildEffects(meta) → 효과 문자열.
export const SKILL_ARCHETYPES = [
  {
    id: 'attack',
    label: '공격',
    icon: '⚔',
    desc: '대상에게 피해를 주는 스킬. 액션 기반 계산식 자동 생성.',
    defaults: { action: '참격', status: '없음', statusValue: '3', statusCount: '3' },
    fields: [
      { key: 'action', label: '기반 액션', type: 'select', options: DAMAGE_ACTIONS },
      { key: 'status', label: '부가 상태 (선택)', type: 'select', options: ATTACK_STATUS },
      { key: 'statusValue', label: '상태 수치', type: 'text', when: m => m.status && m.status !== '없음' },
      { key: 'statusCount', label: '상태 횟수', type: 'text', when: m => m.status && m.status !== '없음' },
    ],
    buildFormula: (m, rank) => buildActionPresetFormula(actionByName(m.action), rank),
    buildEffects: (m) => {
      if (!m.status || m.status === '없음') return '';
      const resist = (m.status === '구속');
      return templateLine('대상', m.status, { value: m.statusValue, count: m.statusCount, resist });
    },
  },
  {
    id: 'heal',
    label: '회복',
    icon: '✚',
    desc: '자신 또는 대상의 체력을 회복. 판정 결과(최종값)만큼 회복.',
    defaults: { target: '자신', stat: '감각' },
    fields: [
      { key: 'target', label: '회복 대상', type: 'select', options: ['자신', '대상'] },
      { key: 'stat', label: '기준 스탯', type: 'select', options: STAT_OPTIONS },
    ],
    buildFormula: (m) => simpleRollFormula(m.stat),
    buildEffects: (m) => `회복 ${m.target || '자신'} 최종값`,
  },
  {
    id: 'buff',
    label: '버프',
    icon: '▲',
    desc: '자신을 강화. 판정 보정 또는 강화 상태 부여.',
    defaults: { kind: 'judgment', judgeType: '전체', value: '3', count: '3' },
    fields: [
      { key: 'kind', label: '버프 종류', type: 'select', options: BUFF_KINDS.map(k => k.value), optionLabels: BUFF_KINDS },
      { key: 'judgeType', label: '적용 판정 유형', type: 'select', options: JUDGMENT_TYPES, when: m => m.kind === 'judgment' },
      { key: 'value', label: '수치', type: 'text' },
      { key: 'count', label: '지속 횟수', type: 'text', when: m => m.kind === 'enhance' },
    ],
    buildFormula: () => simpleRollFormula('지능'),
    buildEffects: (m) => {
      if (m.kind === 'enhance') {
        return templateLine('자신', '강화', { value: m.value, count: m.count });
      }
      const type = (m.judgeType && m.judgeType !== '전체') ? ` ${m.judgeType}` : '';
      return `판정보정${type} = ${m.value || '3'}`;
    },
  },
  {
    id: 'debuff',
    label: '디버프',
    icon: '▼',
    desc: '대상을 약화. 취약/쇠약/구속 등 상태 부여(저항 가능).',
    defaults: { status: '취약', value: '3', count: '3', resist: true },
    fields: [
      { key: 'status', label: '상태', type: 'select', options: DEBUFF_STATUS },
      { key: 'value', label: '수치', type: 'text' },
      { key: 'count', label: '횟수', type: 'text' },
      { key: 'resist', label: '저항 가능', type: 'bool' },
    ],
    buildFormula: () => simpleRollFormula('지능'),
    buildEffects: (m) => templateLine('대상', m.status || '취약', { value: m.value, count: m.count, resist: m.resist }),
  },
  {
    id: 'free',
    label: '유틸·기타',
    icon: '✦',
    desc: '자동 생성 없이 고급 모드에서 직접 작성합니다.',
    defaults: {},
    fields: [],
    buildFormula: () => '',
    buildEffects: () => '',
    freeform: true,
  },
];

export function getArchetype(id) {
  return SKILL_ARCHETYPES.find(a => a.id === id) || null;
}

// 아키타입 meta → { formula, 효과 } 재생성.
export function generateFromArchetype(meta, rank) {
  const arch = getArchetype(meta?.archetype);
  if (!arch || arch.freeform) return null;
  return {
    formula: arch.buildFormula(meta, rank) || '',
    효과: arch.buildEffects(meta) || '',
  };
}
