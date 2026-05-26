import { useState } from 'react';

const HELP_ENTRIES = [
  ['수치',     '상태/효과의 강도. 출혈이면 피해량, 보호막이면 보호량, 강화/약화면 보정값처럼 사용됩니다.'],
  ['횟수',     '효과가 몇 번 남았는지. 판정·턴·장면 처리에 따라 감소할 수 있습니다.'],
  ['최대',     '같은 상태/스택이 누적될 때 넘을 수 없는 상한. 예: 수치 2, 횟수 2, 최대 10이면 반복 부여해도 10을 넘지 않습니다.'],
  ['확률',     '효과가 발동할 기본 확률 (%).'],
  ['누적',     '현재 누적된 발동 확률.'],
  ['증가',     '발동 실패나 특정 조건 후 누적 확률이 증가할 때 사용하는 값.'],
  ['최대확률', '누적 확률이 넘을 수 없는 최대 확률.'],
  ['발동',     '상태가 언제 작동하는지. 예: 판정시작, 판정계산전, 피해직전.'],
  ['판정',     '어떤 판정에 적용되는지. 예: 전체, 스킬, 해석, 지능, 방어, 회피, 저항.'],
  ['중복',     '같은 상태가 이미 있을 때 처리 방식. 허용=누적, 덮어쓰기=새 값으로 갱신.'],
  ['메모',     '운영자 확인용 설명.'],
];

export default function EffectVariableHelp({ compact = false }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={compact ? '' : 'space-y-2'}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-colors ${
          open
            ? 'bg-amber-50 border-amber-200 text-amber-700'
            : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-amber-300 hover:text-amber-600'
        }`}
      >
        {open ? '도움말 닫기' : '? 변수 도움말'}
      </button>
      {open && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1.5 max-h-72 overflow-y-auto">
          <p className="text-[10px] text-amber-600 font-semibold uppercase tracking-widest">고급 변수 설명</p>
          <ul className="space-y-1">
            {HELP_ENTRIES.map(([label, desc]) => (
              <li key={label} className="text-[11px] leading-relaxed">
                <span className="font-semibold text-amber-800">{label}:</span>{' '}
                <span className="text-amber-700">{desc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
