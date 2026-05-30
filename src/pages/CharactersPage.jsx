import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const RANK_ORDER = ['F','E','D','C','B','A','S','U','EX'];
const RANK_COLOR = {
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
const SERIES_COLOR = {
  화력:'bg-rose-50 text-rose-600', 방호:'bg-sky-50 text-sky-600',
  치유:'bg-emerald-50 text-emerald-600', 재생:'bg-teal-50 text-teal-600',
  간섭:'bg-purple-50 text-purple-600', 강화:'bg-amber-50 text-amber-600',
  특수:'bg-slate-100 text-slate-600',
};

function SkillBadge({ text, cls }) {
  return <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${cls}`}>{text}</span>;
}

function CharacterCard({ char, skills }) {
  const [open, setOpen] = useState(false);
  const sorted = [...skills].sort((a, b) => RANK_ORDER.indexOf(b.rank) - RANK_ORDER.indexOf(a.rank));

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-indigo-100/70 shadow-sm shadow-violet-100/20 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50/60 transition text-left"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-800">{char.alias}</span>
            {char.name && char.name !== char.alias && (
              <span className="text-xs text-slate-400">({char.name})</span>
            )}
            <span className="text-[11px] px-1.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded font-medium">
              Lv.{char.level || '?'}
            </span>
          </div>
          <div className="flex gap-2 mt-0.5 flex-wrap">
            {char.race && <span className="text-[11px] text-slate-400">{char.race}</span>}
            {char.faction && <span className="text-[11px] text-slate-400">· {char.faction}</span>}
            <span className="text-[11px] text-slate-300">스킬 {skills.length}개</span>
          </div>
        </div>
        <span className="text-slate-300 shrink-0">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="border-t border-slate-100 px-5 py-4 space-y-2">
          {sorted.length === 0 ? (
            <p className="text-xs text-slate-400 italic">등록된 스킬이 없습니다.</p>
          ) : sorted.map((sk, i) => (
            <div key={i} className="flex items-start gap-2 py-1.5 border-b border-slate-50 last:border-0">
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-slate-700">{sk.name}</span>
                {sk.description && (
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{sk.description}</p>
                )}
              </div>
              <div className="flex gap-1 shrink-0 flex-wrap justify-end">
                <SkillBadge text={sk.rank} cls={RANK_COLOR[sk.rank] || RANK_COLOR.F} />
                <SkillBadge text={sk.series} cls={`border ${SERIES_COLOR[sk.series] || 'bg-slate-50 text-slate-500 border-slate-200'}`} />
                {sk.tradition && (
                  <SkillBadge text={sk.tradition} cls="bg-slate-50 text-slate-400 border-slate-200" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CharactersPage() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/game-data')
      .then(r => r.json())
      .then(d => {
        if (d.ok) setData(d);
        else setError(d.error || '데이터 조회 실패');
      })
      .catch(e => setError(e.message || '네트워크 오류'))
      .finally(() => setLoading(false));
  }, []);

  const skillsByChar = {};
  (data?.skills || []).forEach(sk => {
    if (!skillsByChar[sk.owner]) skillsByChar[sk.owner] = [];
    skillsByChar[sk.owner].push(sk);
  });

  const filtered = (data?.characters || []).filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.alias.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.faction.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-violet-50/40 text-slate-800 relative overflow-hidden">
      <div aria-hidden className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-200/50 rounded-full blur-3xl" />
      </div>

      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-20 shadow-sm shadow-slate-100/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-baseline gap-2 group">
            <span className="bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-xl font-bold text-transparent">APORIA</span>
            <span className="text-slate-400 text-[13px] font-light tracking-widest">CHARACTERS</span>
          </Link>
          <Link to="/" className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98] transition">
            홈
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-indigo-100/70 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-violet-300 font-mono tracking-widest">—</span>
            <h1 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">캐릭터 & 스킬 일람</h1>
          </div>
          <p className="text-xs text-slate-400">등록된 캐릭터와 보유 스킬 목록입니다. 카드를 클릭하면 스킬을 확인할 수 있습니다.</p>
        </div>

        {!loading && !error && (
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="별명, 이름, 소속으로 검색"
            className="w-full bg-white/85 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 outline-none"
          />
        )}

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 rounded-full border-2 border-violet-300 border-t-violet-600 animate-spin" />
            <span className="ml-3 text-sm text-slate-400">데이터 불러오는 중…</span>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-8">검색 결과가 없습니다.</p>
            ) : filtered.map(char => (
              <CharacterCard
                key={char.alias}
                char={char}
                skills={skillsByChar[char.alias] || []}
              />
            ))}
          </div>
        )}

        {!loading && !error && data && (
          <p className="text-center text-[11px] text-slate-300">
            캐릭터 {data.characters.length}명 · 스킬 {data.skills.length}개
          </p>
        )}
      </main>
    </div>
  );
}
