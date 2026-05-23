import { calcAllActions, getDifficultyLabel } from '../utils/calcAction';

export default function ActionDetail({ stats, abilities, proficiencies }) {
  const actions = calcAllActions(stats, abilities, proficiencies);

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <h2 className="text-lg font-bold text-yellow-400">액션 상세</h2>
      <div className="grid grid-cols-1 gap-2">
        {actions.map(a => {
          const { base, multiplier, finalCoef, diceCount, expected } = a.result;
          const diff = getDifficultyLabel(expected);
          return (
            <div key={a.name} className="bg-gray-700/50 rounded p-2 text-xs space-y-0.5">
              <div className="flex justify-between items-center">
                <span className={`font-bold text-sm ${a.isDamage ? 'text-red-300' : 'text-blue-300'}`}>
                  {a.name}
                </span>
                <span className={`font-semibold ${diff.color}`}>{diff.label}</span>
              </div>
              <div className="text-gray-400 space-x-2">
                <span>기초:{base.toFixed(1)}</span>
                <span>배율:×{multiplier.toFixed(2)}</span>
                <span>계수:{finalCoef.toFixed(1)}</span>
                <span className="text-yellow-300 font-semibold">{diceCount}d6 → {expected.toFixed(1)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
