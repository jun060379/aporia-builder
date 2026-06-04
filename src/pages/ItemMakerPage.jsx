import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { supabase } from '../lib/supabaseClient';
import PlaceholderPage from './PlaceholderPage.jsx';

// ── 상수 ──────────────────────────────────────────────────────
const CATEGORIES = ['소모품', '장비', '기타'];
const SLOTS = ['무기', '방어구', '장신구1', '장신구2'];
// 장비 랭크: 등급 표시용(메타데이터). 계산에는 영향 없음. 스킬 랭크와 동일 척도.
const EQUIP_RANKS = ['', 'F', 'E', 'D', 'C', 'B', 'A', 'S', 'U', 'EX'];

const EFFECT_KINDS = [
  { id: '회복',     label: '회복',       needsTarget: false,    note: '대상 HP 회복 (소모품)' },
  { id: '스탯보정', label: '스탯 보정',  needsTarget: 'stat',   note: '판정 시 스탯 보정 (복수 선택 가능)' },
  { id: '액션보정', label: '액션 보정',  needsTarget: 'action', note: '판정 시 액션 보정 (복수 선택 가능)' },
  { id: '계열보정', label: '계열 보정',  needsTarget: 'series', note: '판정 시 스킬 계열 보정 (복수 선택 가능)' },
  { id: '피해감소', label: '피해 감소',  needsTarget: false,    note: '받는 피해 감소 (장비/소모품)' },
  { id: '없음',     label: '효과 없음',  needsTarget: false,    note: '효과코드 없음' },
];

const STAT_NAMES    = ['근력', '민첩', '내구', '감각', '지능'];
const ACTION_NAMES  = ['참격', '관통', '타격', '격투', '사격', '방어', '회피', '저항', '조사', '해석', '은신', '추적', '설득'];
const SERIES_NAMES  = ['화력', '방호', '치유', '재생', '간섭', '강화'];

const ITEM_HEADERS = ['id', '이름', '분류', '슬롯', '랭크', '효과코드', '수치', '횟수', '설명', '메모'];

const EMPTY = {
  이름: '', 분류: '소모품', 슬롯: '무기', 랭크: '',
  effectKind: '회복', effectTarget: '',
  수치: '', 횟수: '', 설명: '', 메모: '',
};

const inputCls  = 'w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 outline-none placeholder:text-slate-400 transition-colors';
const selectCls = 'w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:border-violet-400 outline-none transition-colors';

function targetOptions(needsTarget) {
  if (needsTarget === 'stat')   return STAT_NAMES;
  if (needsTarget === 'action') return ACTION_NAMES;
  if (needsTarget === 'series') return SERIES_NAMES;
  return [];
}

// effectTarget은 콤마로 구분된 복수 대상 문자열. 예: "화력,간섭".
function targetListOf(row) {
  return String(row.effectTarget || '').split(/[,，]/).map(s => s.trim()).filter(Boolean);
}

function buildEffectCode(row) {
  const kind = EFFECT_KINDS.find(k => k.id === row.effectKind);
  if (!kind || kind.id === '없음') return '';
  if (kind.needsTarget) {
    const targets = targetListOf(row);
    if (!targets.length) return '';
    return `${kind.id}:${targets.join(',')}`;
  }
  return kind.id;
}

// ── 메인 ──────────────────────────────────────────────────────
function ItemMaker() {
  const [row, setRow] = useState(EMPTY);
  const [copyMsg, setCopyMsg] = useState('');
  const [deploying, setDeploying] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);

  const kind = EFFECT_KINDS.find(k => k.id === row.effectKind) || EFFECT_KINDS[0];
  const effectCode = buildEffectCode(row);
  const field = (k) => (e) => setRow(r => ({ ...r, [k]: e.target.value }));

  const loadItems = () => {
    setItemsLoading(true);
    fetch('/api/game-data')
      .then(r => r.json())
      .then(d => { if (d.ok) setItems(d.items || []); })
      .catch(() => {})
      .finally(() => setItemsLoading(false));
  };
  useEffect(loadItems, []);

  const errors = useMemo(() => {
    const errs = [];
    if (!row.이름.trim()) errs.push('이름은 필수입니다.');
    if (kind.needsTarget && !targetListOf(row).length) errs.push('효과 대상을 1개 이상 선택하세요.');
    if (row.분류 === '장비' && !row.슬롯) errs.push('장비는 슬롯이 필요합니다.');
    return errs;
  }, [row, kind]);

  const tsv = useMemo(() => {
    const obj = {
      id: '',
      이름: row.이름,
      분류: row.분류,
      슬롯: row.분류 === '장비' ? row.슬롯 : '',
      랭크: row.분류 === '장비' ? row.랭크 : '',
      효과코드: effectCode,
      수치: row.수치,
      횟수: row.횟수,
      설명: row.설명,
      메모: row.메모,
    };
    return ITEM_HEADERS.map(h => String(obj[h] ?? '').replace(/\t/g, ' ').replace(/\r?\n/g, ' ')).join('\t');
  }, [row, effectCode]);

  const payload = () => ({
    이름: row.이름.trim(),
    분류: row.분류,
    슬롯: row.분류 === '장비' ? row.슬롯 : '',
    랭크: row.분류 === '장비' ? row.랭크 : '',
    효과코드: effectCode,
    수치: row.수치,
    횟수: row.횟수,
    설명: row.설명,
    메모: row.메모,
  });

  async function copyTsv() {
    try { await navigator.clipboard.writeText(tsv); setCopyMsg('복사됨!'); }
    catch { setCopyMsg('복사 실패'); }
    setTimeout(() => setCopyMsg(''), 1500);
  }

  async function deploy() {
    setError(''); setNotice(''); setDeploying(true);
    try {
      if (!supabase) { setError('Supabase가 설정되지 않았습니다.'); return; }
      const { data: sess } = await supabase.auth.getSession();
      const token = sess?.session?.access_token;
      if (!token) { setError('로그인이 필요합니다.'); return; }

      const resp = await fetch('/api/item-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ item: payload() }),
      });
      const json = await resp.json().catch(() => null);
      if (!resp.ok || !json || json.ok !== true) {
        setError(json?.error || `배포 실패 (HTTP ${resp.status})`);
        return;
      }
      setNotice(`${json.mode === 'updated' ? '갱신' : '등록'}됨: ${json.name} (${json.id})`);
      loadItems();
    } catch (e) {
      setError(e?.message || '배포 중 오류가 발생했습니다.');
    } finally {
      setDeploying(false);
    }
  }

  function editExisting(it) {
    // 구데이터 "이능보정:..." → "계열보정:..." 로 정규화.
    let eff = String(it.effect || '');
    if (eff.startsWith('이능보정')) eff = '계열보정' + eff.slice('이능보정'.length);
    const ek = EFFECT_KINDS.find(k => eff.startsWith(k.id)) || EFFECT_KINDS.find(k => k.id === '없음');
    const tgt = eff.includes(':') ? eff.slice(eff.indexOf(':') + 1).trim() : '';
    setRow({
      이름: it.name, 분류: it.category || '소모품', 슬롯: it.slot || '무기', 랭크: it.rank || '',
      effectKind: ek.id === '없음' && !eff ? '없음' : (ek.id || '없음'),
      effectTarget: tgt,
      수치: it.value === '' ? '' : String(it.value),
      횟수: it.count === '' ? '' : String(it.count),
      설명: it.description || '', 메모: it.memo || '',
    });
    setNotice(''); setError('');
  }

  return (
    <div className="space-y-5">
      {/* 안내 */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 text-[11px] text-indigo-900 leading-relaxed">
        <p className="font-semibold text-indigo-700 mb-0.5">아이템 제작기</p>
        <p>작성 후 <strong>웹 배포</strong>로 ITEM_DB에 바로 등록하거나, <strong>TSV 복사</strong>로 시트에 직접 붙여넣을 수 있습니다. 같은 이름이면 기존 아이템을 갱신합니다.</p>
      </div>

      {/* 기본 정보 */}
      <div className="space-y-3 bg-slate-50 rounded-xl border border-slate-200 p-4">
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">기본 정보</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-slate-500">이름 <span className="text-rose-400">*</span></span>
            <input className={inputCls} value={row.이름} onChange={field('이름')} placeholder="예: 회복약" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-slate-500">분류</span>
            <select className={selectCls} value={row.분류} onChange={field('분류')}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          {row.분류 === '장비' && (
            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-500">슬롯</span>
              <select className={selectCls} value={row.슬롯} onChange={field('슬롯')}>
                {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          )}
          {row.분류 === '장비' && (
            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-500">랭크 <span className="text-slate-300">(등급 표시용 · 계산 영향 없음)</span></span>
              <select className={selectCls} value={row.랭크} onChange={field('랭크')}>
                {EQUIP_RANKS.map(r => <option key={r || '없음'} value={r}>{r || '— 없음 —'}</option>)}
              </select>
            </label>
          )}
        </div>
      </div>

      {/* 효과 */}
      <div className="space-y-3 bg-slate-50 rounded-xl border border-slate-200 p-4">
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">효과</span>
        <div className="flex flex-wrap gap-1.5">
          {EFFECT_KINDS.map(k => (
            <button
              key={k.id}
              type="button"
              onClick={() => setRow(r => ({ ...r, effectKind: k.id, effectTarget: '' }))}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                row.effectKind === k.id
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-violet-300'
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-slate-400">{kind.note}</p>

        {kind.needsTarget && (
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-slate-500">대상 선택 (복수 가능 · 누르면 토글)</span>
            <div className="flex flex-wrap gap-1.5">
              {targetOptions(kind.needsTarget).map(t => {
                const active = targetListOf(row).includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setRow(r => {
                      const list = String(r.effectTarget || '').split(/[,，]/).map(s => s.trim()).filter(Boolean);
                      const i = list.indexOf(t);
                      if (i >= 0) list.splice(i, 1); else list.push(t);
                      return { ...r, effectTarget: list.join(',') };
                    })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      active
                        ? 'bg-violet-600 text-white border-violet-600'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-violet-300'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-slate-500">수치</span>
            <input className={`${inputCls} font-mono`} value={row.수치} onChange={field('수치')} placeholder="예: 30 또는 -5" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-slate-500">횟수 (소모품 버프 지속, 빈칸=1)</span>
            <input className={`${inputCls} font-mono`} value={row.횟수} onChange={field('횟수')} placeholder="예: 3" />
          </label>
        </div>

        {effectCode && (
          <div className="rounded-lg bg-white border border-violet-100 px-3 py-2 text-xs">
            <span className="text-slate-400">효과코드: </span>
            <code className="font-mono text-violet-700">{effectCode}</code>
          </div>
        )}
      </div>

      {/* 설명/메모 */}
      <div className="grid grid-cols-1 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500">설명 (플레이어 표시)</span>
          <textarea className={`${inputCls} h-14 resize-none`} value={row.설명} onChange={field('설명')} placeholder="아이템 설명" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500">메모 (운영용)</span>
          <input className={inputCls} value={row.메모} onChange={field('메모')} />
        </label>
      </div>

      {/* 오류 */}
      {errors.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 space-y-0.5">
          {errors.map((e, i) => <p key={i} className="text-xs text-amber-700">⚠ {e}</p>)}
        </div>
      )}

      {/* TSV */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500">TSV (ITEM_DB 시트 붙여넣기용 · id는 시트에서 채우세요)</span>
          <button onClick={copyTsv} disabled={errors.length > 0}
            className="shrink-0 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-600 rounded-lg text-xs font-medium transition-colors">
            {copyMsg || 'TSV 복사'}
          </button>
        </div>
        <pre className="bg-slate-800 text-slate-100 rounded-xl p-3 text-[11px] font-mono break-all whitespace-pre-wrap overflow-x-auto leading-relaxed">
          {errors.length > 0 ? '(필수 항목을 채워주세요)' : tsv}
        </pre>
        <p className="text-[10px] text-slate-400">헤더: {ITEM_HEADERS.join(' | ')}</p>
      </div>

      {/* 배포 */}
      <div className="flex gap-2">
        <button onClick={deploy} disabled={errors.length > 0 || deploying}
          className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-40 text-white font-bold rounded-xl text-sm transition-colors shadow-sm shadow-violet-200">
          {deploying ? '배포 중…' : '웹 배포 (ITEM_DB에 등록)'}
        </button>
        <button onClick={() => { setRow(EMPTY); setNotice(''); setError(''); }}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 rounded-xl text-sm transition-colors">
          초기화
        </button>
      </div>

      {error && <p className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">{error}</p>}
      {notice && <p className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-700">{notice}</p>}

      {/* 기존 아이템 목록 */}
      <div className="space-y-2 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-600">등록된 아이템 <span className="text-slate-400 font-normal">{items.length}</span></span>
          <button onClick={loadItems} className="text-[10px] px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-500 transition-colors">새로고침</button>
        </div>
        {itemsLoading ? (
          <p className="text-xs text-slate-400 italic">불러오는 중…</p>
        ) : items.length === 0 ? (
          <p className="text-xs text-slate-400 italic">등록된 아이템이 없습니다.</p>
        ) : (
          <div className="space-y-1.5">
            {items.map(it => (
              <div key={it.id} className="flex items-center justify-between gap-2 bg-slate-50 rounded-lg border border-slate-100 px-3 py-2">
                <div className="min-w-0">
                  <span className="text-sm font-medium text-slate-700">{it.name}</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    <span className="text-[10px] text-violet-600 bg-violet-50 border border-violet-200 rounded px-1.5 py-0.5">{it.category}</span>
                    {it.slot && <span className="text-[10px] text-slate-500">{it.slot}</span>}
                    {it.rank && <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">랭크 {it.rank}</span>}
                    {it.effect && <span className="text-[10px] text-slate-500 font-mono">{it.effect}{it.value !== '' ? ` ${it.value}` : ''}</span>}
                  </div>
                </div>
                <button onClick={() => editExisting(it)}
                  className="shrink-0 text-xs px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-lg transition-colors">
                  불러오기
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── 페이지 래퍼 (관리자 전용) ─────────────────────────────────
export default function ItemMakerPage() {
  const { user, isAdmin, loading, profileLoading } = useAuth();

  if (loading || profileLoading) {
    return <PlaceholderPage title="아이템 제작" body="권한 확인 중입니다…" />;
  }
  if (!user) {
    return (
      <PlaceholderPage title="아이템 제작" body="이 페이지는 로그인 후 이용할 수 있습니다."
        extra={<Link to="/login" className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:from-violet-700 hover:to-indigo-700 transition">로그인하기</Link>}
      />
    );
  }
  if (!isAdmin) {
    return <PlaceholderPage title="아이템 제작" body="관리자 권한이 필요한 페이지입니다." />;
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
            <span className="text-slate-400 text-[13px] font-light tracking-widest">ITEMS</span>
          </Link>
          <Link to="/" className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-violet-700 hover:to-indigo-700 transition">홈</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-indigo-100/70 shadow-lg shadow-violet-100/20 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] text-violet-300 font-mono tracking-widest">—</span>
            <h1 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">장비 · 아이템 제작</h1>
          </div>
          <ItemMaker />
        </div>
      </main>
    </div>
  );
}
