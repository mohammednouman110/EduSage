import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Globe, 
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../../types';

export const AITutorModal: React.FC = () => {
  const { 
    user, 
    chatHistory, 
    sendChatMessage, 
    isAiThinking, 
    isAiModalOpen, 
    setIsAiModalOpen,
    speakText,
    stopSpeaking,
    isSpeaking,
    learningPrefs,
    updateLearningPrefs,
    criticalGaps
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(learningPrefs.primaryLanguage || 'en');
  const [isListening, setIsListening] = useState(false);
  const [showSimplifiedTab, setShowSimplifiedTab] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedLanguage(learningPrefs.primaryLanguage);
  }, [learningPrefs.primaryLanguage]);

  useEffect(() => {
    if (isAiModalOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isAiModalOpen]);

  if (!isAiModalOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isAiThinking) return;
    setInputMessage('');
    await sendChatMessage(text, selectedLanguage);
  };

  // Web Speech API for voice recognition input (Speech-to-Text)
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your question.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const langMap: Record<LanguageCode, string> = {
        en: 'en-US',
        hi: 'hi-IN',
        kn: 'kn-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        ml: 'ml-IN',
        mr: 'mr-IN',
        bn: 'bn-IN'
      };
      recognition.lang = langMap[selectedLanguage] || 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };
      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const samplePrompts = [
    `Explain Bayes Theorem with a real-life analogy`,
    `Why am I weak in ${criticalGaps[0]?.name || 'Statistics'} and how do I fix it?`,
    `How does SQL window partitioning work in production?`,
    `What should I focus on next to reach my ${user?.targetCareerTitle || 'Career'} goal?`
  ];

  return (
    <div 
      id="ai-tutor-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-tutor-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs"
    >
      <div className="w-full max-w-3xl h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-amber-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="ai-tutor-title" className="text-base sm:text-lg font-bold">EduSage Multilingual AI Tutor</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950 uppercase tracking-wider">
                  Context-Aware
                </span>
              </div>
              <p className="text-xs text-blue-100">
                Targeting: <span className="font-semibold text-white">{user?.targetCareerTitle || 'Data Scientist'}</span> • Adapts to your skill gaps
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Picker in Modal */}
            <div className="flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-xl text-xs">
              <Globe className="w-3.5 h-3.5 text-blue-200" />
              <select
                id="modal-ai-language-select"
                aria-label="Select AI Tutor response language"
                value={selectedLanguage}
                onChange={(e) => {
                  const lang = e.target.value as LanguageCode;
                  setSelectedLanguage(lang);
                  updateLearningPrefs({ primaryLanguage: lang });
                }}
                className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                    {l.name} ({l.nativeName})
                  </option>
                ))}
              </select>
            </div>

            <button
              id="close-ai-modal-btn"
              onClick={() => setIsAiModalOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close AI tutor dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Stream Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50">
          {chatHistory.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                How can I assist your learning today?
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Ask me to explain any difficult concept, break down a coding problem, translate to your mother tongue, or explain why you have a specific skill gap.
              </p>
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto">
                {samplePrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-left text-xs font-medium hover:border-blue-500 hover:text-blue-700 transition-all shadow-2xs"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            chatHistory.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              const isSimplifiedActive = showSimplifiedTab[msg.id] || false;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                      <GraduationCap className="w-4 h-4 text-amber-300" />
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm shadow-xs ${
                    isAssistant 
                      ? 'bg-white border border-slate-200 text-slate-900 space-y-3' 
                      : 'bg-blue-600 text-white font-medium'
                  }`}>
                    {isAssistant && (
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-[11px] text-slate-500">
                        <span className="font-bold text-blue-600 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          EduSage Tutor ({SUPPORTED_LANGUAGES.find(l => l.code === msg.language)?.name || 'English'})
                        </span>
                        <div className="flex items-center gap-2">
                          {/* Simplified View Switcher for this message */}
                          {msg.simplifiedVersion && (
                            <button
                              onClick={() =>
                                setShowSimplifiedTab((prev) => ({
                                  ...prev,
                                  [msg.id]: !prev[msg.id],
                                }))
                              }
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                                isSimplifiedActive 
                                  ? 'bg-amber-100 border-amber-300 text-amber-900' 
                                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {isSimplifiedActive ? 'Show Full Explanation' : '💡 Simplify (Easy Words)'}
                            </button>
                          )}

                          {/* TTS Audio Readout */}
                          <button
                            onClick={() => {
                              if (isSpeaking) stopSpeaking();
                              else speakText(isSimplifiedActive && msg.simplifiedVersion ? msg.simplifiedVersion : msg.text, msg.language);
                            }}
                            className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Read aloud in native accent"
                            aria-label="Read message aloud"
                          >
                            {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="whitespace-pre-wrap leading-relaxed">
                      {isSimplifiedActive && msg.simplifiedVersion ? msg.simplifiedVersion : msg.text}
                    </div>

                    {/* Suggested follow-ups */}
                    {isAssistant && msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Suggested Questions:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.suggestedFollowups.map((q, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSend(q)}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold transition-colors text-left"
                            >
                              → {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {isAiThinking && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <GraduationCap className="w-4 h-4 animate-bounce text-amber-300" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-600 flex items-center gap-2 shadow-xs">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>EduSage Tutor is analyzing your profile and generating personalized response in {SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name}...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 space-y-2">
          {/* Quick Context Tags */}
          <div className="flex items-center gap-2 overflow-x-auto text-[11px] text-slate-500 pb-1">
            <span className="font-bold text-slate-700 shrink-0">Ask about:</span>
            {criticalGaps.slice(0, 3).map((g) => (
              <button
                key={g.id}
                onClick={() => handleSend(`Why is ${g.name} a critical gap for me and how can I master it?`)}
                className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-full shrink-0 font-medium hover:bg-amber-100"
              >
                ⚠️ {g.name}
              </button>
            ))}
            <button
              onClick={() => handleSend("Explain this in simple Hindi or Kannada.")}
              className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-full shrink-0 font-medium hover:bg-slate-200"
            >
              🌐 Multilingual Switch
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Voice Input Button */}
            <button
              id="speech-to-text-mic-btn"
              onClick={toggleListening}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isListening 
                  ? 'bg-red-600 text-white animate-pulse shadow-md shadow-red-500/20' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Speak question (Speech-to-Text)"
              aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Message input */}
            <input
              id="ai-chat-input-field"
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={isListening ? "Listening to your voice..." : `Ask in ${SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'English'}... (Press Enter)`}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-slate-50/50"
            />

            {/* Send button */}
            <button
              id="send-ai-chat-btn"
              onClick={() => handleSend()}
              disabled={!inputMessage.trim() || isAiThinking}
              className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs sm:text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
