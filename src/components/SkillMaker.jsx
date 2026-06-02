import { useState, useEffect, useMemo } from 'react';
import { SKILL_TRADITIONS, SKILL_SERIES, SKILL_RANKS, defaultSkill, makeEffect } from '../data/skillRanks';
import {
  validateFormula,
  validateFormulaStructure,
  previewFormula,
  hasTargetReference,
  getEffectWarnings,
} from '../utils/calcSkill';
import { STAT_NAMES } from '../data/stats';
import { ABILITY_NAMES } from '../data/abilities';
import { PROFICIENCY_NAMES } from '../data/proficiencies';
import { ACTIONS } from '../data/actions';
import FormulaBlockModal from './FormulaBlockModal';
import EffectBlockModal from './EffectBlockModal';
import ConditionEditor from './ConditionEditor.jsx';
import EffectRowsEditor from './EffectRowsEditor.jsx';
import CostEditor from './CostEditor.jsx';

// ── 스타일 상수 ─────────────────────────────────────────────────────────
const inputCls  = "w-full min-w-0 bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 outline-none placeholder:text-slate-400 transition-colors";
const selectCls = "w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:border-violet-400 outline-none transition-colors";

// ── 효과 블럭 레이블 ────────────────────────────────────────────────────
const EFFECT_TYPE_LABEL = {
  template:     '상태 템플릿 부여',
  custom:       '커스텀 상태 부여',
  statusRemove: '상태 해제',
  stack:        '스택 변경',
  free:         '자유 입력',
};

// ── 계산식 입력 지원 데이터 ─────────────────────────────────────────────
const OPERATORS = [
  { op: '+', label: '+', tip: '더하기' },
  { op: '-', label: '-', tip: '빼기' },
  { op: '*', label: '*', tip: '곱하기' },
  { op: '/', label: '/', tip: '나누기' },
  { op: '(',  label: '(',  tip: '묶음 시작' },
  { op: ')',  label: ')',  tip: '묶음 끝' },
];

// 랭크별 기초부 계수 [주스탯계수, 부스탯계수]. (F는 미지정 → E 기준 사용)
const PRESET_RANK_COEF = {
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

// 액션의 스탯/기능/숙련 구조 + 선택한 랭크의 기초부 계수로
// "1d20 + 랭크 + ( 기초부 ) * ( 배율부 )" 형태의 계산식을 생성한다.
//   기초부 = 주스탯*주계수 + 부스탯*부계수   (랭크별 계수)
//   배율부 = 주기능*0.12 + 부기능*0.08 + 관련기능*0.05 + 관련숙련*0.25
function buildActionPresetFormula(action, rank) {
  const [c1, c2] = PRESET_RANK_COEF[rank] || PRESET_RANK_COEF.E;
  const b = action.base || [];
  const baseParts = [];
  if (b[0]) baseParts.push(`${b[0].stat} * ${c1}`);
  if (b[1]) baseParts.push(`${b[1].stat} * ${c2}`);
  const basePart = baseParts.join(' + ');
  const multPart = (action.mult || []).map(m => `${m.key} * ${m.coef}`).join(' + ');
  return `1d20 + 랭크 + ( ${basePart} ) * ( ${multPart} )`;
}

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
  '피해직전', '피해후', '회복시', '세션종료', '수동'
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
    desc: '판정(주사위) 결과에 수치를 더하거나 뺍니다.',
    example: '근력 판정에 +3',
    defaults: { 발동: '판정계산전', 효과코드: '판정보정' },
    showValue: true, showTrigger: false, showCheck: true, showEffect: false,
  },
  {
    value: '피해보정',
    label: '피해 경감',
    color: 'blue',
    desc: '받는 피해를 줄이거나 늘립니다. 음수 = 경감.',
    example: 'HP 50% 이상일 때 피해 -5',
    defaults: { 발동: '피해직전', 효과코드: '피해보정' },
    showValue: true, showTrigger: false, showCheck: false, showEffect: false,
  },
  {
    value: '회복보정',
    label: '회복 보정',
    color: 'emerald',
    desc: '체력 회복량을 늘리거나 줄입니다.',
    example: '특정 조건에서 회복 +10',
    defaults: { 발동: '회복시', 효과코드: '회복보정' },
    showValue: true, showTrigger: false, showCheck: false, showEffect: false,
  },
  {
    value: '저항',
    label: '저항 보정',
    color: 'amber',
    desc: '상태이상 저항 판정에 수치를 더합니다.',
    example: '저항 판정에 +3',
    defaults: { 발동: '판정계산전', 효과코드: '저항확률', 판정: '저항' },
    showValue: true, showTrigger: false, showCheck: true, showEffect: false,
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
  const v     = Number(row.수치);
  const sign  = v > 0 ? '+' : '';
  switch (catInfo?.value) {
    case '판정보정':  return `"${name}": ${cond}${row.판정 || '모든'} 판정에 ${sign}${v || '?'} 보정`;
    case '피해보정':  return `"${name}": ${cond}받는 피해 ${sign}${v || '?'}`;
    case '회복보정':  return `"${name}": ${cond}체력 회복량 ${sign}${v || '?'}`;
    case '저항':      return `"${name}": ${cond}저항 판정에 ${sign}${v || '?'}`;
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

function EffectCard({ effect, index, total, onUpdate, onDelete, onMoveUp, onMoveDown }) {
  const [modalOpen, setModalOpen] = useState(false);
  const warnings = getEffectWarnings(effect);
  const hasText = !!effect.generatedText;

  return (
    <div className={`rounded-xl border p-3 space-y-2 transition-colors ${
      effect.confirmed ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] text-slate-400 font-mono shrink-0">효과 {index + 1}</span>
        {effect.type && (
          <span className="text-[11px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-200 shrink-0">
            {EFFECT_TYPE_LABEL[effect.type] ?? effect.type}
          </span>
        )}
        {effect.confirmed && (
          <span className="text-[11px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">확정됨</span>
        )}
        <div className="flex gap-1 ml-auto shrink-0">
          <button onClick={onMoveUp} disabled={index === 0}
            className="w-6 h-6 flex items-center justify-center rounded-lg bg-white hover:bg-slate-100 text-slate-400 text-xs border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">↑</button>
          <button onClick={onMoveDown} disabled={index === total - 1}
            className="w-6 h-6 flex items-center justify-center rounded-lg bg-white hover:bg-slate-100 text-slate-400 text-xs border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">↓</button>
          <button onClick={onDelete}
            className="w-6 h-6 flex items-center justify-center rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 text-xs border border-rose-200 transition-colors">✕</button>
        </div>
      </div>
      {hasText && (
        <div className={`rounded-lg p-2 text-xs font-mono break-all whitespace-pre-wrap ${
          effect.confirmed
            ? 'bg-white text-emerald-700 border border-emerald-200'
            : 'bg-white text-indigo-700 border border-indigo-100'
        }`}>{effect.generatedText}</div>
      )}
      {warnings.length > 0 && (
        <div className="space-y-0.5">
          {warnings.map((w, i) => <p key={i} className="text-xs text-amber-600">⚠ {w}</p>)}
        </div>
      )}
      {!effect.confirmed ? (
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setModalOpen(true)}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-lg text-xs font-medium transition-colors">블럭 선택</button>
          {hasText && (
            <button onClick={() => onUpdate({ ...effect, confirmed: true })}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-medium transition-colors">확정</button>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setModalOpen(true)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors">편집</button>
          <button onClick={() => onUpdate({ ...effect, confirmed: false })}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 rounded-lg text-xs font-medium transition-colors">확정 해제</button>
        </div>
      )}
      {modalOpen && (
        <EffectBlockModal
          initialType={effect.type || 'template'}
          initialParams={effect.params || {}}
          onInsert={(type, params, text) => {
            onUpdate({ ...effect, type, params, generatedText: text });
            setModalOpen(false);
          }}
          onClose={() => setModalOpen(false)}
        />
      )}
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
    setRow(r => ({ ...r, 분류: cat.value, ...cat.defaults }));
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
              </div>
            </div>
          </div>
        )}

        {/* 발동 시점 (트리거효과/기타만 표시) */}
        {catInfo.showTrigger && (
          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-slate-500">발동 시점</span>
            <select className={selectCls} value={row.발동} onChange={field('발동')}>
              {PASSIVE_TRIGGERS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
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
function SkillForm({ editingSkill, stats, abilities, proficiencies, onSave, onCancel }) {
  const [skill, setSkill] = useState(() => {
    const s = editingSkill || defaultSkill();
    return { ...s, effects: s.effects ?? [] };
  });
  const [formulaModalOpen, setFormulaModalOpen] = useState(false);
  const [formulaCat, setFormulaCat] = useState('기본');
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const s = editingSkill || defaultSkill();
    setSkill({ ...s, effects: s.effects ?? [] });
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

  const addEffect = () => setSkill(s => ({ ...s, effects: [...s.effects, makeEffect()] }));

  const updateEffect = (id, updated) =>
    setSkill(s => ({ ...s, effects: s.effects.map(e => e.id === id ? updated : e) }));

  const deleteEffect = (id) =>
    setSkill(s => ({ ...s, effects: s.effects.filter(e => e.id !== id) }));

  const moveEffect = (idx, dir) => {
    setSkill(s => {
      const next = [...s.effects];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return s;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return { ...s, effects: next };
    });
  };

  const tokenErrors    = validateFormula(skill.formula);
  const structureWarns = validateFormulaStructure(skill.formula);
  const needsTarget    = hasTargetReference(skill.formula);
  const allFormulaIssues = [...tokenErrors, ...structureWarns];

  return (
    <div className="space-y-4">

      {/* 스킬명 */}
      <label className="flex flex-col gap-1">
        <span className="text-[11px] text-slate-500 tracking-wide">스킬 이름</span>
        <input className={inputCls} value={skill.name} onChange={field('name')} placeholder="스킬 이름" />
      </label>

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
              onClick={() => setSkill(s => ({ ...s, rank }))}
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

      {/* ── 계산식 ── */}
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

        <FormulaPreview formula={skill.formula} stats={stats} rank={skill.rank} abilities={abilities} proficiencies={proficiencies} />
      </div>

      {/* ── 효과 목록 ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500 tracking-wide">효과 목록</span>
          <span className="text-[11px] text-slate-400 font-mono">{skill.effects.length}개</span>
        </div>
        {skill.effects.length === 0 && (
          <p className="text-xs text-slate-400 italic py-1">효과가 없습니다. 아래 버튼으로 추가하세요.</p>
        )}
        <div className="space-y-2">
          {skill.effects.map((ef, idx) => (
            <EffectCard
              key={ef.id}
              effect={ef}
              index={idx}
              total={skill.effects.length}
              onUpdate={(updated) => updateEffect(ef.id, updated)}
              onDelete={() => deleteEffect(ef.id)}
              onMoveUp={() => moveEffect(idx, -1)}
              onMoveDown={() => moveEffect(idx, 1)}
            />
          ))}
        </div>
        <button
          onClick={addEffect}
          className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl border border-dashed border-slate-300 hover:border-indigo-300 text-sm transition-colors"
        >
          + 효과 추가
        </button>
      </div>

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
          onClick={() => onSave(skill)}
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
