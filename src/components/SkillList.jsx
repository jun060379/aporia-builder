import { getRankValue } from '../data/skillRanks';

export default function SkillList({ skills, onEdit, onRemove }) {
  if (skills.length === 0) {
    return (
      <div className="bg-slate-900/70 backdrop-blur-sm rounded-2xl border border-white/10 p-5 shadow-xl shadow-black/30">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] text-slate-600 font-mono tracking-widest">—</span>
          <h2 className="text-sm font-semibold text-slate-300 tracking-wide uppercase">등록된 스킬</h2>
        </div>
        <p className="text-slate-600 text-sm italic">아직 등록된 스킬이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/70 backdrop-blur-sm rounded-2xl border border-white/10 p-5 shadow-xl shadow-black/30">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] text-slate-600 font-mono tracking-widest">—</span>
        <h2 className="text-sm font-semibold text-slate-300 tracking-wide uppercase">등록된 스킬</h2>
        <span className="ml-auto text-[11px] text-slate-500 font-mono">{skills.length}개</span>
      </div>
      <div className="space-y-2">
        {skills.map(sk => (
          <div key={sk.id} className="bg-slate-800/50 rounded-xl border border-white/8 p-3 hover:border-white/12 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="text-slate-100 font-semibold text-sm">{sk.name || '(이름 없음)'}</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className="text-[11px] text-violet-300/70 bg-violet-900/20 border border-violet-800/30 rounded px-1.5 py-0.5">{sk.tradition}</span>
                  <span className="text-[11px] text-slate-400 bg-slate-800/60 border border-slate-700/40 rounded px-1.5 py-0.5">{sk.series}</span>
                  <span className="text-[11px] text-amber-300/70 bg-amber-900/20 border border-amber-800/30 rounded px-1.5 py-0.5">{sk.rank}</span>
                  <span className="text-[11px] text-slate-500 font-mono">비용 {getRankValue(sk.rank)}pt</span>
                </div>
                {sk.formula && (
                  <p className="text-[11px] text-slate-500 font-mono mt-1.5 truncate">= {sk.formula}</p>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => onEdit(sk)}
                  className="text-xs px-2.5 py-1 bg-cyan-900/40 hover:bg-cyan-800/50 border border-cyan-800/40 text-cyan-300 rounded-lg transition-colors"
                >편집</button>
                <button
                  onClick={() => onRemove(sk.id)}
                  className="text-xs px-2.5 py-1 bg-rose-900/30 hover:bg-rose-800/40 border border-rose-800/30 text-rose-300 rounded-lg transition-colors"
                >삭제</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
