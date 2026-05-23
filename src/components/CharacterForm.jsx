export default function CharacterForm({ char, onChange }) {
  const field = (key) => (e) => onChange({ ...char, [key]: e.target.value });

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <h2 className="text-lg font-bold text-yellow-400">캐릭터 기본 정보</h2>
      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">이름</span>
          <input
            className="bg-gray-700 text-white rounded px-2 py-1 text-sm border border-gray-600 focus:border-yellow-400 outline-none"
            value={char.name} onChange={field('name')} placeholder="캐릭터 이름"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">종족</span>
          <input
            className="bg-gray-700 text-white rounded px-2 py-1 text-sm border border-gray-600 focus:border-yellow-400 outline-none"
            value={char.race} onChange={field('race')} placeholder="종족"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">경험치</span>
          <input
            type="number" min="0"
            className="bg-gray-700 text-white rounded px-2 py-1 text-sm border border-gray-600 focus:border-yellow-400 outline-none"
            value={char.exp} onChange={field('exp')}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">일상점</span>
          <input
            className="bg-gray-700 text-white rounded px-2 py-1 text-sm border border-gray-600 focus:border-yellow-400 outline-none"
            value={char.dailyPoints} onChange={field('dailyPoints')} placeholder="일상점"
          />
        </label>
        <label className="flex flex-col gap-1 col-span-2">
          <span className="text-xs text-gray-400">이면침식</span>
          <input
            className="bg-gray-700 text-white rounded px-2 py-1 text-sm border border-gray-600 focus:border-yellow-400 outline-none"
            value={char.erosion} onChange={field('erosion')} placeholder="이면침식"
          />
        </label>
      </div>
    </div>
  );
}
