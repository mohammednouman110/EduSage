import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  User, 
  Briefcase, 
  Globe, 
  ShieldCheck, 
  Accessibility, 
  Volume2, 
  ArrowLeft,
  KeyRound,
  Check,
  AlertCircle
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../types';

export const LoginPage: React.FC = () => {
  const { 
    loginUser, 
    signupUser, 
    switchUser, 
    setActiveView, 
    accessibility, 
    updateAccessibility,
    speakText 
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Sign In state
  const [signInEmail, setSignInEmail] = useState('alex.chen@edusage.ai');
  const [signInPassword, setSignInPassword] = useState('••••••••••••');

  // Sign Up state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpCareer, setSignUpCareer] = useState('Data Scientist');
  const [signUpEducation, setSignUpEducation] = useState("Bachelor's Degree");
  const [signUpLanguage, setSignUpLanguage] = useState<LanguageCode>('en');

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!signInEmail.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await loginUser(signInEmail.trim());
      setIsSubmitting(false);
      setActiveView('dashboard');
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg('Failed to sign in. Please check your credentials or select a demo profile.');
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!signUpName.trim() || !signUpEmail.trim()) {
      setErrorMsg('Please provide your full name and email address.');
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
      setActiveView('onboarding');
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg('Failed to create account. Please try again.');
    }
  };

  const handleDemoLogin = async (demoId: string) => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await switchUser(demoId);
      setIsSubmitting(false);
      setActiveView('dashboard');
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg('Failed to switch to demo user.');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSubmitted(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSubmitted(false);
      setSuccessMsg(`A secure reset link was dispatched to ${forgotEmail}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#191c20] antialiased flex flex-col justify-between">
      {/* Top Header */}
      <header className="w-full border-b border-[#e1e2e9] bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div 
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#215ba7] text-white flex items-center justify-center shadow-xs group-hover:bg-[#1a4a8a] transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold text-[#191c20] tracking-tight">
                Edu<span className="text-[#215ba7]">Sage</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => speakText(mode === 'signin' ? 'Sign in to EduSage to continue your adaptive learning roadmap.' : 'Create an EduSage account to start your personalized skill gap analysis.')}
              className="p-2 rounded-lg text-[#424751] hover:bg-[#ededf4] transition-colors"
              title="Listen to instructions"
              aria-label="Listen to page instructions"
            >
              <Volume2 className="w-4 h-4 text-[#215ba7]" />
            </button>
            <button
              onClick={() => setActiveView('landing')}
              className="text-xs font-semibold text-[#424751] hover:text-[#215ba7] flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-[#ededf4] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch max-w-5xl">
          
          {/* Left Column: Brand Showcase & Value Highlights */}
          <div className="lg:col-span-5 bg-[#215ba7] text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
            {/* Ambient pattern */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-900/40 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold text-white border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Next-Gen Adaptive Learning</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                  Your Personalized Bridge to Mastery.
                </h2>
                <p className="text-sm text-blue-100 mt-2.5 leading-relaxed">
                  EduSage analyzes your skill proficiencies, translates lessons into 8+ Indian regional languages, and charts your accelerated path to top tech careers.
                </p>
              </div>

              {/* Feature Points */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Universal Accessibility First</h4>
                    <p className="text-[11px] text-blue-100 leading-snug">Text scaling, high contrast, dyslexia fonts, and voice navigation.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Dynamic Skill-Gap Diagnostics</h4>
                    <p className="text-[11px] text-blue-100 leading-snug">Benchmarked against industry hiring requirements in real time.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Multilingual AI Tutoring</h4>
                    <p className="text-[11px] text-blue-100 leading-snug">Interactive tutoring, regional speech, and simplified analogies.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial / Trust badge */}
            <div className="relative z-10 pt-6 mt-6 border-t border-white/20">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
                  alt="Learner"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="text-xs font-bold text-white">Alex Chen</p>
                  <p className="text-[10px] text-blue-200">Data Science Aspirant • 87% Career Match</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#c2c6d3] p-6 sm:p-8 shadow-md flex flex-col justify-between relative">
            <div>
              {/* Mode Segmented Control */}
              <div className="flex bg-[#ededf4] p-1 rounded-xl mb-6">
                <button
                  type="button"
                  id="auth-tab-signin"
                  onClick={() => { setMode('signin'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    mode === 'signin'
                      ? 'bg-white text-[#215ba7] shadow-xs'
                      : 'text-[#424751] hover:text-[#191c20]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  id="auth-tab-signup"
                  onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    mode === 'signup'
                      ? 'bg-white text-[#215ba7] shadow-xs'
                      : 'text-[#424751] hover:text-[#191c20]'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Title / Description */}
              <div className="mb-5">
                <h1 className="text-2xl font-bold text-[#191c20]">
                  {mode === 'signin' ? 'Welcome back to EduSage' : 'Start your learning journey'}
                </h1>
                <p className="text-xs text-[#424751] mt-1 leading-relaxed">
                  {mode === 'signin'
                    ? 'Enter your credentials or choose a quick demo profile to continue.'
                    : 'Personalize your profile to generate your custom AI skill roadmap.'}
                </p>
              </div>

              {/* Alerts */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* SIGN IN FORM */}
              {mode === 'signin' && (
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#191c20] mb-1.5" htmlFor="signin-email">
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="w-4 h-4 text-[#737782] absolute left-3.5 pointer-events-none" />
                      <input
                        id="signin-email"
                        type="email"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#c2c6d3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#215ba7] focus:border-transparent text-[#191c20]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-[#191c20]" htmlFor="signin-password">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-xs text-[#215ba7] font-semibold hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 text-[#737782] absolute left-3.5 pointer-events-none" />
                      <input
                        id="signin-password"
                        type={showPassword ? 'text' : 'password'}
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-[#c2c6d3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#215ba7] focus:border-transparent text-[#191c20]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-[#737782] hover:text-[#191c20] focus:outline-none"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-[#215ba7] focus:ring-[#215ba7] border-[#c2c6d3]"
                      />
                      <span className="text-xs text-[#424751]">Remember this device</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    id="submit-signin-btn"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#215ba7] hover:bg-[#1a4a8a] text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Signing In...' : 'Sign In to EduSage'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* SIGN UP FORM */}
              {mode === 'signup' && (
                <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#191c20] mb-1" htmlFor="signup-name">
                      Full Name
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-[#737782] absolute left-3.5 pointer-events-none" />
                      <input
                        id="signup-name"
                        type="text"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="e.g. Jordan Miller"
                        className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[#c2c6d3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#215ba7] text-[#191c20]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#191c20] mb-1" htmlFor="signup-email">
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="w-4 h-4 text-[#737782] absolute left-3.5 pointer-events-none" />
                      <input
                        id="signup-email"
                        type="email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[#c2c6d3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#215ba7] text-[#191c20]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#191c20] mb-1" htmlFor="signup-career">
                        Target Career
                      </label>
                      <select
                        id="signup-career"
                        value={signUpCareer}
                        onChange={(e) => setSignUpCareer(e.target.value)}
                        className="w-full py-2 px-3 text-xs bg-white border border-[#c2c6d3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#215ba7] text-[#191c20]"
                      >
                        <option value="Data Scientist">Data Scientist</option>
                        <option value="ML Engineer">ML Engineer</option>
                        <option value="AI Full Stack Engineer">AI Full Stack Engineer</option>
                        <option value="Cloud Data Architect">Cloud Data Architect</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#191c20] mb-1" htmlFor="signup-education">
                        Education Level
                      </label>
                      <select
                        id="signup-education"
                        value={signUpEducation}
                        onChange={(e) => setSignUpEducation(e.target.value)}
                        className="w-full py-2 px-3 text-xs bg-white border border-[#c2c6d3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#215ba7] text-[#191c20]"
                      >
                        <option value="High School">High School</option>
                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                        <option value="Master's Degree">Master's Degree</option>
                        <option value="Working Professional">Working Professional</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#191c20] mb-1" htmlFor="signup-language">
                      Preferred Language for AI Tutoring
                    </label>
                    <select
                      id="signup-language"
                      value={signUpLanguage}
                      onChange={(e) => setSignUpLanguage(e.target.value as LanguageCode)}
                      className="w-full py-2 px-3 text-xs bg-white border border-[#c2c6d3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#215ba7] text-[#191c20]"
                    >
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name} ({lang.nativeName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    id="submit-signup-btn"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#215ba7] hover:bg-[#1a4a8a] text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    <span>{isSubmitting ? 'Creating Profile...' : 'Create Account & Start Onboarding'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e1e2e9]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-[#737782] font-semibold text-[10px] tracking-wider">
                    Or instant 1-click test profiles
                  </span>
                </div>
              </div>

              {/* Quick Demo Logins */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('demo-alex')}
                  className="p-2.5 rounded-xl border border-[#c2c6d3] hover:border-[#215ba7] hover:bg-[#f2f3fa] transition-all flex items-center gap-2.5 text-left group cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&auto=format&fit=crop&q=80"
                    alt="Alex"
                    className="w-8 h-8 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#191c20] group-hover:text-[#215ba7] truncate">
                      Alex Chen
                    </div>
                    <div className="text-[10px] text-[#737782] truncate">Data Scientist Track</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('demo-priya')}
                  className="p-2.5 rounded-xl border border-[#c2c6d3] hover:border-[#215ba7] hover:bg-[#f2f3fa] transition-all flex items-center gap-2.5 text-left group cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                    alt="Priya"
                    className="w-8 h-8 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#191c20] group-hover:text-[#215ba7] truncate">
                      Priya Sharma
                    </div>
                    <div className="text-[10px] text-[#737782] truncate">ML Engineer (Hindi Tutoring)</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Privacy & Security Note */}
            <div className="pt-6 mt-6 border-t border-[#ededf4] flex items-center justify-between text-[11px] text-[#737782]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#215ba7]" />
                Secure WCAG 2.1 AA Compliant
              </span>
              <span>EduSage AI Platform</span>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-[#c2c6d3] shadow-2xl">
            <h3 className="text-base font-bold text-[#191c20] mb-1">Reset Your Password</h3>
            <p className="text-xs text-[#424751] mb-4">
              Enter your email address and we'll send you an instant recovery link.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-3">
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full px-3 py-2 text-xs border border-[#c2c6d3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215ba7]"
              />
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3 py-1.5 text-xs text-[#424751] hover:bg-[#ededf4] rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotSubmitted}
                  className="px-4 py-1.5 text-xs bg-[#215ba7] text-white rounded-lg font-bold hover:bg-[#1a4a8a]"
                >
                  {forgotSubmitted ? 'Sending Link...' : 'Send Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
