import { useState } from 'react';
import { STAT_NAMES } from '../data/stats';
import { ABILITY_NAMES } from '../data/abilities';
import { PROFICIENCY_NAMES } from '../data/proficiencies';

const CATEGORIES = [
  { id: 'd6',      label: 'd6',         group: '기본' },
  { id: 'd20',     label: 'd20',        group: '기본' },
  { id: '2d6',     label: '2d6',        group: '기본' },
  { id: '랭크',    label: '랭크',       group: '기본' },
  { id: '스탯',    label: '스탯',       group: '참조' },
  { id: '기능',    label: '기능',       group: '참조' },
  { id: '숙련',    label: '숙련',       group: '참조' },
  { id: '자신상태', label: '자신의 상태', group: '상태/스택' },
  { id: '대상상태', label: '대상의 상태', group: '상태/스택' },
  { id: '자신스택', label: '자신의 스택', group: '상태/스택' },
  { id: '대상스택', label: '대상의 스택', group: '상태/스택' },
  { id: '고급변수', label: '고급 변수',  group: '고급' },
];

const DESCRIPTIONS = {
  'd6':      '1d6 판정을 계산식에 추가합니다. 기대값 프리뷰에서는 3.5로 계산됩니다.',
  'd20':     '1d20 판정을 계산식에 추가합니다. 기대값 프리뷰에서는 10.5로 계산됩니다.',
  '2d6':     '2d6 판정을 계산식에 추가합니다. 기대값 프리뷰에서는 7로 계산됩니다.',
  '랭크':    '현재 스킬의 랭크값을 참조합니다. F=1, E=10, D=20, C=30, B=40, A=50, S=70, U=80, EX=100.',
  '스탯':    '현재 캐릭터의 스탯 내부값을 참조합니다. 예: 감각 A → 30.',
  '기능':    '현재 캐릭터의 기능 수치(0~5)를 참조합니다.',
  '숙련':    '현재 캐릭터의 숙련 수치(0~5)를 참조합니다.',
  '자신상태': '스킬 사용자 자신에게 걸린 상태를 참조합니다. 상태_출혈_수치는 자신에게 걸린 출혈 수치 합계입니다.',
  '대상상태': '스킬 대상에게 걸린 상태를 참조합니다. 대상 지정이 필요한 스킬에서만 정상 동작합니다.',
  '자신스택': '스킬 사용자 자신에게 쌓인 스택값을 참조합니다. 예: 스택_혈인.',
  '대상스택': '스킬 대상에게 쌓인 스택값을 참조합니다. 대상 지정이 필요한 스킬에서만 정상 동작합니다.',
  '고급변수': '캐릭터 DB의 숫자형 필드를 참조합니다. 운영진 검수 대상입니다.',
};

const REF_TYPES = ['수치', '개수', '최대', '존재', '확률'];
const DB_VARS = ['현재체력', '최대체력', '이면침식', '일상점'];

function generateToken(category, params) {
  switch (category) {
    case 'd6':  return 'd6';
    case 'd20': return 'd20';
    case '2d6': return '2d6';
    case '랭크': return '랭크';
    case '스탯': return params.stat || '';
    case '기능': return params.ability || '';
    case '숙련': return params.proficiency || '';
    case '자신상태': {
      if (!params.statusName || !params.refType) return '';
      return `상태_${params.statusName}_${params.refType}`;
    }
    case '대상상태': {
      if (!params.statusName || !params.refType) return '';
      return `대상상태_${params.statusName}_${params.refType}`;
    }
    case '자신스택': return params.stackName ? `스택_${params.stackName}` : '';
    case '대상스택': return params.stackName ? `대상스택_${params.stackName}` : '';
    case '고급변수': return params.variable || '';
    default: return '';
  }
}

const groups = [...new Set(CATEGORIES.map(c => c.group))];

const inputCls = "w-full min-w-0 bg-slate-800/60 text-slate-100 rounded-lg px-3 py-1.5 text-sm border border-slate-700/50 focus:border-amber-400/50 outline-none placeholder:text-slate-600 transition-colors";

function BtnSel({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
        active
          ? 'bg-amber-400/80 text-slate-900 border-amber-400/60'
          : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:border-amber-400/40 hover:text-slate-200'
      }`}
    >
      {children}
    </button>
  );
}

export default function FormulaBlockModal({ onInsert, onClose }) {
  const [category, setCategory] = useState('d6');
  const [params, setParams] = useState({});

  const token = generateToken(category, params);
  const needsTarget = category === '대상상태' || category === '대상스택';
  const canInsert = token !== '';

  const setParam = (k, v) => setParams(p => ({ ...p, [k]: v }));
  const changeCategory = (cat) => { setCategory(cat); setParams({}); };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50">

        <div className="sticky top-0 bg-slate-900 border-b border-white/10 px-5 py-3.5 flex items-center justify-between z-10">
          <div>
            <h3 className="text-sm font-semibold text-amber-200">계산식 블럭 선택</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Formula Block</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800/60 text-slate-400 hover:text-slate-200 text-sm transition-colors">✕</button>
        </div>

        <div className="p-5 space-y-4">
          {/* Category by group */}
          {groups.map(g => (
            <div key={g} className="space-y-1.5">
              <span className="text-[10px] text-slate-600 font-mono tracking-widest uppercase">{g}</span>
              <div className="flex flex-wrap gap-1">
                {CATEGORIES.filter(c => c.group === g).map(c => (
                  <BtnSel key={c.id} active={category === c.id} onClick={() => changeCategory(c.id)}>
                    {c.label}
                  </BtnSel>
                ))}
              </div>
            </div>
          ))}

          {/* Description */}
          <div className="bg-slate-800/40 rounded-xl border border-white/6 p-3 text-xs text-slate-400 leading-relaxed">
            {DESCRIPTIONS[category]}
          </div>

          {/* Inputs */}
          {category === '스탯' && (
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-500">스탯 선택</span>
              <div className="flex flex-wrap gap-1">
                {STAT_NAMES.map(s => (
                  <BtnSel key={s} active={params.stat === s} onClick={() => setParam('stat', s)}>{s}</BtnSel>
                ))}
              </div>
            </div>
          )}

          {category === '기능' && (
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-500">기능 선택</span>
              <div className="flex flex-wrap gap-1">
                {ABILITY_NAMES.map(a => (
                  <BtnSel key={a} active={params.ability === a} onClick={() => setParam('ability', a)}>{a}</BtnSel>
                ))}
              </div>
            </div>
          )}

          {category === '숙련' && (
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-500">숙련 선택</span>
              <div className="flex flex-wrap gap-1">
                {PROFICIENCY_NAMES.map(p => (
                  <BtnSel key={p} active={params.proficiency === p} onClick={() => setParam('proficiency', p)}>{p}</BtnSel>
                ))}
              </div>
            </div>
          )}

          {(category === '자신상태' || category === '대상상태') && (
            <div className="space-y-3">
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-slate-500">상태명</span>
                <input className={inputCls} value={params.statusName || ''} onChange={e => setParam('statusName', e.target.value)} placeholder="예: 출혈, 구속, 보호막" />
              </label>
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-500">참조값</span>
                <div className="flex flex-wrap gap-1">
                  {REF_TYPES.map(r => (
                    <BtnSel key={r} active={params.refType === r} onClick={() => setParam('refType', r)}>{r}</BtnSel>
                  ))}
                </div>
              </div>
              {needsTarget && (
                <p className="text-xs text-amber-400">⚠ 대상 지정이 필요한 스킬에서만 정상 동작합니다.</p>
              )}
            </div>
          )}

          {(category === '자신스택' || category === '대상스택') && (
            <div className="space-y-2">
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-slate-500">스택명</span>
                <input className={inputCls} value={params.stackName || ''} onChange={e => setParam('stackName', e.target.value)} placeholder="예: 혈인, 표식" />
              </label>
              {needsTarget && (
                <p className="text-xs text-amber-400">⚠ 대상 지정이 필요한 스킬에서만 정상 동작합니다.</p>
              )}
            </div>
          )}

          {category === '고급변수' && (
            <div className="space-y-2">
              <span className="text-[11px] text-slate-500">변수 선택</span>
              <div className="flex flex-wrap gap-1">
                {DB_VARS.map(v => (
                  <BtnSel key={v} active={params.variable === v} onClick={() => setParam('variable', v)}>{v}</BtnSel>
                ))}
              </div>
              <p className="text-xs text-amber-400">⚠ 운영진 검수 대상입니다.</p>
            </div>
          )}

          {/* Preview */}
          <div className="bg-slate-950/60 rounded-xl border border-white/8 p-3">
            <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1.5">삽입 미리보기</p>
            <p className="text-sm font-mono text-emerald-300/90 break-all">{token || '(값을 선택 또는 입력하세요)'}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => canInsert && onInsert(token)}
              disabled={!canInsert}
              className={`flex-1 py-2 rounded-xl font-bold text-sm transition-colors ${
                canInsert
                  ? 'bg-amber-400/80 hover:bg-amber-400/90 text-slate-900 shadow-sm shadow-amber-400/20'
                  : 'bg-slate-800/40 text-slate-600 cursor-not-allowed'
              }`}
            >
              삽입
            </button>
            <button onClick={onClose} className="px-4 py-2 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 text-slate-400 rounded-xl text-sm transition-colors">
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
