import React from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, Sparkles, MessageSquare } from 'lucide-react';

export const AITutorFloating: React.FC = () => {
  const { setIsAiModalOpen, criticalGaps } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {criticalGaps.length > 0 && (
        <div 
          onClick={() => setIsAiModalOpen(true)}
          className="bg-white/95 backdrop-blur-xs border border-amber-300 text-slate-800 px-3.5 py-2 rounded-2xl shadow-lg text-xs font-semibold cursor-pointer hover:border-blue-500 transition-all flex items-center gap-2 max-w-xs animate-bounce"
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span>Skill Gap detected in <strong>{criticalGaps[0].name}</strong>. Ask EduSage Tutor!</span>
        </div>
      )}

      <button
        id="floating-ai-tutor-fab"
        onClick={() => setIsAiModalOpen(true)}
        aria-label="Open EduSage AI Learning Assistant"
        className="px-4 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:scale-105 hover:shadow-2xl transition-all flex items-center gap-2.5 group"
      >
        <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-amber-300 group-hover:rotate-12 transition-transform">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div className="text-left leading-tight hidden sm:block">
          <div className="text-xs font-extrabold flex items-center gap-1">
            EduSage Tutor <Sparkles className="w-3 h-3 text-amber-300" />
          </div>
          <div className="text-[10px] text-blue-100 font-medium">Adaptive • 8+ Languages</div>
        </div>
      </button>
    </div>
  );
};
