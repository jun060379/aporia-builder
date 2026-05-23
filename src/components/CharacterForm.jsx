const inputCls = "w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 outline-none placeholder:text-slate-400 transition-colors";

export default function CharacterForm({ char, onChange }) {
  const field = (key) => (e) => onChange({ ...char, [key]: e.target.value });

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-lg shadow-violet-100/20 p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] text-violet-300 font-mono tracking-widest">01</span>
        <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">기본 정보</h2>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">이름</span>
          <input className={inputCls} value={char.name} onChange={field('name')} placeholder="캐릭터 이름" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">종족</span>
          <input className={inputCls} value={char.race} onChange={field('race')} placeholder="종족" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">경험치</span>
          <input type="number" min="0" className={inputCls} value={char.exp} onChange={field('exp')} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">일상점</span>
          <input className={inputCls} value={char.dailyPoints} onChange={field('dailyPoints')} placeholder="—" />
        </label>
        <label className="flex flex-col gap-1 col-span-2">
          <span className="text-[11px] text-slate-500 tracking-wide">이면침식</span>
          <input className={inputCls} value={char.erosion} onChange={field('erosion')} placeholder="—" />
        </label>
      </div>
    </div>
  );
}
