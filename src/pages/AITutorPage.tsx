import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Globe, 
  RefreshCw 
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../types';

export const AITutorPage: React.FC = () => {
  const { 
    user, 
    chatHistory, 
    sendChatMessage, 
    isAiThinking, 
    speakText, 
    stopSpeaking, 
    isSpeaking, 
    learningPrefs, 
    updateLearningPrefs
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(learningPrefs.primaryLanguage || 'en');
  const [isListening, setIsListening] = useState(false);
  const [showSimplifiedTab, setShowSimplifiedTab] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isAiThinking) return;
    setInputMessage('');
    await sendChatMessage(text, selectedLanguage);
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
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
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const quickPrompts = [
    `Explain Bayes Theorem using a cricket match or medical analogy`,
    `Why is my probability score low and what 3 exercises should I do?`,
    `Give me a Python mock interview question for Data Science`,
    `Explain the difference between Random Forests and XGBoost simply in ${SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'English'}`
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-800">EduSage AI Learning Tutor</h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  PH-10 Engine
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Personalized for <strong className="text-slate-800">{user?.name}</strong> • Goal: <strong className="text-slate-800">{user?.targetCareerTitle}</strong>
              </p>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
            <Globe className="w-4 h-4 text-blue-600 ml-1" />
            <select
              value={selectedLanguage}
              onChange={(e) => {
                const lang = e.target.value as LanguageCode;
                setSelectedLanguage(lang);
                updateLearningPrefs({ primaryLanguage: lang });
              }}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer py-1 pr-2"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chat Stream Window */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[65vh] overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
            {chatHistory.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  Ask your Multilingual Tutor anything!
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  I can explain complex machine learning algorithms, step through Python code, translate concepts into 8+ Indian languages, or simplify explanations when you are stuck.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-xl mx-auto pt-4">
                  {quickPrompts.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(p)}
                      className="p-3 rounded-lg border border-slate-200 bg-white text-slate-700 text-left text-xs font-medium hover:border-blue-500 hover:text-blue-700 transition-colors shadow-2xs"
                    >
                      "{p}"
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              chatHistory.map((msg) => {
                const isAssistant = msg.sender === 'assistant';
                const isSimplified = showSimplifiedTab[msg.id] || false;

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                  >
                    {isAssistant && (
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                        <GraduationCap className="w-4 h-4 text-amber-300" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-xl p-4 text-xs sm:text-sm shadow-xs ${
                        isAssistant
                          ? 'bg-white border border-slate-200 text-slate-800 space-y-2.5'
                          : 'bg-blue-600 text-white font-medium'
                      }`}
                    >
                      {isAssistant && (
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs text-slate-500">
                          <span className="font-semibold text-blue-600 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-blue-500" />
                            Tutor Response ({SUPPORTED_LANGUAGES.find(l => l.code === msg.language)?.name || 'English'})
                          </span>

                          <div className="flex items-center gap-2">
                            {msg.simplifiedVersion && (
                              <button
                                onClick={() =>
                                  setShowSimplifiedTab((prev) => ({
                                    ...prev,
                                    [msg.id]: !prev[msg.id],
                                  }))
                                }
                                className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors ${
                                  isSimplified
                                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                                }`}
                              >
                                {isSimplified ? 'Show Technical' : '💡 Simplify'}
                              </button>
                            )}

                            <button
                              onClick={() => {
                                if (isSpeaking) stopSpeaking();
                                else speakText(isSimplified && msg.simplifiedVersion ? msg.simplifiedVersion : msg.text, msg.language);
                              }}
                              className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Listen to native voice"
                            >
                              {isSpeaking ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="whitespace-pre-wrap leading-relaxed">
                        {isSimplified && msg.simplifiedVersion ? msg.simplifiedVersion : msg.text}
                      </div>

                      {isAssistant && msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                        <div className="pt-2.5 border-t border-slate-100 space-y-1.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                            Suggested Next Questions:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.suggestedFollowups.map((q, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSend(q)}
                                className="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium transition-colors text-left"
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
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <GraduationCap className="w-4 h-4 animate-bounce text-amber-300" />
                </div>
                <div className="bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-600 flex items-center gap-2 shadow-xs">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  <span>EduSage Tutor is crafting an explanation in {SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name}...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Controller */}
          <div className="p-4 bg-white border-t border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleListening}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title="Speak Question"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-slate-600" />}
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={isListening ? "Listening to your voice..." : `Ask your question in ${SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name}... (Press Enter)`}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-slate-50"
              />

              <button
                onClick={() => handleSend()}
                disabled={!inputMessage.trim() || isAiThinking}
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-xs sm:text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
