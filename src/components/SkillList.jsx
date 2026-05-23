import { getRankValue } from '../data/skillRanks';

export default function SkillList({ skills, onEdit, onRemove }) {
  if (skills.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <h2 className="text-lg font-bold text-yellow-400 mb-2">등록된 스킬</h2>
        <p className="text-gray-500 text-sm">아직 등록된 스킬이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <h2 className="text-lg font-bold text-yellow-400">등록된 스킬</h2>
      <div className="space-y-2">
        {skills.map(sk => (
          <div key={sk.id} className="bg-gray-700 rounded p-2 text-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-white font-semibold">{sk.name || '(이름 없음)'}</span>
                <span className="text-gray-400 ml-2 text-xs">
                  [{sk.tradition}·{sk.series}·{sk.rank}] 비용:{getRankValue(sk.rank)}
                </span>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => onEdit(sk)}
                  className="text-xs px-2 py-0.5 bg-blue-700 hover:bg-blue-600 rounded text-white"
                >편집</button>
                <button
                  onClick={() => onRemove(sk.id)}
                  className="text-xs px-2 py-0.5 bg-red-800 hover:bg-red-700 rounded text-white"
                >삭제</button>
              </div>
            </div>
            {sk.formula && (
              <div className="text-gray-400 text-xs mt-1 truncate">계산식: {sk.formula}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
