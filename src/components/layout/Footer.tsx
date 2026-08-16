import React from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, Shield, Heart, Eye, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setIsAccessibilityOpen } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#215ba7] text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-extrabold text-base">EduSage</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              EduSage: An adaptive AI-powered learning and career assistant that adapts to your accessibility needs, 
              learning style, knowledge gaps, and career goals.
            </p>
            <div className="flex items-center gap-4 text-slate-300 text-xs">
              <span className="flex items-center gap-1.5 text-blue-400">
                <Shield className="w-3.5 h-3.5" /> WCAG AA Compliant
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Globe className="w-3.5 h-3.5" /> 8+ Indian Languages
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Core Modules</h3>
            <ul className="space-y-2 text-xs">
              <li><span className="text-slate-300">Accessibility Control Engine</span></li>
              <li><span className="text-slate-300">Adaptive Diagnostic Assessment</span></li>
              <li><span className="text-slate-300">Skill Gap Analytics Matrix</span></li>
              <li><span className="text-slate-300">Personalized Learning Roadmap</span></li>
              <li><span className="text-slate-300">Career Readiness Scoring</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Ethical AI Statement</h3>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Recommendations provided are AI-generated educational guidance based on verified skill competencies. 
              The system protects learner privacy and does not mandate medical disability disclosures.
            </p>
            <button
              onClick={() => setIsAccessibilityOpen(true)}
              className="mt-3 text-blue-400 hover:text-blue-300 underline text-xs font-semibold flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" /> Customize Accessibility Preferences
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 EduSage Platform. Built for inclusive digital education and equitable career mobility.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Powered by Gemini 3.7 Flash</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
