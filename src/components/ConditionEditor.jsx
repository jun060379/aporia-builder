import { useState } from 'react';

const inputCls = "w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 outline-none placeholder:text-slate-400 transition-colors";

// ── 필수 조건 블록 ─────────────────────────────────────────────────────
const REQUIRED_BLOCKS = [
  { label: '내 상태 보유',           template: '상태:출혈' },
  { label: '내 상태 없음',           template: '!상태:출혈' },
  { label: '대상 상태 보유',         template: '대상상태:표식' },
  { label: '대상 상태 없음',         template: '!대상상태:표식' },
  { label: '내 스택 보유',           template: '스택:혈인' },
  { label: '내 스택 없음',           template: '!스택:혈인' },
  { label: '대상 스택 보유',         template: '대상스택:표식' },
  { label: '대상 스택 없음',         template: '!대상스택:표식' },
  { label: '레벨 비교',              template: '레벨 >= 3' },
  { label: '현재 체력 비교',         template: '현재체력 <= 10' },
  { label: '체력 비율 비교',         template: '현재체력비율 <= 50' },
  { label: '대상 체력 비율 비교',    template: '대상현재체력비율 <= 30' },
  { label: '이면침식 비교',          template: '이면침식 >= 6' },
  { label: '일상점 비교',            template: '일상점 < 5' },
  { label: '내 상태 수치 비교',      template: '상태_출혈_수치 >= 5' },
  { label: '대상 상태 수치 비교',    template: '대상상태_표식_수치 > 0' },
  { label: '내 스택 수치 비교',      template: '스택_혈인 >= 3' },
  { label: '자유 텍스트(수동확인)', template: '예: 대상이 어둠 속에 있을 때' },
];

// ── 세부 조건 블록 ─────────────────────────────────────────────────────
// 형식: "세부: <조건> +N"  — 조건 충족 시 판정값에 보너스 적용
const DETAIL_BLOCKS = [
  { label: '체력 비율 낮을 때 +보너스',   template: '세부: 현재체력비율 <= 50 +5' },
  { label: '침식 높을 때 +보너스',         template: '세부: 이면침식 >= 6 +5' },
  { label: '상태 보유 시 +보너스',         template: '세부: 상태:집중 +3' },
  { label: '스택 수치 기반 보너스',        template: '세부: 스택_혈인 >= 3 +5' },
  { label: '대상 상태 시 +보너스',         template: '세부: 대상상태:표식 +5' },
  { label: '레벨 조건 보너스',             template: '세부: 레벨 >= 6 +3' },
  { label: '조건 충족 시 ×배율',           template: '세부: 상태:집중 *1.5' },
  { label: '침식 높을 때 ×배율',           template: '세부: 이면침식 >= 6 *2' },
];

const HELP_TEXT = `조건 문법
─────────────────────────────────
필수 조건 (미충족 시 스킬 차단):
  상태:이름 / !상태:이름
  대상상태:이름 / 스택:이름 / 대상스택:이름
  레벨 >= 3
  현재체력 <= 10
  현재체력비율 <= 50    ← 현재HP / 최대HP × 100
  대상현재체력비율 <= 30
  이면침식 >= 6
  상태_출혈_수치 >= 5
  스택_혈인 >= 3

세부 조건 "세부:" 접두어 (차단 없음, 충족 시 판정값 보정):
  세부: 현재체력비율 <= 50 +5   ← 덧셈
  세부: 이면침식 >= 6 +3
  세부: 상태:집중 *1.5          ← 곱셈 (×도 가능)
  세부: 스택_혈인 >= 3 *2

비교 연산자: >= <= > < == !=
대상 변수에는 "대상" 접두어 사용.
인식되지 않는 줄은 수동 확인 항목으로 표시됩니다.`;

export default function ConditionEditor({ value, onChange, placeholder, helpInline = false }) {
  const [showHelp, setShowHelp] = useState(false);

  const required = extractSection(value, false);
  const detail   = extractSection(value, true);

  function extractSection(raw, isDetail) {
    const lines = String(raw || '').split('\n');
    return lines
      .filter(l => isDetail ? /^세부\s*[:：]/i.test(l.trim()) : !/^세부\s*[:：]/i.test(l.trim()))
      .join('\n');
  }

  function mergeValue(req, det) {
    const lines = [];
    req.split('\n').forEach(l => { if (l.trim()) lines.push(l.trim()); });
    det.split('\n').forEach(l => { if (l.trim()) lines.push(l.trim()); });
    onChange(lines.join('\n'));
  }

  function appendRequired(line) {
    const cur = required;
    const sep = cur && !cur.endsWith('\n') ? '\n' : '';
    mergeValue(cur + sep + line, detail);
  }

  function appendDetail(line) {
    const cur = detail;
    const sep = cur && !cur.endsWith('\n') ? '\n' : '';
    mergeValue(required, cur + sep + line);
  }

  return (
    <div className="space-y-3">
      {/* ── 필수 조건 ── */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-600">필수 조건</span>
          <span className="text-[10px] text-slate-400">미충족 시 스킬 발동 차단</span>
        </div>
        <textarea
          className={`${inputCls} h-20 resize-none font-mono`}
          value={required}
          onChange={e => mergeValue(e.target.value, detail)}
          placeholder={placeholder || '한 줄에 하나의 조건. 예) 상태:집중\n레벨 >= 3\n현재체력비율 <= 50'}
        />
        <div className="flex flex-wrap gap-1">
          {REQUIRED_BLOCKS.map((b) => (
            <button
              key={b.label}
              type="button"
              onClick={() => appendRequired(b.template)}
              className="text-[10px] bg-slate-100 hover:bg-violet-100 text-slate-600 hover:text-violet-700 rounded-md px-2 py-1 border border-slate-200 transition-colors"
              title={b.template}
            >
              + {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 세부 조건 ── */}
      <div className="space-y-1.5 border-t border-slate-100 pt-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-indigo-600">세부 조건</span>
          <span className="text-[10px] text-slate-400">충족 시 판정값 보너스 적용 (차단 없음)</span>
        </div>
        <textarea
          className={`${inputCls} h-16 resize-none font-mono text-indigo-900`}
          value={detail}
          onChange={e => mergeValue(required, e.target.value)}
          placeholder={'세부: 현재체력비율 <= 50 +5\n세부: 상태:집중 +3'}
        />
        <div className="flex flex-wrap gap-1">
          {DETAIL_BLOCKS.map((b) => (
            <button
              key={b.label}
              type="button"
              onClick={() => appendDetail(b.template)}
              className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-800 rounded-md px-2 py-1 border border-indigo-200 transition-colors"
              title={b.template}
            >
              + {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 도움말 ── */}
      <div>
        <button
          type="button"
          onClick={() => setShowHelp(s => !s)}
          className="text-[10px] bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-md px-2 py-1 border border-slate-200 transition-colors"
        >
          {showHelp ? '도움말 닫기' : '? 조건 문법 도움말'}
        </button>
        {(showHelp || helpInline) && (
          <div className="mt-2 bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-[11px] text-indigo-900 leading-relaxed whitespace-pre-wrap font-mono">
            {HELP_TEXT}
          </div>
        )}
      </div>
    </div>
  );
}
