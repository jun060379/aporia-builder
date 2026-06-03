import { previewFormula, normalizeFormula } from './calcSkill';
import { getSkillEffectText } from '../data/skillRanks';

// 대상 토큰을 자연어로.
function targetWord(t, withParticle = true) {
  const x = String(t || '').trim();
  if (x === '자신') return withParticle ? '자신에게' : '자신';
  if (x === '대상') return withParticle ? '대상에게' : '대상';
  return withParticle ? `${x}에게` : x;
}

// "수치:3 횟수:2 최대:5 저항:가능 …" 토큰 파싱.
function parseOpts(tokens) {
  const opts = {};
  tokens.forEach(tok => {
    const m = tok.match(/^([^:：]+)[:：](.+)$/);
    if (m) opts[m[1].trim()] = m[2].trim();
  });
  return opts;
}

// set-effect 변수를 자연어로.
const SET_LABEL = {
  판정보정: '판정', 피해보정: '받는 피해', 피해감소: '받는 피해 감소',
  회복보정: '회복량', 이면침식: '이면침식', 현재체력: '현재 체력', 일상점: '일상점',
};

// DSL 한 줄 → 한국어 설명. 인식 실패 시 원문 반환.
export function describeEffectLine(line) {
  const raw = String(line || '').trim();
  if (!raw) return '';

  // 조건부: "조건 => 효과"
  const arrow = raw.match(/^([\s\S]*?)\s*(?:=>|⇒|→|->)\s*([\s\S]*)$/);
  if (arrow) {
    const cond = arrow[1].trim();
    const eff = describeEffectLine(arrow[2].trim());
    return cond ? `${cond} 일 때 ${eff}` : eff;
  }

  // set-effect: "변수 [유형] = 값"
  const setMod = raw.match(/^(판정보정|피해보정|피해감소|회복보정)\s*([^=<>!]*?)\s*=\s*(.+)$/);
  if (setMod) {
    const v = setMod[1];
    const type = setMod[2].trim();
    const val = setMod[3].trim();
    const isMult = /^[*×]/.test(val);
    const num = val.replace(/^[*×]\s*/, '');
    const amt = isMult ? `×${num}` : (/^-/.test(val) ? val : `+${val}`);
    if (v === '판정보정') return `${type && type !== '전체' ? type + ' ' : ''}판정 ${amt}`;
    if (v === '피해감소') return `받는 피해 ${num} 경감`;
    return `${SET_LABEL[v]} ${amt}`;
  }
  const setDb = raw.match(/^(이면침식|현재체력|일상점)\s*==?\s*(.+)$/);
  if (setDb) return `${SET_LABEL[setDb[1]]}을(를) ${setDb[2].trim()}(으)로 설정`;

  const tokens = raw.split(/\s+/);
  const cmd = tokens[0];

  if (cmd === '상태템플릿부여' || cmd === '상태부여') {
    const target = tokens[1];
    const name = tokens[2];
    const opts = parseOpts(tokens.slice(3));
    const parts = [];
    if (opts['수치']) parts.push(`수치 ${opts['수치']}`);
    if (opts['횟수']) parts.push(`${opts['횟수']}회`);
    const detail = parts.length ? `(${parts.join(', ')})` : '';
    const resist = opts['저항'] === '가능' ? ' [저항 가능]' : '';
    return `${targetWord(target)} ${name}${detail} 부여${resist}`;
  }
  if (cmd === '상태해제') return `${targetWord(tokens[1])} ${tokens[2]} 해제`;
  if (cmd === '스택증가') return `${targetWord(tokens[1])} ${tokens[2]} 스택 ${tokens[3] || '증가'}`;
  if (cmd === '스택감소') return `${targetWord(tokens[1])} ${tokens[2]} 스택 ${tokens[3] || '감소'}`;
  if (cmd === '스택설정') return `${targetWord(tokens[1])} ${tokens[2]} 스택 ${tokens[3] || '설정'}`;
  if (cmd === '랜덤상태부여') {
    const list = String(tokens[3] || '').split(/[,，]/).filter(Boolean);
    return `${targetWord(tokens[1])} ${tokens[2]} 중 무작위 1개(${list.join('/')}) 부여`;
  }
  if (cmd === '피해' || cmd === '회복') {
    const amt = tokens.slice(2).join(' ').trim();
    const amtLabel = amt === '최종값' ? '판정값만큼' : amt;
    return `${targetWord(tokens[1])} ${amtLabel} ${cmd === '피해' ? '피해' : '체력 회복'}`;
  }

  return raw; // 미인식 — 원문
}

// 스킬 전체 평문 요약.
export function buildSkillSummary(skill, ctx = {}) {
  if (!skill) return '';
  const { stats = {}, abilities = {}, proficiencies = {} } = ctx;
  const parts = [];

  // 판정
  const formula = String(skill.formula || '').trim();
  if (formula) {
    let exp = null;
    try {
      const r = previewFormula(formula, stats, skill.rank, {}, abilities, proficiencies);
      exp = r && r.value !== null ? r.value : null;
    } catch { exp = null; }
    const actionLabel = skill.meta?.archetype === 'attack' && skill.meta?.action
      ? `${skill.meta.action} 기반 판정` : '판정';
    parts.push(exp !== null ? `${actionLabel}(기대값 약 ${exp})` : actionLabel);
  }

  // 효과
  const effLines = getSkillEffectText(skill)
    .split('\n').map(s => s.trim()).filter(Boolean)
    .map(describeEffectLine).filter(Boolean);

  let body;
  if (parts.length && effLines.length) {
    body = `${parts[0]}으로 ${effLines.join(', ')}`;
  } else if (effLines.length) {
    body = effLines.join(', ');
  } else if (parts.length) {
    body = parts[0];
  } else {
    return '아직 효과/계산식이 없습니다. 아키타입을 고르거나 직접 입력하세요.';
  }

  let summary = `이 스킬은 ${body}.`;

  // 조건 (필수 조건만, 세부조건 제외)
  const reqCond = String(skill.condition || '').split('\n')
    .map(s => s.trim()).filter(l => l && !/^세부\s*[:：]/.test(l));
  if (reqCond.length) summary += ` (조건: ${reqCond.join(', ')})`;

  // 대가
  const cost = String(skill.cost || '').replace(/\n/g, ', ').trim();
  if (cost) summary += ` (대가: ${cost})`;

  return summary;
}

export { normalizeFormula };
