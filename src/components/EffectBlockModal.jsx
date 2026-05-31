import { useState } from 'react';
import EffectVariableHelp from './EffectVariableHelp';

const EFFECT_TYPES = [
  { id: 'template',     label: '상태 템플릿 부여' },
  { id: 'custom',       label: '커스텀 상태 부여' },
  { id: 'statusRemove', label: '상태 해제' },
  { id: 'stack',        label: '스택 변경' },
  { id: 'damage',       label: '피해' },
  { id: 'heal',         label: '회복' },
  { id: 'free',         label: '자유 입력' },
];

const DESCRIPTIONS = {
  template:     '미리 정의된 상태 템플릿을 자신 또는 대상에게 부여합니다.',
  custom:       '직접 정의 상태를 부여합니다. 운영진 검수가 필요합니다.',
  statusRemove: '자신 또는 대상에게 걸린 특정 상태를 해제합니다.',
  stack:        '자신 또는 대상의 스택을 증가, 감소, 설정합니다.',
  damage:       '자신 또는 대상에게 피해를 입힙니다. (패시브·보호막 처리 포함)',
  heal:         '자신 또는 대상의 체력을 회복시킵니다.',
  free:         '자동 블럭으로 만들 수 없는 효과를 직접 입력합니다. 운영진 수동 검수 대상입니다.',
};

const NUM_TOKENS = [
  { label: '랭크', token: '랭크' },
  { label: '근력', token: '근력' }, { label: '민첩', token: '민첩' },
  { label: '내구', token: '내구' }, { label: '감각', token: '감각' }, { label: '지능', token: '지능' },
  { label: 'HP%', token: '현재체력비율' }, { label: '침식', token: '이면침식' },
  { label: '최종값', token: '최종값' },
];

function NumTokenBar({ onInsert }) {
  return (
    <div className="flex flex-wrap gap-1 pt-0.5">
      {NUM_TOKENS.map(({ label, token }) => (
        <button key={token} type="button" onClick={() => onInsert(token)}
          className="text-[10px] px-1.5 py-0.5 bg-slate-100 hover:bg-cyan-100 text-slate-500 hover:text-cyan-700 border border-slate-200 hover:border-cyan-300 rounded font-mono transition-colors">
          {label}
        </button>
      ))}
      {['+', '-', '*', '/'].map(op => (
        <button key={op} type="button" onClick={() => onInsert(` ${op} `)}
          className="text-[10px] px-1.5 py-0.5 bg-slate-50 hover:bg-slate-100 text-slate-400 border border-slate-200 rounded font-mono transition-colors">
          {op}
        </button>
      ))}
    </div>
  );
}

const TEMPLATE_NAMES = ['출혈', '구속', '보호막', '취약', '쇠약', '강화', '직접입력'];
const CUSTOM_CATEGORIES = ['지속피해', '행동방해', '보호', '약화', '강화', '기타'];
const EFFECT_CODES = ['bleed', 'bind', 'shield', 'vulnerable', 'weaken', 'buff', '직접입력'];

function buildText(type, params) {
  if (type === 'template') {
    const name = params.templateName === '직접입력' ? (params.customTemplateName || '') : (params.templateName || '');
    if (!name) return '';
    let t = `상태템플릿부여 ${params.target || '대상'} ${name}`;
    if (params.value)    t += ` 수치:${params.value}`;
    if (params.count)    t += ` 횟수:${params.count}`;
    if (params.max)      t += ` 최대:${params.max}`;
    if (params.maxCount) t += ` 최대횟수:${params.maxCount}`;
    if (params.resist === 'possible') {
      t += ' 저항:가능';
      if (params.resistDifficulty) t += ` 저항난이도:${params.resistDifficulty}`;
    }
    return t;
  }
  if (type === 'custom') {
    if (!params.statusName) return '';
    let t = `상태부여 ${params.target || '대상'} ${params.statusName}`;
    if (params.category) t += ` ${params.category}`;
    const code = params.effectCode === '직접입력' ? (params.customEffectCode || '') : (params.effectCode || '');
    if (code)               t += ` ${code}`;
    if (params.value)       t += ` 수치:${params.value}`;
    if (params.probability) t += ` 확률:${params.probability}`;
    if (params.count)       t += ` 횟수:${params.count}`;
    if (params.max)         t += ` 최대:${params.max}`;
    if (params.maxCount)    t += ` 최대횟수:${params.maxCount}`;
    if (params.activation)  t += ` 발동:${params.activation}`;
    if (params.judgment)    t += ` 판정:${params.judgment}`;
    if (params.duplicate)   t += ` 중복:${params.duplicate}`;
    if (params.resist === 'possible') {
      t += ' 저항:가능';
      if (params.resistDifficulty) t += ` 저항난이도:${params.resistDifficulty}`;
    }
    if (params.memo)        t += ` 메모:${params.memo}`;
    return t;
  }
  if (type === 'statusRemove') {
    if (!params.statusName) return '';
    return `상태해제 ${params.target || '대상'} ${params.statusName}`;
  }
  if (type === 'stack') {
    if (!params.stackName || !params.value) return '';
    const tgt = params.target || '자신';
    if (params.changeType === '증가') {
      let t = `스택증가 ${tgt} ${params.stackName} +${params.value}`;
      if (params.max) t += ` 최대:${params.max}`;
      return t;
    }
    if (params.changeType === '감소') return `스택감소 ${tgt} ${params.stackName} -${params.value}`;
    let t = `스택설정 ${tgt} ${params.stackName} =${params.value}`;
    if (params.max) t += ` 최대:${params.max}`;
    return t;
  }
  if (type === 'damage') {
    if (!params.amount) return '';
    return `피해 ${params.target || '대상'} ${params.amount}`;
  }
  if (type === 'heal') {
    if (!params.amount) return '';
    return `회복 ${params.target || '자신'} ${params.amount}`;
  }
  if (type === 'free') return params.text || '';
  return '';
}

function getModalWarnings(type, params) {
  const warns = [];
  if (type === 'free' || type === 'custom') warns.push('운영진 수동 검수 대상입니다.');
  if (type === 'template') {
    const name = params.templateName === '직접입력' ? params.customTemplateName : params.templateName;
    if (name === '출혈' && !params.value && !params.count) warns.push('출혈에는 수치 또는 횟수를 입력하는 것을 권장합니다.');
    if (name === '구속' && params.resist !== 'possible') warns.push('구속 상태에는 저항 설정을 권장합니다.');
  }
  if (type === 'stack' && (params.changeType === '증가' || params.changeType === '설정') && !params.max) {
    warns.push('최대값 설정을 권장합니다.');
  }
  if ((type === 'template' || type === 'custom') && params.maxCount && params.count) {
    const mc = Number(params.maxCount), c = Number(params.count);
    if (!isNaN(mc) && !isNaN(c) && mc < c) {
      warns.push(`최대횟수(${mc})가 횟수(${c})보다 작습니다 — 초기 횟수가 ${mc}으로 클램프됩니다.`);
    }
  }
  return warns;
}

const inputCls = "w-full min-w-0 bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none placeholder:text-slate-400 transition-colors";

function BtnSel({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
        active
          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200'
          : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50'
      }`}
    >
      {children}
    </button>
  );
}

function TargetToggle({ value, onChange }) {
  return (
    <div className="space-y-1">
      <span className="text-[11px] text-slate-500">대상</span>
      <div className="flex gap-1">
        {['대상', '자신'].map(t => (
          <BtnSel key={t} active={value === t} onClick={() => onChange(t)}>{t}</BtnSel>
        ))}
      </div>
    </div>
  );
}

function ResistSection({ params, setParam }) {
  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <span className="text-[11px] text-slate-500">저항 여부</span>
        <div className="flex gap-1">
          {['없음', '가능'].map(r => (
            <BtnSel key={r} active={params.resist === (r === '가능' ? 'possible' : 'none')} onClick={() => setParam('resist', r === '가능' ? 'possible' : 'none')}>{r}</BtnSel>
          ))}
        </div>
      </div>
      {params.resist === 'possible' && (
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500">저항난이도</span>
          <input className={inputCls} value={params.resistDifficulty || ''} onChange={e => setParam('resistDifficulty', e.target.value)} placeholder="최종값 또는 숫자" />
        </label>
      )}
    </div>
  );
}

export default function EffectBlockModal({ initialType, initialParams, onInsert, onClose }) {
  const [type, setType] = useState(initialType || 'template');
  const [params, setParams] = useState(
    initialParams || { target: '대상', templateName: '출혈', changeType: '증가' }
  );

  const setParam = (k, v) => setParams(p => ({ ...p, [k]: v }));
  const changeType = (t) => { setType(t); setParams({ target: '대상', changeType: '증가' }); };

  const text = buildText(type, params);
  const warns = getModalWarnings(type, params);
  const canInsert = text !== '';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl shadow-slate-300/50">

        <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-3.5 flex items-center justify-between z-10 gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-800">효과 블럭 선택</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Effect Block</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <EffectVariableHelp compact />
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 text-sm transition-colors">✕</button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">효과 종류</span>
            <div className="flex flex-wrap gap-1">
              {EFFECT_TYPES.map(et => (
                <BtnSel key={et.id} active={type === et.id} onClick={() => changeType(et.id)}>
                  {et.label}
                </BtnSel>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 text-xs text-slate-500 leading-relaxed">
            {DESCRIPTIONS[type]}
          </div>

          {/* ── template ── */}
          {type === 'template' && (
            <div className="space-y-3">
              <TargetToggle value={params.target || '대상'} onChange={v => setParam('target', v)} />
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-500">템플릿명</span>
                <div className="flex flex-wrap gap-1">
                  {TEMPLATE_NAMES.map(n => (
                    <BtnSel key={n} active={params.templateName === n} onClick={() => setParam('templateName', n)}>{n}</BtnSel>
                  ))}
                </div>
                {params.templateName === '직접입력' && (
                  <input className={`${inputCls} mt-1`} value={params.customTemplateName || ''} onChange={e => setParam('customTemplateName', e.target.value)} placeholder="템플릿명 직접 입력" />
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[['수치','value','0'], ['횟수','count','1']].map(([lbl, key, ph]) => (
                  <label key={key} className="flex flex-col gap-1">
                    <span className="text-[11px] text-slate-500">{lbl}</span>
                    <input className={`${inputCls} font-mono`} value={params[key] || ''} onChange={e => setParam(key, e.target.value)} placeholder={ph} />
                  </label>
                ))}
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] text-slate-500">최대 <span className="text-slate-400">(수치 상한)</span></span>
                  <input className={`${inputCls} font-mono`} value={params.max || ''} onChange={e => setParam('max', e.target.value)} placeholder="무제한" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] text-slate-500">최대횟수 <span className="text-slate-400">(횟수 상한)</span></span>
                  <input className={`${inputCls} font-mono`} value={params.maxCount || ''} onChange={e => setParam('maxCount', e.target.value)} placeholder="무제한" />
                </label>
              </div>
              <NumTokenBar onInsert={t => setParam('value', (params.value || '') + t)} />
              <ResistSection params={params} setParam={setParam} />
            </div>
          )}

          {/* ── custom ── */}
          {type === 'custom' && (
            <div className="space-y-3">
              <TargetToggle value={params.target || '대상'} onChange={v => setParam('target', v)} />
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-slate-500">상태명</span>
                <input className={inputCls} value={params.statusName || ''} onChange={e => setParam('statusName', e.target.value)} placeholder="예: 화상" />
              </label>
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-500">분류</span>
                <div className="flex flex-wrap gap-1">
                  {CUSTOM_CATEGORIES.map(c => (
                    <BtnSel key={c} active={params.category === c} onClick={() => setParam('category', c)}>{c}</BtnSel>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-500">효과 코드</span>
                <div className="flex flex-wrap gap-1">
                  {EFFECT_CODES.map(c => (
                    <BtnSel key={c} active={params.effectCode === c} onClick={() => setParam('effectCode', c)}>{c}</BtnSel>
                  ))}
                </div>
                {params.effectCode === '직접입력' && (
                  <input className={`${inputCls} mt-1`} value={params.customEffectCode || ''} onChange={e => setParam('customEffectCode', e.target.value)} placeholder="효과 코드 직접 입력" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">고급 변수</span>
                <EffectVariableHelp compact />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['수치','value'], ['확률','probability'], ['횟수','count'],
                  ['최대(수치 상한)','max'], ['최대횟수(횟수 상한)','maxCount'],
                  ['발동','activation'], ['판정','judgment'], ['중복','duplicate']
                ].map(([lbl, key]) => (
                  <label key={key} className="flex flex-col gap-1">
                    <span className="text-[11px] text-slate-500">{lbl}</span>
                    <input className={inputCls} value={params[key] || ''} onChange={e => setParam(key, e.target.value)} placeholder="" />
                  </label>
                ))}
              </div>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-slate-500">메모</span>
                <input className={inputCls} value={params.memo || ''} onChange={e => setParam('memo', e.target.value)} placeholder="메모" />
              </label>
              <ResistSection params={params} setParam={setParam} />
            </div>
          )}

          {/* ── statusRemove ── */}
          {type === 'statusRemove' && (
            <div className="space-y-3">
              <TargetToggle value={params.target || '대상'} onChange={v => setParam('target', v)} />
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-slate-500">상태명</span>
                <input className={inputCls} value={params.statusName || ''} onChange={e => setParam('statusName', e.target.value)} placeholder="예: 출혈, 구속" />
              </label>
            </div>
          )}

          {/* ── stack ── */}
          {type === 'stack' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-500">변경 종류</span>
                <div className="flex gap-1">
                  {['증가', '감소', '설정'].map(c => (
                    <BtnSel key={c} active={params.changeType === c} onClick={() => setParam('changeType', c)}>{c}</BtnSel>
                  ))}
                </div>
              </div>
              <TargetToggle value={params.target || '자신'} onChange={v => setParam('target', v)} />
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-slate-500">스택명</span>
                <input className={inputCls} value={params.stackName || ''} onChange={e => setParam('stackName', e.target.value)} placeholder="예: 혈인, 표식" />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] text-slate-500">값</span>
                  <input className={`${inputCls} font-mono`} value={params.value || ''} onChange={e => setParam('value', e.target.value)} placeholder="1 또는 스택_혈인" />
                </label>
                {params.changeType !== '감소' && (
                  <label className="flex flex-col gap-1">
                    <span className="text-[11px] text-slate-500">최대</span>
                    <input className={`${inputCls} font-mono`} value={params.max || ''} onChange={e => setParam('max', e.target.value)} placeholder="5 또는 근력" />
                  </label>
                )}
              </div>
              <NumTokenBar onInsert={t => setParam('value', (params.value || '') + t)} />
            </div>
          )}

          {/* ── damage ── */}
          {type === 'damage' && (
            <div className="space-y-3">
              <TargetToggle value={params.target || '대상'} onChange={v => setParam('target', v)} />
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-slate-500">피해량</span>
                <input className={`${inputCls} font-mono`} value={params.amount || ''} onChange={e => setParam('amount', e.target.value)} placeholder="10 또는 최종값 또는 랭크 * 2" />
              </label>
              <NumTokenBar onInsert={t => setParam('amount', (params.amount || '') + t)} />
            </div>
          )}

          {/* ── heal ── */}
          {type === 'heal' && (
            <div className="space-y-3">
              <TargetToggle value={params.target || '자신'} onChange={v => setParam('target', v)} />
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-slate-500">회복량</span>
                <input className={`${inputCls} font-mono`} value={params.amount || ''} onChange={e => setParam('amount', e.target.value)} placeholder="10 또는 최종값 또는 랭크 * 2" />
              </label>
              <NumTokenBar onInsert={t => setParam('amount', (params.amount || '') + t)} />
            </div>
          )}

          {/* ── free ── */}
          {type === 'free' && (
            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-500">효과 직접 입력</span>
              <textarea
                className={`${inputCls} h-20 resize-none`}
                value={params.text || ''} onChange={e => setParam('text', e.target.value)}
                placeholder="효과를 직접 입력하세요"
              />
            </label>
          )}

          {warns.length > 0 && (
            <div className="space-y-1">
              {warns.map((w, i) => (
                <p key={i} className="text-xs text-amber-600">⚠ {w}</p>
              ))}
            </div>
          )}

          <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-3">
            <p className="text-[10px] text-indigo-400 uppercase tracking-widest mb-1.5">생성 미리보기</p>
            <p className="text-sm font-mono text-indigo-700 break-all whitespace-pre-wrap">{text || '(값을 입력하세요)'}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => canInsert && onInsert(type, params, text)}
              disabled={!canInsert}
              className={`flex-1 py-2 rounded-xl font-bold text-sm transition-colors ${
                canInsert
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              삽입
            </button>
            <button onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 rounded-xl text-sm transition-colors">
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
