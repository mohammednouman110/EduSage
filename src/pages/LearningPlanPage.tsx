import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Clock, 
  Play, 
  Bot, 
  Check
} from 'lucide-react';

export const LearningPlanPage: React.FC = () => {
  const { 
    user, 
    modules, 
    setCurrentModuleId, 
    setActiveView, 
    setIsAiModalOpen
  } = useApp();

  const completedCount = modules.filter((m) => m.status === 'completed').length;
  const inProgressCount = modules.filter((m) => m.status === 'in-progress').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 uppercase tracking-wider">
                PH-10 Adaptive Modules
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Goal: <strong className="text-slate-800">{user?.targetCareerTitle || 'Data Scientist'}</strong>
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Personalized Learning Pathway
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Sequenced curriculum designed to eliminate your critical skill gaps in probability, data structures, SQL window functions, and ML systems.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-center min-w-24">
              <div className="text-xl font-bold text-slate-800">{completedCount} / {modules.length}</div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Completed</div>
            </div>

            <button
              onClick={() => setIsAiModalOpen(true)}
              className="px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-colors"
            >
              <Bot className="w-4 h-4 text-white" />
              <span>Ask Tutor: "Explain Next Topic"</span>
            </button>
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-4">
          {modules.map((mod, index) => {
            const isCompleted = mod.status === 'completed';
            const isInProgress = mod.status === 'in-progress';

            return (
              <div
                key={mod.id}
                className={`bg-white rounded-xl border p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:border-slate-300 ${
                  isInProgress ? 'border-blue-500' : isCompleted ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : isInProgress
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : `0${index + 1}`}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isInProgress
                            ? 'bg-blue-100 text-blue-800 font-bold'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {mod.status.replace('-', ' ')}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" /> {mod.estimatedMinutes} Mins
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-slate-800">
                      {mod.title}
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                      {mod.summary}
                    </p>

                    {/* Objectives Chips */}
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {mod.objectives.map((obj, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                        >
                          ✓ {obj}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                  <button
                    onClick={() => {
                      setCurrentModuleId(mod.id);
                      setActiveView('module-detail');
                    }}
                    className={`w-full md:w-auto px-5 py-2.5 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                      isInProgress
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                        : isCompleted
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{isCompleted ? 'Review Lesson' : isInProgress ? 'Resume Module' : 'Start Module'}</span>
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
