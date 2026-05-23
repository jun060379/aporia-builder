import { getRankValue } from '../data/skillRanks';

export default function SkillList({ skills, onEdit, onRemove }) {
  if (skills.length === 0) {
    return (
      <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-lg shadow-violet-100/20 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] text-violet-300 font-mono tracking-widest">—</span>
          <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">등록된 스킬</h2>
        </div>
        <p className="text-slate-400 text-sm italic">아직 등록된 스킬이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-lg shadow-violet-100/20 p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] text-violet-300 font-mono tracking-widest">—</span>
        <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">등록된 스킬</h2>
        <span className="ml-auto text-[11px] text-slate-400 font-mono">{skills.length}개</span>
      </div>
      <div className="space-y-2">
        {skills.map(sk => (
          <div key={sk.id} className="bg-slate-50 rounded-xl border border-slate-100 p-3 hover:border-violet-100 hover:bg-violet-50/30 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="text-slate-900 font-semibold text-sm">{sk.name || '(이름 없음)'}</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className="text-[11px] text-violet-700 bg-violet-50 border border-violet-200 rounded px-1.5 py-0.5">{sk.tradition}</span>
                  <span className="text-[11px] text-slate-500 bg-white border border-slate-200 rounded px-1.5 py-0.5">{sk.series}</span>
                  <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">{sk.rank}</span>
                  <span className="text-[11px] text-slate-400 font-mono">비용 {getRankValue(sk.rank)}pt</span>
                </div>
                {sk.formula && (
                  <p className="text-[11px] text-slate-400 font-mono mt-1.5 truncate">= {sk.formula}</p>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => onEdit(sk)}
                  className="text-xs px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-lg transition-colors"
                >편집</button>
                <button
                  onClick={() => onRemove(sk.id)}
                  className="text-xs px-2.5 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-lg transition-colors"
                >삭제</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
