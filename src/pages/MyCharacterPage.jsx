import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { supabase } from '../lib/supabaseClient';
import PlaceholderPage from './PlaceholderPage.jsx';
import EffectRowsEditor from '../components/EffectRowsEditor.jsx';
import ConditionEditor from '../components/ConditionEditor.jsx';

const STAT_NAMES    = ['근력', '민첩', '내구', '감각', '지능'];
const FEATURE_NAMES = ['무기술', '격투술', '사격술', '기동술', '방어술', '인내', '관찰', '추적술', '은밀행동', '지식', '이면학', '화술'];
const PROF_NAMES    = ['참격숙련', '관통숙련', '타격숙련', '격투숙련', '사격숙련', '회피숙련', '방어숙련', '저항숙련', '조사숙련', '해석숙련', '은신숙련', '추적숙련', '설득숙련'];
const EQUIP_SLOTS   = ['무기', '방어구', '장신구1', '장신구2'];

const inputCls = 'w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 outline-none placeholder:text-slate-400 transition-colors';

async function callMyChar(action, extra = {}) {
  if (!supabase) throw new Error('Supabase가 설정되지 않았습니다.');
  const { data: sess } = await supabase.auth.getSession();
  const token = sess?.session?.access_token;
  if (!token) throw new Error('로그인이 필요합니다.');
  const resp = await fetch('/api/my-character', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ action, ...extra }),
  });
  return resp.json();
}

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

// 성장 가능한 항목 한 칸
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

function PassiveEditForm({ passive, onClose }) {
  const [cond, setCond]   = useState(passive.condition || '');
  const [eff, setEff]     = useState(passive.effect    || '');
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

function ManageView({ data, alias, onReload, onChangeAlias }) {
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [editingPassiveKey, setEditingPassiveKey] = useState(null);

  const remain = data.remain ?? 0;

  const grow = async (field) => {
    setBusy(field); setError(''); setNotice('');
    try {
      const r = await callMyChar('grow', { field });
      if (r.ok) { onReload(r); setNotice(`${field} 성장 완료`); }
      else setError(r.error || r.message || '성장에 실패했습니다.');
    } catch (e) { setError(e.message); }
    finally { setBusy(''); }
  };

  const equip = async (invId) => {
    setBusy('eq:' + invId); setError(''); setNotice('');
    try {
      const r = await callMyChar('equip', { invId });
      if (r.ok) { onReload(r); setNotice(r.message || '장착 완료'); }
      else setError(r.error || r.message || '장착에 실패했습니다.');
    } catch (e) { setError(e.message); }
    finally { setBusy(''); }
  };

  const unequip = async (slot) => {
    setBusy('uneq:' + slot); setError(''); setNotice('');
    try {
      const r = await callMyChar('unequip', { slot });
      if (r.ok) { onReload(r); setNotice(r.message || '해제 완료'); }
      else setError(r.error || r.message || '해제에 실패했습니다.');
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
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg font-bold text-slate-800">{data.alias}</span>
            {data.name && data.name !== data.alias && <span className="text-sm text-slate-400">({data.name})</span>}
            <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded">Lv.{data.level || '?'}</span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">{data.race} · {data.faction}</div>
        </div>
        <button onClick={onChangeAlias} className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-500 transition-colors">
          별명 변경
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

function AliasRegister({ initial, onSaved }) {
  const { user } = useAuth();
  const [alias, setAlias] = useState(initial || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    const a = alias.trim();
    if (!a) { setError('별명을 입력하세요.'); return; }
    setSaving(true); setError('');
    try {
      const { error: err } = await supabase
        .from('profiles')
        .update({ character_alias: a })
        .eq('id', user.id);
      if (err) {
        if (/column .*character_alias.* does not exist/i.test(err.message)) {
          setError('profiles 테이블에 character_alias 컬럼이 없습니다. 관리자에게 문의하세요.');
        } else {
          setError(err.message);
        }
        return;
      }
      onSaved(a);
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">관리할 캐릭터의 <strong>별명</strong>(BOT_DB 등록명)을 입력하세요. 인게임에서 사용하는 캐릭터 별명과 같아야 합니다.</p>
      <div className="flex gap-2">
        <input className={inputCls} value={alias} onChange={e => setAlias(e.target.value)} placeholder="예: 월하륜" onKeyDown={e => e.key === 'Enter' && save()} />
        <button onClick={save} disabled={saving}
          className="shrink-0 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-lg text-sm font-medium transition-colors">
          {saving ? '저장 중…' : '연결'}
        </button>
      </div>
      {error && <p className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">{error}</p>}
    </div>
  );
}

export default function MyCharacterPage() {
  const { user, loading } = useAuth();
  const [alias, setAlias] = useState(null);     // null=미확인, ''=미등록
  const [data, setData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingAlias, setEditingAlias] = useState(false);

  // 별명 조회
  useEffect(() => {
    if (!user || !supabase) { setPageLoading(false); return; }
    let cancelled = false;
    (async () => {
      try {
        const { data: prof, error: err } = await supabase
          .from('profiles').select('character_alias').eq('id', user.id).maybeSingle();
        if (cancelled) return;
        if (err) {
          setError('프로필 조회 실패: ' + err.message);
          setAlias('');
        } else {
          setAlias(String(prof?.character_alias || ''));
        }
      } catch (e) {
        if (!cancelled) { setError(e.message); setAlias(''); }
      } finally {
        if (!cancelled) setPageLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  // 캐릭터 데이터 로드
  const loadChar = useCallback(async () => {
    setError('');
    try {
      const r = await callMyChar('view');
      if (r.ok) setData(r);
      else if (r.error === 'NO_ALIAS') setAlias('');
      else setError(r.error || r.message || '캐릭터 조회 실패');
    } catch (e) { setError(e.message); }
  }, []);

  useEffect(() => {
    if (alias) loadChar();
  }, [alias, loadChar]);

  if (loading || pageLoading) return <PlaceholderPage title="내 캐릭터" body="불러오는 중입니다…" />;
  if (!user) {
    return (
      <PlaceholderPage title="내 캐릭터" body="이 페이지는 로그인 후 이용할 수 있습니다."
        extra={<Link to="/login" className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:from-violet-700 hover:to-indigo-700 transition">로그인하기</Link>}
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
          <Link to="/" className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-violet-700 hover:to-indigo-700 transition">홈</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-indigo-100/70 shadow-lg shadow-violet-100/20 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] text-violet-300 font-mono tracking-widest">—</span>
            <h1 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">내 캐릭터 관리</h1>
          </div>

          {error && <p className="mb-4 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700 whitespace-pre-wrap">{error}</p>}

          {(!alias || editingAlias) ? (
            <AliasRegister initial={alias} onSaved={(a) => { setAlias(a); setEditingAlias(false); setData(null); }} />
          ) : !data ? (
            <p className="text-sm text-slate-400 py-8 text-center">캐릭터 데이터를 불러오는 중…</p>
          ) : (
            <ManageView data={data} alias={alias} onReload={(r) => setData(r)} onChangeAlias={() => setEditingAlias(true)} />
          )}
        </div>
      </main>
    </div>
  );
}
