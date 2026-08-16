import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Type, 
  Eye, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Sliders, 
  Check, 
  RotateCcw,
  BookOpen,
  Mic,
  Maximize2
} from 'lucide-react';
import { ContrastMode, FontSize, SUPPORTED_LANGUAGES } from '../../types';

export const AccessibilityPanel: React.FC = () => {
  const { 
    accessibility, 
    updateAccessibility, 
    learningPrefs,
    isAccessibilityOpen, 
    setIsAccessibilityOpen,
    isSpeaking,
    stopSpeaking,
    speakText
  } = useApp();

  if (!isAccessibilityOpen) return null;

  const fontSizes: { value: FontSize; label: string; desc: string }[] = [
    { value: 'normal', label: 'Standard (16px)', desc: 'Default readable size' },
    { value: 'large', label: 'Large (18px)', desc: 'Comfortable reading' },
    { value: 'xlarge', label: 'Extra Large (20px)', desc: 'Maximum visual clarity' },
  ];

  const contrastModes: { value: ContrastMode; label: string; bg: string; text: string; border: string }[] = [
    { value: 'default', label: 'Standard Palette', bg: 'bg-white', text: 'text-slate-800', border: 'border-slate-300' },
    { value: 'high-contrast-dark', label: 'OLED Pure Dark', bg: 'bg-black', text: 'text-white', border: 'border-white' },
    { value: 'high-contrast-light', label: 'High Contrast White', bg: 'bg-white', text: 'text-black', border: 'border-black' },
    { value: 'night-vision-amber', label: 'Night Vision Amber', bg: 'bg-stone-950', text: 'text-amber-400', border: 'border-amber-500' },
  ];

  const resetAccessibility = () => {
    updateAccessibility({
      fontSize: 'normal',
      contrastMode: 'default',
      dyslexicFont: false,
      reducedMotion: false,
      textSpacing: false,
      simplifiedUI: false,
      captionsEnabled: true,
      textToSpeech: true,
      speechToText: true,
      screenReaderOptimized: false,
      autoAudioExplanations: false,
    });
  };

  return (
    <div 
      id="accessibility-modal-container"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-panel-title"
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs p-4 sm:p-6 transition-all"
    >
      <div 
        id="accessibility-panel-drawer"
        className="w-full max-w-md h-full max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="accessibility-panel-title" className="text-lg font-bold text-slate-900">
                Accessibility Assistant
              </h2>
              <p className="text-xs text-slate-500">Shortcut: Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-700 font-mono text-[10px]">Alt + A</kbd></p>
            </div>
          </div>
          <button
            id="close-accessibility-panel-btn"
            onClick={() => setIsAccessibilityOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close accessibility panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1 text-slate-800">
          {/* Quick Voice / TTS Test */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-blue-950 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-blue-600" />
                Text-to-Speech Engine
              </div>
              <p className="text-xs text-blue-700 mt-0.5">Read content aloud in your chosen language ({SUPPORTED_LANGUAGES.find(l => l.code === learningPrefs.primaryLanguage)?.name})</p>
            </div>
            {isSpeaking ? (
              <button
                id="stop-tts-btn"
                onClick={stopSpeaking}
                className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 flex items-center gap-1.5 shadow-xs"
              >
                <VolumeX className="w-3.5 h-3.5" />
                Stop Voice
              </button>
            ) : (
              <button
                id="test-tts-btn"
                onClick={() => {
                  const testPhrases: Record<string, string> = {
                    en: "EduSage accessibility controls active. Audio speed and voice narration are configured in English.",
                    hi: "एडुसेज अभिगम्यता नियंत्रण सक्रिय हैं। ऑडियो और वाक् विवरण आपकी पसंदीदा भाषा हिंदी में तैयार है।",
                    kn: "EduSage ಪ್ರವೇಶ ನಿಯಂತ್ರಣಗಳು ಸಕ್ರಿಯವಾಗಿವೆ. ಕನ್ನಡ ಭಾಷೆಯಲ್ಲಿ ಆಡಿಯೊ ನಿರೂಪಣೆ ಸಿದ್ಧವಾಗಿದೆ.",
                    ta: "EduSage அணுகல்தன்மை கட்டுப்பாடுகள் செயலில் உள்ளன. உங்கள் விருப்பமான தமிழ் மொழியில் ஆடியோ தயாராக உள்ளது.",
                    te: "EduSage యాక్సెసిబిలిటీ నియంత్రణలు సక్రియంగా ఉన్నాయి. మీ ప్రాధాన్య తెలుగు భాషలో ఆడియో సిద్ధంగా ఉంది.",
                    ml: "EduSage ആക്സസിബിലിറ്റി ക്രമീകരണങ്ങൾ സജീവമാണ്. മലയാളം ഭാഷയിൽ ഓഡിയോ ലഭ്യമാണ്.",
                    mr: "EduSage प्रवेशयोग्यता नियंत्रणे सक्रिय आहेत. ऑडिओ विवरण तुमच्या पसंतीच्या मराठी भाषेत उपलब्ध आहे.",
                    bn: "EduSage অ্যাক্সেসিবিলিটি নিয়ন্ত্রণ সক্রিয়। আপনার পছন্দের বাংলা ভাষায় অডিও প্রস্তুত।"
                  };
                  const phrase = testPhrases[learningPrefs.primaryLanguage] || testPhrases.en;
                  speakText(phrase, learningPrefs.primaryLanguage);
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5 shadow-xs"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Test Voice ({SUPPORTED_LANGUAGES.find(l => l.code === learningPrefs.primaryLanguage)?.name})
              </button>
            )}
          </div>

          {/* Font Size Scaling */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              Font Size & Scaling
            </label>
            <div className="grid grid-cols-3 gap-2">
              {fontSizes.map((f) => {
                const isActive = accessibility.fontSize === f.value;
                return (
                  <button
                    key={f.value}
                    id={`font-size-${f.value}-btn`}
                    onClick={() => updateAccessibility({ fontSize: f.value })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isActive 
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 text-blue-900 font-semibold' 
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold">{f.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{f.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Contrast Modes */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Visual Contrast Modes
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {contrastModes.map((c) => {
                const isSelected = accessibility.contrastMode === c.value;
                return (
                  <button
                    key={c.value}
                    id={`contrast-mode-${c.value}-btn`}
                    onClick={() => updateAccessibility({ contrastMode: c.value })}
                    className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all ${c.bg} ${c.text} ${
                      isSelected ? 'ring-2 ring-blue-600 border-blue-600' : c.border
                    }`}
                  >
                    <span className="text-xs font-medium">{c.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cognitive & Neurodivergent Adaptations */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Cognitive & Reading Preferences
            </label>

            {/* Dyslexia font */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
              <div>
                <div className="text-sm font-semibold text-slate-900">Dyslexia-Friendly Typography</div>
                <div className="text-xs text-slate-500">Enhanced letter distinction and character tracking</div>
              </div>
              <button
                id="toggle-dyslexic-font-btn"
                role="switch"
                aria-checked={accessibility.dyslexicFont}
                onClick={() => updateAccessibility({ dyslexicFont: !accessibility.dyslexicFont })}
                className={`w-12 h-6 rounded-full transition-colors relative ${accessibility.dyslexicFont ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${accessibility.dyslexicFont ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Wide Text Spacing */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
              <div>
                <div className="text-sm font-semibold text-slate-900">Expanded Text & Line Spacing</div>
                <div className="text-xs text-slate-500">Increased line-height and letter-spacing for easy scanning</div>
              </div>
              <button
                id="toggle-text-spacing-btn"
                role="switch"
                aria-checked={accessibility.textSpacing}
                onClick={() => updateAccessibility({ textSpacing: !accessibility.textSpacing })}
                className={`w-12 h-6 rounded-full transition-colors relative ${accessibility.textSpacing ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${accessibility.textSpacing ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Simplified UI Mode */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
              <div>
                <div className="text-sm font-semibold text-slate-900">Simplified Focus View</div>
                <div className="text-xs text-slate-500">Removes non-essential UI elements to prevent cognitive overload</div>
              </div>
              <button
                id="toggle-simplified-ui-btn"
                role="switch"
                aria-checked={accessibility.simplifiedUI}
                onClick={() => updateAccessibility({ simplifiedUI: !accessibility.simplifiedUI })}
                className={`w-12 h-6 rounded-full transition-colors relative ${accessibility.simplifiedUI ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${accessibility.simplifiedUI ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
              <div>
                <div className="text-sm font-semibold text-slate-900">Reduce Motion & Animations</div>
                <div className="text-xs text-slate-500">Disables parallax, transitions, and motion triggers</div>
              </div>
              <button
                id="toggle-reduced-motion-btn"
                role="switch"
                aria-checked={accessibility.reducedMotion}
                onClick={() => updateAccessibility({ reducedMotion: !accessibility.reducedMotion })}
                className={`w-12 h-6 rounded-full transition-colors relative ${accessibility.reducedMotion ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${accessibility.reducedMotion ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            id="reset-accessibility-btn"
            onClick={resetAccessibility}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Standard
          </button>
          <button
            id="save-accessibility-close-btn"
            onClick={() => setIsAccessibilityOpen(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
          >
            Apply & Done
          </button>
        </div>
      </div>
    </div>
  );
};
