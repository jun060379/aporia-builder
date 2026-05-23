import { getLevelInfo } from '../data/levels';
import {
  calcStatCost, calcAbilityCost, calcProficiencyCost, calcSkillsCost,
} from '../utils/calcBudget';

export default function BudgetSummary({ char, stats, abilities, proficiencies, skills }) {
  const { level, budget } = getLevelInfo(char.exp);
  const statCost  = calcStatCost(stats);
  const ablCost   = calcAbilityCost(abilities);
  const profCost  = calcProficiencyCost(proficiencies);
  const skillCost = calcSkillsCost(skills);
  const used      = statCost + ablCost + profCost + skillCost;
  const remaining = budget - used;
  const overBudget = remaining < 0;

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-yellow-400">성장예산</h2>
        <span className="text-sm text-gray-400">Lv.{level} | 예산 {budget}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <Row label="스탯 비용" value={statCost} />
        <Row label="기능 비용" value={ablCost} />
        <Row label="숙련 비용" value={profCost} />
        <Row label="스킬 비용" value={skillCost} />
      </div>

      <div className="border-t border-gray-600 pt-2 flex justify-between text-sm font-semibold">
        <span className="text-gray-300">사용점수</span>
        <span className="text-white">{used} / {budget}</span>
      </div>

      <div className={`text-center rounded py-2 font-bold text-lg ${
        overBudget ? 'bg-red-900 text-red-300' : 'bg-gray-700 text-green-400'
      }`}>
        {overBudget ? `초과 ${Math.abs(remaining)}점` : `남은점수: ${remaining}점`}
      </div>

      {overBudget && (
        <p className="text-xs text-red-400 text-center">예산을 초과했습니다!</p>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <>
      <span className="text-gray-400">{label}</span>
      <span className="text-white text-right">{value}</span>
    </>
  );
}
