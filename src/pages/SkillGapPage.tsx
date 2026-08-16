import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Filter, 
  Bot, 
  BookOpen
} from 'lucide-react';

export const SkillGapPage: React.FC = () => {
  const { 
    user, 
    skills, 
    criticalGaps, 
    setActiveView, 
    setCurrentModuleId, 
    modules, 
    setIsAiModalOpen 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const categories = ['all', 'Technical', 'Analytical', 'Domain Knowledge', 'Soft Skills', 'Tooling'];

  const filteredSkills = skills.filter((s) => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus;
    return matchesCat && matchesStatus;
  });

  const developingSkills = skills.filter((s) => s.status === 'developing');
  const masteredSkills = skills.filter((s) => s.status === 'mastered');

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 uppercase tracking-wider">
                PH-12 Intelligence
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Benchmark: <strong className="text-slate-800">{user?.targetCareerTitle || 'Data Scientist'}</strong>
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Skill Gap Matrix & Competency Benchmark
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              We analyze your demonstrated skill proficiencies against hiring benchmarks for your target role to calculate exactly what is missing and construct your learning roadmap.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-colors"
            >
              <Bot className="w-4 h-4 text-white" />
              <span>Ask Tutor: "Why do I have gaps?"</span>
            </button>
          </div>
        </div>

        {/* 3 Summary Buckets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Critical Gaps</span>
              <AlertTriangle className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{criticalGaps.length} Skills</div>
            <p className="text-xs text-orange-600 font-medium">Deficit &gt; 25% compared to job requirements</p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Developing</span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{developingSkills.length} Skills</div>
            <p className="text-xs text-blue-600 font-medium">Moderate proficiency, needs project practice</p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Mastered</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{masteredSkills.length} Skills</div>
            <p className="text-xs text-emerald-600 font-medium">Meets or exceeds industry requirements</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5 shrink-0">
              <Filter className="w-3.5 h-3.5 text-blue-600" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium capitalize transition-colors shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-700">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 text-slate-800 rounded-lg px-3 py-1.5 border border-slate-200 font-medium focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="critical-gap">Critical Gaps Only</option>
              <option value="developing">Developing</option>
              <option value="mastered">Mastered</option>
            </select>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSkills.map((skill) => {
            const delta = skill.targetLevel - skill.currentLevel;
            const isCritical = skill.status === 'critical-gap';
            const isMastered = skill.status === 'mastered';

            return (
              <div
                key={skill.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {skill.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-800">{skill.name}</h3>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        isCritical
                          ? 'bg-orange-100 text-orange-800'
                          : isMastered
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {skill.status.replace('-', ' ')}
                    </span>
                  </div>

                  {/* Visual Comparison Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium text-slate-600">
                      <span>Assessed: <strong className="text-slate-800">{skill.currentLevel}%</strong></span>
                      <span>Target: <strong className="text-slate-800">{skill.targetLevel}%</strong></span>
                    </div>

                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
                      {/* Target Marker */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-slate-700 z-10"
                        style={{ left: `${skill.targetLevel}%` }}
                        title={`Target: ${skill.targetLevel}%`}
                      />
                      {/* Current Level Fill */}
                      <div
                        className={`h-full rounded-full transition-all ${
                          isCritical ? 'bg-orange-500' : isMastered ? 'bg-emerald-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${skill.currentLevel}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Priority: <strong className="capitalize text-slate-700">{skill.priority}</strong></span>
                      <span className={delta > 0 ? 'text-orange-600 font-semibold' : 'text-emerald-600 font-semibold'}>
                        {delta > 0 ? `Gap: -${delta}%` : 'Target Met ✓'}
                      </span>
                    </div>
                  </div>

                  {/* Prioritized Action Recommendations */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                      Prioritized Remediation Actions:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {skill.recommendedActions.map((act, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-blue-600 font-bold">›</span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      const mod = modules.find((m) => m.skillTarget?.toLowerCase().includes(skill.name.toLowerCase())) || modules[0];
                      if (mod) {
                        setCurrentModuleId(mod.id);
                        setActiveView('module-detail');
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Practice Related Module</span>
                  </button>

                  <button
                    onClick={() => setIsAiModalOpen(true)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Ask AI Tutor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
