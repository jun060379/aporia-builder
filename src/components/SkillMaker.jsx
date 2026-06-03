import { useState, useEffect, useMemo } from 'react';
import { SKILL_TRADITIONS, SKILL_SERIES, SKILL_RANKS, defaultSkill, effectsToText } from '../data/skillRanks';
import {
  validateFormula,
  validateFormulaStructure,
  previewFormula,
  hasTargetReference,
} from '../utils/calcSkill';
import { STAT_NAMES } from '../data/stats';
import { ABILITY_NAMES } from '../data/abilities';
import { PROFICIENCY_NAMES } from '../data/proficiencies';
import { ACTIONS } from '../data/actions';
import FormulaBlockModal from './FormulaBlockModal';
import ConditionEditor from './ConditionEditor.jsx';
import EffectRowsEditor from './EffectRowsEditor.jsx';
import CostEditor from './CostEditor.jsx';
import { SKILL_ARCHETYPES, getArchetype, generateFromArchetype, buildActionPresetFormula } from '../data/skillArchetypes';
import { buildSkillSummary } from '../utils/skillSummary';

// ── 스타일 상수 ─────────────────────────────────────────────────────────
const inputCls  = "w-full min-w-0 bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 outline-none placeholder:text-slate-400 transition-colors";
const selectCls = "w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:border-violet-400 outline-none transition-colors";

// ── 계산식 입력 지원 데이터 ─────────────────────────────────────────────
const OPERATORS = [
  { op: '+', label: '+', tip: '더하기' },
  { op: '-', label: '-', tip: '빼기' },
  { op: '*', label: '*', tip: '곱하기' },
  { op: '/', label: '/', tip: '나누기' },
  { op: '(',  label: '(',  tip: '묶음 시작' },
  { op: ')',  label: ')',  tip: '묶음 끝' },
];

// 액션 기반이 아닌 특수 템플릿 (스택/대상상태 참조)
const SPECIAL_COMBOS = [
  { label: '스택 강화식',      formula: '1d20 + 랭크 + 스택_이름 * 2' },
  { label: '대상 상태 강화식', formula: '1d20 + 랭크 + 대상상태_상태_수치 * 2' },
];

const FORMULA_CATEGORIES = [
  { id: '기본',      tokens: ['d6', 'd20', '2d6', 'd100', '랭크'] },
  { id: '스탯',      tokens: STAT_NAMES },
  { id: '기능',      tokens: ABILITY_NAMES },
  { id: '숙련',      tokens: PROFICIENCY_NAMES },
  { id: '상태/스택', tokens: ['상태_출혈_수치', '대상상태_출혈_수치', '스택_혈인', '대상스택_표식'] },
  { id: '고급',      tokens: ['현재체력', '최대체력', '현재체력비율', '이면침식', '일상점'] },
];

// ── 패시브 전용 상수 (Code.js PASSIVE_SKILLS 시트 컬럼 기준) ───────────
const PASSIVE_HEADERS = [
  'key','이름','소유타입','소유키','해금레벨','분류','효과코드',
  '수치','최대','발동','판정','조건','효과','설명','메모'
];
const PASSIVE_OWNER_TYPES = [
  { value: 'global',    label: '공용 (모든 캐릭터)' },
  { value: 'character', label: '캐릭터 (특정 별명)' },
  { value: 'faction',   label: '소속 (파벌/조직)' },
  { value: 'species',   label: '종족' },
];
const PASSIVE_TRIGGERS = [
  '항상', '판정계산전', '판정시작', '판정후',
  '액션사용후', '스킬사용후',
  '피해직전', '피해후', '가해후', '공격해결후', '회복시', '세션종료', '수동'
];
const PASSIVE_CHECK_TYPES = ['전체', '스탯', '액션', '이능', '스킬', '대응', '저항'];

// 판정 유형은 넓은 범주(액션/스탯 등)뿐 아니라 세부 판정명(참격/근력/화력 등)도
// 콤마로 지정할 수 있다. 백엔드 매칭이 checkTypes에 세부명을 포함하므로
// 예) 판정:참격 → !참격 액션에만 보정 적용.
const JUDGMENT_GROUPS = [
  { label: '범주', items: PASSIVE_CHECK_TYPES },
  { label: '스탯', items: STAT_NAMES },
  { label: '액션', items: ACTIONS.map(a => a.name) },
  { label: '이능', items: ['화력', '방호', '치유', '재생', '간섭', '강화'] },
];

// 카테고리별 설명 + 자동 기본값 설정
const PASSIVE_CATEGORY_INFO = [
  {
    value: '판정보정',
    label: '판정 보정',
    color: 'violet',
    desc: '판정(주사위) 결과에 수치를 더하거나 뺍니다. 줄 효과 + 유형 필터.',
    example: '판정보정 참격 = 3',
    defaults: { 발동: '판정계산전', 효과코드: '판정보정', 판정: '전체' },
    effectSeed: '판정보정 = ',
    showValue: false, showTrigger: false, showCheck: false, showEffect: true,
  },
  {
    value: '피해보정',
    label: '피해 경감',
    color: 'blue',
    desc: '받는 피해를 줄이거나 늘립니다. 음수 = 경감.',
    example: '피해보정 = -5',
    defaults: { 발동: '피해직전', 효과코드: '피해보정', 판정: '전체' },
    effectSeed: '피해보정 = ',
    showValue: false, showTrigger: false, showCheck: false, showEffect: true,
  },
  {
    value: '회복보정',
    label: '회복 보정',
    color: 'emerald',
    desc: '체력 회복량을 늘리거나 줄입니다.',
    example: '회복보정 = 10',
    defaults: { 발동: '회복시', 효과코드: '회복보정', 판정: '전체' },
    effectSeed: '회복보정 = ',
    showValue: false, showTrigger: false, showCheck: false, showEffect: true,
  },
  {
    value: '저항',
    label: '저항 보정',
    color: 'amber',
    desc: '상태이상 저항 판정에 수치를 더합니다. (저항 유형 판정보정)',
    example: '판정보정 저항 = 3',
    defaults: { 발동: '판정계산전', 효과코드: '판정보정', 판정: '저항' },
    effectSeed: '판정보정 저항 = ',
    showValue: false, showTrigger: false, showCheck: false, showEffect: true,
  },
  {
    value: '트리거효과',
    label: '트리거 효과',
    color: 'rose',
    desc: '특정 시점에 상태/스택 효과를 자동 발동합니다.',
    example: '판정 시작 시 집중 상태 부여',
    defaults: { 발동: '판정시작', 효과코드: '상태부여' },
    showValue: false, showTrigger: true, showCheck: true, showEffect: true,
  },
  {
    value: '기타',
    label: '직접 설정',
    color: 'slate',
    desc: '모든 필드를 직접 입력합니다.',
    example: '',
    defaults: { 발동: '수동', 효과코드: '기타' },
    showValue: true, showTrigger: true, showCheck: true, showEffect: true,
  },
];

const PASSIVE_EFFECT_CODES = [
  '판정보정', '피해보정', '회복보정', '저항확률',
  '상태부여', '상태해제', '스택증가', '스택감소',
  '체력회복', '체력손상', '메시지', '기타'
];

const PASSIVE_VALUE_TOKENS = [
  { label: '근력', token: '근력' }, { label: '민첩', token: '민첩' },
  { label: '내구', token: '내구' }, { label: '감각', token: '감각' }, { label: '지능', token: '지능' },
  { label: 'HP%', token: '현재체력비율' }, { label: '침식', token: '이면침식' },
  { label: '현재HP', token: '현재체력' }, { label: '최대HP', token: '최대체력' },
];

const EMPTY_PASSIVE = {
  key: '', 이름: '', 소유타입: 'global', 소유키: '*',
  해금레벨: '1', 분류: '판정보정', 효과코드: '판정보정',
  수치: '', 최대: '', 발동: '판정계산전', 판정: '전체',
  조건: '', 효과: '', 설명: '', 메모: ''
};

const COLOR_MAP = {
  violet: { card: 'border-violet-200 bg-violet-50', active: 'border-violet-400 bg-violet-100 ring-2 ring-violet-300', badge: 'bg-violet-100 text-violet-700' },
  blue:   { card: 'border-blue-200 bg-blue-50',     active: 'border-blue-400 bg-blue-100 ring-2 ring-blue-300',     badge: 'bg-blue-100 text-blue-700'   },
  emerald:{ card: 'border-emerald-200 bg-emerald-50',active:'border-emerald-400 bg-emerald-100 ring-2 ring-emerald-300',badge:'bg-emerald-100 text-emerald-700'},
  amber:  { card: 'border-amber-200 bg-amber-50',   active: 'border-amber-400 bg-amber-100 ring-2 ring-amber-300',   badge: 'bg-amber-100 text-amber-700' },
  rose:   { card: 'border-rose-200 bg-rose-50',     active: 'border-rose-400 bg-rose-100 ring-2 ring-rose-300',     badge: 'bg-rose-100 text-rose-700'   },
  slate:  { card: 'border-slate-200 bg-slate-50',   active: 'border-slate-400 bg-slate-100 ring-2 ring-slate-300',   badge: 'bg-slate-100 text-slate-700' },
};

function buildPassivePreview(row, catInfo) {
  const name  = row.이름 || '(이름 없음)';
  const cond  = row.조건 ? '조건 충족 시 ' : '';
  // 모디파이어/트리거 카테고리는 효과(줄=효과) 텍스트를 미리보기로 보여준다.
  const effLines = String(row.효과 || '').split('\n').map(s => s.trim()).filter(Boolean);
  switch (catInfo?.value) {
    case '판정보정':
    case '피해보정':
    case '회복보정':
    case '저항':
      return effLines.length ? `"${name}": ${cond}${effLines.join(' · ')}` : `"${name}": (효과를 입력하세요)`;
    case '트리거효과':return `"${name}": ${row.발동 || '?'} 시점에 효과 자동 발동`;
    default:          return `"${name}"`;
  }
}

// ── 공통 서브 컴포넌트 ──────────────────────────────────────────────────

function FormulaPreview({ formula, stats, rank, abilities, proficiencies }) {
  if (!formula.trim()) return null;
  const base = previewFormula(formula, stats, rank, {}, abilities, proficiencies);
  const hasDbVar = /이면침식/.test(formula);
  const 침식0 = hasDbVar ? previewFormula(formula, stats, rank, { 이면침식: 0 }, abilities, proficiencies) : null;
  const 침식6 = hasDbVar ? previewFormula(formula, stats, rank, { 이면침식: 6 }, abilities, proficiencies) : null;
  const 침식9 = hasDbVar ? previewFormula(formula, stats, rank, { 이면침식: 9 }, abilities, proficiencies) : null;
  const show = base.value !== null || base.warnings.length > 0;
  if (!show) return null;

  return (
    <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-3 space-y-2">
      <p className="text-[10px] text-indigo-400 uppercase tracking-widest">계산 미리보기</p>
      {hasDbVar ? (
        <div className="grid grid-cols-3 gap-2">
          {[[침식0, '침식 0'], [침식6, '침식 6'], [침식9, '침식 9']].map(([res, lbl]) => (
            <div key={lbl} className="bg-white rounded-lg p-2 text-center border border-indigo-100">
              <p className="text-[10px] text-slate-400 mb-0.5">{lbl}</p>
              <p className={`text-sm font-bold ${res?.value !== null ? 'text-emerald-600' : 'text-rose-600'}`}>
                {res?.value !== null ? res.value : '오류'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        base.value !== null && (
          <p className="text-sm text-emerald-700">기대값 <span className="font-bold">{base.value}</span></p>
        )
      )}
      {base.warnings.map((w, i) => (
        <p key={i} className="text-xs text-amber-600">⚠ {w}</p>
      ))}
      {base.infos.map((info, i) => (
        <p key={i} className="text-xs text-slate-400 italic">ℹ {info}</p>
      ))}
    </div>
  );
}

// ── PassiveForm — 패시브 작성 폼 ─────────────────────────────────────────
function PassiveForm({ editingPassive, onSavePassive, onUpdatePassive, onCancelEdit }) {
  const [row, setRow] = useState(() => editingPassive ? { ...EMPTY_PASSIVE, ...editingPassive } : EMPTY_PASSIVE);
  const [copyMsg, setCopyMsg] = useState('');

  useEffect(() => {
    setRow(editingPassive ? { ...EMPTY_PASSIVE, ...editingPassive } : EMPTY_PASSIVE);
  }, [editingPassive]);

  const catInfo = PASSIVE_CATEGORY_INFO.find(c => c.value === row.분류) || PASSIVE_CATEGORY_INFO[0];

  function setCategory(cat) {
    setRow(r => {
      const next = { ...r, 분류: cat.value, ...cat.defaults };
      // 모디파이어 카테고리는 효과를 비워둔 경우 시작 템플릿을 넣어준다.
      if (cat.effectSeed && !String(r.효과 || '').trim()) next.효과 = cat.effectSeed;
      return next;
    });
  }

  const field = (k) => (e) => setRow(r => ({ ...r, [k]: e.target.value }));

  const tsv = useMemo(() => {
    const headers = ['key','이름','소유타입','소유키','해금레벨','분류','효과코드',
                     '수치','최대','발동','판정','조건','효과','설명','메모'];
    return headers
      .map(h => {
        // 효과 컬럼은 줄마다 ' ; ' 로 구분 보존(Apps Script가 ';'로 분리).
        const sep = h === '효과' ? ' ; ' : ' ';
        return String(row[h] ?? '').replace(/\t/g, ' ').replace(/\r?\n/g, sep).trim();
      })
      .join('\t');
  }, [row]);

  const errors = useMemo(() => {
    const errs = [];
    if (!row.key.trim())  errs.push('key는 필수입니다 (영소문자+밑줄 권장).');
    if (/\s/.test(row.key.trim())) errs.push('key에 공백 불가.');
    if (!row.이름.trim()) errs.push('이름은 필수입니다.');
    if (row.소유타입 !== 'global' && !row.소유키.trim()) errs.push('소유키를 입력하세요.');
    return errs;
  }, [row]);

  async function copy() {
    try { await navigator.clipboard.writeText(tsv); setCopyMsg('복사됨!'); }
    catch { setCopyMsg('복사 실패'); }
    setTimeout(() => setCopyMsg(''), 1500);
  }

  const preview = buildPassivePreview(row, catInfo);
  const colors  = COLOR_MAP[catInfo.color] || COLOR_MAP.slate;

  // 발동 트리거의 "base:인자" 분해 (특정 액션/스킬/공격명 필터)
  const TRIGGER_ARG_BASES = ['판정후', '액션사용후', '스킬사용후', '가해후', '공격해결후'];
  const _trigCi  = row.발동.indexOf(':');
  const trigBase = _trigCi >= 0 ? row.발동.slice(0, _trigCi) : row.발동;
  const trigArg  = _trigCi >= 0 ? row.발동.slice(_trigCi + 1) : '';
  const trigSupportsArg = TRIGGER_ARG_BASES.includes(trigBase);

  return (
    <div className="space-y-4">

      {/* ── 안내 ── */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 text-[11px] text-indigo-900 leading-relaxed">
        <p className="font-semibold text-indigo-700 mb-0.5">패시브 제작기</p>
        <p>작성 완료 후 하단 <strong>TSV 복사</strong> → Google Sheets <code className="bg-white px-1 rounded">PASSIVE_SKILLS</code> 마지막 행에 붙여넣기.</p>
      </div>

      {/* ── 분류 카드 선택 ── */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold text-slate-600">어떤 패시브인가요?</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PASSIVE_CATEGORY_INFO.map(cat => {
            const c = COLOR_MAP[cat.color] || COLOR_MAP.slate;
            const active = row.분류 === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat)}
                className={`text-left p-2.5 rounded-xl border transition-all ${active ? c.active : c.card + ' hover:opacity-80'}`}
              >
                <p className="text-xs font-bold text-slate-800">{cat.label}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{cat.desc}</p>
                {cat.example && (
                  <p className={`text-[10px] mt-1 px-1.5 py-0.5 rounded font-mono inline-block ${c.badge}`}>예: {cat.example}</p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 미리보기 ── */}
      <div className={`rounded-xl border p-3 ${colors.card}`}>
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">미리보기</p>
        <p className="text-sm text-slate-800">{preview}</p>
      </div>

      {/* ── 기본 정보 ── */}
      <div className="space-y-3 bg-slate-50 rounded-xl border border-slate-200 p-4">
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">기본 정보</span>

        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-slate-500">key <span className="text-rose-400">*</span></span>
            <input className={inputCls} value={row.key} onChange={field('key')} placeholder="예: dmg_reduce_hp" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-slate-500">이름 <span className="text-rose-400">*</span></span>
            <input className={inputCls} value={row.이름} onChange={field('이름')} placeholder="예: 피해 감면" />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-slate-500">적용 대상</span>
            <select className={selectCls} value={row.소유타입}
              onChange={e => setRow(r => ({ ...r, 소유타입: e.target.value, 소유키: e.target.value === 'global' ? '*' : '' }))}>
              {[
                { value: 'global',    label: '공용 (모든 캐릭터)' },
                { value: 'character', label: '특정 캐릭터 (별명)' },
                { value: 'faction',   label: '소속/파벌' },
                { value: 'species',   label: '종족' },
              ].map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-slate-500">
              {row.소유타입 === 'global' ? '소유 키 (자동)' : row.소유타입 === 'character' ? '캐릭터 별명' : row.소유타입 === 'faction' ? '소속명' : '종족명'}
            </span>
            <input
              className={inputCls}
              value={row.소유키}
              onChange={field('소유키')}
              placeholder={row.소유타입 === 'global' ? '* (전체)' : '대상 값 입력'}
              disabled={row.소유타입 === 'global'}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500">해금 레벨 (몇 레벨부터 적용되나요?)</span>
          <input className={inputCls} value={row.해금레벨} onChange={field('해금레벨')} type="number" min="1" placeholder="1" />
        </label>
      </div>

      {/* ── 효과 설정 ── */}
      <div className="space-y-3 bg-slate-50 rounded-xl border border-slate-200 p-4">
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">효과 설정</span>

        {/* 수치 보정값 */}
        {catInfo.showValue && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-slate-500">
                  {row.분류 === '피해보정' ? '피해 보정 (음수=경감)' :
                   row.분류 === '회복보정' ? '회복 보정 (양수=증가)' :
                   row.분류 === '저항'     ? '저항 판정 보정' :
                                             '보정 수치'}
                </span>
                <input className={`${inputCls} font-mono`} value={row.수치} onChange={field('수치')}
                  placeholder={row.분류 === '피해보정' ? '-5 또는 -근력/2' : row.분류 === '회복보정' ? '10 또는 내구+2' : '3 또는 감각'} />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-slate-500">최대값 (선택)</span>
                <input className={`${inputCls} font-mono`} value={row.최대} onChange={field('최대')} placeholder="없음" />
              </label>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-slate-400">변수 삽입 (수치/최대 입력란에 커서 두고 클릭)</p>
              <div className="flex flex-wrap gap-1">
                {PASSIVE_VALUE_TOKENS.map(({ label, token }) => (
                  <button key={token} type="button"
                    onClick={() => setRow(r => ({ ...r, 수치: (r.수치 + (r.수치 && !r.수치.endsWith(' ') ? ' ' : '') + token).trimStart() }))}
                    className="text-[10px] px-1.5 py-0.5 bg-slate-100 hover:bg-violet-100 text-slate-500 hover:text-violet-700 border border-slate-200 hover:border-violet-300 rounded transition-colors font-mono"
                  >
                    {label}
                  </button>
                ))}
                {['+', '-', '*', '/'].map(op => (
                  <button key={op} type="button"
                    onClick={() => setRow(r => ({ ...r, 수치: r.수치 + ` ${op} ` }))}
                    className="text-[10px] px-1.5 py-0.5 bg-slate-50 hover:bg-slate-100 text-slate-400 border border-slate-200 rounded font-mono transition-colors"
                  >
                    {op}
                  </button>
                ))}
                <button type="button"
                  onClick={() => setRow(r => ({ ...r, 수치: '*' + (r.수치 || '').replace(/^\s*[*×]\s*/, '') }))}
                  className="text-[10px] px-1.5 py-0.5 bg-fuchsia-50 hover:bg-fuchsia-100 text-fuchsia-600 border border-fuchsia-200 rounded font-mono transition-colors"
                  title="값 맨 앞에 * 를 붙여 곱셈 배율로 만듭니다"
                >*배율</button>
              </div>
              <p className="text-[10px] text-slate-400 leading-snug">
                맨 앞에 <code className="bg-slate-100 px-1 rounded">*</code> 를 붙이면 덧셈이 아니라 <strong>곱셈 배율</strong>입니다.
                예: <code className="bg-slate-100 px-1 rounded">*1.5</code> = ×1.5.
                {row.분류 === '판정보정' && ' 곱셈 배율이 여러 개면 1+Σ(배율-1)로 합산됩니다 (×1.5+×2.2 → ×2.7).'}
              </p>
            </div>
          </div>
        )}

        {/* 발동 시점 (트리거효과/기타만 표시) */}
        {catInfo.showTrigger && (
          <div className="grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-500">발동 시점</span>
              <select className={selectCls} value={trigBase}
                onChange={e => setRow(r => ({ ...r, 발동: e.target.value }))}>
                {PASSIVE_TRIGGERS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            {trigSupportsArg && (
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-slate-500">특정 대상 (선택)</span>
                <input
                  className={`${inputCls} font-mono`}
                  value={trigArg}
                  onChange={e => {
                    const a = e.target.value.trim();
                    setRow(r => ({ ...r, 발동: a ? trigBase + ':' + a : trigBase }));
                  }}
                  placeholder={
                    trigBase === '액션사용후' ? '예: 은신 (비우면 모든 액션)' :
                    trigBase === '스킬사용후' ? '예: 월광참 (비우면 모든 스킬)' :
                    trigBase === '가해후'     ? '예: 화력 A (비우면 모든 공격)' :
                                                '스킬명 (비우면 전체)'
                  }
                />
              </label>
            )}
          </div>
        )}

        {/* 판정 유형 */}
        {catInfo.showCheck && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] text-slate-500">
              {row.분류 === '판정보정' ? '적용할 판정 유형 (전체=모든 판정 / 세부명 가능, 콤마 구분)' :
               row.분류 === '저항'     ? '판정 유형 (저항 고정 권장)' :
                                         '판정 유형 필터 (콤마 구분)'}
            </span>
            <input
              className={`${inputCls} font-mono`}
              value={row.판정}
              onChange={field('판정')}
              placeholder="예: 전체 / 참격 / 근력 / 참격,관통 / 액션"
            />
            <div className="space-y-1">
              {JUDGMENT_GROUPS.map(grp => (
                <div key={grp.label} className="flex flex-wrap gap-1 items-center">
                  <span className="text-[10px] text-slate-400 w-7 shrink-0">{grp.label}</span>
                  {grp.items.map(it => (
                    <button
                      key={it}
                      type="button"
                      onClick={() => setRow(r => {
                        if (it === '전체') return { ...r, 판정: '전체' };
                        const cur = String(r.판정 || '').split(/[,，]/).map(s => s.trim()).filter(Boolean).filter(x => x !== '전체');
                        if (!cur.includes(it)) cur.push(it);
                        return { ...r, 판정: cur.join(',') };
                      })}
                      className="text-[10px] px-1.5 py-0.5 bg-white hover:bg-violet-50 text-slate-500 hover:text-violet-700 border border-slate-200 hover:border-violet-300 rounded transition-colors"
                    >{it}</button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 효과코드 — 기타일 때만 직접 편집 */}
        {row.분류 === '기타' && (
          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-slate-500">효과 코드</span>
            <select className={selectCls} value={row.효과코드} onChange={field('효과코드')}>
              {PASSIVE_EFFECT_CODES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        )}

        {/* 효과 (세부조건 → 세부효과 행 방식) */}
        {catInfo.showEffect && (
          <div className="space-y-1">
            <span className="text-[11px] text-slate-500">효과</span>
            <EffectRowsEditor
              value={row.효과}
              onChange={v => setRow(r => ({ ...r, 효과: v }))}
            />
          </div>
        )}
      </div>

      {/* ── 조건 ── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-600">발동 조건</span>
          <span className="text-[10px] text-slate-400">비워두면 항상 적용됩니다</span>
        </div>
        <ConditionEditor
          value={row.조건}
          onChange={v => setRow(r => ({ ...r, 조건: v }))}
          placeholder="예: 현재체력비율 >= 50&#10;세부: 현재체력비율 >= 80 +5"
        />
      </div>

      {/* ── 설명 / 메모 ── */}
      <div className="grid grid-cols-1 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500">설명 (플레이어에게 표시)</span>
          <textarea className={`${inputCls} h-14 resize-none`} value={row.설명} onChange={field('설명')} placeholder="패시브 효과 설명" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500">메모 (운영 내부용)</span>
          <input className={inputCls} value={row.메모} onChange={field('메모')} placeholder="테스트중, 검수 필요 등" />
        </label>
      </div>

      {/* ── 오류 ── */}
      {errors.length > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 space-y-0.5">
          {errors.map((e, i) => <p key={i} className="text-xs text-rose-700">⚠ {e}</p>)}
        </div>
      )}

      {/* ── 추가/수정 버튼 ── */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (editingPassive) { onUpdatePassive({ ...row }); }
            else { onSavePassive({ ...row }); setRow(EMPTY_PASSIVE); }
          }}
          disabled={errors.length > 0}
          className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white font-bold rounded-xl text-sm transition-colors shadow-sm shadow-violet-200"
        >
          {editingPassive ? '패시브 수정' : '패시브 추가'}
        </button>
        {editingPassive ? (
          <button
            onClick={onCancelEdit}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 rounded-xl text-sm transition-colors"
          >
            취소
          </button>
        ) : (
          <button
            onClick={() => setRow(EMPTY_PASSIVE)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 rounded-xl text-sm transition-colors"
          >
            초기화
          </button>
        )}
        <button
          onClick={copy}
          disabled={errors.length > 0}
          title="시트에 직접 붙여넣기용 TSV 복사"
          className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-600 rounded-xl text-xs transition-colors"
        >
          {copyMsg || 'TSV'}
        </button>
      </div>
    </div>
  );
}
// ── SkillForm — 기존 스킬 작성 폼 ──────────────────────────────────────
// 쉬운 모드 아키타입 필드 입력 렌더러.
function ArchField({ field: f, meta, onChange }) {
  if (f.when && !f.when(meta || {})) return null;
  const val = (meta || {})[f.key] ?? '';
  if (f.type === 'bool') {
    return (
      <label className="flex items-center gap-2 text-[11px] text-slate-600">
        <input type="checkbox" checked={!!val} onChange={e => onChange(f.key, e.target.checked)} />
        {f.label}
      </label>
    );
  }
  if (f.type === 'select') {
    const labelFor = (o) => f.optionLabels ? (f.optionLabels.find(x => x.value === o)?.label || o) : o;
    return (
      <label className="flex flex-col gap-1">
        <span className="text-[11px] text-slate-500">{f.label}</span>
        <select className={selectCls} value={val} onChange={e => onChange(f.key, e.target.value)}>
          {f.options.map(o => <option key={o} value={o}>{labelFor(o)}</option>)}
        </select>
      </label>
    );
  }
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] text-slate-500">{f.label}</span>
      <input className={`${inputCls} font-mono`} value={val} onChange={e => onChange(f.key, e.target.value)} placeholder="" />
    </label>
  );
}

function SkillForm({ editingSkill, stats, abilities, proficiencies, onSave, onCancel }) {
  // 효과는 줄=효과 문자열(skill.효과). 레거시 effects[]가 있으면 로드 시 변환.
  const initSkill = (src) => {
    const s = src || defaultSkill();
    return { ...s, 효과: s.효과 || effectsToText(s.effects), meta: s.meta || null };
  };
  // 모드: meta(아키타입)이 있으면 쉬운, 없으면(레거시·자유) 고급. 새 스킬은 쉬운.
  const initMode = (src) => {
    if (!src) return 'easy';
    const a = getArchetype(src.meta?.archetype);
    return (a && !a.freeform) ? 'easy' : 'advanced';
  };
  const [skill, setSkill] = useState(() => initSkill(editingSkill));
  const [mode, setMode] = useState(() => initMode(editingSkill));
  const [formulaModalOpen, setFormulaModalOpen] = useState(false);
  const [formulaCat, setFormulaCat] = useState('기본');
  const [showTokens, setShowTokens] = useState(false); // 고급: 토큰/연산자 펼치기

  useEffect(() => {
    setSkill(initSkill(editingSkill));
    setMode(initMode(editingSkill));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingSkill]);

  const field = (key) => (e) => setSkill(s => ({ ...s, [key]: e.target.value }));

  const insertFormula = (token) => {
    setSkill(s => {
      const prev = s.formula;
      const sep = prev.length > 0 && !prev.endsWith(' ') ? ' ' : '';
      return { ...s, formula: prev + sep + token };
    });
    setFormulaModalOpen(false);
  };

  const appendOperator = (op) => {
    setSkill(s => ({ ...s, formula: s.formula + ` ${op} ` }));
  };

  // 아키타입 선택 → meta 초기화 + formula/효과 자동 생성. (freeform이면 고급 모드로)
  const applyArchetype = (archId) => {
    const arch = getArchetype(archId);
    if (!arch || arch.freeform) { setSkill(s => ({ ...s, meta: null })); setMode('advanced'); return; }
    setSkill(s => {
      const meta = { archetype: archId, ...(arch.defaults || {}) };
      const gen = generateFromArchetype(meta, s.rank);
      return { ...s, meta, ...(gen ? { formula: gen.formula, 효과: gen.효과 } : {}) };
    });
  };
  // 쉬운 모드 필드/랭크 변경 → meta 갱신 + 재생성.
  const setMetaField = (key, val) => setSkill(s => {
    const meta = { ...(s.meta || {}), [key]: val };
    const gen = generateFromArchetype(meta, s.rank);
    return { ...s, meta, ...(gen ? { formula: gen.formula, 효과: gen.효과 } : {}) };
  });
  const setRank = (rank) => setSkill(s => {
    const gen = (mode === 'easy' && s.meta) ? generateFromArchetype(s.meta, rank) : null;
    return { ...s, rank, ...(gen ? { formula: gen.formula, 효과: gen.효과 } : {}) };
  });

  const tokenErrors    = validateFormula(skill.formula);
  const structureWarns = validateFormulaStructure(skill.formula);
  const needsTarget    = hasTargetReference(skill.formula);
  const allFormulaIssues = [...tokenErrors, ...structureWarns];

  const summary = buildSkillSummary(skill, { stats, abilities, proficiencies });
  const currentArch = getArchetype(skill.meta?.archetype);

  // 저장: 레거시 effects 제거. 고급 모드에서 저장하면 meta 비움(수동 편집 확정).
  const handleSave = () => {
    const { effects, ...rest } = skill;
    onSave(mode === 'advanced' ? { ...rest, meta: null } : rest);
  };

  return (
    <div className="space-y-4">

      {/* 스킬명 */}
      <label className="flex flex-col gap-1">
        <span className="text-[11px] text-slate-500 tracking-wide">스킬 이름</span>
        <input className={inputCls} value={skill.name} onChange={field('name')} placeholder="스킬 이름" />
      </label>

      {/* ── 평문 요약 카드 ── */}
      <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-3">
        <p className="text-[10px] font-semibold text-violet-500 uppercase tracking-widest mb-1">요약</p>
        <p className="text-sm text-slate-800 leading-relaxed">{summary}</p>
      </div>

      {/* ── 모드 토글 ── */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
        {[{ id: 'easy', label: '쉬운 (아키타입)' }, { id: 'advanced', label: '고급 (직접 편집)' }].map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === m.id ? 'bg-white text-violet-700 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'
            }`}
          >{m.label}</button>
        ))}
      </div>

      {/* 계통 / 계열 */}
      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">계통</span>
          <select className={selectCls} value={skill.tradition} onChange={field('tradition')}>
            {SKILL_TRADITIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">계열</span>
          <select className={selectCls} value={skill.series} onChange={field('series')}>
            {SKILL_SERIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>

      {/* 랭크 */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-slate-500 tracking-wide">랭크</span>
        <div className="flex flex-wrap gap-1">
          {SKILL_RANKS.map(({ rank, value }) => (
            <button
              key={rank}
              onClick={() => setRank(rank)}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold border transition-all ${
                skill.rank === rank
                  ? 'bg-amber-400 text-white border-amber-400 shadow-sm shadow-amber-200/50'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50'
              }`}
            >
              {rank} <span className="opacity-50 font-normal">({value})</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 쉬운 모드: 아키타입 위저드 ── */}
      {mode === 'easy' && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-600">어떤 스킬인가요?</span>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {SKILL_ARCHETYPES.map(a => {
                const active = (skill.meta?.archetype || '') === a.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => applyArchetype(a.id)}
                    title={a.desc}
                    className={`flex flex-col items-center gap-0.5 p-2 rounded-xl border transition-all ${
                      active ? 'border-violet-400 bg-violet-100 ring-2 ring-violet-300' : 'border-slate-200 bg-slate-50 hover:border-violet-300'
                    }`}
                  >
                    <span className="text-base leading-none">{a.icon}</span>
                    <span className="text-[11px] font-semibold text-slate-700">{a.label}</span>
                  </button>
                );
              })}
            </div>
            {currentArch && <p className="text-[10px] text-slate-400 leading-snug">{currentArch.desc}</p>}
          </div>

          {currentArch && !currentArch.freeform && (
            <div className="space-y-3 bg-slate-50 rounded-xl border border-slate-200 p-4">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">세부 설정</span>
              <div className="grid grid-cols-2 gap-2">
                {currentArch.fields.map(f => (
                  <ArchField key={f.key} field={f} meta={skill.meta} onChange={setMetaField} />
                ))}
              </div>
              <FormulaPreview formula={skill.formula} stats={stats} rank={skill.rank} abilities={abilities} proficiencies={proficiencies} />
              <p className="text-[10px] text-slate-400 italic">계산식·효과는 자동 생성된 기본값입니다. 세밀하게 고치려면 위 <strong>고급</strong> 모드로 전환하세요.</p>
            </div>
          )}
        </div>
      )}

      {/* ── 고급 모드: 계산식 직접 편집 ── */}
      {mode === 'advanced' && (
      <div className="space-y-3 bg-slate-50 rounded-xl border border-slate-200 p-4">
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">계산식</span>

        <input
          className={`${inputCls}${allFormulaIssues.length > 0 ? ' border-amber-400 focus:border-amber-400 focus:ring-amber-400/20' : ''}`}
          value={skill.formula}
          onChange={field('formula')}
          placeholder="예: d20 + 랭크 + 근력"
        />

        {allFormulaIssues.length > 0 && (
          <div className="space-y-0.5">
            {allFormulaIssues.map((e, i) => <p key={i} className="text-xs text-amber-600">⚠ {e}</p>)}
          </div>
        )}
        {needsTarget && (
          <p className="text-xs text-amber-600">⚠ 이 계산식은 대상 지정이 필요합니다. 사용 예: !스킬 스킬명 대상:대상별명</p>
        )}

        <FormulaPreview formula={skill.formula} stats={stats} rank={skill.rank} abilities={abilities} proficiencies={proficiencies} />

        <button
          type="button"
          onClick={() => setShowTokens(v => !v)}
          className="text-[11px] px-2.5 py-1 bg-white border border-slate-200 text-slate-500 hover:text-violet-700 hover:border-violet-300 rounded-lg transition-colors"
        >
          {showTokens ? '입력 도구 접기 ▲' : '입력 도구 펼치기 (토큰·연산자·액션식) ▼'}
        </button>

        {showTokens && (<>
        <div className="space-y-2">
          <p className="text-[10px] text-slate-400 tracking-widest uppercase">빠른 삽입</p>
          <div className="flex flex-wrap gap-1">
            {FORMULA_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFormulaCat(cat.id)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-medium border transition-colors ${
                  formulaCat === cat.id
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-violet-300 hover:text-violet-700'
                }`}
              >
                {cat.id}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {FORMULA_CATEGORIES.find(c => c.id === formulaCat)?.tokens.map(token => (
              <button
                key={token}
                onClick={() => insertFormula(token)}
                className="px-2 py-1 bg-white hover:bg-violet-50 border border-slate-200 hover:border-violet-300 text-slate-600 hover:text-violet-700 rounded-lg text-[11px] font-mono transition-colors"
              >
                {token}
              </button>
            ))}
          </div>
          {formulaCat === '고급' && (
            <p className="text-[10px] text-amber-600">⚠ 고급 변수는 캐릭터 DB를 참조합니다. 운영진 검수 대상입니다.</p>
          )}
          <button
            onClick={() => setFormulaModalOpen(true)}
            className="text-[11px] px-2.5 py-1 bg-white border border-dashed border-slate-300 text-slate-400 hover:text-violet-700 hover:border-violet-300 hover:bg-violet-50 rounded-lg transition-colors"
          >
            + 고급 블럭 선택기
          </button>
        </div>

        <div className="space-y-1.5">
          <p className="text-[10px] text-slate-400 tracking-widest uppercase">연산자</p>
          <div className="flex flex-wrap gap-1.5">
            {OPERATORS.map(({ op, label, tip }) => (
              <button
                key={op}
                onClick={() => appendOperator(op)}
                title={tip}
                className="min-w-[2.75rem] px-2 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 hover:border-violet-300 text-slate-700 font-mono font-bold rounded-lg text-sm transition-colors"
              >
                {label}
                <span className="block text-slate-400 font-sans font-normal" style={{ fontSize: '9px', lineHeight: '1.2' }}>{tip}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-[10px] text-slate-400 tracking-widest uppercase">빠른 조합 (액션 기반)</p>
          <div className="flex flex-wrap gap-1">
            {ACTIONS.map((action) => (
              <button
                key={action.name}
                onClick={() => setSkill(s => ({ ...s, formula: buildActionPresetFormula(action, s.rank) }))}
                title={buildActionPresetFormula(action, skill.rank)}
                className="px-2 py-1 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-500 hover:text-indigo-700 rounded-lg text-xs transition-colors"
              >
                {action.name}식
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 tracking-widest uppercase pt-1">특수 템플릿</p>
          <div className="flex flex-wrap gap-1">
            {SPECIAL_COMBOS.map(({ label, formula }) => (
              <button
                key={label}
                onClick={() => setSkill(s => ({ ...s, formula }))}
                title={formula}
                className="px-2 py-1 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-500 hover:text-indigo-700 rounded-lg text-xs transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 italic">누르면 현재 계산식이 교체됩니다. 액션 기반 식은 현재 선택한 <strong>랭크</strong> 기준 계수가 반영됩니다.</p>
        </div>
        </>)}
      </div>
      )}

      {/* ── 효과 (줄=효과) — 고급 모드에서 직접 편집 ── */}
      {mode === 'advanced' && (
        <div className="space-y-1">
          <span className="text-[11px] text-slate-500 tracking-wide">효과</span>
          <EffectRowsEditor
            value={skill.효과}
            onChange={(v) => setSkill((s) => ({ ...s, 효과: v }))}
          />
        </div>
      )}

      {/* 조건 */}
      <div className="space-y-1">
        <span className="text-[11px] text-slate-500 tracking-wide">조건</span>
        <ConditionEditor
          value={skill.condition}
          onChange={(v) => setSkill((s) => ({ ...s, condition: v }))}
        />
      </div>

      <div className="space-y-1.5">
        <span className="text-[11px] text-slate-500 tracking-wide">대가</span>
        <CostEditor value={skill.cost} onChange={v => setSkill(s => ({ ...s, cost: v }))} />
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] text-slate-500 tracking-wide">설명</span>
        <textarea
          className={`${inputCls} h-16 resize-none`}
          value={skill.description}
          onChange={field('description')}
          placeholder="스킬 설명"
        />
      </label>

      {/* 저장 */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={handleSave}
          className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm shadow-violet-200"
        >
          {editingSkill ? '스킬 수정' : '스킬 추가'}
        </button>
        {editingSkill && (
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 rounded-xl text-sm transition-colors"
          >
            취소
          </button>
        )}
      </div>

      {formulaModalOpen && (
        <FormulaBlockModal
          onInsert={insertFormula}
          onClose={() => setFormulaModalOpen(false)}
        />
      )}
    </div>
  );
}

// ── 메인 export — 모드 탭 포함 ─────────────────────────────────────────
export default function SkillMaker({
  editingSkill, stats, abilities, proficiencies, onSave, onCancel,
  editingPassive, onSavePassive, onUpdatePassive, onCancelPassiveEdit,
}) {
  // 편집 중일 때는 해당 모드 고정
  const [mode, setMode] = useState('skill');

  // 패시브 편집 진입 시 패시브 모드로 전환
  useEffect(() => {
    if (editingPassive) setMode('passive');
  }, [editingPassive]);

  const editing = editingSkill || editingPassive;

  const MODES = [
    { id: 'skill',   label: '스킬 제작' },
    { id: 'passive', label: '패시브 제작' },
  ];

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-lg shadow-violet-100/20 p-5 space-y-4">

      {/* 헤더 */}
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-violet-300 font-mono tracking-widest">05</span>
            <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
              스킬 / 패시브 메이커
            </h2>
            {editing && (
              <span className="text-[11px] text-violet-700 bg-violet-50 border border-violet-200 rounded px-1.5 py-0.5">
                {editingPassive ? '패시브 편집 중' : '편집 중'}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">스킬과 패시브를 제작합니다.</p>
        </div>
      </div>

      {/* 모드 탭 — 편집 중에는 숨김 */}
      {!editing && (
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === m.id
                  ? 'bg-white text-violet-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      {/* 폼 본문 */}
      {((mode === 'skill' && !editingPassive) || editingSkill) ? (
        <SkillForm
          editingSkill={editingSkill}
          stats={stats}
          abilities={abilities}
          proficiencies={proficiencies}
          onSave={onSave}
          onCancel={onCancel}
        />
      ) : (
        <PassiveForm
          editingPassive={editingPassive}
          onSavePassive={onSavePassive}
          onUpdatePassive={onUpdatePassive}
          onCancelEdit={onCancelPassiveEdit}
        />
      )}
    </div>
  );
}
