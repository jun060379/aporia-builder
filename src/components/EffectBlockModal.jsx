import { useState } from 'react';

const EFFECT_TYPES = [
  { id: 'template',     label: '상태 템플릿 부여' },
  { id: 'custom',       label: '커스텀 상태 부여' },
  { id: 'statusRemove', label: '상태 해제' },
  { id: 'stack',        label: '스택 변경' },
  { id: 'free',         label: '자유 입력' },
];

const DESCRIPTIONS = {
  template:     '미리 정의된 상태 템플릿을 자신 또는 대상에게 부여합니다. 출혈, 구속, 보호막 등 자주 쓰는 효과를 빠르게 만들 때 사용합니다.',
  custom:       '템플릿이 아닌 직접 정의 상태를 부여합니다. 운영진 검수가 필요한 고급 효과입니다.',
  statusRemove: '자신 또는 대상에게 걸린 특정 상태를 해제합니다.',
  stack:        '자신 또는 대상의 스택을 증가, 감소, 설정합니다. 계산식에서 스택_혈인 또는 대상스택_표식으로 참조할 수 있습니다.',
  free:         '자동 생성 블럭으로 만들 수 없는 효과를 직접 입력합니다. 이 효과는 운영진 수동 검수 대상입니다.',
};

const TEMPLATE_NAMES = ['출혈', '구속', '보호막', '취약', '쇠약', '강화', '직접입력'];
const CUSTOM_CATEGORIES = ['지속피해', '행동방해', '보호', '약화', '강화', '기타'];
const EFFECT_CODES = ['bleed', 'bind', 'shield', 'vulnerable', 'weaken', 'buff', '직접입력'];

function buildText(type, params) {
  if (type === 'template') {
    const name = params.templateName === '직접입력' ? (params.customTemplateName || '') : (params.templateName || '');
    if (!name) return '';
    let t = `상태템플릿부여 ${params.target || '대상'} ${name}`;
    if (params.value)  t += ` 수치:${params.value}`;
    if (params.count)  t += ` 횟수:${params.count}`;
    if (params.max)    t += ` 최대:${params.max}`;
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
    const nm  = params.stackName;
    const val = params.value;
    if (params.changeType === '증가') {
      let t = `스택증가 ${tgt} ${nm} +${val}`;
      if (params.max) t += ` 최대:${params.max}`;
      return t;
    }
    if (params.changeType === '감소') return `스택감소 ${tgt} ${nm} -${val}`;
    let t = `스택설정 ${tgt} ${nm} =${val}`;
    if (params.max) t += ` 최대:${params.max}`;
    return t;
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
  return warns;
}

const inputCls = "w-full min-w-0 bg-gray-700 text-white rounded px-2 py-1.5 text-sm border border-gray-600 focus:border-blue-400 outline-none";

function TargetToggle({ value, onChange }) {
  return (
    <div className="space-y-1">
      <span className="text-xs text-gray-400">대상</span>
      <div className="flex gap-1">
        {['대상', '자신'].map(t => (
          <button key={t} onClick={() => onChange(t)}
            className={`px-3 py-1.5 rounded text-sm border transition-colors ${value === t ? 'bg-blue-600 text-white border-blue-500' : 'bg-gray-700 text-gray-300 border-gray-600'}`}>
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

function ResistSection({ params, setParam }) {
  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <span className="text-xs text-gray-400">저항 여부</span>
        <div className="flex gap-1">
          {['없음', '가능'].map(r => (
            <button key={r} onClick={() => setParam('resist', r === '가능' ? 'possible' : 'none')}
              className={`px-3 py-1.5 rounded text-sm border ${params.resist === (r === '가능' ? 'possible' : 'none') ? 'bg-blue-600 text-white border-blue-500' : 'bg-gray-700 text-gray-300 border-gray-600'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>
      {params.resist === 'possible' && (
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">저항난이도</span>
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
  const changeType = (t) => {
    setType(t);
    setParams({ target: '대상', changeType: '증가' });
  };

  const text = buildText(type, params);
  const warns = getModalWarnings(type, params);
  const canInsert = text !== '';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-2 sm:p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-600 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">

        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between z-10">
          <h3 className="text-base font-bold text-blue-400">효과 블럭 선택</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl font-bold leading-none">✕</button>
        </div>

        <div className="p-4 space-y-4">
          {/* Type picker */}
          <div className="space-y-1">
            <span className="text-xs text-gray-400">효과 종류</span>
            <div className="flex flex-wrap gap-1">
              {EFFECT_TYPES.map(et => (
                <button key={et.id} onClick={() => changeType(et.id)}
                  className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${
                    type === et.id ? 'bg-blue-600 text-white border-blue-500' : 'bg-gray-700 text-gray-300 border-gray-600 hover:border-blue-400'
                  }`}>
                  {et.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-700/50 rounded-lg p-3 text-xs text-gray-300 leading-relaxed">
            {DESCRIPTIONS[type]}
          </div>

          {/* ── template ── */}
          {type === 'template' && (
            <div className="space-y-3">
              <TargetToggle value={params.target || '대상'} onChange={v => setParam('target', v)} />
              <div className="space-y-1">
                <span className="text-xs text-gray-400">템플릿명</span>
                <div className="flex flex-wrap gap-1">
                  {TEMPLATE_NAMES.map(n => (
                    <button key={n} onClick={() => setParam('templateName', n)}
                      className={`px-2 py-1 rounded text-xs border transition-colors ${params.templateName === n ? 'bg-blue-600 text-white border-blue-500' : 'bg-gray-700 text-gray-300 border-gray-600'}`}>
                      {n}
                    </button>
                  ))}
                </div>
                {params.templateName === '직접입력' && (
                  <input className={inputCls + ' mt-1'} value={params.customTemplateName || ''} onChange={e => setParam('customTemplateName', e.target.value)} placeholder="템플릿명 직접 입력" />
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-gray-400">수치</span>
                  <input className={inputCls} type="number" value={params.value || ''} onChange={e => setParam('value', e.target.value)} placeholder="0" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-gray-400">횟수</span>
                  <input className={inputCls} type="number" value={params.count || ''} onChange={e => setParam('count', e.target.value)} placeholder="0" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-gray-400">최대</span>
                  <input className={inputCls} type="number" value={params.max || ''} onChange={e => setParam('max', e.target.value)} placeholder="0" />
                </label>
              </div>
              <ResistSection params={params} setParam={setParam} />
            </div>
          )}

          {/* ── custom ── */}
          {type === 'custom' && (
            <div className="space-y-3">
              <TargetToggle value={params.target || '대상'} onChange={v => setParam('target', v)} />
              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">상태명</span>
                <input className={inputCls} value={params.statusName || ''} onChange={e => setParam('statusName', e.target.value)} placeholder="예: 화상" />
              </label>
              <div className="space-y-1">
                <span className="text-xs text-gray-400">분류</span>
                <div className="flex flex-wrap gap-1">
                  {CUSTOM_CATEGORIES.map(c => (
                    <button key={c} onClick={() => setParam('category', c)}
                      className={`px-2 py-1 rounded text-xs border ${params.category === c ? 'bg-blue-600 text-white border-blue-500' : 'bg-gray-700 text-gray-300 border-gray-600'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-400">효과 코드</span>
                <div className="flex flex-wrap gap-1">
                  {EFFECT_CODES.map(c => (
                    <button key={c} onClick={() => setParam('effectCode', c)}
                      className={`px-2 py-1 rounded text-xs border ${params.effectCode === c ? 'bg-blue-600 text-white border-blue-500' : 'bg-gray-700 text-gray-300 border-gray-600'}`}>
                      {c}
                    </button>
                  ))}
                </div>
                {params.effectCode === '직접입력' && (
                  <input className={inputCls + ' mt-1'} value={params.customEffectCode || ''} onChange={e => setParam('customEffectCode', e.target.value)} placeholder="효과 코드 직접 입력" />
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[['수치','value'], ['확률','probability'], ['횟수','count'], ['발동','activation'], ['판정','judgment'], ['중복','duplicate']].map(([lbl, key]) => (
                  <label key={key} className="flex flex-col gap-1">
                    <span className="text-xs text-gray-400">{lbl}</span>
                    <input className={inputCls} value={params[key] || ''} onChange={e => setParam(key, e.target.value)} placeholder={lbl} />
                  </label>
                ))}
              </div>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">메모</span>
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
                <span className="text-xs text-gray-400">상태명</span>
                <input className={inputCls} value={params.statusName || ''} onChange={e => setParam('statusName', e.target.value)} placeholder="예: 출혈, 구속" />
              </label>
            </div>
          )}

          {/* ── stack ── */}
          {type === 'stack' && (
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-xs text-gray-400">변경 종류</span>
                <div className="flex gap-1">
                  {['증가', '감소', '설정'].map(c => (
                    <button key={c} onClick={() => setParam('changeType', c)}
                      className={`px-3 py-1.5 rounded text-sm border ${params.changeType === c ? 'bg-blue-600 text-white border-blue-500' : 'bg-gray-700 text-gray-300 border-gray-600'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <TargetToggle value={params.target || '자신'} onChange={v => setParam('target', v)} />
              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">스택명</span>
                <input className={inputCls} value={params.stackName || ''} onChange={e => setParam('stackName', e.target.value)} placeholder="예: 혈인, 표식" />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-gray-400">값</span>
                  <input className={inputCls} type="number" value={params.value || ''} onChange={e => setParam('value', e.target.value)} placeholder="0" />
                </label>
                {params.changeType !== '감소' && (
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-gray-400">최대</span>
                    <input className={inputCls} type="number" value={params.max || ''} onChange={e => setParam('max', e.target.value)} placeholder="0" />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* ── free ── */}
          {type === 'free' && (
            <label className="flex flex-col gap-1">
              <span className="text-xs text-gray-400">효과 직접 입력</span>
              <textarea
                className={inputCls + ' h-20 resize-none'}
                value={params.text || ''} onChange={e => setParam('text', e.target.value)}
                placeholder="효과를 직접 입력하세요"
              />
            </label>
          )}

          {/* Warnings */}
          {warns.length > 0 && (
            <div className="space-y-1">
              {warns.map((w, i) => (
                <p key={i} className={`text-xs ${w.includes('운영진') ? 'text-orange-400' : 'text-yellow-400'}`}>⚠ {w}</p>
              ))}
            </div>
          )}

          {/* Preview */}
          <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
            <p className="text-xs text-gray-500 mb-1">생성 미리보기</p>
            <p className="text-sm font-mono text-blue-300 break-all whitespace-pre-wrap">{text || '(값을 입력하세요)'}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => canInsert && onInsert(type, params, text)}
              disabled={!canInsert}
              className={`flex-1 py-2 rounded font-bold text-sm transition-colors ${
                canInsert ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'
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
