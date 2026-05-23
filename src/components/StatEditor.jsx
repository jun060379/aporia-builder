import { STAT_NAMES, STAT_GRADES, getStatCost, getStatValue } from '../data/stats';

export default function StatEditor({ stats, onChange }) {
  const grades = STAT_GRADES.map(g => g.grade);

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <h2 className="text-lg font-bold text-yellow-400">스탯</h2>
      <div className="space-y-2">
        {STAT_NAMES.map(name => (
          <div key={name} className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-300 w-10 shrink-0">{name}</span>
            <div className="flex gap-1 flex-wrap flex-1">
              {grades.map(g => (
                <button
                  key={g}
                  onClick={() => onChange({ ...stats, [name]: g })}
                  className={`px-2 py-0.5 rounded text-xs font-bold border transition-colors ${
                    stats[name] === g
                      ? 'bg-yellow-500 text-gray-900 border-yellow-400'
                      : 'bg-gray-700 text-gray-300 border-gray-600 hover:border-yellow-500'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            <span className="text-xs text-gray-500 shrink-0 w-20 text-right">
              값:{getStatValue(stats[name])} / 비용:{getStatCost(stats[name])}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
