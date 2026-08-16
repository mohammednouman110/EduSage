import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  FolderGit2, 
  MessageSquare, 
  Target, 
  Bot,
  Sparkles,
  RefreshCw,
  X,
  ChevronRight,
  ArrowRight,
  Compass
} from 'lucide-react';
import { CareerRoadmap } from '../types';

export const CareerRoadmapPage: React.FC = () => {
  const { 
    user, 
    activeCareerRoadmap, 
    setActiveView, 
    setIsAiModalOpen,
    toggleMilestone,
    generateRoadmap,
    isLoading
  } = useApp();

  const [isSwitchCareerOpen, setIsSwitchCareerOpen] = useState(false);
  const [selectedCareerTitle, setSelectedCareerTitle] = useState(user?.targetCareerTitle || 'Data Scientist');
  const [selectedExperience, setSelectedExperience] = useState(user?.experienceLevel || 'beginner');
  const [isGenerating, setIsGenerating] = useState(false);

  const defaultRoadmap: CareerRoadmap = {
    careerId: 'cp-ds',
    careerTitle: user?.targetCareerTitle || 'Data Scientist',
    readinessScore: {
      technicalSkills: 35,
      problemSolving: 40,
      projects: 15,
      communication: 40,
      portfolio: 10,
      overall: 32
    },
    phases: [
      {
        phaseNumber: 1,
        title: 'Core Fundamentals & Baseline Calibration',
        durationWeeks: '4 Weeks',
        status: 'in-progress',
        description: 'Establish foundational proficiency and complete diagnostic gap exercises.',
        milestones: [
          { id: 'm1', title: 'Diagnostic Gap Assessment I', type: 'course', completed: false, skillsAwarded: ['Fundamentals'] },
          { id: 'm2', title: 'Interactive Practice Problem Set', type: 'project', completed: false, skillsAwarded: ['Python'] },
        ]
      }
    ],
    capstoneProjects: [
      {
        id: 'proj-1',
        title: 'End-to-End Analytics Pipeline',
        description: 'Build a production dataset transformation and analysis platform.',
        difficulty: 'Intermediate',
        skillsTrained: ['Python', 'SQL'],
        deliverables: ['GitHub Repository', 'Live Cloud Demo']
      }
    ],
    interviewPrepTopics: [
      'Core Programming Concepts',
      'Data Structure & Query Optimization',
      'System Architecture Tradeoffs'
    ]
  };

  const roadmap = activeCareerRoadmap || defaultRoadmap;

  const handleToggleMilestone = async (id: string) => {
    await toggleMilestone(id);
  };

  const handleGenerateNewRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      await generateRoadmap(selectedCareerTitle, selectedExperience);
      setIsSwitchCareerOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const popularCareers = [
    { title: 'AI Full Stack Engineer', desc: 'LLM orchestration, FastAPI backends, vector search & modern React' },
    { title: 'Data Scientist', desc: 'Predictive modeling, inferential statistics, ML algorithms & storytelling' },
    { title: 'Business Data Analyst', desc: 'Relational SQL, KPI modeling, BI dashboards & data transformation' },
    { title: 'Cloud & MLOps Engineer', desc: 'Docker/Kubernetes orchestration, CI/CD automation & model governance' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 uppercase tracking-wider">
                EduSage Career Roadmap
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Active Goal: <strong className="text-slate-800">{roadmap.careerTitle}</strong>
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium capitalize">
                {user?.experienceLevel || 'Beginner'} Track
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Personalized Career Development Pathway
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Real-time milestone progression based on your diagnostic results and learning pace. Click milestones to track completion.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setIsSwitchCareerOpen(true)}
              className="px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Customize / Switch Goal</span>
            </button>
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Bot className="w-4 h-4 text-white" />
              <span>Ask AI Coach</span>
            </button>
          </div>
        </div>

        {/* Readiness Dashboard */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                Target Role Readiness Score
              </span>
              <span className="text-xs text-slate-400">
                Calculated dynamically from validated skill assessments and milestone completions.
              </span>
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {roadmap.readinessScore.overall}% Ready
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, roadmap.readinessScore.overall)}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <div className="text-lg font-bold text-slate-800">{roadmap.readinessScore.technicalSkills}%</div>
              <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Technical</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <div className="text-lg font-bold text-slate-800">{roadmap.readinessScore.problemSolving}%</div>
              <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Problem Solving</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <div className="text-lg font-bold text-slate-800">{roadmap.readinessScore.projects}%</div>
              <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Projects</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <div className="text-lg font-bold text-slate-800">{roadmap.readinessScore.portfolio}%</div>
              <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Portfolio</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <div className="text-lg font-bold text-slate-800">{roadmap.readinessScore.communication}%</div>
              <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Communication</div>
            </div>
          </div>
        </div>

        {/* Execution Phases */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-600" />
              <span>Phased Milestone Roadmap</span>
            </h2>
            <span className="text-xs text-slate-500">
              Check off completed milestones to update your progress in real-time
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roadmap.phases.map((phase, idx) => {
              const isCurrent = phase.status === 'in-progress';
              const isCompleted = phase.status === 'completed';

              return (
                <div
                  key={idx}
                  className={`bg-white rounded-xl border p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all ${
                    isCurrent ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                        PHASE {phase.phaseNumber} • {phase.durationWeeks}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isCurrent
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {phase.status.replace('-', ' ')}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-800">{phase.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{phase.description}</p>

                    {/* Milestones List */}
                    <div className="pt-2 space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                        Phase Milestones (Click to toggle):
                      </span>
                      <div className="space-y-1.5">
                        {phase.milestones.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => handleToggleMilestone(m.id)}
                            className={`w-full p-2.5 rounded-lg border text-xs flex items-center justify-between text-left transition-colors cursor-pointer ${
                              m.completed
                                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                                : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 pr-2">
                              <CheckCircle2
                                className={`w-4 h-4 shrink-0 transition-colors ${
                                  m.completed ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300'
                                }`}
                              />
                              <span className={m.completed ? 'line-through text-slate-500 font-medium' : 'text-slate-800 font-medium'}>
                                {m.title}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono capitalize shrink-0">
                              {m.type}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {isCurrent && (
                    <button
                      onClick={() => setActiveView('learning')}
                      className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Continue Phase Modules</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Capstone Projects & Portfolio Artifacts */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <FolderGit2 className="w-4 h-4" /> Portfolio Projects
            </span>
            <h2 className="text-lg font-bold text-slate-800">
              Industry-Grade Capstone Projects for {roadmap.careerTitle}
            </h2>
            <p className="text-xs text-slate-500">
              Publish these public repositories to validate your real-world proficiency to hiring managers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roadmap.capstoneProjects.map((proj) => (
              <div
                key={proj.id}
                className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {proj.difficulty} Level
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      Portfolio Asset
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-800">{proj.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {proj.deliverables.map((d, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-medium"
                      >
                        📦 {d}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setIsAiModalOpen(true)}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Ask AI for starter architecture & code templates</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Preparation Topics */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <span>Job Interview Preparation Tracks</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Key technical interview topics tailored for {roadmap.careerTitle} roles.
              </p>
            </div>
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-semibold transition-colors border border-purple-200 cursor-pointer"
            >
              Start AI Mock Interview
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {roadmap.interviewPrepTopics.map((topic, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />
                <span className="truncate">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Switch / Customize Career Roadmap Modal */}
      {isSwitchCareerOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Customize Career Pathway</h3>
              </div>
              <button 
                onClick={() => setIsSwitchCareerOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateNewRoadmap} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select or Enter Target Career Goal
                </label>
                <input
                  type="text"
                  value={selectedCareerTitle}
                  onChange={(e) => setSelectedCareerTitle(e.target.value)}
                  placeholder="e.g. AI Full Stack Engineer, Data Scientist, Cloud Architect"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-500 mb-2">
                  Popular Career Pathways:
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {popularCareers.map((c) => (
                    <button
                      key={c.title}
                      type="button"
                      onClick={() => setSelectedCareerTitle(c.title)}
                      className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                        selectedCareerTitle === c.title
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{c.title}</div>
                        <div className="text-[11px] text-slate-500 font-normal">{c.desc}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Current Experience Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedExperience(lvl)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold capitalize transition-colors ${
                        selectedExperience === lvl
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSwitchCareerOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating Custom Pathway...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate New Roadmap</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
