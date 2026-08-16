import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Eye, 
  Type, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Globe, 
  Moon, 
  Sun,
  BookOpen,
  Sliders
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../../types';

export const AccessibilityToolbar: React.FC = () => {
  const { 
    accessibility, 
    updateAccessibility, 
    learningPrefs, 
    updateLearningPrefs, 
    setIsAccessibilityOpen,
    isSpeaking,
    stopSpeaking,
    speakText
  } = useApp();

  const toggleFontSize = () => {
    if (accessibility.fontSize === 'normal') updateAccessibility({ fontSize: 'large' });
    else if (accessibility.fontSize === 'large') updateAccessibility({ fontSize: 'xlarge' });
    else updateAccessibility({ fontSize: 'normal' });
  };

  const toggleHighContrast = () => {
    if (accessibility.contrastMode === 'default') {
      updateAccessibility({ contrastMode: 'high-contrast-dark' });
    } else if (accessibility.contrastMode === 'high-contrast-dark') {
      updateAccessibility({ contrastMode: 'high-contrast-light' });
    } else {
      updateAccessibility({ contrastMode: 'default' });
    }
  };

  return (
    <aside 
      id="accessibility-quick-toolbar"
      aria-label="Accessibility quick controls"
      className="bg-slate-900 text-slate-100 text-xs px-3 sm:px-6 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40"
    >
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
        <span className="font-semibold text-blue-400 flex items-center gap-1.5 text-[11px] tracking-wide uppercase">
          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
          Accessibility:
        </span>

        {/* Font Size Toggle */}
        <button
          id="quick-font-toggle-btn"
          onClick={toggleFontSize}
          aria-label={`Toggle font size. Current: ${accessibility.fontSize}`}
          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 font-mono"
        >
          <Type className="w-3 h-3" />
          <span>Size: {accessibility.fontSize.toUpperCase()}</span>
        </button>

        {/* High Contrast Toggle */}
        <button
          id="quick-contrast-toggle-btn"
          onClick={toggleHighContrast}
          aria-label={`Toggle high contrast mode. Current: ${accessibility.contrastMode}`}
          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
        >
          <Sun className="w-3 h-3 text-amber-400" />
          <span>Contrast: {accessibility.contrastMode === 'default' ? 'Standard' : accessibility.contrastMode.replace('high-contrast-', 'High ')}</span>
        </button>

        {/* Dyslexia Mode Toggle */}
        <button
          id="quick-dyslexia-toggle-btn"
          onClick={() => updateAccessibility({ dyslexicFont: !accessibility.dyslexicFont })}
          aria-pressed={accessibility.dyslexicFont}
          className={`px-2.5 py-1 rounded border transition-colors flex items-center gap-1.5 ${
            accessibility.dyslexicFont 
              ? 'bg-blue-600 border-blue-500 text-white font-bold' 
              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
          }`}
        >
          <BookOpen className="w-3 h-3" />
          <span>Dyslexia Font</span>
        </button>

        {/* Speech / Text-to-Speech in preferred language */}
        <button
          id="quick-tts-toggle-btn"
          onClick={() => {
            if (isSpeaking) {
              stopSpeaking();
            } else {
              const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === learningPrefs.primaryLanguage)?.name || 'English';
              const message = `Welcome to EduSage. Your preferred language is set to ${currentLang}. Use the top toolbar to adjust text scale, contrast, dyslexia font, or open AI Tutor.`;
              speakText(message, learningPrefs.primaryLanguage);
            }
          }}
          aria-label={isSpeaking ? "Stop Voice Narration" : "Read Page Overview"}
          className={`px-2.5 py-1 rounded border transition-colors flex items-center gap-1.5 ${
            isSpeaking 
              ? 'bg-red-600 border-red-500 text-white font-bold animate-pulse' 
              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
          }`}
          title={`Speech output in ${SUPPORTED_LANGUAGES.find(l => l.code === learningPrefs.primaryLanguage)?.name || 'English'}`}
        >
          {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-blue-400" />}
          <span>{isSpeaking ? 'Stop Voice' : 'Read Aloud'}</span>
        </button>

        {/* Simplified View Toggle */}
        <button
          id="quick-simplified-toggle-btn"
          onClick={() => updateAccessibility({ simplifiedUI: !accessibility.simplifiedUI })}
          aria-pressed={accessibility.simplifiedUI}
          className={`px-2.5 py-1 rounded border transition-colors flex items-center gap-1.5 ${
            accessibility.simplifiedUI 
              ? 'bg-emerald-600 border-emerald-500 text-white font-bold' 
              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
          }`}
        >
          <Sparkles className="w-3 h-3 text-emerald-300" />
          <span>Simplified View</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Language Selector */}
        <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
          <Globe className="w-3 h-3 text-blue-400" aria-hidden="true" />
          <select
            id="quick-language-select"
            aria-label="Select platform language"
            value={learningPrefs.primaryLanguage}
            onChange={(e) => updateLearningPrefs({ primaryLanguage: e.target.value as LanguageCode })}
            className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer py-0.5"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                {lang.name} ({lang.nativeName})
              </option>
            ))}
          </select>
        </div>

        {/* Full Accessibility Controls Opener */}
        <button
          id="open-full-accessibility-btn"
          onClick={() => setIsAccessibilityOpen(true)}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Sliders className="w-3 h-3" />
          <span className="hidden sm:inline">All Controls</span> (Alt+A)
        </button>
      </div>
    </aside>
  );
};
