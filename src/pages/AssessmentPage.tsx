import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Target,
  Layers,
  Bot
} from 'lucide-react';
import { AssessmentQuestion } from '../types';

export const AssessmentPage: React.FC = () => {
  const { 
    user, 
    learningPrefs,
    submitAssessment, 
    setActiveView, 
    speakText, 
    stopSpeaking, 
    isSpeaking,
    setIsAiModalOpen 
  } = useApp();

  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);

  const fallbackQuestions: AssessmentQuestion[] = [
    {
      id: 'q-prob-1',
      skillId: 'skill-prob',
      skillName: 'Probability & Statistics',
      difficulty: 'intermediate',
      questionText: 'A disease affects 1 in 10,000 people. A diagnostic test has a 99% true positive rate and a 1% false positive rate. If a random person tests positive, what is the approximate probability they actually have the disease?',
      options: [
        { id: 'opt-1', text: 'Approximately 99%', isCorrect: false, explanation: 'Incorrect. This neglects the extremely small prior base rate (1 in 10,000).' },
        { id: 'opt-2', text: 'Approximately 50%', isCorrect: false, explanation: 'Incorrect. Calculate (0.99 * 0.0001) / ((0.99 * 0.0001) + (0.01 * 0.9999)).' },
        { id: 'opt-3', text: 'Approximately 1% (Bayes Theorem with small prior)', isCorrect: true, explanation: 'Correct! Out of 10,000 people, 1 person has disease (1 true positive) and ~100 healthy people trigger false alarms (~1% positive reliability).' },
        { id: 'opt-4', text: 'Approximately 0.01%', isCorrect: false, explanation: 'Incorrect. That is the prior prevalence rate itself.' }
      ]
    },
    {
      id: 'q-py-1',
      skillId: 'skill-py',
      skillName: 'Python & Data Structures',
      difficulty: 'beginner',
      questionText: 'What is the average time complexity of looking up a key in a standard Python dictionary (hash table)?',
      options: [
        { id: 'opt-2-1', text: 'O(1) Constant Time', isCorrect: true, explanation: 'Correct! Python dicts are hash tables with O(1) average key lookup.' },
        { id: 'opt-2-2', text: 'O(log n) Logarithmic Time', isCorrect: false, explanation: 'Incorrect. Binary search trees offer O(log n), but hash maps average O(1).' },
        { id: 'opt-2-3', text: 'O(n) Linear Time', isCorrect: false, explanation: 'Incorrect. O(n) is the worst-case hash collision scenario, not average.' },
        { id: 'opt-2-4', text: 'O(n^2) Quadratic Time', isCorrect: false, explanation: 'Incorrect.' }
      ]
    }
  ];

  useEffect(() => {
    fetch('/api/assessment/questions')
      .then((r) => r.json())
      .then((data) => {
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          setQuestions(fallbackQuestions);
        }
      })
      .catch(() => setQuestions(fallbackQuestions));
  }, [user?.targetCareerId, user?.targetCareerTitle]);

  const activeQuestions = questions.length > 0 ? questions : fallbackQuestions;
  const currentQ = activeQuestions[currentQIndex] || activeQuestions[0];

  const handleOptionSelect = (optionId: string) => {
    if (showFeedback || !currentQ) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: optionId }));
    setShowFeedback(true);
  };

  const handleNext = async () => {
    setShowFeedback(false);
    if (currentQIndex < activeQuestions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      setIsSubmitting(true);
      await submitAssessment(selectedAnswers);
      setIsSubmitting(false);
      setAssessmentCompleted(true);
    }
  };

  const totalScore = Object.entries(selectedAnswers).filter(([qId, ansId]) => {
    const q = activeQuestions.find((item) => item.id === qId);
    const chosen = q?.options.find((o) => o.id === ansId);
    return chosen?.isCorrect;
  }).length;

  if (assessmentCompleted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800">
              Assessment Completed
            </span>
            <h1 className="text-2xl font-bold text-slate-800">
              Diagnostic Assessment Complete!
            </h1>
            <p className="text-sm text-slate-500">
              Your personalized skill matrix, critical gaps, and adaptive pathway have been updated.
            </p>
          </div>

          {/* Score metric card */}
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-4">
            <div>
              <div className="text-3xl font-bold text-slate-800">
                {Math.round((totalScore / (activeQuestions.length || 1)) * 100)}%
              </div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Score ({totalScore}/{activeQuestions.length})</div>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <div className="text-3xl font-bold text-blue-600">
                {user?.targetCareerTitle || 'Data Scientist'}
              </div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Target Benchmark</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setActiveView('skills')}
              className="flex-1 py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>View Skill Gaps</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveView('learning')}
              className="flex-1 py-3 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Go to Learning Plan</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedOptId = selectedAnswers[currentQ.id];
  const selectedOpt = currentQ.options.find((o) => o.id === selectedOptId);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header & Progress */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Question {currentQIndex + 1} of {activeQuestions.length}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium">
                {Math.round(((currentQIndex + 1) / (activeQuestions.length || 1)) * 100)}% Progress
              </span>
            </div>
            <div className="w-48 bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentQIndex + 1) / (activeQuestions.length || 1)) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="assessment-tts-btn"
              onClick={() => {
                if (isSpeaking) stopSpeaking();
                else speakText(
                  `${currentQ.questionText}. The options are: ${currentQ.options.map(o => o.text).join(', ')}`, 
                  learningPrefs.primaryLanguage
                );
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
              title="Read question aloud in preferred language"
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5 text-blue-600" />}
              <span>{isSpeaking ? 'Stop Audio' : 'Read Aloud'}</span>
            </button>

            <button
              onClick={() => setIsAiModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-blue-200"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask Tutor</span>
            </button>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
              Assessing: {currentQ.skillName}
            </span>
            <span className="capitalize font-medium text-slate-600">
              Difficulty: {currentQ.difficulty}
            </span>
          </div>

          <p className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed">
            {currentQ.questionText}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, i) => {
              const isPicked = selectedOptId === opt.id;
              const isCorrect = opt.isCorrect;
              
              let style = "border-slate-200 hover:border-blue-400 bg-white text-slate-800";
              if (showFeedback) {
                if (isCorrect) {
                  style = "border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold";
                } else if (isPicked && !isCorrect) {
                  style = "border-red-500 bg-red-50 text-red-950";
                } else {
                  style = "border-slate-200 bg-slate-50 text-slate-400 opacity-60";
                }
              } else if (isPicked) {
                style = "border-blue-600 bg-blue-50 text-blue-900 font-semibold ring-1 ring-blue-500";
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleOptionSelect(opt.id)}
                  disabled={showFeedback}
                  className={`w-full p-4 rounded-lg border text-left flex items-center justify-between text-xs sm:text-sm transition-all ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                  {showFeedback && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {showFeedback && isPicked && !isCorrect && <XCircle className="w-5 h-5 text-red-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Immediate Adaptive Explanation Box */}
          {showFeedback && selectedOpt && (
            <div className="p-4 sm:p-5 rounded-lg bg-blue-50/80 border border-blue-200 text-xs sm:text-sm space-y-2">
              <div className="font-bold text-blue-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Explanation & Concept Breakdown:</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {selectedOpt.explanation}
              </p>
            </div>
          )}

          {/* Continue Button */}
          {showFeedback && (
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all"
              >
                <span>{currentQIndex < activeQuestions.length - 1 ? 'Next Question' : 'Complete Assessment & Update Skills'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
