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

export default function FormulaBlockModal({ onInsert, onClose }) {
  const [category, setCategory] = useState('d6');
  const [params, setParams] = useState({});

  const token = generateToken(category, params);
  const needsTarget = category === '대상상태' || category === '대상스택';
  const canInsert = token !== '';

  const setParam = (k, v) => setParams(p => ({ ...p, [k]: v }));
  const changeCategory = (cat) => { setCategory(cat); setParams({}); };

  const BtnSel = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${
        active ? 'bg-yellow-500 text-gray-900 border-yellow-400' : 'bg-gray-700 text-gray-300 border-gray-600 hover:border-yellow-500'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-2 sm:p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-600 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">

        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between z-10">
          <h3 className="text-base font-bold text-yellow-400">계산식 블럭 선택</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl font-bold leading-none">✕</button>
        </div>

        <div className="p-4 space-y-4">
          {/* Category by group */}
          {groups.map(g => (
            <div key={g} className="space-y-1">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{g}</span>
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
          <div className="bg-gray-700/50 rounded-lg p-3 text-xs text-gray-300 leading-relaxed">
            {DESCRIPTIONS[category]}
          </div>

          {/* Inputs */}
          {category === '스탯' && (
            <div className="space-y-1">
              <span className="text-xs text-gray-400">스탯 선택</span>
              <div className="flex flex-wrap gap-1">
                {STAT_NAMES.map(s => (
                  <BtnSel key={s} active={params.stat === s} onClick={() => setParam('stat', s)}>{s}</BtnSel>
                ))}
              </div>
            </div>
          )}

          {category === '기능' && (
            <div className="space-y-1">
              <span className="text-xs text-gray-400">기능 선택</span>
              <div className="flex flex-wrap gap-1">
                {ABILITY_NAMES.map(a => (
                  <BtnSel key={a} active={params.ability === a} onClick={() => setParam('ability', a)}>{a}</BtnSel>
                ))}
              </div>
            </div>
          )}

          {category === '숙련' && (
            <div className="space-y-1">
              <span className="text-xs text-gray-400">숙련 선택</span>
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
                <span className="text-xs text-gray-400">상태명</span>
                <input
                  className="w-full bg-gray-700 text-white rounded px-2 py-1.5 text-sm border border-gray-600 focus:border-yellow-400 outline-none"
                  value={params.statusName || ''} onChange={e => setParam('statusName', e.target.value)}
                  placeholder="예: 출혈, 구속, 보호막"
                />
              </label>
              <div className="space-y-1">
                <span className="text-xs text-gray-400">참조값</span>
                <div className="flex flex-wrap gap-1">
                  {REF_TYPES.map(r => (
                    <BtnSel key={r} active={params.refType === r} onClick={() => setParam('refType', r)}>{r}</BtnSel>
                  ))}
                </div>
              </div>
              {needsTarget && (
                <p className="text-xs text-orange-400">⚠ 대상 지정이 필요한 스킬에서만 정상 동작합니다. 조건 칸에 "대상 지정 필요"를 추가하세요.</p>
              )}
            </div>
          )}

          {(category === '자신스택' || category === '대상스택') && (
            <div className="space-y-2">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">스택명</span>
                <input
                  className="w-full bg-gray-700 text-white rounded px-2 py-1.5 text-sm border border-gray-600 focus:border-yellow-400 outline-none"
                  value={params.stackName || ''} onChange={e => setParam('stackName', e.target.value)}
                  placeholder="예: 혈인, 표식, 분노"
                />
              </label>
              {needsTarget && (
                <p className="text-xs text-orange-400">⚠ 대상 지정이 필요한 스킬에서만 정상 동작합니다. 조건 칸에 "대상 지정 필요"를 추가하세요.</p>
              )}
            </div>
          )}

          {category === '고급변수' && (
            <div className="space-y-2">
              <span className="text-xs text-gray-400">변수 선택</span>
              <div className="flex flex-wrap gap-1">
                {DB_VARS.map(v => (
                  <BtnSel key={v} active={params.variable === v} onClick={() => setParam('variable', v)}>{v}</BtnSel>
                ))}
              </div>
              <p className="text-xs text-orange-400">⚠ 운영진 검수 대상입니다.</p>
            </div>
          )}

          {/* Preview */}
          <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
            <p className="text-xs text-gray-500 mb-1">삽입 미리보기</p>
            <p className="text-sm font-mono text-green-400 break-all">{token || '(값을 선택/입력하세요)'}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => canInsert && onInsert(token)}
              disabled={!canInsert}
              className={`flex-1 py-2 rounded font-bold text-sm transition-colors ${
                canInsert ? 'bg-yellow-500 hover:bg-yellow-400 text-gray-900' : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              삽입
            </button>
            <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm transition-colors">
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
