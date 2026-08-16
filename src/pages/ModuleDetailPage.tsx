import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Clock, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Bot, 
  Sliders, 
  Play, 
  RotateCcw,
  BookOpen,
  Award,
  HelpCircle,
  Zap,
  Code
} from 'lucide-react';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../types';

export const ModuleDetailPage: React.FC = () => {
  const { 
    modules, 
    currentModuleId, 
    setActiveView, 
    submitQuiz, 
    speakText, 
    stopSpeaking, 
    isSpeaking,
    setIsAiModalOpen,
    learningPrefs,
    updateLearningPrefs,
    skills
  } = useApp();

  const activeModule = modules.find((m) => m.id === currentModuleId) || modules[0];

  const [activeTab, setActiveTab] = useState<'lesson' | 'interactive' | 'quiz'>('lesson');
  const [simplifiedView, setSimplifiedView] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Interactive Bayes Calculator state
  const [priorProb, setPriorProb] = useState<number>(0.01); // 1%
  const [truePositive, setTruePositive] = useState<number>(0.95); // 95%
  const [falsePositive, setFalsePositive] = useState<number>(0.05); // 5%

  // Bayes calculation: P(D|+) = (P(+|D)*P(D)) / [ P(+|D)*P(D) + P(+|~D)*P(~D) ]
  const num = truePositive * priorProb;
  const den = (truePositive * priorProb) + (falsePositive * (1 - priorProb));
  const posteriorProb = den > 0 ? (num / den) * 100 : 0;

  const handleQuizOptionSelect = (qId: string, optIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIndex }));
  };

  const handleQuizSubmit = async () => {
    if (!activeModule) return;
    const res = await submitQuiz(activeModule.id, selectedAnswers);
    if (res && res.score !== undefined) {
      setQuizScore(res.score);
      setQuizSubmitted(true);
    }
  };

  if (!activeModule) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 text-center">
        <p>Module not found.</p>
        <button onClick={() => setActiveView('learning')} className="mt-4 text-blue-600 font-bold">
          Return to Learning Path
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveView('learning')}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Learning Pathway</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Audio narration button */}
            <button
              onClick={() => {
                if (isSpeaking) stopSpeaking();
                else speakText(
                  `${activeModule.title}. ${activeModule.summary}. ${simplifiedView ? activeModule.summary : activeModule.contentMarkdown}`,
                  learningPrefs.primaryLanguage
                );
              }}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors shadow-xs"
              title={`Listen to lesson in ${SUPPORTED_LANGUAGES.find(l => l.code === learningPrefs.primaryLanguage)?.name || 'English'}`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
              <span>{isSpeaking ? 'Stop Narration' : `Listen to Lesson (${SUPPORTED_LANGUAGES.find(l => l.code === learningPrefs.primaryLanguage)?.name || 'English'})`}</span>
            </button>

            {/* AI Tutor */}
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all"
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span>Ask Tutor</span>
            </button>
          </div>
        </div>

        {/* Module Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                Module {activeModule.id}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {activeModule.estimatedMinutes} Mins
              </span>
            </div>

            {/* Simplified Explanation Switcher */}
            <button
              onClick={() => setSimplifiedView(!simplifiedView)}
              className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                simplifiedView
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{simplifiedView ? 'Showing Simplified Explanations' : 'Switch to Simplified Mode'}</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {activeModule.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            {activeModule.summary}
          </p>

          {/* Module Objectives */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Core Competency Goals:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeModule.objectives.map((obj, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 pt-2 gap-4">
            <button
              onClick={() => setActiveTab('lesson')}
              className={`pb-3 text-xs font-bold transition-all relative ${
                activeTab === 'lesson'
                  ? 'text-blue-600 border-b-2 border-blue-600 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              1. Detailed Lesson & Notes
            </button>
            <button
              onClick={() => setActiveTab('interactive')}
              className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-1.5 ${
                activeTab === 'interactive'
                  ? 'text-blue-600 border-b-2 border-blue-600 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>2. Interactive Practice Sandbox</span>
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'text-blue-600 border-b-2 border-blue-600 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-blue-500" />
              <span>3. Check for Mastery (Quiz)</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Lesson Content */}
        {activeTab === 'lesson' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-slate-800">
            {simplifiedView ? (
              <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4">
                <div className="font-bold text-amber-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Simplified Real-World Analogy (Easy Words)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Imagine you have 10,000 lottery tickets in a giant box, but only 1 ticket wins the jackpot. A friend claims their metal detector finds gold 99% of the time, but also accidentally beeps on rocks 1% of the time. If the detector beeps on a random ticket, is it definitely a winner?
                </p>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold">
                  Because winning tickets are so rare (1 in 10,000), the machine beeps on about 100 normal tickets by mistake. So out of all the beeps, the real jackpot is only 1 out of 101 beeps (roughly 1%)!
                </p>
                <div className="text-xs text-amber-900 bg-amber-100 p-3 rounded-xl">
                  🔑 <strong>Golden Rule:</strong> Extraordinary claims need you to factor in how rare something was to begin with (the "Prior").
                </div>
              </div>
            ) : (
              <div className="prose max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
                <h3 className="text-base font-bold text-slate-900">
                  Mathematical Formulation of Bayes' Rule
                </h3>
                <p>
                  Bayes' Theorem describes the probability of an event, based on prior knowledge of conditions that might be related to the event:
                </p>
                <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm my-3 shadow-inner">
                  P(A | B) = [ P(B | A) × P(A) ] / P(B)
                </div>
                <p>Where:</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li><strong>P(A | B) [Posterior]:</strong> Probability of hypothesis A occurring given that evidence B occurred.</li>
                  <li><strong>P(A) [Prior]:</strong> The initial base-rate probability of hypothesis A before observing evidence B.</li>
                  <li><strong>P(B | A) [Likelihood]:</strong> The probability of observing evidence B given that hypothesis A is true.</li>
                  <li><strong>P(B) [Marginal Evidence]:</strong> Total probability of observing evidence B across all possible states.</li>
                </ul>

                <div className="mt-6 p-4 rounded-2xl bg-blue-50 border border-blue-200">
                  <h4 className="font-bold text-blue-950 text-xs sm:text-sm mb-1">
                    Why is this critical for Data Science & Machine Learning?
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Spam filters (Naive Bayes), medical diagnosis models, self-driving vehicle sensor fusion (Kalman Filters), and Bayesian A/B testing all rely fundamentally on updating prior beliefs with noisy real-world sensor evidence.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Ask tutor for another example</span>
              </button>

              <button
                onClick={() => setActiveTab('interactive')}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Try Interactive Simulation →
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Interactive Sandbox & Bayes Simulator */}
        {activeTab === 'interactive' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Interactive Probability Simulator
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Interactive Bayes' Theorem Visualizer
              </h2>
              <p className="text-xs text-slate-500">
                Drag the sliders below to observe how small base rates dramatically affect the posterior probability.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              {/* Sliders Control Box */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                {/* Prior Probability */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>Base Rate / Prior P(Disease):</span>
                    <span className="text-blue-600 font-mono">{(priorProb * 100).toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.001"
                    max="0.20"
                    step="0.001"
                    value={priorProb}
                    onChange={(e) => setPriorProb(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="text-[10px] text-slate-500">
                    (How common is the condition in the overall population?)
                  </div>
                </div>

                {/* True Positive Rate (Sensitivity) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>True Positive Rate (Sensitivity):</span>
                    <span className="text-emerald-600 font-mono">{(truePositive * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.50"
                    max="1.0"
                    step="0.01"
                    value={truePositive}
                    onChange={(e) => setTruePositive(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="text-[10px] text-slate-500">
                    (Chance test correctly flags a diseased patient)
                  </div>
                </div>

                {/* False Positive Rate */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>False Positive Rate:</span>
                    <span className="text-red-600 font-mono">{(falsePositive * 100).toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.20"
                    step="0.005"
                    value={falsePositive}
                    onChange={(e) => setFalsePositive(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                  <div className="text-[10px] text-slate-500">
                    (Chance test mistakenly flags a healthy patient)
                  </div>
                </div>
              </div>

              {/* Live Computed Output Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-blue-300">
                    Computed Posterior Result
                  </span>
                  <div className="text-4xl font-extrabold text-white mt-1">
                    {posteriorProb.toFixed(1)}%
                  </div>
                  <div className="text-xs text-blue-200 font-medium mt-1">
                    Chance a positive test actually has the disease P(Disease | Test +)
                  </div>
                </div>

                {/* Intuitive visual bar */}
                <div className="space-y-1.5">
                  <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all duration-200"
                      style={{ width: `${Math.min(100, posteriorProb)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-blue-100 leading-relaxed">
                    {posteriorProb < 50
                      ? '⚠️ Counter-Intuitive: Even with a 95% accurate test, when prior base rates are low, false positives outnumber true positives!'
                      : '✅ When the prior base rate is high or false alarm rate is tiny, confidence in positive tests increases rapidly.'}
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className="w-full py-2.5 rounded-xl bg-white text-blue-950 text-xs font-bold hover:bg-blue-50 transition-colors text-center"
                >
                  Test Your Mastery on Quiz →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Mastery Quiz */}
        {activeTab === 'quiz' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Concept Mastery Check ({activeModule.quiz.length} Questions)
                </h2>
                <p className="text-xs text-slate-500">
                  Score 60% or higher to mark this module complete and advance your skill level.
                </p>
              </div>

              {quizSubmitted && quizScore !== null && (
                <div className={`px-4 py-2 rounded-2xl text-xs font-extrabold border ${
                  quizScore >= 60 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                    : 'bg-amber-50 border-amber-300 text-amber-800'
                }`}>
                  Final Score: {quizScore}% {quizScore >= 60 ? '🎉 Passed' : '⚠️ Review Suggested'}
                </div>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {activeModule.quiz.map((q, qIndex) => {
                const picked = selectedAnswers[q.id];
                const isCorrect = picked === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200 space-y-3"
                  >
                    <div className="text-xs font-bold text-slate-500">
                      Question {qIndex + 1}:
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      {q.question}
                    </p>

                    <div className="space-y-2">
                      {q.options.map((opt, optIndex) => {
                        const isPicked = picked === optIndex;
                        let optionStyle = "border-slate-200 bg-white text-slate-800 hover:border-blue-400";
                        if (quizSubmitted) {
                          if (optIndex === q.correctIndex) {
                            optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold";
                          } else if (isPicked && !isCorrect) {
                            optionStyle = "border-red-500 bg-red-50 text-red-950 font-medium";
                          } else {
                            optionStyle = "border-slate-200 bg-slate-100 text-slate-400 opacity-60";
                          }
                        } else if (isPicked) {
                          optionStyle = "border-blue-600 bg-blue-50 text-blue-900 font-bold ring-2 ring-blue-500/20";
                        }

                        return (
                          <button
                            key={optIndex}
                            type="button"
                            onClick={() => handleQuizOptionSelect(q.id, optIndex)}
                            disabled={quizSubmitted}
                            className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && optIndex === q.correctIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                            {quizSubmitted && isPicked && !isCorrect && (
                              <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-slate-700 leading-relaxed">
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quiz Submit Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              {!quizSubmitted ? (
                <button
                  type="button"
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(selectedAnswers).length < activeModule.quiz.length}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                >
                  Submit Quiz & Verify Mastery
                </button>
              ) : (
                <div className="flex items-center gap-3 w-full justify-between">
                  <button
                    onClick={() => {
                      setQuizSubmitted(false);
                      setSelectedAnswers({});
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Quiz</span>
                  </button>

                  <button
                    onClick={() => setActiveView('learning')}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-colors"
                  >
                    Next Pathway Module →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
