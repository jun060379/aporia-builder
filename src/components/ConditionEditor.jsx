import { useState } from 'react';

const inputCls = "w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 outline-none placeholder:text-slate-400 transition-colors";

const BLOCKS = [
  { label: '내 상태 보유',     template: '상태:출혈' },
  { label: '내 상태 없음',     template: '!상태:출혈' },
  { label: '대상 상태 보유',   template: '대상상태:표식' },
  { label: '대상 상태 없음',   template: '!대상상태:표식' },
  { label: '내 스택 보유',     template: '스택:혈인' },
  { label: '내 스택 없음',     template: '!스택:혈인' },
  { label: '대상 스택 보유',   template: '대상스택:표식' },
  { label: '대상 스택 없음',   template: '!대상스택:표식' },
  { label: '레벨 비교',        template: '레벨 >= 3' },
  { label: '현재 체력 비교',   template: '현재체력 <= 10' },
  { label: '이면침식 비교',    template: '이면침식 >= 6' },
  { label: '일상점 비교',      template: '일상점 < 5' },
  { label: '내 상태 수치 비교',template: '상태_출혈_수치 >= 5' },
  { label: '대상 상태 수치 비교', template: '대상상태_표식_수치 > 0' },
  { label: '내 스택 수치 비교',template: '스택_혈인 >= 3' },
  { label: '자유 텍스트(수동확인)', template: '예: 대상이 어둠 속에 있을 때' },
];

export default function ConditionEditor({ value, onChange, placeholder, helpInline = false }) {
  const [showHelp, setShowHelp] = useState(false);

  function append(line) {
    const cur = String(value || '');
    const sep = cur && !cur.endsWith('\n') ? '\n' : '';
    onChange(cur + sep + line);
  }

  return (
    <div className="space-y-1.5">
      <textarea
        className={`${inputCls} h-20 resize-none font-mono`}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || '한 줄에 하나의 조건. 예) 상태:집중\n레벨 >= 3\n대상상태_표식_수치 > 0'}
      />
      <div className="flex flex-wrap gap-1">
        {BLOCKS.map((b) => (
          <button
            key={b.label}
            type="button"
            onClick={() => append(b.template)}
            className="text-[10px] bg-slate-100 hover:bg-violet-100 text-slate-600 hover:text-violet-700 rounded-md px-2 py-1 border border-slate-200 transition-colors"
            title={b.template}
          >
            + {b.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowHelp((s) => !s)}
          className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md px-2 py-1 border border-indigo-200 transition-colors"
        >
          {showHelp ? '도움말 닫기' : '도움말'}
        </button>
      </div>
      {(showHelp || helpInline) && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-2.5 text-[11px] text-indigo-900 space-y-1.5 leading-relaxed">
          <p className="font-semibold text-indigo-700">조건 문법</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>한 줄에 하나의 조건 (또는 콤마 구분).</li>
            <li>비교 연산자: <code>{'>= <= > < == != ='}</code></li>
            <li>존재 단축: <code>상태:이름</code>, <code>!상태:이름</code>, <code>대상상태:이름</code>, <code>!대상상태:이름</code>, <code>스택:이름</code>, <code>대상스택:이름</code></li>
            <li>변수: <code>레벨, 현재체력, 최대체력, 이면침식, 일상점, 상태_X_수치, 상태_X_존재, 대상상태_X_수치, 스택_X, 대상스택_X</code></li>
            <li>인식되지 않은 줄은 <b>수동 확인 항목</b>으로 표시됩니다 (차단하지 않음).</li>
            <li><b>대상</b> 변수를 사용했는데 대상이 없으면 조건이 실패 처리됩니다.</li>
          </ul>
        </div>
      )}
    </div>
  );
}
