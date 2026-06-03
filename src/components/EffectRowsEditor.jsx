import { useState, useEffect } from 'react';
import EffectBlockModal from './EffectBlockModal';
import { STAT_NAMES } from '../data/stats';
import { ACTIONS } from '../data/actions';
import { SKILL_SERIES } from '../data/skillRanks';

const inputCls = "w-full min-w-0 bg-white border border-slate-200 text-slate-900 rounded-lg px-2.5 py-1.5 text-sm focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 outline-none placeholder:text-slate-400 transition-colors font-mono";

// ── 효과 문자열 ↔ 행 배열 변환 ──────────────────────────────────────────
// 저장 형식: 한 줄에 "세부조건 => 세부효과" (조건 없으면 "=> 효과" 또는 효과만).
// ' / '(TSV 줄바꿈 치환) 도 줄 구분으로 인식 → Apps Script parseConditionList 와 동일 규칙.
export function parseEffectRows(value) {
  const raw = String(value || '').replace(/\s*\/\s*/g, '\n');
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return [{ cond: '', eff: '' }];
  return lines.map(line => {
    const m = line.match(/^([\s\S]*?)\s*(?:=>|⇒|→|->)\s*([\s\S]*)$/);
    if (m) return { cond: m[1].trim(), eff: m[2].trim() };
    return { cond: '', eff: line };
  });
}

export function serializeEffectRows(rows) {
  return (rows || [])
    .map(r => {
      const c = (r.cond || '').trim();
      const e = (r.eff || '').trim();
      if (!e) return '';
      return c ? `${c} => ${e}` : e;
    })
    .filter(Boolean)
    .join('\n');
}

const COND_PRESETS = [
  '이면침식 <= 3', '이면침식 >= 6',
  '현재체력비율 <= 50', '현재체력비율 >= 80',
  '상태:집중', '스택_혈인 >= 3', '레벨 >= 6',
  '사용액션 == 상태접미_지정', '사용액션 != 상태접미_지정',
];

const EFFECT_SET_PRESETS = [
  { label: '이면침식 설정', tpl: '이면침식 = ' },
  { label: '현재체력 설정', tpl: '현재체력 = ' },
  { label: '일상점 설정',  tpl: '일상점 = ' },
  { label: '피해감소',     tpl: '피해감소 = ' },
  { label: '회복보정',     tpl: '회복보정 = ' },
  { label: '판정보정',     tpl: '판정보정 = ' },
  { label: '랜덤지정',     tpl: '랜덤상태부여 자신 지정 참격,관통,타격,사격,격투' },
];

// 판정보정 유형 칩: 누르면 "판정보정 <유형> = " 템플릿 생성(유형별 보정).
const JUDGMENT_TYPE_GROUPS = [
  { label: '범주', items: ['전체', '스탯', '액션', '이능', '스킬', '대응', '저항'] },
  { label: '스탯', items: STAT_NAMES },
  { label: '액션', items: ACTIONS.map(a => a.name) },
  { label: '계열', items: SKILL_SERIES.filter(s => s !== '특수') },
];

// "판정보정 <유형목록> = 값" 줄에서 유형 토큰을 추가/토글. 값(우변)은 보존.
function addJudgmentType(eff, type) {
  const m = String(eff || '').match(/^\s*판정보정\s*([^=]*?)\s*=\s*(.*)$/);
  const val = m ? (m[2] || '') : '';
  const prevTypes = m ? (m[1] || '') : '';
  if (type === '전체') return `판정보정 = ${val}`;
  const types = prevTypes.split(/[,，]/).map(s => s.trim()).filter(Boolean).filter(t => t !== '전체');
  if (!types.includes(type)) types.push(type);
  return `판정보정 ${types.join(',')} = ${val}`;
}

export default function EffectRowsEditor({ value, onChange }) {
  // 입력 중 공백/빈 효과가 직렬화에서 잘려나가지 않도록 내부 상태로 행을 보관.
  // 외부 value가 직렬화 결과와 달라질 때만(편집 로드/초기화 등) 재동기화.
  const [rows, setRows] = useState(() => parseEffectRows(value));
  const [modalRow, setModalRow] = useState(null); // 블럭 편집 중 행 index

  useEffect(() => {
    if (String(value || '') !== serializeEffectRows(rows)) {
      setRows(parseEffectRows(value));
    }
    // rows는 의도적으로 의존성에서 제외 — value 변경 시에만 재동기화.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const commit = (next) => { setRows(next); onChange(serializeEffectRows(next)); };

  const patchRow = (i, patch) =>
    commit(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const addRow = () => commit([...rows, { cond: '', eff: '' }]);

  const removeRow = (i) => {
    const next = rows.filter((_, idx) => idx !== i);
    commit(next.length ? next : [{ cond: '', eff: '' }]);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold text-slate-600">세부조건 → 세부효과</span>
        <span className="text-[10px] text-slate-400">한 줄당 조건 1개 + 효과 1개</span>
      </div>

      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/60 p-2.5 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-mono shrink-0">{i + 1}</span>
              <span className="text-[10px] text-indigo-500 font-semibold">세부조건{i + 1}</span>
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="ml-auto w-6 h-6 flex items-center justify-center rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 text-xs border border-rose-200 transition-colors"
                title="이 행 삭제"
              >✕</button>
            </div>

            {/* 세부조건 */}
            <input
              className={inputCls}
              value={row.cond}
              onChange={e => patchRow(i, { cond: e.target.value })}
              placeholder="비우면 항상 실행 — 예: 이면침식 <= 3"
            />
            <div className="flex flex-wrap gap-1">
              {COND_PRESETS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => patchRow(i, { cond: c })}
                  className="text-[10px] bg-white hover:bg-indigo-50 text-slate-500 hover:text-indigo-700 rounded px-1.5 py-0.5 border border-slate-200 transition-colors font-mono"
                >{c}</button>
              ))}
            </div>

            {/* 화살표 */}
            <div className="flex items-center gap-1.5 text-[10px] text-violet-500 font-semibold">
              <span className="font-mono">⇒</span>
              <span>세부효과{i + 1}</span>
            </div>

            {/* 세부효과 */}
            <input
              className={inputCls}
              value={row.eff}
              onChange={e => patchRow(i, { eff: e.target.value })}
              placeholder="예: 이면침식 = 3  /  상태부여 자신 집중 …"
            />
            <div className="flex flex-wrap gap-1 items-center">
              {EFFECT_SET_PRESETS.map(p => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => patchRow(i, { eff: p.tpl })}
                  className="text-[10px] bg-white hover:bg-violet-50 text-slate-500 hover:text-violet-700 rounded px-1.5 py-0.5 border border-slate-200 transition-colors"
                >{p.label}</button>
              ))}
              <button
                type="button"
                onClick={() => setModalRow(i)}
                className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded px-1.5 py-0.5 border border-indigo-200 transition-colors"
              >블럭 선택</button>
            </div>

            {/* 판정보정 줄일 때: 적용 판정 유형 칩 (판정보정 <유형> = 값) */}
            {row.eff.trim().startsWith('판정보정') && (
              <div className="space-y-1 rounded-lg bg-violet-50/60 border border-violet-100 p-1.5">
                <p className="text-[10px] text-violet-500 font-semibold">적용 판정 유형 (비우면 모든 판정)</p>
                {JUDGMENT_TYPE_GROUPS.map(grp => (
                  <div key={grp.label} className="flex flex-wrap gap-1 items-center">
                    <span className="text-[10px] text-slate-400 w-7 shrink-0">{grp.label}</span>
                    {grp.items.map(it => (
                      <button
                        key={it}
                        type="button"
                        onClick={() => patchRow(i, { eff: addJudgmentType(row.eff, it) })}
                        className="text-[10px] px-1.5 py-0.5 bg-white hover:bg-violet-100 text-slate-500 hover:text-violet-700 border border-slate-200 hover:border-violet-300 rounded transition-colors"
                      >{it}</button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="w-full py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl border border-dashed border-slate-300 hover:border-indigo-300 text-xs transition-colors"
      >+ 행 추가</button>

      <div className="bg-indigo-50/60 border border-indigo-100 rounded-lg p-2.5 text-[10px] text-indigo-900 leading-relaxed">
        <p className="font-semibold mb-0.5">문법</p>
        <p>조건 연산자: <code>&lt;= &gt;= &lt; &gt; == !=</code> · 설정 효과: <code>변수 = 값</code> (또는 <code>==</code>)</p>
        <p>설정 가능 변수: 이면침식 · 현재체력 · 일상점 · 피해감소 · 회복보정 · 판정보정</p>
        <p><code>판정보정 참격,관통 = 3</code> — 변수와 <code>=</code> 사이에 콤마로 판정 유형을 넣으면 해당 유형 판정에만 보정(비우면 전체). <code>*N</code> 으로 배율도 가능.</p>
        <p>기존 효과(<code>상태부여</code>·<code>스택증가</code> 등)도 그대로 입력 가능. 조건을 비우면 항상 실행됩니다.</p>
        <p className="mt-1"><code>랜덤상태부여 자신 지정 참격,관통,타격,사격,격투</code> — 목록 중 무작위 1개로 <code>지정_OO</code> 상태 부여(나머지 제거). 수치 옵션 주면 해당 액션 판정 버프도 함께.</p>
        <p>조건에서 <code>사용액션</code>(방금 쓴 액션·스킬명) · <code>상태접미_지정</code>(현재 지정된 항목)을 비교 가능. 예: <code>사용액션 == 상태접미_지정</code></p>
      </div>

      {modalRow !== null && (
        <EffectBlockModal
          initialType="template"
          initialParams={{}}
          onInsert={(type, params, text) => {
            patchRow(modalRow, { eff: text });
            setModalRow(null);
          }}
          onClose={() => setModalRow(null)}
        />
      )}
    </div>
  );
}
