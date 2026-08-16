import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Clock, 
  CheckCircle2, 
  Flame, 
  Sparkles, 
  Award,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  AreaChart, 
  Area 
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { user, skills, modules, activeCareerRoadmap, criticalGaps } = useApp();

  const weeklyStudyData = [
    { day: 'Mon', hours: 1.5, target: 1.0 },
    { day: 'Tue', hours: 2.0, target: 1.0 },
    { day: 'Wed', hours: 0.8, target: 1.0 },
    { day: 'Thu', hours: 2.5, target: 1.0 },
    { day: 'Fri', hours: 1.8, target: 1.0 },
    { day: 'Sat', hours: 3.2, target: 1.5 },
    { day: 'Sun', hours: 2.4, target: 1.5 },
  ];

  const quizHistoryData = [
    { test: 'Diagnostic', score: 62 },
    { test: 'Python DS', score: 85 },
    { test: 'Probability 1', score: 55 },
    { test: 'Bayes Review', score: 78 },
    { test: 'SQL Window', score: 82 },
    { test: 'ML Pipeline', score: 70 },
  ];

  const radarData = skills.map((s) => ({
    subject: s.name.split(' ')[0],
    current: s.currentLevel,
    target: s.targetLevel,
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 uppercase tracking-wider">
                Progress & Performance Intelligence
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Goal: <strong className="text-slate-800">{user?.targetCareerTitle || 'Data Scientist'}</strong>
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Learning Analytics & Mastery Trajectory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Track your weekly consistency, quiz velocity, skill acquisition delta, and career readiness index over time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 flex items-center gap-3">
              <Flame className="w-6 h-6 text-orange-500 shrink-0" />
              <div>
                <div className="text-xl font-bold leading-none">6 Days</div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5">Current Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Lifetime Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="text-xs font-medium uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Total Time Invested
            </div>
            <div className="text-2xl font-bold text-slate-800">14.2 Hours</div>
            <div className="text-xs text-emerald-600 font-semibold">↑ +3.5h this week</div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="text-xs font-medium uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Modules Completed
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {modules.filter(m => m.status === 'completed').length} / {modules.length}
            </div>
            <div className="text-xs text-slate-500">Across 4 curriculum phases</div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="text-xs font-medium uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-orange-500" />
              Skill Gaps Resolved
            </div>
            <div className="text-2xl font-bold text-slate-800">2 Gaps</div>
            <div className="text-xs text-orange-600 font-medium">{criticalGaps.length} critical gaps remaining</div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="text-xs font-medium uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-600" />
              Readiness Score
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {activeCareerRoadmap?.readinessScore.overall || 63}%
            </div>
            <div className="text-xs text-purple-700 font-medium">Target: 85% for recruitment</div>
          </div>
        </div>

        {/* Charts Row 1: Weekly Hours & Quiz Trajectory */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Study Hours Bar Chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Weekly Study Consistency</h3>
                <p className="text-xs text-slate-500 mt-0.5">Hours logged per day vs Daily 1.0h goal</p>
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                Daily Goal: 30-60m
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyStudyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} unit="h" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Bar dataKey="hours" name="Hours Studied" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" name="Daily Target" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quiz Score Trajectory Area Chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Quiz Score Trajectory</h3>
                <p className="text-xs text-slate-500 mt-0.5">Mastery assessment performance over time</p>
              </div>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Average: 75%
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={quizHistoryData}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="test" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} unit="%" />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="score" name="Score %" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#scoreGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Row 2: Radar Mastery & Goal Projection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skill Radar */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Competency Distribution</h3>
              <p className="text-xs text-slate-500 mt-0.5">Blue: Current Level • Grey: Target Benchmark</p>
            </div>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Radar name="Current Level" dataKey="current" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.3} />
                  <Radar name="Target Level" dataKey="target" stroke="#64748b" fill="#94a3b8" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Career Readiness Milestones */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base">AI Readiness Projection</h3>
              <p className="text-xs text-slate-500 mt-0.5">Estimated time to reach 85%+ job-ready score</p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-xs text-slate-700 space-y-1">
                <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Velocity Forecast:</span>
                </div>
                <p>
                  At your current pace of <strong>5.5 hours/week</strong>, you are projected to eliminate your remaining critical skill gaps in <strong>4.2 weeks</strong> and complete the capstone portfolio in <strong>7.5 weeks</strong>.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="font-semibold text-slate-800">Highest ROI Next Actions:</div>
                <ul className="space-y-1 text-slate-600">
                  <li>• Complete <em>Conditional Probability & Bayes Theorem</em> interactive quiz.</li>
                  <li>• Implement SQL Window partitioning exercise with live query tests.</li>
                  <li>• Initialize the Customer Churn ML GitHub Capstone repository.</li>
                </ul>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs text-slate-400">
                Analytics refreshed automatically upon each lesson & quiz completion.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
