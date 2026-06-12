import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { supabase } from '../lib/supabaseClient';
import PlaceholderPage from './PlaceholderPage.jsx';
import EffectRowsEditor from '../components/EffectRowsEditor.jsx';
import ConditionEditor from '../components/ConditionEditor.jsx';

const STAT_NAMES    = ['근력', '민첩', '내구', '감각', '지능'];
const FEATURE_NAMES = ['무기술', '격투술', '사격술', '기동술', '방어술', '인내', '관찰', '추적술', '은밀행동', '지식', '이면학', '화술'];
const PROF_NAMES    = ['참격숙련', '관통숙련', '타격숙련', '격투숙련', '사격숙련', '회피숙련', '방어숙련', '저항숙련', '조사숙련', '해석숙련', '은신숙련', '추적숙련', '설득숙련', '기만숙련', '협박숙련'];
const EQUIP_SLOTS   = ['무기', '방어구', '장신구1', '장신구2'];

const inputCls = 'w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 outline-none placeholder:text-slate-400 transition-colors';

async function callMyChar(action, extra = {}, alias) {
  if (!supabase) throw new Error('Supabase가 설정되지 않았습니다.');
  const { data: sess } = await supabase.auth.getSession();
  const token = sess?.session?.access_token;
  if (!token) throw new Error('로그인이 필요합니다.');
  const resp = await fetch('/api/my-character', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ action, ...(alias ? { alias } : {}), ...extra }),
  });
  return resp.json();
}

function extractAliases(prof) {
  if (!prof) return [];
  let list = [];
  try {
    const arr = prof.character_aliases;
    if (Array.isArray(arr)) {
      list = arr.filter(a => a && typeof a === 'string' && a.trim());
    } else if (typeof arr === 'string' && arr.trim().startsWith('[')) {
      list = JSON.parse(arr).filter(a => a && typeof a === 'string' && a.trim());
    }
  } catch {}
  if (list.length === 0 && prof.character_alias) {
    const a = String(prof.character_alias).trim();
    if (a) list = [a];
  }
  return [...new Set(list)];
}

// ── sessionStorage cache helpers ──────────────────────────────────────
const ALIASES_LIST_KEY = 'aporia-mychar-aliases-v1';
const SELECTED_KEY     = 'aporia-mychar-selected-v1';
const DATA_TTL         = 30_000;

function readAliasesCache() {
  try {
    const raw = sessionStorage.getItem(ALIASES_LIST_KEY);
    if (!raw) return null;
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : null;
  } catch { return null; }
}
function writeAliasesCache(arr) { try { sessionStorage.setItem(ALIASES_LIST_KEY, JSON.stringify(arr)); } catch {} }
function clearAliasesCache()    { try { sessionStorage.removeItem(ALIASES_LIST_KEY); sessionStorage.removeItem(SELECTED_KEY); } catch {} }
function readSelectedCache()    { try { return sessionStorage.getItem(SELECTED_KEY) || null; } catch { return null; } }
function writeSelectedCache(a)  { try { sessionStorage.setItem(SELECTED_KEY, a); } catch {} }

function dataKey(alias) { return `aporia-mychar-data-v1-${alias}`; }
function readDataCache(alias) {
  if (!alias) return null;
  try {
    const raw = sessionStorage.getItem(dataKey(alias));
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    return Date.now() - ts < DATA_TTL ? data : null;
  } catch { return null; }
}
function writeDataCache(alias, d) {
  if (!alias) return;
  try { sessionStorage.setItem(dataKey(alias), JSON.stringify({ ts: Date.now(), data: d })); } catch {}
}
function clearDataCache(alias) {
  if (!alias) return;
  try { sessionStorage.removeItem(dataKey(alias)); } catch {}
}

// ── SectionTitle ──
function SectionTitle({ children, extra }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-violet-300 font-mono">—</span>
        <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{children}</h3>
      </div>
      {extra}
    </div>
  );
}

// ── GrowCell ──
function GrowCell({ label, info, remain, busy, onGrow }) {
  const canGrow = !info.isMax && info.cost != null && info.cost <= remain;
  return (
    <div className={`rounded-lg border px-2.5 py-2 ${info.isMax ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
      <div className="flex items-center justify-between gap-1">
        <span className="text-[11px] text-slate-600 truncate">{label}</span>
        <span className="text-sm font-bold text-slate-800">{info.current}</span>
      </div>
      {info.isMax ? (
        <div className="text-[10px] text-amber-600 mt-1">최대</div>
      ) : (
        <button
          onClick={onGrow}
          disabled={!canGrow || busy}
          className={`mt-1 w-full text-[10px] py-0.5 rounded transition-colors ${
            canGrow && !busy
              ? 'bg-violet-600 hover:bg-violet-700 text-white'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
          title={`${info.current} → ${info.next} (${info.cost}pt)`}
        >
          → {info.next} ({info.cost}pt)
        </button>
      )}
    </div>
  );
}

// ── PassiveEditForm ──
function PassiveEditForm({ passive, onClose }) {
  const [cond, setCond]     = useState(passive.condition || '');
  const [eff, setEff]       = useState(passive.effect    || '');
  const [copied, setCopied] = useState(false);

  const text = [
    '!패시브수정',
    `key: ${passive.key}`,
    `이름: ${passive.name}`,
    `조건: ${cond}`,
    `효과: ${eff}`,
  ].join('\n');

  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="mt-2 rounded-xl border border-violet-200 bg-violet-50/60 p-3 space-y-3">
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-600">발동 조건</span>
        <ConditionEditor value={cond} onChange={setCond} />
      </div>
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-600">효과</span>
        <EffectRowsEditor value={eff} onChange={setEff} />
      </div>
      <div className="bg-slate-800 rounded-lg p-2.5 text-[11px] text-slate-100 font-mono whitespace-pre-wrap">{text}</div>
      <div className="flex gap-2">
        <button
          onClick={copy}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
            copied ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-violet-600 hover:bg-violet-700 text-white border-violet-600'
          }`}
        >{copied ? '복사됨 ✓' : '수정 텍스트 복사'}</button>
        <button onClick={onClose} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 rounded-lg text-xs transition-colors">닫기</button>
      </div>
      <p className="text-[10px] text-slate-400">복사 후 운영진에게 전달하거나 빌더에서 신청하세요.</p>
    </div>
  );
}

// ── ManageView ──
function ManageView({ data, selectedAlias, hasMultiple, onBack, onReload, onChangeAlias }) {
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [editingPassiveKey, setEditingPassiveKey] = useState(null);

  const remain = data.remain ?? 0;

  const afterWrite = (r, msg) => {
    clearDataCache(selectedAlias);
    writeDataCache(selectedAlias, r);
    onReload(r);
    setNotice(msg);
  };

  const grow = async (field) => {
    setBusy(field); setError(''); setNotice('');
    try {
      const r = await callMyChar('grow', { field }, selectedAlias);
      if (r.ok) afterWrite(r, `${field} 성장 완료`);
      else setError(r.error || r.message || '성장에 실패했습니다.');
    } catch (e) { setError(e.message); }
    finally { setBusy(''); }
  };

  const equip = async (invId) => {
    setBusy('eq:' + invId); setError(''); setNotice('');
    try {
      const r = await callMyChar('equip', { invId }, selectedAlias);
      if (r.ok) afterWrite(r, r.message || '장착 완료');
      else setError(r.error || r.message || '장착에 실패했습니다.');
    } catch (e) { setError(e.message); }
    finally { setBusy(''); }
  };

  const unequip = async (slot) => {
    setBusy('uneq:' + slot); setError(''); setNotice('');
    try {
      const r = await callMyChar('unequip', { slot }, selectedAlias);
      if (r.ok) afterWrite(r, r.message || '해제 완료');
      else setError(r.error || r.message || '해제에 실패했습니다.');
    } catch (e) { setError(e.message); }
    finally { setBusy(''); }
  };

  const setQuickslot = async (slotIndex, itemName) => {
    setBusy('qs:' + slotIndex); setError(''); setNotice('');
    try {
      const r = await callMyChar('quickslot', { slotIndex, itemName }, selectedAlias);
      if (r.ok) afterWrite(r, r.message || '퀵슬롯 변경 완료');
      else setError(r.error || r.message || '퀵슬롯 변경에 실패했습니다.');
    } catch (e) { setError(e.message); }
    finally { setBusy(''); }
  };

  const equipBySlot = {};
  (data.equipment || []).forEach(e => { equipBySlot[e.slot] = e; });
  const gearItems = (data.items || []).filter(i => i.category === '장비');

  return (
    <div className="space-y-6">
      {/* 헤더 정보 */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          {hasMultiple && (
            <button
              onClick={onBack}
              className="text-[11px] text-violet-500 hover:text-violet-700 flex items-center gap-1 mb-1.5 transition-colors"
            >
              ← 캐릭터 선택으로
            </button>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg font-bold text-slate-800">{data.alias}</span>
            {data.name && data.name !== data.alias && <span className="text-sm text-slate-400">({data.name})</span>}
            <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded">Lv.{data.level || '?'}</span>
            <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded font-mono">{Number(data.silver || 0).toLocaleString()} 은화</span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">{data.race} · {data.faction}</div>
        </div>
        <button
          onClick={onChangeAlias}
          className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-500 transition-colors"
        >
          {hasMultiple ? '캐릭터 추가/삭제' : '별명 변경'}
        </button>
      </div>

      {/* 예산 */}
      <div className="grid grid-cols-3 gap-2">
        {[['성장예산', data.budget, 'text-slate-700'], ['사용', data.used, 'text-slate-500'], ['남은 점수', remain, remain > 0 ? 'text-emerald-600' : 'text-rose-500']].map(([lbl, val, cls]) => (
          <div key={lbl} className="text-center bg-slate-50 rounded-xl py-3 border border-slate-100">
            <div className="text-[10px] text-slate-400 mb-0.5">{lbl}</div>
            <div className={`text-lg font-bold ${cls}`}>{val}</div>
          </div>
        ))}
      </div>

      {error && <p className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700 whitespace-pre-wrap">{error}</p>}
      {notice && <p className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-700">{notice}</p>}

      {/* 스탯 */}
      <section>
        <SectionTitle>스탯 강화</SectionTitle>
        <div className="grid grid-cols-5 gap-2">
          {STAT_NAMES.map(s => (
            <GrowCell key={s} label={s} info={data.stats[s]} remain={remain} busy={busy === s} onGrow={() => grow(s)} />
          ))}
        </div>
      </section>

      {/* 기능 */}
      <section>
        <SectionTitle>기능 강화</SectionTitle>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {FEATURE_NAMES.map(f => (
            <GrowCell key={f} label={f} info={data.features[f]} remain={remain} busy={busy === f} onGrow={() => grow(f)} />
          ))}
        </div>
      </section>

      {/* 숙련 */}
      <section>
        <SectionTitle>숙련 강화</SectionTitle>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {PROF_NAMES.map(p => (
            <GrowCell key={p} label={p.replace('숙련', '')} info={data.profs[p]} remain={remain} busy={busy === p} onGrow={() => grow(p)} />
          ))}
        </div>
      </section>

      {/* 장비 */}
      <section>
        <SectionTitle>장비창</SectionTitle>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {EQUIP_SLOTS.map(slot => {
            const eq = equipBySlot[slot];
            return (
              <div key={slot} className={`rounded-xl border px-3 py-2.5 ${eq ? 'bg-violet-50 border-violet-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center justify-between">
                  <div className="text-[10px] text-slate-400">{slot}</div>
                  {eq && (
                    <button onClick={() => unequip(slot)} disabled={busy === 'uneq:' + slot}
                      className="text-[10px] px-1.5 py-0.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded transition-colors disabled:opacity-40">
                      해제
                    </button>
                  )}
                </div>
                {eq ? (
                  <>
                    <div className="text-sm font-medium text-slate-800 mt-0.5">{eq.name}</div>
                    {eq.effect && <div className="text-[10px] text-violet-600 font-mono">{eq.effect}{eq.value !== '' ? ` ${eq.value}` : ''}</div>}
                  </>
                ) : <div className="text-xs text-slate-300 mt-0.5">비어 있음</div>}
              </div>
            );
          })}
        </div>
        {gearItems.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] text-slate-400">보유 장비 — 클릭해서 장착 (같은 슬롯 자동 교체)</p>
            {gearItems.map(it => (
              <div key={it.invId} className="flex items-center justify-between gap-2 bg-white rounded-lg border border-slate-100 px-3 py-2">
                <div className="min-w-0">
                  <span className="text-sm text-slate-700">{it.name}</span>
                  <span className="text-[10px] text-slate-400 ml-2">{it.slot}{it.effect ? ` · ${it.effect}${it.value !== '' ? ` ${it.value}` : ''}` : ''}</span>
                </div>
                <button onClick={() => equip(it.invId)} disabled={busy === 'eq:' + it.invId}
                  className="shrink-0 text-xs px-2.5 py-1 bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-700 rounded-lg transition-colors disabled:opacity-40">
                  장착
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 인벤토리 */}
      <section>
        <SectionTitle>인벤토리</SectionTitle>
        {(data.items || []).length === 0 ? (
          <p className="text-xs text-slate-400 italic">보유 아이템이 없습니다.</p>
        ) : (
          <div className="space-y-1.5">
            {data.items.map(it => (
              <div key={it.invId} className="flex items-center justify-between gap-2 bg-slate-50 rounded-lg border border-slate-100 px-3 py-2">
                <span className="text-sm text-slate-700">{it.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">{it.category}{it.slot ? ` / ${it.slot}` : ''}</span>
                  <span className="text-xs text-slate-400 font-mono">×{it.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 퀵슬롯 */}
      <section>
        <SectionTitle>퀵슬롯 <span className="text-[10px] text-slate-400 font-normal">(소모품 단축 사용 · !퀵슬롯1~3 또는 !아이템명)</span></SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[0, 1, 2].map(i => {
            const cur = (data.quickslots || [])[i] || '';
            const consumables = (data.items || []).filter(it => it.category === '소모품');
            const hasCur = !cur || consumables.some(c => c.name === cur);
            return (
              <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                <div className="text-[10px] text-slate-400 mb-1">퀵슬롯{i + 1}</div>
                <select
                  className={`${inputCls} text-xs`}
                  value={cur}
                  disabled={busy === 'qs:' + (i + 1)}
                  onChange={(e) => setQuickslot(i + 1, e.target.value)}
                >
                  <option value="">— 비어 있음 —</option>
                  {consumables.map(it => <option key={it.invId} value={it.name}>{it.name} ×{it.quantity}</option>)}
                  {!hasCur && <option value={cur}>{cur} (보유 없음)</option>}
                </select>
              </div>
            );
          })}
        </div>
      </section>

      {/* 스킬 */}
      <section>
        <SectionTitle extra={<Link to="/builder" className="text-[11px] text-violet-600 hover:underline">빌더에서 수정 신청 →</Link>}>스킬</SectionTitle>
        <p className="text-[10px] text-slate-400 mb-2">스킬 추가/수정은 캐릭터 빌더에서 작성 후 신청하면 관리자 승인 뒤 반영됩니다.</p>
        {(data.skills || []).length === 0 ? (
          <p className="text-xs text-slate-400 italic">등록된 스킬이 없습니다.</p>
        ) : (
          <div className="space-y-1.5">
            {data.skills.map((sk, i) => (
              <div key={i} className="bg-slate-50 rounded-lg border border-slate-100 px-3 py-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-slate-700">{sk.name}</span>
                  <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">{sk.rank}</span>
                  {sk.series && <span className="text-[10px] text-slate-500">{sk.series}</span>}
                </div>
                {sk.formula && <p className="text-[10px] text-slate-400 font-mono mt-0.5">{sk.formula}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 패시브 */}
      <section>
        <SectionTitle extra={<Link to="/builder" className="text-[11px] text-violet-600 hover:underline">빌더에서 신청 →</Link>}>패시브</SectionTitle>
        <p className="text-[10px] text-slate-400 mb-2">수정 버튼으로 조건/효과를 편집하고 텍스트를 복사해 운영진에게 전달하세요.</p>
        {(data.passives || []).length === 0 ? (
          <p className="text-xs text-slate-400 italic">적용 중인 패시브가 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {data.passives.map((p, i) => {
              const rowKey = p.key || String(i);
              const isEditing = editingPassiveKey === rowKey;
              return (
                <div key={rowKey} className="bg-slate-50 rounded-lg border border-slate-100 px-3 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-slate-700">{p.name}</span>
                        {p.category && <span className="text-[10px] text-violet-700 bg-violet-50 border border-violet-200 rounded px-1.5 py-0.5">{p.category}</span>}
                        {p.trigger && <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">{p.trigger}</span>}
                        {p.value && <span className="text-[10px] text-slate-400 font-mono">수치 {p.value}</span>}
                      </div>
                      {!isEditing && p.condition && <p className="text-[10px] text-slate-400 font-mono mt-0.5 whitespace-pre-wrap break-all">조건: {p.condition}</p>}
                      {!isEditing && p.effect && <p className="text-[10px] text-indigo-500 font-mono mt-0.5 whitespace-pre-wrap break-all">효과: {p.effect}</p>}
                      {!isEditing && p.description && <p className="text-[10px] text-slate-400 mt-0.5">{p.description}</p>}
                    </div>
                    <button
                      onClick={() => setEditingPassiveKey(isEditing ? null : rowKey)}
                      className={`shrink-0 text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                        isEditing
                          ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-500'
                          : 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700'
                      }`}
                    >{isEditing ? '닫기' : '수정'}</button>
                  </div>
                  {isEditing && (
                    <PassiveEditForm passive={p} onClose={() => setEditingPassiveKey(null)} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

// ── CharacterPicker ──
function CharacterPicker({ aliases, onSelect, onManageAliases }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-slate-700 mb-1">캐릭터 선택</h2>
        <p className="text-xs text-slate-400">관리할 캐릭터를 선택하세요.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {aliases.map(alias => (
          <button
            key={alias}
            onClick={() => onSelect(alias)}
            className="flex items-center justify-center py-6 px-3 bg-slate-50 hover:bg-violet-50 border border-slate-200 hover:border-violet-300 rounded-xl text-sm font-semibold text-slate-700 hover:text-violet-700 transition-all active:scale-[0.97] shadow-sm"
          >
            {alias}
          </button>
        ))}
      </div>
      <button
        onClick={onManageAliases}
        className="text-[12px] text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
      >
        캐릭터 추가 / 삭제
      </button>
    </div>
  );
}

// ── AliasRegister ──
function AliasRegister({ aliases, onSaved, onBack }) {
  const { user } = useAuth();
  const [newAlias, setNewAlias] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const saveAliases = async (updated) => {
    setSaving(true); setError('');
    try {
      const primary = updated[0] || '';
      const { error: err } = await supabase
        .from('profiles')
        .update({ character_alias: primary, character_aliases: updated })
        .eq('id', user.id);
      if (err) {
        if (/column|does not exist/i.test(err.message || '')) {
          // character_aliases column not yet created — fall back to character_alias only
          const { error: err2 } = await supabase
            .from('profiles')
            .update({ character_alias: updated[updated.length - 1] || primary })
            .eq('id', user.id);
          if (err2) { setError(err2.message); return; }
        } else {
          setError(err.message); return;
        }
      }
      setNewAlias('');
      onSaved(updated);
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const addAlias = async () => {
    const a = newAlias.trim();
    if (!a) { setError('별명을 입력하세요.'); return; }
    if (aliases.includes(a)) { setError('이미 등록된 별명입니다.'); return; }
    await saveAliases([...aliases, a]);
  };

  const removeAlias = async (alias) => {
    await saveAliases(aliases.filter(a => a !== alias));
  };

  return (
    <div className="space-y-4">
      {aliases.length === 0 && (
        <p className="text-xs text-slate-500">
          관리할 캐릭터의 <strong>별명</strong>(BOT_DB 등록명)을 입력하세요. 인게임에서 사용하는 캐릭터 별명과 같아야 합니다.
        </p>
      )}

      {aliases.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-slate-600">등록된 캐릭터</p>
          {aliases.map(a => (
            <div key={a} className="flex items-center justify-between bg-slate-50 rounded-lg border border-slate-100 px-3 py-2">
              <span className="text-sm text-slate-700">{a}</span>
              <button
                onClick={() => removeAlias(a)}
                disabled={saving}
                className="text-[11px] px-2 py-0.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded transition-colors disabled:opacity-40"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <p className="text-[11px] text-slate-500 mb-1.5">
          {aliases.length === 0 ? '캐릭터 별명 입력' : '캐릭터 추가'}
        </p>
        <div className="flex gap-2">
          <input
            className={inputCls}
            value={newAlias}
            onChange={e => setNewAlias(e.target.value)}
            placeholder="예: 월하륜"
            onKeyDown={e => e.key === 'Enter' && addAlias()}
          />
          <button
            onClick={addAlias}
            disabled={saving}
            className="shrink-0 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {saving ? '저장 중…' : '추가'}
          </button>
        </div>
      </div>

      {error && <p className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">{error}</p>}

      {onBack && (
        <button
          onClick={onBack}
          className="text-[12px] text-slate-400 hover:text-slate-600 transition-colors"
        >
          ← 뒤로
        </button>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────
export default function MyCharacterPage() {
  const { user, loading } = useAuth();

  const [aliases, setAliases]                 = useState(null);   // null = still loading
  const [selectedAlias, setSelectedAlias]     = useState(null);
  const [data, setData]                       = useState(null);
  const [pageLoading, setPageLoading]         = useState(true);
  const [refreshing, setRefreshing]           = useState(false);
  const [error, setError]                     = useState('');
  const [managingAliases, setManagingAliases] = useState(false);

  const loadChar = useCallback(async (alias, background = false) => {
    if (!alias) return;
    if (background) setRefreshing(true);
    else setData(null);
    setError('');
    try {
      const r = await callMyChar('view', {}, alias);
      if (r.ok) { writeDataCache(alias, r); setData(r); }
      else setError(r.error || r.message || '캐릭터 조회 실패');
    } catch (e) { if (!background) setError(e.message); }
    finally { if (background) setRefreshing(false); }
  }, []);

  // Load aliases list from Supabase profile
  useEffect(() => {
    if (!user || !supabase) { setPageLoading(false); return; }

    const cachedList = readAliasesCache();
    if (cachedList !== null) {
      setAliases(cachedList);
      setPageLoading(false);
      const cachedSel = readSelectedCache();
      if (cachedList.length === 1) {
        setSelectedAlias(cachedList[0]);
      } else if (cachedSel && cachedList.includes(cachedSel)) {
        setSelectedAlias(cachedSel);
      }
      // Background refresh from Supabase
      (async () => {
        try {
          const { data: prof } = await supabase
            .from('profiles').select('character_alias, character_aliases').eq('id', user.id).maybeSingle();
          const fresh = extractAliases(prof);
          if (JSON.stringify(fresh) !== JSON.stringify(cachedList)) {
            writeAliasesCache(fresh);
            setAliases(fresh);
          }
        } catch {}
      })();
      return;
    }

    // No cache — fetch fresh from Supabase
    let cancelled = false;
    (async () => {
      try {
        // Try with character_aliases column; fall back if it doesn't exist yet
        let prof = null;
        const { data: d1, error: e1 } = await supabase
          .from('profiles').select('character_alias, character_aliases').eq('id', user.id).maybeSingle();
        if (e1 && /column|does not exist/i.test(e1.message || '')) {
          const { data: d2, error: e2 } = await supabase
            .from('profiles').select('character_alias').eq('id', user.id).maybeSingle();
          if (e2) { if (!cancelled) setError('프로필 조회 실패: ' + e2.message); }
          else prof = d2;
        } else if (e1) {
          if (!cancelled) setError('프로필 조회 실패: ' + e1.message);
        } else {
          prof = d1;
        }
        if (cancelled) return;
        const list = extractAliases(prof);
        writeAliasesCache(list);
        setAliases(list);
        if (list.length === 1) {
          setSelectedAlias(list[0]);
          writeSelectedCache(list[0]);
        }
      } catch (e) { if (!cancelled) setError(e.message); }
      finally { if (!cancelled) setPageLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [user]);

  // Load character data when selectedAlias changes
  useEffect(() => {
    if (!selectedAlias) return;
    writeSelectedCache(selectedAlias);
    const cached = readDataCache(selectedAlias);
    if (cached) {
      setData(cached);
      loadChar(selectedAlias, true);
    } else {
      loadChar(selectedAlias, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAlias]);

  // ── Auth guards ──
  if (loading || pageLoading || aliases === null) {
    return <PlaceholderPage title="내 캐릭터" body="불러오는 중입니다…" />;
  }
  if (!user) {
    return (
      <PlaceholderPage
        title="내 캐릭터"
        body="이 페이지는 로그인 후 이용할 수 있습니다."
        extra={
          <Link to="/login" className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:from-violet-700 hover:to-indigo-700 transition">
            로그인하기
          </Link>
        }
      />
    );
  }

  const hasMultiple = aliases.length > 1;

  // ── Content logic ──
  let content;
  if (managingAliases || aliases.length === 0) {
    content = (
      <AliasRegister
        aliases={aliases}
        onSaved={(updated) => {
          setAliases(updated);
          writeAliasesCache(updated);
          setManagingAliases(false);
          if (updated.length === 0) {
            setSelectedAlias(null);
            setData(null);
          } else if (updated.length === 1 && !selectedAlias) {
            setSelectedAlias(updated[0]);
          }
        }}
        onBack={aliases.length > 0 ? () => setManagingAliases(false) : null}
      />
    );
  } else if (!selectedAlias && hasMultiple) {
    content = (
      <CharacterPicker
        aliases={aliases}
        onSelect={(a) => setSelectedAlias(a)}
        onManageAliases={() => setManagingAliases(true)}
      />
    );
  } else if (!data) {
    content = <p className="text-sm text-slate-400 py-8 text-center">캐릭터 데이터를 불러오는 중…</p>;
  } else {
    content = (
      <ManageView
        data={data}
        selectedAlias={selectedAlias}
        hasMultiple={hasMultiple}
        onBack={() => { setSelectedAlias(null); setData(null); }}
        onReload={(r) => setData(r)}
        onChangeAlias={() => setManagingAliases(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-violet-50/40 text-slate-800">
      <div aria-hidden className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-200/50 rounded-full blur-3xl" />
      </div>

      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-20 shadow-sm shadow-slate-100/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-xl font-bold text-transparent">APORIA</span>
            <span className="text-slate-400 text-[13px] font-light tracking-widest">MY CHARACTER</span>
          </Link>
          <div className="flex items-center gap-2">
            {refreshing && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border border-violet-300 border-t-violet-600 animate-spin inline-block" />
                갱신 중
              </span>
            )}
            {data && !managingAliases && selectedAlias && (
              <button
                onClick={() => { clearDataCache(selectedAlias); loadChar(selectedAlias, false); }}
                disabled={refreshing}
                className="text-[11px] px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 rounded-lg transition disabled:opacity-40"
              >새로고침</button>
            )}
            <Link to="/" className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-violet-700 hover:to-indigo-700 transition">홈</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-indigo-100/70 shadow-lg shadow-violet-100/20 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] text-violet-300 font-mono tracking-widest">—</span>
            <h1 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">내 캐릭터 관리</h1>
          </div>

          {error && <p className="mb-4 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700 whitespace-pre-wrap">{error}</p>}

          {content}
        </div>
      </main>
    </div>
  );
}
