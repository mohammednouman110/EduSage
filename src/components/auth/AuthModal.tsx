import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  Briefcase, 
  GraduationCap,
  LogIn,
  UserPlus,
  Database,
  Bird
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'signin' 
}) => {
  const { loginUser, signupUser, switchUser, user, setActiveView } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpCareer, setSignUpCareer] = useState('Data Scientist');
  const [signUpEducation, setSignUpEducation] = useState('Undergraduate');
  const [signUpLanguage, setSignUpLanguage] = useState<LanguageCode>('en');

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!signInEmail.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginUser(signInEmail.trim());
      setIsSubmitting(false);
      if (res.success) {
        onClose();
        setActiveView('dashboard');
      } else {
        setErrorMsg(res.error || 'Account not found. Please click Sign Up to create your account.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg('Failed to sign in. Please try again.');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!signUpName.trim() || !signUpEmail.trim()) {
      setErrorMsg('Please fill in all required fields (Name and Email).');
      return;
    }

    setIsSubmitting(true);
    try {
      await signupUser({
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        targetCareerTitle: signUpCareer,
        educationLevel: signUpEducation,
      });
      setIsSubmitting(false);
      onClose();
      setActiveView('onboarding');
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg('Failed to create account. Please try again.');
    }
  };

  const handleQuickDemo = async (demoId: string) => {
    setIsSubmitting(true);
    try {
      await switchUser(demoId);
      setIsSubmitting(false);
      onClose();
      setActiveView('dashboard');
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Header with Close */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Bird className="w-4 h-4 text-amber-300 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
              EduSage Platform
            </span>
          </div>

          <h2 id="auth-modal-title" className="text-xl font-bold">
            {mode === 'signin' ? 'Sign In to Your Account' : 'Create a New Learner Account'}
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            {mode === 'signin'
              ? 'Access your personalized learning path, skill diagnostics, and AI tutor.'
              : 'Start your journey with adaptive assessments and tailored career roadmaps.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors ${
              mode === 'signin'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors ${
              mode === 'signup'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New User (Register)</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {mode === 'signin' ? (
            /* Sign In Form */
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="e.g. alex.rivera@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password (Optional for Demo)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Signing In...' : 'Sign In to Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Demo Switcher within Sign In */}
              <div className="pt-4 border-t border-slate-100">
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                  Or Instant 1-Click Demo Login
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('demo-alex')}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-left transition-colors"
                  >
                    <div className="text-xs font-bold text-slate-800">Alex Rivera</div>
                    <div className="text-[10px] text-slate-500">Data Science Track</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('demo-priya')}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-left transition-colors"
                  >
                    <div className="text-xs font-bold text-slate-800">Priya Sharma</div>
                    <div className="text-[10px] text-slate-500">AI Fullstack (Hindi)</div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Sign Up / New User Form */
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="e.g. Rahul Verma"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="e.g. rahul@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Target Career Goal
                  </label>
                  <select
                    value={signUpCareer}
                    onChange={(e) => setSignUpCareer(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-slate-800"
                  >
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="AI Full Stack Engineer">AI Full Stack Engineer</option>
                    <option value="Business Data Analyst">Business Data Analyst</option>
                    <option value="Cloud & MLOps Engineer">Cloud & MLOps Engineer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Education Level
                  </label>
                  <select
                    value={signUpEducation}
                    onChange={(e) => setSignUpEducation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-slate-800"
                  >
                    <option value="Undergraduate">Undergraduate (B.Tech/B.Sc)</option>
                    <option value="Postgraduate">Postgraduate (M.Tech/M.Sc)</option>
                    <option value="High School">High School</option>
                    <option value="Working Professional">Working Professional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  Primary Language for AI Tutor
                </label>
                <select
                  value={signUpLanguage}
                  onChange={(e) => setSignUpLanguage(e.target.value as LanguageCode)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-slate-800"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name} ({l.nativeName})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 pt-3"
              >
                <span>{isSubmitting ? 'Creating Profile...' : 'Create Account & Start Onboarding'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Database Storage Information */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Storage: <strong>Supabase Ready</strong></span>
            </div>
            <span className="text-[10px] text-slate-400">Syncs users & scores</span>
          </div>
        </div>
      </div>
    </div>
  );
};
