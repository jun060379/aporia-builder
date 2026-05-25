export const ADMIN_CATEGORIES = [
  { key: 'all',             label: '전체',     type: null },
  { key: 'character_data',  label: '캐릭터',   type: 'character_data' },
  { key: 'enemy_template',  label: '적',       type: 'enemy_template' },
  { key: 'enemy_skill',     label: '적 스킬',  type: 'enemy_skill' },
];

export default function AdminCategoryTabs({ value, onChange, counts }) {
  return (
    <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1">
      {ADMIN_CATEGORIES.map((c) => {
        const active = value === c.key;
        const n = counts?.[c.key];
        return (
          <button
            key={c.key}
            type="button"
            onClick={() => onChange(c.key)}
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium border transition ${
              active
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent shadow-sm shadow-violet-200'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span>{c.label}</span>
            {typeof n === 'number' && (
              <span
                className={`rounded-full px-1.5 text-[10px] ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {n}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
