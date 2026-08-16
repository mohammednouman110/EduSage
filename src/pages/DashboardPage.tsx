import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calculator, 
  ArrowRight, 
  CheckCircle2, 
  Bot, 
  Menu, 
  Sparkles, 
  Compass, 
  GraduationCap, 
  Award, 
  Briefcase, 
  User, 
  ChevronRight,
  TrendingUp,
  Brain,
  FlaskConical,
  Play,
  Flame,
  Volume2
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export const DashboardPage: React.FC = () => {
  const { 
    user, 
    skills, 
    criticalGaps, 
    modules, 
    activeCareerRoadmap, 
    setActiveView, 
    setCurrentModuleId,
    setIsAiModalOpen,
    setIsAccessibilityOpen,
    learningPrefs,
    speakText
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'learning' | 'skills' | 'career' | 'profile'>('dashboard');

  const activeModule = modules[0] || null;
  const currentProgress = 42;

  // Radar chart data for Skill Profile
  const radarData = skills.map((s) => ({
    subject: s.name.split(' ')[0],
    current: s.currentLevel,
    target: s.targetLevel,
    fullMark: 100,
  }));

  const handleTabClick = (tabId: 'dashboard' | 'learning' | 'skills' | 'career' | 'profile') => {
    setActiveTab(tabId);
    if (tabId === 'learning') setActiveView('learning');
    if (tabId === 'skills') setActiveView('skills');
    if (tabId === 'career') setActiveView('careers');
    if (tabId === 'profile') setActiveView('onboarding');
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#191c20] antialiased flex flex-col items-center justify-start pb-24 md:pb-12">
      {/* Container Wrapper */}
      <div className="w-full max-w-md md:max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 pt-3 space-y-6">
        
        {/* Top Header Bar */}
        <header className="flex items-center justify-between py-2 border-b border-[#ededf4]">
          <button 
            onClick={() => setActiveView('landing')}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#191c20] hover:bg-[#ededf4] transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-[#191c20]" />
          </button>

          <div 
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <span className="text-xl sm:text-2xl font-bold text-[#215ba7] tracking-tight">
              EduSage
            </span>
          </div>

          <button 
            onClick={() => setActiveView('onboarding')}
            className="w-9 h-9 rounded-full overflow-hidden border border-[#c2c6d3] flex items-center justify-center bg-[#ededf4] hover:ring-2 hover:ring-[#215ba7] transition-all"
            title="User Profile"
          >
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" 
              alt="Alex" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>
        </header>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Main Column (Mobile matches Image 1 directly) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            
            {/* Card 1: Good morning, Alex & Circular Progress */}
            <div className="bg-white rounded-2xl border border-[#c2c6d3] p-5 sm:p-6 shadow-xs flex items-center justify-between relative overflow-hidden">
              <div className="space-y-1.5 max-w-[240px] sm:max-w-md">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#191c20] tracking-tight flex items-center gap-1.5">
                  Good morning, {user?.name || 'Alex'}
                  <span className="text-2xl animate-wave">👋</span>
                </h1>
                <p className="text-sm text-[#424751] leading-relaxed">
                  You're {currentProgress}% through your learning journey.
                </p>
                <button
                  onClick={() => speakText(`Good morning ${user?.name || 'Alex'}. You are ${currentProgress}% through your learning journey. Today's recommended focus is Conditional Probability.`)}
                  className="inline-flex items-center gap-1 text-xs text-[#215ba7] hover:underline font-medium pt-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen to daily brief</span>
                </button>
              </div>

              {/* Circular Progress Gauge */}
              <div className="relative w-18 h-18 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path
                    className="text-[#e1e2e9]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Progress Circle */}
                  <path
                    className="text-[#215ba7]"
                    strokeDasharray={`${currentProgress}, 100`}
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-sm sm:text-base font-bold text-[#215ba7]">
                  {currentProgress}%
                </span>
              </div>
            </div>

            {/* Card 2: Target Career Hero Card (Steel Blue #215ba7) */}
            <div className="bg-[#215ba7] text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white/90 uppercase tracking-widest">
                  TARGET CAREER
                </span>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#215ba7] text-xs font-bold shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#215ba7]" />
                  <span>87% Match</span>
                </div>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {user?.targetCareerTitle || 'Data Scientist'}
                </h2>
              </div>

              <button 
                id="dashboard-view-career-path-btn"
                onClick={() => setActiveView('roadmap')}
                className="w-full h-11 bg-white hover:bg-[#f2f3fa] text-[#215ba7] font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>View Career Path</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Section: Today's Learning */}
            <div className="space-y-2.5">
              <h3 className="text-lg sm:text-xl font-bold text-[#191c20]">
                Today's Learning
              </h3>

              <div 
                onClick={() => {
                  if (activeModule) {
                    setCurrentModuleId(activeModule.id);
                    setActiveView('module-detail');
                  } else {
                    setActiveView('learning');
                  }
                }}
                className="bg-white rounded-2xl border border-[#c2c6d3] p-4 sm:p-5 shadow-xs hover:border-[#215ba7] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 mb-3">
                  {/* Math / Calculator icon box */}
                  <div className="w-12 h-12 rounded-xl bg-[#e7e8ef] text-[#215ba7] flex items-center justify-center shrink-0 border border-[#c2c6d3] group-hover:bg-[#d6e3ff] transition-colors">
                    <Calculator className="w-6 h-6 text-[#215ba7]" />
                  </div>
                  <div>
                    <div className="text-xs text-[#424751] font-medium">Continue Learning</div>
                    <h4 className="text-base sm:text-lg font-bold text-[#191c20] group-hover:text-[#215ba7] transition-colors">
                      {activeModule?.title || 'Core Foundations & Practice'}
                    </h4>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="w-full bg-[#ededf4] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#215ba7] h-full rounded-full transition-all" style={{ width: '65%' }} />
                  </div>
                  <div className="flex justify-between text-xs text-[#424751] font-medium">
                    <span>65% complete</span>
                    <span>25 min left</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Skill Gaps */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-[#191c20]">
                  Skill Gaps
                </h3>
                <button 
                  onClick={() => setActiveView('skills')}
                  className="text-xs text-[#215ba7] font-semibold hover:underline"
                >
                  View Matrix →
                </button>
              </div>

              {/* Statistics Critical Gap Card with Red Left Accent */}
              <div className="bg-white rounded-2xl border border-[#c2c6d3] border-l-4 border-l-[#ba1a1a] p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-[#191c20]">Statistics</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ffdad6] text-[#93000a] tracking-wider uppercase">
                    HIGH PRIORITY
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Current Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#424751]">Current</span>
                      <span className="font-bold text-[#191c20]">35%</span>
                    </div>
                    <div className="w-full bg-[#ededf4] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#ba1a1a] h-full rounded-full" style={{ width: '35%' }} />
                    </div>
                  </div>

                  {/* Required Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#424751]">Required</span>
                      <span className="font-bold text-[#191c20]">75%</span>
                    </div>
                    <div className="w-full bg-[#ededf4] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#215ba7] h-full rounded-full opacity-60" style={{ width: '75%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Recommended Roles */}
            <div className="space-y-2.5">
              <h3 className="text-lg sm:text-xl font-bold text-[#191c20]">
                Recommended Roles
              </h3>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* Role 1: Data Scientist */}
                <div 
                  onClick={() => setActiveView('careers')}
                  className="bg-white rounded-2xl border border-[#c2c6d3] p-4 flex flex-col items-center text-center shadow-xs hover:border-[#215ba7] transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#d6e3ff] text-[#215ba7] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                    <FlaskConical className="w-6 h-6" />
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#191c20] leading-tight">
                    Data Scientist
                  </div>
                  <div className="text-xs font-semibold text-[#215ba7] mt-0.5">
                    91% Match
                  </div>
                </div>

                {/* Role 2: ML Engineer */}
                <div 
                  onClick={() => setActiveView('careers')}
                  className="bg-white rounded-2xl border border-[#c2c6d3] p-4 flex flex-col items-center text-center shadow-xs hover:border-[#215ba7] transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#ffddaf] text-[#7d5400] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#191c20] leading-tight">
                    ML Engineer
                  </div>
                  <div className="text-xs font-semibold text-[#215ba7] mt-0.5">
                    78% Match
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Secondary Desktop / Tablet Insights Column */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-4 space-y-5">
            {/* Radar Chart Card */}
            <div className="bg-white rounded-2xl border border-[#c2c6d3] p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#191c20]">Skill Competency vs Target</h3>
                  <p className="text-[11px] text-[#424751]">Assessed proficiency benchmark</p>
                </div>
                <button
                  onClick={() => setActiveView('assessment')}
                  className="text-[11px] font-semibold text-[#215ba7] hover:underline"
                >
                  Retake
                </button>
              </div>

              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e1e2e9" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#424751', fontSize: 10, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                    <Radar name="Current Level" dataKey="current" stroke="#215ba7" fill="#4075c1" fillOpacity={0.4} />
                    <Radar name="Target Level" dataKey="target" stroke="#737782" fill="#ededf4" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#ededf4] text-xs">
                {skills.slice(0, 4).map((s) => (
                  <div key={s.id} className="p-2 rounded-lg bg-[#f2f3fa]">
                    <div className="font-semibold text-[#191c20] truncate">{s.name}</div>
                    <div className="text-[#215ba7] font-bold text-[11px]">{s.currentLevel}% / {s.targetLevel}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Tutor Assistant Quick Card */}
            <div className="bg-[#ededf4] rounded-2xl p-5 border border-[#c2c6d3] space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#215ba7] text-white flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#191c20]">EduSage AI Tutor</h4>
                  <p className="text-[10px] text-[#424751]">Explaining in {learningPrefs.primaryLanguage.toUpperCase()}</p>
                </div>
              </div>
              <p className="text-xs text-[#424751] leading-relaxed">
                Stuck on probability or Bayesian formulas? Ask questions in plain language and receive step-by-step intuition.
              </p>
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="w-full py-2 bg-[#215ba7] hover:bg-[#1a4a8a] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Ask AI Tutor</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <button 
        id="dashboard-ai-fab-btn"
        onClick={() => setIsAiModalOpen(true)}
        className="fixed bottom-20 right-4 sm:right-8 w-14 h-14 rounded-full bg-[#215ba7] text-white shadow-xl hover:bg-[#1a4a8a] hover:scale-105 active:scale-95 transition-all flex items-center justify-center z-40 focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-label="Open AI Tutor"
        title="Open AI Tutor"
      >
        <Bot className="w-7 h-7" />
      </button>

      {/* Bottom Navigation Bar (Matching Screen 1) */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-[#c2c6d3] px-2 py-1.5 z-40 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Dashboard Tab */}
          <button
            onClick={() => handleTabClick('dashboard')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all ${
              activeTab === 'dashboard'
                ? 'bg-[#215ba7] text-white'
                : 'text-[#424751] hover:text-[#215ba7]'
            }`}
          >
            <div className="flex items-center gap-1">
              <Compass className="w-5 h-5" />
              {activeTab === 'dashboard' && (
                <span className="text-xs font-bold pl-0.5">Dashboard</span>
              )}
            </div>
          </button>

          {/* Learning Tab */}
          <button
            onClick={() => handleTabClick('learning')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 transition-colors ${
              activeTab === 'learning' ? 'text-[#215ba7] font-bold' : 'text-[#424751] hover:text-[#215ba7]'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-0.5">Learning</span>
          </button>

          {/* Skills Tab */}
          <button
            onClick={() => handleTabClick('skills')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 transition-colors ${
              activeTab === 'skills' ? 'text-[#215ba7] font-bold' : 'text-[#424751] hover:text-[#215ba7]'
            }`}
          >
            <Award className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-0.5">Skills</span>
          </button>

          {/* Career Tab */}
          <button
            onClick={() => handleTabClick('career')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 transition-colors ${
              activeTab === 'career' ? 'text-[#215ba7] font-bold' : 'text-[#424751] hover:text-[#215ba7]'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-0.5">Career</span>
          </button>

          {/* Profile Tab */}
          <button
            onClick={() => handleTabClick('profile')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 transition-colors ${
              activeTab === 'profile' ? 'text-[#215ba7] font-bold' : 'text-[#424751] hover:text-[#215ba7]'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-0.5">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
