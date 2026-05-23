import { useState } from 'react';
import { defaultStats, STAT_NAMES, getStatValue } from './data/stats';
import { defaultAbilities } from './data/abilities';
import { defaultProficiencies } from './data/proficiencies';
import { getLevelInfo } from './data/levels';

import CharacterForm from './components/CharacterForm';
import StatEditor from './components/StatEditor';
import AbilityEditor from './components/AbilityEditor';
import ProficiencyEditor from './components/ProficiencyEditor';
import BudgetSummary from './components/BudgetSummary';
import ActionTable from './components/ActionTable';
import ActionDetail from './components/ActionDetail';
import SkillMaker from './components/SkillMaker';
import SkillList from './components/SkillList';
import ApplicationText from './components/ApplicationText';

const TABS_LEFT  = ['캐릭터', '기능/숙련', '스킬'];
const TABS_RIGHT = ['요약', '액션표', '신청텍스트'];

function TabBar({ tabs, active, onChange, variant = 'warm' }) {
  const activeClass = variant === 'warm'
    ? 'bg-amber-400/15 text-amber-200 border border-amber-400/25'
    : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/25';

  return (
    <div className="flex gap-1 bg-slate-900/60 backdrop-blur-sm rounded-xl p-1 border border-white/8">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
            active === tab ? activeClass : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function CharacterSummary({ char, stats }) {
  const levelInfo = getLevelInfo(char.exp);
  return (
    <div className="bg-slate-900/70 backdrop-blur-sm rounded-2xl border border-white/10 p-5 shadow-xl shadow-black/30">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] text-slate-600 font-mono tracking-widest">—</span>
        <h2 className="text-sm font-semibold text-slate-300 tracking-wide uppercase">캐릭터 요약</h2>
      </div>

      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm mb-4">
        <span className="text-slate-500">이름</span>
        <span className="text-slate-100 font-semibold">{char.name || '—'}</span>
        <span className="text-slate-500">종족</span>
        <span className="text-slate-200">{char.race || '—'}</span>
        <span className="text-slate-500">경험치</span>
        <span className="text-slate-200">{char.exp}</span>
        <span className="text-slate-500">레벨</span>
        <span className="text-amber-300 font-bold">Lv.{levelInfo.level}</span>
        <span className="text-slate-500">성장예산</span>
        <span className="text-slate-200">{levelInfo.budget}</span>
      </div>

      <div className="border-t border-white/8 pt-3">
        <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-2">스탯</p>
        <div className="grid grid-cols-5 gap-1.5">
          {STAT_NAMES.map(s => (
            <div key={s} className="text-center bg-slate-800/50 rounded-lg py-1.5">
              <div className="text-[10px] text-slate-500 mb-0.5">{s}</div>
              <div className="text-sm font-bold text-amber-300">{stats[s]}</div>
              <div className="text-[10px] text-slate-500">{getStatValue(stats[s])}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [char, setChar] = useState({ name: '', race: '', exp: '0', dailyPoints: '', erosion: '' });
  const [stats, setStats] = useState(defaultStats());
  const [abilities, setAbilities] = useState(defaultAbilities());
  const [proficiencies, setProficiencies] = useState(defaultProficiencies());
  const [skills, setSkills] = useState([]);
  const [editingSkill, setEditingSkill] = useState(null);

  const [leftTab, setLeftTab]   = useState('캐릭터');
  const [rightTab, setRightTab] = useState('요약');

  const handleSaveSkill = (skill) => {
    if (editingSkill) {
      setSkills(prev => prev.map(s => s.id === skill.id ? skill : s));
      setEditingSkill(null);
    } else {
      setSkills(prev => [...prev, { ...skill, id: Date.now() }]);
    }
  };

  const handleEditSkill = (skill) => {
    setEditingSkill(skill);
    setLeftTab('스킬');
  };

  const handleRemoveSkill = (id) => {
    setSkills(prev => prev.filter(s => s.id !== id));
  };

  const handleCancelEdit = () => {
    setEditingSkill(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 text-slate-100">

      {/* ── 헤더 ── */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
          <div>
            <div className="flex items-baseline gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-amber-200">APORIA</h1>
              <span className="text-slate-400 text-base font-light tracking-widest">BUILDER</span>
            </div>
            <p className="text-[11px] text-slate-500 tracking-widest mt-0.5">Everyday / Unreality Character Sheet</p>
          </div>
          <p className="text-xs text-slate-600 italic hidden sm:block">
            돌아갈 일상이 있기에, 이면은 더욱 선명해진다.
          </p>
        </div>
      </header>

      <div className="flex flex-col xl:flex-row gap-3 xl:gap-6 p-3 xl:p-6 max-w-7xl mx-auto">

        {/* ── 왼쪽 패널 (일상 기록지) ── */}
        <div className="w-full xl:w-[440px] xl:shrink-0 space-y-3">
          <TabBar tabs={TABS_LEFT} active={leftTab} onChange={setLeftTab} variant="warm" />

          {leftTab === '캐릭터' && (
            <div className="space-y-3">
              <CharacterForm char={char} onChange={setChar} />
              <StatEditor stats={stats} onChange={setStats} />
              <BudgetSummary
                char={char} stats={stats}
                abilities={abilities} proficiencies={proficiencies} skills={skills}
              />
            </div>
          )}

          {leftTab === '기능/숙련' && (
            <div className="space-y-3">
              <BudgetSummary
                char={char} stats={stats}
                abilities={abilities} proficiencies={proficiencies} skills={skills}
              />
              <AbilityEditor abilities={abilities} onChange={setAbilities} />
              <ProficiencyEditor proficiencies={proficiencies} onChange={setProficiencies} />
            </div>
          )}

          {leftTab === '스킬' && (
            <div className="space-y-3">
              <BudgetSummary
                char={char} stats={stats}
                abilities={abilities} proficiencies={proficiencies} skills={skills}
              />
              <SkillMaker
                editingSkill={editingSkill}
                stats={stats}
                onSave={handleSaveSkill}
                onCancel={handleCancelEdit}
              />
              <SkillList
                skills={skills}
                onEdit={handleEditSkill}
                onRemove={handleRemoveSkill}
              />
            </div>
          )}
        </div>

        {/* ── 오른쪽 패널 (이면 관측 패널) ── */}
        <div className="flex-1 min-w-0 space-y-3 xl:sticky xl:top-20 xl:self-start xl:max-h-[calc(100vh-5rem)] xl:overflow-y-auto xl:pb-4">
          <TabBar tabs={TABS_RIGHT} active={rightTab} onChange={setRightTab} variant="cool" />

          {rightTab === '요약' && (
            <div className="space-y-3">
              <CharacterSummary char={char} stats={stats} />
              <ActionDetail stats={stats} abilities={abilities} proficiencies={proficiencies} />
            </div>
          )}

          {rightTab === '액션표' && (
            <ActionTable stats={stats} abilities={abilities} proficiencies={proficiencies} />
          )}

          {rightTab === '신청텍스트' && (
            <ApplicationText
              char={char} stats={stats}
              abilities={abilities} proficiencies={proficiencies}
              skills={skills}
            />
          )}
        </div>
      </div>
    </div>
  );
}
