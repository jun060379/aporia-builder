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

function TabBar({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`flex-1 py-1.5 rounded text-sm font-medium transition-colors ${
            active === tab
              ? 'bg-yellow-500 text-gray-900'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
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
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <h2 className="text-lg font-bold text-yellow-400">캐릭터 요약</h2>
      <div className="grid grid-cols-2 gap-1 text-sm">
        <span className="text-gray-400">이름</span>
        <span className="text-white font-semibold">{char.name || '—'}</span>
        <span className="text-gray-400">종족</span>
        <span className="text-white">{char.race || '—'}</span>
        <span className="text-gray-400">경험치</span>
        <span className="text-white">{char.exp}</span>
        <span className="text-gray-400">레벨</span>
        <span className="text-yellow-400 font-bold">Lv.{levelInfo.level}</span>
        <span className="text-gray-400">성장예산</span>
        <span className="text-white">{levelInfo.budget}</span>
      </div>
      <div className="border-t border-gray-700 pt-2">
        <p className="text-xs text-gray-400 mb-2">스탯</p>
        <div className="grid grid-cols-5 gap-1">
          {STAT_NAMES.map(s => (
            <div key={s} className="text-center">
              <div className="text-xs text-gray-500">{s}</div>
              <div className="text-sm font-bold text-yellow-400">{stats[s]}</div>
              <div className="text-xs text-gray-400">{getStatValue(stats[s])}</div>
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
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-yellow-400">⚔ Aporia 캐릭터 빌더</h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 p-2 lg:p-4 max-w-7xl mx-auto">

        {/* ── 왼쪽 패널 ── */}
        <div className="w-full lg:w-[420px] lg:shrink-0 space-y-2">
          <TabBar tabs={TABS_LEFT} active={leftTab} onChange={setLeftTab} />

          {leftTab === '캐릭터' && (
            <div className="space-y-2">
              <CharacterForm char={char} onChange={setChar} />
              <StatEditor stats={stats} onChange={setStats} />
              <BudgetSummary
                char={char} stats={stats}
                abilities={abilities} proficiencies={proficiencies} skills={skills}
              />
            </div>
          )}

          {leftTab === '기능/숙련' && (
            <div className="space-y-2">
              <BudgetSummary
                char={char} stats={stats}
                abilities={abilities} proficiencies={proficiencies} skills={skills}
              />
              <AbilityEditor abilities={abilities} onChange={setAbilities} />
              <ProficiencyEditor proficiencies={proficiencies} onChange={setProficiencies} />
            </div>
          )}

          {leftTab === '스킬' && (
            <div className="space-y-2">
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

        {/* ── 오른쪽 패널 ── */}
        <div className="flex-1 min-w-0 space-y-2">
          <TabBar tabs={TABS_RIGHT} active={rightTab} onChange={setRightTab} />

          {rightTab === '요약' && (
            <div className="space-y-2">
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
