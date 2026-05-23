import { calcAllActions, getDifficultyLabel } from '../utils/calcAction';

export default function ActionTable({ stats, abilities, proficiencies }) {
  const actions = calcAllActions(stats, abilities, proficiencies);
  const damage = actions.filter(a => a.isDamage);
  const other  = actions.filter(a => !a.isDamage);

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <h2 className="text-lg font-bold text-yellow-400">액션 계산</h2>

      <Section title="⚔ 피해 액션" actions={damage} />
      <Section title="🛡 비피해 액션" actions={other} />
    </div>
  );
}

function Section({ title, actions }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-400 mb-2">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs border-b border-gray-700">
              <th className="text-left py-1 pr-2">액션</th>
              <th className="text-right py-1 pr-2">d6</th>
              <th className="text-right py-1 pr-2">기대값</th>
              <th className="text-right py-1">난이도</th>
            </tr>
          </thead>
          <tbody>
            {actions.map(a => {
              const { diceCount, expected } = a.result;
              const diff = getDifficultyLabel(expected);
              return (
                <tr key={a.name} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                  <td className="py-1 pr-2 text-white font-medium">{a.name}</td>
                  <td className="py-1 pr-2 text-right text-gray-300">{diceCount}d6</td>
                  <td className="py-1 pr-2 text-right text-gray-300">{expected.toFixed(1)}</td>
                  <td className={`py-1 text-right font-semibold ${diff.color}`}>{diff.label}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
