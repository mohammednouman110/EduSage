import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Target, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Bot, 
  Check, 
  Compass
} from 'lucide-react';
import { CareerPath } from '../types';

export const CareersPage: React.FC = () => {
  const { 
    user, 
    careers, 
    updateUserProfile, 
    setActiveView, 
    setIsAiModalOpen 
  } = useApp();

  const [selectedCareer, setSelectedCareer] = useState<CareerPath>(
    careers.find((c) => c.id === user?.targetCareerId) || careers[0] || {
      id: 'cp-ds',
      title: 'Data Scientist & AI Engineer',
      category: 'Artificial Intelligence & Data',
      description: 'Design machine learning pipelines, statistical inferencing models, and deep learning architectures.',
      matchScore: 92,
      averageSalaryIndia: '₹14 - 32 LPA',
      globalDemandLevel: 'Very High',
      requiredSkills: [
        { name: 'Python & Data Structures', requiredLevel: 85, importance: 'Must-Have' },
        { name: 'Machine Learning Algorithms', requiredLevel: 80, importance: 'Must-Have' },
        { name: 'SQL & Relational Databases', requiredLevel: 75, importance: 'Important' },
        { name: 'Probability & Statistics', requiredLevel: 80, importance: 'Must-Have' }
      ],
      whyMatch: {
        positives: ['Strong foundation in analytical mathematics', 'Demonstrated problem solving ability'],
        gapsToClose: ['Bayesian probability intuition', 'SQL window functions', 'Tree-based ensemble tuning'],
        aiInsight: 'Your computational background accelerates math/ML concepts by 2.4x.'
      },
      sampleRoles: ['Associate Data Scientist', 'ML Engineer', 'Analytics Consultant'],
      topHiringIndustries: ['Fintech', 'HealthTech', 'E-Commerce', 'SaaS']
    }
  );

  const handleSetTargetCareer = (career: CareerPath) => {
    updateUserProfile({
      targetCareerId: career.id,
      targetCareerTitle: career.title
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 uppercase tracking-wider">
                PH-12 Career Recommendations
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Active Goal: <strong className="text-slate-800">{user?.targetCareerTitle || selectedCareer.title}</strong>
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              AI-Recommended Career Pathways
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Transparent, explainable AI career matches calculated from your background, skill levels, and learning pace.
            </p>
          </div>

          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-colors"
          >
            <Bot className="w-4 h-4 text-white" />
            <span>Consult AI Career Advisor</span>
          </button>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Career Paths List */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">
              Ranked Opportunities ({careers.length})
            </h2>

            <div className="space-y-3">
              {careers.map((c) => {
                const isSelected = selectedCareer.id === c.id;
                const isCurrentTarget = user?.targetCareerId === c.id || user?.targetCareerTitle === c.title;

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCareer(c)}
                    className={`p-5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white border-blue-600 shadow-sm ring-1 ring-blue-600'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                          {c.category}
                        </span>
                        <h3 className="text-base font-bold text-slate-800">{c.title}</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                        {c.matchScore}% Match
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                      <span>{c.averageSalaryIndia}</span>
                      <span className="text-emerald-700 font-semibold">{c.globalDemandLevel} Demand</span>
                    </div>

                    {isCurrentTarget && (
                      <div className="mt-2 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                        <Check className="w-3 h-3" /> ACTIVE TARGET GOAL
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Transparent Explainable AI Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 uppercase tracking-wider">
                      {selectedCareer.category}
                    </span>
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> {selectedCareer.globalDemandLevel} Demand
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mt-1">
                    {selectedCareer.title}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Estimated Industry Range: <strong className="text-slate-800">{selectedCareer.averageSalaryIndia}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {user?.targetCareerTitle !== selectedCareer.title ? (
                    <button
                      onClick={() => handleSetTargetCareer(selectedCareer)}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors"
                    >
                      Set as My Target Goal
                    </button>
                  ) : (
                    <span className="px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Active Goal
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedCareer.description}
              </p>

              {/* Crucial Section: "Why this recommendation?" */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Why This Career Was Recommended (Explainable AI):</span>
                </div>

                <div className="text-xs text-slate-700 font-medium italic bg-white p-3 rounded-lg border border-slate-200">
                  "{selectedCareer.whyMatch?.aiInsight || 'High synergy between your analytical foundation and engineering requirements.'}"
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-emerald-800 block">Identified Strengths:</span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {selectedCareer.whyMatch?.positives?.map((pos, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{pos}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-orange-800 block">Bridgeable Gaps:</span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {selectedCareer.whyMatch?.gapsToClose?.map((gap, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-orange-500 font-bold">›</span>
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Required Skills Matrix */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                  Core Skills & Target Requirements
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedCareer.requiredSkills.map((sk, i) => (
                    <div key={i} className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-slate-800">{sk.name}</div>
                        <div className="text-slate-500 text-[11px]">{sk.importance}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">{sk.requiredLevel}%</div>
                        <div className="text-[10px] text-slate-400">Benchmark</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setIsAiModalOpen(true)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5"
                >
                  <Bot className="w-4 h-4" />
                  <span>Ask AI Tutor for Advice</span>
                </button>

                <button
                  onClick={() => setActiveView('roadmap')}
                  className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                >
                  Open {selectedCareer.title} Roadmap →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
