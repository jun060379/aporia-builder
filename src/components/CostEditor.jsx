import { useState, useEffect } from 'react';

const inputCls = "w-full min-w-0 bg-white border border-slate-200 text-slate-900 rounded-lg px-2.5 py-1.5 text-sm focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 outline-none placeholder:text-slate-400 transition-colors font-mono";

// ── 대가 문법 ──────────────────────────────────────────────────────────────
// 한 줄에 하나, 여러 줄 가능.
//   체력감소:N       — 자신 HP 직접 차감
//   침식증가:N       — 이면침식 +N
//   스택소모:스택명:N — 스택 N 차감 (부족하면 차단)
//   상태소모:상태명   — 상태 제거 (없으면 차단)
//   쿨타임:N         — N턴 재사용 불가 (상태 기반)
//   캐스팅:N         — N턴 후 발동 (캐스팅 상태 없으면 차단)

const COST_PRESETS = [
  { label: '체력감소',   tpl: '체력감소:',   placeholder: '예: 5 또는 최종값/2' },
  { label: '침식증가',   tpl: '침식증가:',   placeholder: '예: 1' },
  { label: '스택소모',   tpl: '스택소모:혈인:1', placeholder: '스택소모:스택명:수량' },
  { label: '상태소모',   tpl: '상태소모:',   placeholder: '예: 집중' },
  { label: '쿨타임',     tpl: '쿨타임:',    placeholder: '예: 3 (턴수)' },
  { label: '캐스팅',     tpl: '캐스팅:',    placeholder: '예: 2 (턴수)' },
];

const COST_HELP = `대가 문법 (한 줄에 하나)
──────────────────────────────
체력감소:N        — 자신 HP를 N 직접 차감
침식증가:N        — 이면침식 +N
스택소모:스택명:N  — 스택 N 차감 (부족하면 스킬 차단)
상태소모:상태명   — 상태 해제 (없으면 스킬 차단)
쿨타임:N          — 사용 후 판정 N회 동안 재사용 불가
                   (판정시작마다 자동 차감, 0이 되면 해제)
캐스팅:N          — 먼저 사용 시 캐스팅 시작 (차단),
                   판정 N회 후 다시 사용해야 실제 발동

모든 코스트는 조건 통과 후 지불됩니다.`;

export function parseCostRows(value) {
  const raw = String(value || '').replace(/\s*\/\s*/g, '\n');
  return raw.split('\n').map(l => l.trim()).filter(Boolean);
}

export function serializeCostRows(rows) {
  return (rows || []).filter(Boolean).join('\n');
}

export default function CostEditor({ value, onChange }) {
  const [rows, setRows] = useState(() => parseCostRows(value));
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (String(value || '') !== serializeCostRows(rows)) {
      setRows(parseCostRows(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const commit = (next) => { setRows(next); onChange(serializeCostRows(next)); };

  const addPreset = (tpl) => commit([...rows, tpl]);
  const addRow = () => commit([...rows, '']);
  const updateRow = (i, v) => commit(rows.map((r, idx) => idx === i ? v : r));
  const removeRow = (i) => {
    const next = rows.filter((_, idx) => idx !== i);
    commit(next);
  };

  return (
    <div className="space-y-2">
      {/* 프리셋 버튼 */}
      <div className="flex flex-wrap gap-1">
        {COST_PRESETS.map(p => (
          <button
            key={p.label}
            type="button"
            onClick={() => addPreset(p.tpl)}
            className="text-[10px] bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded px-1.5 py-0.5 transition-colors"
          >{p.label}</button>
        ))}
      </div>

      {/* 대가 행 목록 */}
      {rows.length > 0 && (
        <div className="space-y-1.5">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <input
                className={inputCls}
                value={row}
                onChange={e => updateRow(i, e.target.value)}
                placeholder="예: 체력감소:5"
              />
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="shrink-0 w-6 h-6 flex items-center justify-center rounded bg-rose-50 hover:bg-rose-100 text-rose-500 text-xs border border-rose-200 transition-colors"
              >✕</button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-1.5 items-center">
        <button
          type="button"
          onClick={addRow}
          className="text-[10px] px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 text-slate-400 rounded transition-colors"
        >+ 직접 입력</button>
        <button
          type="button"
          onClick={() => setShowHelp(v => !v)}
          className="text-[10px] px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-400 rounded transition-colors"
        >{showHelp ? '도움말 닫기' : '? 문법'}</button>
      </div>

      {showHelp && (
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-2.5 text-[10px] text-amber-900 font-mono whitespace-pre-wrap leading-relaxed">
          {COST_HELP}
        </div>
      )}

      {rows.length > 0 && (
        <div className="bg-slate-800 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-300 font-mono whitespace-pre-wrap">
          {serializeCostRows(rows) || '(비어 있음)'}
        </div>
      )}
    </div>
  );
}
