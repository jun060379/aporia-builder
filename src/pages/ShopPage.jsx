import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { supabase } from '../lib/supabaseClient';

const inputCls  = 'w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 outline-none placeholder:text-slate-400 transition-colors';
const selectCls = 'w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:border-violet-400 outline-none transition-colors';

async function authToken() {
  if (!supabase) throw new Error('Supabase가 설정되지 않았습니다.');
  const { data: sess } = await supabase.auth.getSession();
  const token = sess?.session?.access_token;
  if (!token) throw new Error('로그인이 필요합니다.');
  return token;
}
async function callMyChar(action, extra = {}) {
  const token = await authToken();
  const resp = await fetch('/api/my-character', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ action, ...extra }),
  });
  return resp.json();
}
async function callShopRegister(body) {
  const token = await authToken();
  const resp = await fetch('/api/shop-register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  return resp.json();
}

function Coin({ n }) {
  return <span className="font-mono font-semibold text-amber-600">{Number(n || 0).toLocaleString()} 은화</span>;
}

// ── 구매 카드 ─────────────────────────────────────────────────
function ShopItemCard({ item, canBuy, silver, busy, onBuy }) {
  const [qty, setQty] = useState(1);
  const total = item.price * Math.max(1, qty);
  const afford = silver >= total;
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3.5 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="text-sm font-semibold text-slate-800">{item.name}</span>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {item.category && <span className="text-[10px] text-violet-600 bg-violet-50 border border-violet-200 rounded px-1.5 py-0.5">{item.category}</span>}
            {item.slot && <span className="text-[10px] text-slate-500">{item.slot}</span>}
            {item.rank && <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">랭크 {item.rank}</span>}
            {item.effect && <span className="text-[10px] text-slate-500 font-mono">{item.effect}{item.value !== '' ? ` ${item.value}` : ''}</span>}
          </div>
        </div>
        <span className="shrink-0 text-sm font-mono font-semibold text-amber-600">{Number(item.price).toLocaleString()}</span>
      </div>
      {item.description && <p className="text-[11px] text-slate-500 leading-snug">{item.description}</p>}
      {canBuy && (
        <div className="flex items-center gap-1.5 mt-0.5">
          <input
            type="number" min="1" value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono outline-none focus:border-violet-400"
          />
          <button
            onClick={() => onBuy(item.name, qty)}
            disabled={busy || !afford}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              afford && !busy ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
            title={afford ? `${total} 은화` : '은화 부족'}
          >
            구매 ({total.toLocaleString()})
          </button>
        </div>
      )}
    </div>
  );
}

// ── 관리자: 상점 관리 ─────────────────────────────────────────
function ShopAdmin({ items, shop, onChanged }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  async function register(e) {
    e?.preventDefault?.();
    setMsg(''); setErr('');
    if (!name) { setErr('아이템을 선택하세요.'); return; }
    const p = Math.max(0, Math.floor(Number(price) || 0));
    setBusy(true);
    try {
      const r = await callShopRegister({ shopItem: { 아이템명: name, 가격: p, 공개: isPublic } });
      if (r?.ok !== true) { setErr(r?.error || '등록 실패'); return; }
      setMsg(`${r.mode === 'updated' ? '갱신' : '등록'}됨: ${name} (${p} 은화)`);
      setName(''); setPrice('');
      onChanged?.();
    } catch (e2) { setErr(e2?.message || '오류'); }
    finally { setBusy(false); }
  }

  async function remove(itemName) {
    setMsg(''); setErr(''); setBusy(true);
    try {
      const r = await callShopRegister({ delete: itemName });
      if (r?.ok !== true) { setErr(r?.error || '삭제 실패'); return; }
      setMsg(`삭제됨: ${itemName}`);
      onChanged?.();
    } catch (e2) { setErr(e2?.message || '오류'); }
    finally { setBusy(false); }
  }

  async function togglePublic(s) {
    setBusy(true); setErr('');
    try {
      const r = await callShopRegister({ shopItem: { 아이템명: s.name, 가격: s.price, 공개: !s.isPublic } });
      if (r?.ok !== true) { setErr(r?.error || '변경 실패'); return; }
      onChanged?.();
    } catch (e2) { setErr(e2?.message || '오류'); }
    finally { setBusy(false); }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 text-[11px] text-indigo-900 leading-relaxed">
        ITEM_DB에 등록된 아이템을 상점 판매 품목으로 등록합니다. 같은 아이템을 다시 등록하면 가격/공개가 갱신됩니다.
      </div>
      <form onSubmit={register} className="bg-slate-50 rounded-xl border border-slate-200 p-4 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-2 items-end">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500">아이템</span>
          <select className={selectCls} value={name} onChange={(e) => setName(e.target.value)}>
            <option value="">— 선택 —</option>
            {items.map((it) => <option key={it.id || it.name} value={it.name}>{it.name}{it.category ? ` (${it.category})` : ''}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500">가격(은화)</span>
          <input className={`${inputCls} w-28 font-mono`} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" />
        </label>
        <label className="flex items-center gap-1.5 text-xs text-slate-600 pb-2">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} /> 공개
        </label>
        <button disabled={busy} className="py-2 px-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-lg text-sm font-medium">
          {busy ? '처리 중…' : '등록/갱신'}
        </button>
      </form>
      {err && <p className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">{err}</p>}
      {msg && <p className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-700">{msg}</p>}

      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-600">등록된 판매 품목 <span className="text-slate-400 font-normal">{shop.length}</span></span>
        {shop.length === 0 ? (
          <p className="text-xs text-slate-400 italic">등록된 품목이 없습니다.</p>
        ) : shop.map((s) => (
          <div key={s.name} className="flex items-center justify-between gap-2 bg-white rounded-lg border border-slate-100 px-3 py-2">
            <div className="min-w-0">
              <span className="text-sm font-medium text-slate-700">{s.name}</span>
              <span className="ml-2 text-xs font-mono text-amber-600">{Number(s.price).toLocaleString()} 은화</span>
              {!s.isPublic && <span className="ml-2 text-[10px] text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">비공개</span>}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => togglePublic(s)} disabled={busy} className="text-[11px] px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-500">
                {s.isPublic ? '비공개로' : '공개로'}
              </button>
              <button onClick={() => remove(s.name)} disabled={busy} className="text-[11px] px-2 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded">
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 메인 ──────────────────────────────────────────────────────
function ShopBody() {
  const { user, isAdmin } = useAuth();
  const [tab, setTab] = useState('shop');
  const [data, setData] = useState({ shop: [], items: [] });
  const [loading, setLoading] = useState(true);
  const [my, setMy] = useState(null);       // { silver, items, alias } | { error: 'NO_ALIAS' }
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const loadGameData = useCallback((bust) => {
    setLoading(true);
    fetch('/api/game-data' + (bust ? `?t=${Date.now()}` : ''))
      .then((r) => r.json())
      .then((d) => { if (d.ok) setData({ shop: d.shop || [], items: d.items || [] }); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadMy = useCallback(() => {
    if (!user) { setMy(null); return; }
    callMyChar('view')
      .then((r) => setMy(r))
      .catch(() => setMy(null));
  }, [user]);

  useEffect(() => { loadGameData(false); }, [loadGameData]);
  useEffect(() => { loadMy(); }, [loadMy]);

  const silver = my?.ok ? Number(my.silver || 0) : 0;
  const noAlias = my && my.ok !== true && (my.error === 'NO_ALIAS' || /별명/.test(my.message || ''));

  const visibleShop = useMemo(
    () => (data.shop || []).filter((s) => isAdmin || s.isPublic),
    [data.shop, isAdmin]
  );

  async function buy(itemName, qty) {
    setBusy(true); setMsg(''); setErr('');
    try {
      const r = await callMyChar('buy', { itemName, qty });
      if (r?.ok !== true) { setErr(r?.error || '구매 실패'); return; }
      setMy(r);
      setMsg(r.message || '구매 완료');
    } catch (e) { setErr(e?.message || '오류'); }
    finally { setBusy(false); }
  }

  return (
    <div className="space-y-5">
      {/* 잔액 / 안내 */}
      <div className="flex items-center justify-between gap-2 rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3">
        <span className="text-xs text-amber-800">
          {user ? (my?.ok ? <>보유 잔액 · <Coin n={silver} /> <span className="text-amber-700/70">({my.alias})</span></> : noAlias ? '먼저 캐릭터 별명을 등록하세요.' : '잔액 불러오는 중…') : '구매하려면 로그인하세요.'}
        </span>
        <button onClick={() => { loadGameData(true); loadMy(); }} className="text-[11px] px-2 py-1 bg-white hover:bg-slate-50 border border-amber-200 rounded text-amber-700">새로고침</button>
      </div>

      {/* 탭 (관리자) */}
      {isAdmin && (
        <div className="flex gap-1.5">
          {[['shop', '상점'], ['admin', '상점 관리']].map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${tab === k ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-500 border-slate-200 hover:border-violet-300'}`}>
              {label}
            </button>
          ))}
        </div>
      )}

      {err && <p className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">{err}</p>}
      {msg && <p className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-700">{msg}</p>}

      {tab === 'admin' && isAdmin ? (
        <ShopAdmin items={data.items} shop={data.shop} onChanged={() => loadGameData(true)} />
      ) : loading ? (
        <p className="text-sm text-slate-400 italic">불러오는 중…</p>
      ) : visibleShop.length === 0 ? (
        <p className="text-sm text-slate-400 italic">판매 중인 품목이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {visibleShop.map((item) => (
            <ShopItemCard
              key={item.name}
              item={item}
              canBuy={!!user && !!my?.ok && !noAlias}
              silver={silver}
              busy={busy}
              onBuy={buy}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
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
            <span className="text-slate-400 text-[13px] font-light tracking-widest">SHOP</span>
          </Link>
          <Link to="/" className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-violet-700 hover:to-indigo-700 transition">홈</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-indigo-100/70 shadow-lg shadow-violet-100/20 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] text-violet-300 font-mono tracking-widest">—</span>
            <h1 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">은화 상점</h1>
          </div>
          <ShopBody />
        </div>
      </main>
    </div>
  );
}
