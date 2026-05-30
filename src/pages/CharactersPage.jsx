import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// ── 상수 ──────────────────────────────────────────────────────
const STAT_NAMES     = ['근력','민첩','내구','감각','지능'];
const FEATURE_NAMES  = ['무기술','격투술','사격술','기동술','방어술','인내','관찰','추적술','은밀행동','지식','이면학','화술'];
const PROF_NAMES     = ['참격숙련','관통숙련','타격숙련','격투숙련','사격숙련','회피숙련','방어숙련','저항숙련','조사숙련','해석숙련','은신숙련','추적숙련','설득숙련'];

const RANK_ORDER = ['F','E','D','C','B','A','S','U','EX'];
const RANK_CLS = {
  F:'bg-slate-100 text-slate-500 border-slate-200',
  E:'bg-slate-100 text-slate-600 border-slate-200',
  D:'bg-sky-50 text-sky-600 border-sky-200',
  C:'bg-emerald-50 text-emerald-600 border-emerald-200',
  B:'bg-amber-50 text-amber-600 border-amber-200',
  A:'bg-orange-50 text-orange-600 border-orange-200',
  S:'bg-violet-50 text-violet-700 border-violet-200',
  U:'bg-rose-50 text-rose-600 border-rose-200',
  EX:'bg-gradient-to-r from-violet-100 to-amber-100 text-violet-800 border-violet-300',
};
const SERIES_CLS = {
  화력:'bg-rose-50 text-rose-600 border-rose-200',
  방호:'bg-sky-50 text-sky-600 border-sky-200',
  치유:'bg-emerald-50 text-emerald-600 border-emerald-200',
  재생:'bg-teal-50 text-teal-600 border-teal-200',
  간섭:'bg-purple-50 text-purple-600 border-purple-200',
  강화:'bg-amber-50 text-amber-600 border-amber-200',
  특수:'bg-slate-100 text-slate-500 border-slate-200',
};

// ── 유틸 ──────────────────────────────────────────────────────
function Badge({ text, cls }) {
  return <span className={`inline-flex items-center text-[10px] px-1.5 py-0.5 rounded border font-medium ${cls || 'bg-slate-100 text-slate-500 border-slate-200'}`}>{text}</span>;
}

function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[10px] text-violet-300 font-mono">—</span>
      <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{children}</h3>
    </div>
  );
}

// ── 캐릭터 상세 모달 ──────────────────────────────────────────
const EQUIP_SLOTS = ['무기', '방어구', '장신구1', '장신구2'];

function CharacterModal({ char, skills, passives, inventory, equipment, onClose }) {
  // ESC 닫기
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  const mySkills   = skills.filter(s => s.owner === char.alias)
    .sort((a, b) => RANK_ORDER.indexOf(b.rank) - RANK_ORDER.indexOf(a.rank));
  const myPassives = passives.filter(p =>
    p.ownerType === 'global' ||
    (p.ownerType === 'character' && p.owner === char.alias)
  );
  const myInventory = (inventory || []).filter(i => i.owner === char.alias);
  const myEquipment = (equipment || []).filter(e => e.owner === char.alias);
  const equipBySlot = {};
  myEquipment.forEach(e => { equipBySlot[e.slot] = e; });

  const hpPct = char.maxHp > 0 ? Math.round(char.currentHp / char.maxHp * 100) : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-slate-400/20 flex flex-col">

        {/* ── 헤더 ── */}
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-100 px-6 py-4 flex items-start justify-between gap-3 z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-slate-800">{char.alias}</h2>
              {char.name && char.name !== char.alias && (
                <span className="text-sm text-slate-400">({char.name})</span>
              )}
              <Badge text={`Lv.${char.level || '?'}`} cls="bg-amber-50 text-amber-600 border-amber-200 text-[11px] px-2 py-0.5" />
            </div>
            <div className="flex gap-3 mt-1 text-xs text-slate-400">
              {char.race && <span>{char.race}</span>}
              {char.faction && <span>· {char.faction}</span>}
              {char.maxHp > 0 && <span>· HP {char.currentHp}/{char.maxHp}</span>}
              {char.erosion > 0 && <span>· 침식 {char.erosion}</span>}
            </div>
            {char.maxHp > 0 && (
              <div className="mt-2 h-1.5 w-48 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${hpPct > 50 ? 'bg-emerald-400' : hpPct > 25 ? 'bg-amber-400' : 'bg-rose-400'}`}
                  style={{ width: `${hpPct}%` }}
                />
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition"
          >✕</button>
        </div>

        <div className="p-6 space-y-8">

          {/* ── 스탯 ── */}
          <section>
            <SectionTitle>스탯</SectionTitle>
            <div className="grid grid-cols-5 gap-2">
              {STAT_NAMES.map(s => {
                const grade = char.stats?.[s] || 'F';
                return (
                  <div key={s} className="text-center bg-slate-50 rounded-xl py-3 border border-slate-100">
                    <div className="text-[10px] text-slate-400 mb-1">{s}</div>
                    <div className="text-lg font-bold text-amber-600">{grade}</div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── 기능 ── */}
          <section>
            <SectionTitle>기능</SectionTitle>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {FEATURE_NAMES.map(f => {
                const val = char.features?.[f] || 0;
                return (
                  <div key={f} className={`flex items-center justify-between rounded-lg px-3 py-1.5 border ${val > 0 ? 'bg-violet-50 border-violet-100' : 'bg-slate-50 border-slate-100'}`}>
                    <span className="text-[11px] text-slate-600">{f}</span>
                    <span className={`text-sm font-bold ml-2 ${val > 0 ? 'text-violet-700' : 'text-slate-300'}`}>{val}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── 숙련 ── */}
          <section>
            <SectionTitle>숙련</SectionTitle>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {PROF_NAMES.map(p => {
                const val = char.profs?.[p] || 0;
                return (
                  <div key={p} className={`flex items-center justify-between rounded-lg px-3 py-1.5 border ${val > 0 ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100'}`}>
                    <span className="text-[11px] text-slate-600">{p.replace('숙련','')}<span className="text-slate-300">숙련</span></span>
                    <span className={`text-sm font-bold ml-2 ${val > 0 ? 'text-indigo-700' : 'text-slate-300'}`}>{val}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── 스킬 ── */}
          <section>
            <SectionTitle>스킬 ({mySkills.length})</SectionTitle>
            {mySkills.length === 0 ? (
              <p className="text-xs text-slate-400 italic">등록된 스킬이 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {mySkills.map((sk, i) => (
                  <SkillRow key={i} sk={sk} />
                ))}
              </div>
            )}
          </section>

          {/* ── 패시브 ── */}
          <section>
            <SectionTitle>패시브 ({myPassives.length})</SectionTitle>
            {myPassives.length === 0 ? (
              <p className="text-xs text-slate-400 italic">등록된 패시브가 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {myPassives.map((p, i) => (
                  <PassiveRow key={i} p={p} />
                ))}
              </div>
            )}
          </section>

          {/* ── 장비 ── */}
          <section>
            <SectionTitle>장비</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              {EQUIP_SLOTS.map(slot => {
                const eq = equipBySlot[slot];
                return (
                  <div key={slot} className={`rounded-xl border px-3 py-2.5 ${eq ? 'bg-violet-50 border-violet-100' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="text-[10px] text-slate-400 mb-0.5">{slot}</div>
                    {eq ? (
                      <>
                        <div className="text-sm font-medium text-slate-800">{eq.name}</div>
                        {eq.effect && (
                          <div className="text-[10px] text-violet-600 font-mono mt-0.5">{eq.effect}{eq.value !== '' ? ` ${eq.value}` : ''}</div>
                        )}
                      </>
                    ) : (
                      <div className="text-xs text-slate-300">비어 있음</div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── 인벤토리 ── */}
          <section>
            <SectionTitle>인벤토리 ({myInventory.length})</SectionTitle>
            {myInventory.length === 0 ? (
              <p className="text-xs text-slate-400 italic">보유 아이템이 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {myInventory.map((it, i) => (
                  <InventoryRow key={i} item={it} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function InventoryRow({ item }) {
  const [open, setOpen] = useState(false);
  const catCls = {
    소모품: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    장비:   'bg-violet-50 text-violet-600 border-violet-200',
    기타:   'bg-slate-100 text-slate-500 border-slate-200',
  };
  const hasDetail = item.effect || item.description || item.slot;
  return (
    <div className="rounded-xl border border-slate-100 overflow-hidden">
      <button
        onClick={() => hasDetail && setOpen(v => !v)}
        className={`w-full flex items-center gap-2 px-4 py-2.5 bg-slate-50 transition text-left ${hasDetail ? 'hover:bg-slate-100' : 'cursor-default'}`}
      >
        <span className="flex-1 text-sm font-medium text-slate-700">{item.name}</span>
        <span className="text-xs text-slate-400 font-mono">×{item.quantity}</span>
        <div className="flex gap-1 shrink-0">
          {item.category && <Badge text={item.category} cls={`${catCls[item.category] || catCls.기타} text-[10px]`} />}
        </div>
        {hasDetail && <span className="text-slate-300 text-xs">{open ? '▲' : '▼'}</span>}
      </button>
      {open && hasDetail && (
        <div className="px-4 py-3 bg-white space-y-1.5 text-xs text-slate-600 border-t border-slate-100">
          {item.slot   && <p><span className="text-slate-400 mr-1">슬롯</span>{item.slot}</p>}
          {item.effect && <p><span className="text-slate-400 mr-1">효과</span><code className="font-mono text-violet-700">{item.effect}{item.value !== '' ? ` ${item.value}` : ''}</code></p>}
          {item.description && <p className="text-slate-500 leading-relaxed">{item.description}</p>}
        </div>
      )}
    </div>
  );
}

function SkillRow({ sk }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-slate-100 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 transition text-left"
      >
        <span className="flex-1 text-sm font-medium text-slate-700">{sk.name}</span>
        <div className="flex gap-1 shrink-0">
          <Badge text={sk.rank} cls={`${RANK_CLS[sk.rank] || RANK_CLS.F} text-[10px]`} />
          {sk.series && <Badge text={sk.series} cls={`${SERIES_CLS[sk.series] || 'bg-slate-100 text-slate-500 border-slate-200'} text-[10px]`} />}
          {sk.tradition && <Badge text={sk.tradition} cls="bg-slate-50 text-slate-400 border-slate-200 text-[10px]" />}
        </div>
        <span className="text-slate-300 text-xs">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-4 py-3 bg-white space-y-1.5 text-xs text-slate-600 border-t border-slate-100">
          {sk.formula    && <p><span className="text-slate-400 mr-1">계산식</span><code className="font-mono text-indigo-600">{sk.formula}</code></p>}
          {sk.condition  && <p><span className="text-slate-400 mr-1">조건</span>{sk.condition}</p>}
          {sk.cost       && <p><span className="text-slate-400 mr-1">대가</span>{sk.cost}</p>}
          {sk.description && <p className="text-slate-500 leading-relaxed">{sk.description}</p>}
        </div>
      )}
    </div>
  );
}

function PassiveRow({ p }) {
  const [open, setOpen] = useState(false);
  const catCls = {
    판정보정:'bg-violet-50 text-violet-600 border-violet-200',
    피해보정:'bg-blue-50 text-blue-600 border-blue-200',
    회복보정:'bg-emerald-50 text-emerald-600 border-emerald-200',
    저항:'bg-amber-50 text-amber-600 border-amber-200',
    트리거효과:'bg-rose-50 text-rose-600 border-rose-200',
  };
  return (
    <div className="rounded-xl border border-slate-100 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 transition text-left"
      >
        <span className="flex-1 text-sm font-medium text-slate-700">{p.name}</span>
        <div className="flex gap-1 shrink-0">
          {p.category && <Badge text={p.category} cls={`${catCls[p.category] || 'bg-slate-100 text-slate-500 border-slate-200'} text-[10px]`} />}
          {p.value && <span className="text-[10px] text-slate-500 font-mono">{p.value}</span>}
        </div>
        <span className="text-slate-300 text-xs">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-4 py-3 bg-white space-y-1.5 text-xs text-slate-600 border-t border-slate-100">
          {p.trigger   && <p><span className="text-slate-400 mr-1">발동</span>{p.trigger}</p>}
          {p.condition && <p><span className="text-slate-400 mr-1">조건</span><code className="font-mono">{p.condition}</code></p>}
          {p.description && <p className="text-slate-500 leading-relaxed">{p.description}</p>}
        </div>
      )}
    </div>
  );
}

// ── 캐릭터 카드 (목록) ─────────────────────────────────────────
function CharacterCard({ char, skillCount, passiveCount, itemCount, equipCount, onClick }) {
  const hpPct = char.maxHp > 0 ? Math.round(char.currentHp / char.maxHp * 100) : null;
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white/85 backdrop-blur-sm rounded-2xl border border-indigo-100/70 shadow-sm hover:shadow-md hover:border-indigo-200 transition p-5"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-800">{char.alias}</span>
            {char.name && char.name !== char.alias && (
              <span className="text-xs text-slate-400">({char.name})</span>
            )}
            <Badge text={`Lv.${char.level || '?'}`} cls="bg-amber-50 text-amber-600 border-amber-200" />
          </div>
          <div className="flex gap-2 mt-1 flex-wrap">
            {char.race    && <span className="text-[11px] text-slate-400">{char.race}</span>}
            {char.faction && <span className="text-[11px] text-slate-400">· {char.faction}</span>}
          </div>
          <div className="flex gap-2 mt-1.5 flex-wrap">
            {skillCount > 0   && <span className="text-[10px] text-violet-500">스킬 {skillCount}</span>}
            {passiveCount > 0 && <span className="text-[10px] text-indigo-500">패시브 {passiveCount}</span>}
            {equipCount > 0   && <span className="text-[10px] text-sky-500">장비 {equipCount}</span>}
            {itemCount > 0    && <span className="text-[10px] text-emerald-500">아이템 {itemCount}</span>}
          </div>
        </div>
        <div className="shrink-0 text-right">
          {hpPct !== null && (
            <div className="space-y-1">
              <div className="text-[10px] text-slate-400">{char.currentHp}/{char.maxHp}</div>
              <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full ${hpPct > 50 ? 'bg-emerald-400' : hpPct > 25 ? 'bg-amber-400' : 'bg-rose-400'}`}
                  style={{ width: `${hpPct}%` }}
                />
              </div>
            </div>
          )}
          <div className="text-[10px] text-slate-300 mt-2">클릭해서 상세보기 →</div>
        </div>
      </div>
    </button>
  );
}

// ── 메인 페이지 ───────────────────────────────────────────────
export default function CharactersPage() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [search, setSearch]   = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('/api/game-data')
      .then(r => r.json())
      .then(d => { if (d.ok) setData(d); else setError(d.error || '조회 실패'); })
      .catch(e => setError(e.message || '네트워크 오류'))
      .finally(() => setLoading(false));
  }, []);

  const skillsByChar   = {};
  const passivesByChar = {};
  (data?.skills   || []).forEach(s => { (skillsByChar[s.owner]   = skillsByChar[s.owner]   || []).push(s); });

  const chars = data?.characters || [];
  const filtered = chars.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.alias.toLowerCase().includes(q)
      || c.name.toLowerCase().includes(q)
      || c.faction.toLowerCase().includes(q)
      || c.race.toLowerCase().includes(q);
  });

  const selectedChar = selected ? chars.find(c => c.alias === selected) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-violet-50/40 text-slate-800">
      <div aria-hidden className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-200/50 rounded-full blur-3xl" />
      </div>

      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-20 shadow-sm shadow-slate-100/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-xl font-bold text-transparent">APORIA</span>
            <span className="text-slate-400 text-[13px] font-light tracking-widest">CHARACTERS</span>
          </Link>
          <Link to="/" className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98] transition">
            홈
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-indigo-100/70 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-violet-300 font-mono tracking-widest">—</span>
            <h1 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">캐릭터 & 스킬 일람</h1>
          </div>
          <p className="text-xs text-slate-400">카드를 클릭하면 스탯·기능·숙련·스킬·패시브 전체를 확인할 수 있습니다.</p>
        </div>

        {!loading && !error && (
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="별명, 이름, 종족, 소속으로 검색"
            className="w-full bg-white/85 border border-slate-200 rounded-xl px-4 py-2.5 text-sm placeholder:text-slate-400 focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 outline-none"
          />
        )}

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 rounded-full border-2 border-violet-300 border-t-violet-600 animate-spin" />
            <span className="ml-3 text-sm text-slate-400">불러오는 중…</span>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
        )}

        {!loading && !error && (
          <div className="space-y-3">
            {filtered.length === 0
              ? <p className="text-center text-sm text-slate-400 py-8">검색 결과가 없습니다.</p>
              : filtered.map(char => (
                <CharacterCard
                  key={char.alias}
                  char={char}
                  skillCount={(skillsByChar[char.alias] || []).length}
                  passiveCount={(data?.passives || []).filter(p =>
                    p.ownerType === 'global' || (p.ownerType === 'character' && p.owner === char.alias)
                  ).length}
                  itemCount={(data?.inventory || []).filter(i => i.owner === char.alias).length}
                  equipCount={(data?.equipment || []).filter(e => e.owner === char.alias).length}
                  onClick={() => setSelected(char.alias)}
                />
              ))
            }
          </div>
        )}

        {!loading && !error && data && (
          <p className="text-center text-[11px] text-slate-300">
            캐릭터 {data.characters.length}명 · 스킬 {data.skills.length}개 · 패시브 {data.passives.length}개
          </p>
        )}
      </main>

      {selectedChar && (
        <CharacterModal
          char={selectedChar}
          skills={data?.skills || []}
          passives={data?.passives || []}
          inventory={data?.inventory || []}
          equipment={data?.equipment || []}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
