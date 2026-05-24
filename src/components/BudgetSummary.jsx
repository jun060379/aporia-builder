import { getLevelByNumber } from '../data/levels';
import { calcStatCost, calcAbilityCost, calcProficiencyCost, calcSkillsCost } from '../utils/calcBudget';

function MiniCard({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 text-center">
      <p className="text-[10px] text-slate-400 tracking-wide mb-1">{label}</p>
      <p className="text-lg font-bold text-slate-700">{value}</p>
    </div>
  );
}

export default function BudgetSummary({ char, stats, abilities, proficiencies, skills }) {
  const { level, budget } = getLevelByNumber(char.level);
  const statCost  = calcStatCost(stats);
  const ablCost   = calcAbilityCost(abilities);
  const profCost  = calcProficiencyCost(proficiencies);
  const skillCost = calcSkillsCost(skills);
  const used      = statCost + ablCost + profCost + skillCost;
  const remaining = budget - used;
  const overBudget = remaining < 0;

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-lg shadow-violet-100/20 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-violet-300 font-mono tracking-widest">—</span>
          <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">성장예산</h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">Lv.{level} 기준 · {budget}pt</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 mb-3">
        <MiniCard label="스탯" value={statCost} />
        <MiniCard label="기능" value={ablCost} />
        <MiniCard label="숙련" value={profCost} />
        <MiniCard label="스킬" value={skillCost} />
      </div>

      <div className="flex items-center justify-between text-sm border-t border-slate-100 pt-3 mb-3">
        <span className="text-slate-500">사용점수</span>
        <span className="font-semibold text-slate-800 font-mono">{used} / {budget}</span>
      </div>

      <div className={`rounded-xl py-2.5 text-center font-bold text-base border transition-colors ${
        overBudget
          ? 'bg-rose-50 border-rose-200 text-rose-700'
          : 'bg-emerald-50 border-emerald-200 text-emerald-700'
      }`}>
        {overBudget ? `초과 ${Math.abs(remaining)}점` : `남은점수 ${remaining}점`}
      </div>

      {overBudget && (
        <p className="text-xs text-rose-500 text-center mt-2">예산을 초과했습니다.</p>
      )}
    </div>
  );
}
