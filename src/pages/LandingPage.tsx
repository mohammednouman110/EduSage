import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  ArrowRight, 
  User, 
  Brain, 
  BookOpen, 
  TrendingUp, 
  Compass, 
  Flag,
  Accessibility,
  Sliders,
  Briefcase,
  GraduationCap
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveView, switchUser, openAuthModal, setIsAccessibilityOpen } = useApp();

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#191c20] antialiased flex flex-col">
      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col">
        {/* Hero Section */}
        <section className="relative px-4 md:px-8 pt-12 pb-16 md:pt-20 md:pb-24 flex flex-col items-center text-center max-w-5xl mx-auto w-full overflow-hidden">
          {/* Decorative background blur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#d6e3ff] rounded-full blur-[100px] opacity-40 -z-10 pointer-events-none" />

          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ededf4] border border-[#e1e2e9] mb-6 shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#215ba7]" />
            <span className="text-xs text-[#424751] font-semibold tracking-wider uppercase">
              AI-Powered Learning
            </span>
          </div>

          {/* Display Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight leading-[1.15] text-[#191c20] max-w-4xl">
            Learn Your Way.<br className="hidden sm:block" />
            <span className="gradient-text font-extrabold">Build Your Skills.</span><br className="hidden sm:block" />
            Reach Your Career.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#424751] max-w-2xl mx-auto mb-8 leading-relaxed">
            An AI-powered learning and career assistant that adapts to your accessibility needs, learning style, knowledge gaps and career goals.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
            <button 
              id="hero-get-started-btn"
              onClick={() => setActiveView('onboarding')}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#215ba7] text-white text-sm font-semibold rounded-full hover:bg-[#1a4a8a] transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              id="hero-explore-btn"
              onClick={() => {
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#215ba7] border border-[#c2c6d3] text-sm font-semibold rounded-full hover:bg-[#f2f3fa] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              Explore How It Works
            </button>
          </div>

          {/* Instant Demo Profile Switcher */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-[#737782]">
            <span>Or launch demo:</span>
            <button
              onClick={async () => {
                await switchUser('demo-alex');
                setActiveView('dashboard');
              }}
              className="font-bold text-[#215ba7] hover:underline"
            >
              Alex (Data Scientist Track)
            </button>
            <span>•</span>
            <button
              onClick={async () => {
                await switchUser('demo-priya');
                setActiveView('dashboard');
              }}
              className="font-bold text-[#215ba7] hover:underline"
            >
              Priya (ML Engineer / Hindi)
            </button>
          </div>
        </section>

        {/* AI Journey Flow (Visual Flow Bar) */}
        <section className="py-8 bg-white border-y border-[#c2c6d3] w-full">
          <div className="max-w-7xl mx-auto px-4 md:px-8 overflow-x-auto pb-2 hide-scrollbar">
            <div className="flex items-center justify-between min-w-[700px] md:min-w-0">
              {/* Step 1: You */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#c8dbff] text-[#4e607e] flex items-center justify-center shadow-xs">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-[#424751] uppercase tracking-widest">You</span>
              </div>
              <div className="flex-1 h-px bg-[#c2c6d3] mx-3 relative">
                <ArrowRight className="w-3.5 h-3.5 text-[#737782] absolute right-0 top-1/2 -translate-y-1/2" />
              </div>

              {/* Step 2: Understand */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#e1e2e9] text-[#191c20] flex items-center justify-center shadow-xs">
                  <Brain className="w-5 h-5 text-[#215ba7]" />
                </div>
                <span className="text-[11px] font-bold text-[#424751] uppercase tracking-widest">Understand</span>
              </div>
              <div className="flex-1 h-px bg-[#c2c6d3] mx-3 relative">
                <ArrowRight className="w-3.5 h-3.5 text-[#737782] absolute right-0 top-1/2 -translate-y-1/2" />
              </div>

              {/* Step 3: Learn */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#d6e3ff] text-[#001b3d] flex items-center justify-center shadow-xs">
                  <BookOpen className="w-5 h-5 text-[#215ba7]" />
                </div>
                <span className="text-[11px] font-bold text-[#424751] uppercase tracking-widest">Learn</span>
              </div>
              <div className="flex-1 h-px bg-[#c2c6d3] mx-3 relative">
                <ArrowRight className="w-3.5 h-3.5 text-[#737782] absolute right-0 top-1/2 -translate-y-1/2" />
              </div>

              {/* Step 4: Improve */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#d6e3ff] text-[#071c37] flex items-center justify-center shadow-xs">
                  <TrendingUp className="w-5 h-5 text-[#215ba7]" />
                </div>
                <span className="text-[11px] font-bold text-[#424751] uppercase tracking-widest">Improve</span>
              </div>
              <div className="flex-1 h-px bg-[#c2c6d3] mx-3 relative">
                <ArrowRight className="w-3.5 h-3.5 text-[#737782] absolute right-0 top-1/2 -translate-y-1/2" />
              </div>

              {/* Step 5: Discover */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#ffddaf] text-[#281800] flex items-center justify-center shadow-xs">
                  <Compass className="w-5 h-5 text-[#7d5400]" />
                </div>
                <span className="text-[11px] font-bold text-[#424751] uppercase tracking-widest">Discover</span>
              </div>
              <div className="flex-1 h-px bg-[#c2c6d3] mx-3 relative">
                <ArrowRight className="w-3.5 h-3.5 text-[#737782] absolute right-0 top-1/2 -translate-y-1/2" />
              </div>

              {/* Step 6: Achieve */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#215ba7] text-white flex items-center justify-center shadow-xs">
                  <Flag className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-[#215ba7] uppercase tracking-widest">Achieve</span>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid: Tailored to You */}
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full" id="features">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#191c20] mb-2">
              Tailored to You
            </h2>
            <p className="text-sm sm:text-base text-[#424751] max-w-2xl mx-auto">
              Addressing your unique needs with intelligent, adaptive solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Accessibility First */}
            <div className="bento-card p-6 flex flex-col h-full group relative overflow-hidden bg-white shadow-xs">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#d6e3ff] rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity" />
              <div className="w-12 h-12 rounded-xl bg-[#e7e8ef] flex items-center justify-center mb-4 border border-[#c2c6d3] text-[#4d5f7e]">
                <Accessibility className="w-6 h-6 text-[#215ba7]" />
              </div>
              <h3 className="text-lg font-bold text-[#191c20] mb-2">Accessibility First</h3>
              <p className="text-sm text-[#424751] mb-5 flex-grow leading-relaxed">
                Learn comfortably with integrated tools designed for all abilities. Text scaling, high-contrast, dyslexia fonts, voice commands, and speech synthesis.
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className="px-2.5 py-1 rounded-full bg-[#ededf4] text-[#424751] text-xs font-medium border border-[#e1e2e9]">
                  Voice Navigation
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#ededf4] text-[#424751] text-xs font-medium border border-[#e1e2e9]">
                  Text-to-Speech
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#ededf4] text-[#424751] text-xs font-medium border border-[#e1e2e9]">
                  Smart Captions
                </span>
              </div>
            </div>

            {/* Card 2: Personalized Learning */}
            <div className="bento-card p-6 flex flex-col h-full group relative overflow-hidden bg-white shadow-xs">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#d6e3ff] rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity" />
              <div className="w-12 h-12 rounded-xl bg-[#e7e8ef] flex items-center justify-center mb-4 border border-[#c2c6d3] text-[#215ba7]">
                <Sliders className="w-6 h-6 text-[#215ba7]" />
              </div>
              <h3 className="text-lg font-bold text-[#191c20] mb-2">Personalized Learning</h3>
              <p className="text-sm text-[#424751] mb-5 flex-grow leading-relaxed">
                Content that adjusts to your pace and fills in your specific knowledge gaps in 8+ Indian regional languages with step-by-step interactive tutoring.
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className="px-2.5 py-1 rounded-full bg-[#ededf4] text-[#424751] text-xs font-medium border border-[#e1e2e9]">
                  Adaptive Paths
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#ededf4] text-[#424751] text-xs font-medium border border-[#e1e2e9]">
                  Knowledge-gap Focus
                </span>
              </div>
            </div>

            {/* Card 3: Career Skills */}
            <div className="bento-card p-6 flex flex-col h-full group relative overflow-hidden bg-white shadow-xs">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#ffddaf] rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity" />
              <div className="w-12 h-12 rounded-xl bg-[#e7e8ef] flex items-center justify-center mb-4 border border-[#c2c6d3] text-[#7d5400]">
                <Briefcase className="w-6 h-6 text-[#7d5400]" />
              </div>
              <h3 className="text-lg font-bold text-[#191c20] mb-2">Career Skills</h3>
              <p className="text-sm text-[#424751] mb-5 flex-grow leading-relaxed">
                Direct connection between what you learn today and your job tomorrow. Industry benchmark skill matrices, milestone projects, and readiness scoring.
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className="px-2.5 py-1 rounded-full bg-[#ededf4] text-[#424751] text-xs font-medium border border-[#e1e2e9]">
                  Skill-gap Analysis
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#ededf4] text-[#424751] text-xs font-medium border border-[#e1e2e9]">
                  Career Roadmap
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works (Timeline) */}
        <section className="py-16 px-4 md:px-8 bg-white border-t border-[#c2c6d3] w-full" id="how-it-works">
          <div className="max-w-3xl mx-auto">
            <div className="mb-12 text-left md:text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#191c20] mb-2">
                How It Works
              </h2>
              <p className="text-sm text-[#424751]">
                Your journey from ambition to achievement in 5 simple steps.
              </p>
            </div>

            <div className="ml-2 md:ml-6 space-y-2">
              {/* Step 01 */}
              <div className="timeline-step">
                <div className="flex items-start gap-4">
                  <span className="text-2xl font-bold text-[#737782] -mt-1 font-mono">01</span>
                  <div>
                    <h4 className="text-base font-semibold text-[#191c20] mb-1">Tell Us About You</h4>
                    <p className="text-sm text-[#424751] leading-relaxed">
                      Input your current skills, career aspirations, and any accessibility preferences.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 02 */}
              <div className="timeline-step">
                <div className="flex items-start gap-4">
                  <span className="text-2xl font-bold text-[#737782] -mt-1 font-mono">02</span>
                  <div>
                    <h4 className="text-base font-semibold text-[#191c20] mb-1">AI Assessment</h4>
                    <p className="text-sm text-[#424751] leading-relaxed">
                      Our engine analyzes your profile to identify specific knowledge and skill gaps.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 03 */}
              <div className="timeline-step">
                <div className="flex items-start gap-4">
                  <span className="text-2xl font-bold text-[#737782] -mt-1 font-mono">03</span>
                  <div>
                    <h4 className="text-base font-semibold text-[#191c20] mb-1">Discover Your Path</h4>
                    <p className="text-sm text-[#424751] leading-relaxed">
                      Receive a personalized, adaptive learning roadmap tailored exactly to what you need to know.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 04 */}
              <div className="timeline-step">
                <div className="flex items-start gap-4">
                  <span className="text-2xl font-bold text-[#737782] -mt-1 font-mono">04</span>
                  <div>
                    <h4 className="text-base font-semibold text-[#191c20] mb-1">Build Skills</h4>
                    <p className="text-sm text-[#424751] leading-relaxed">
                      Engage with dynamic content that adjusts in real-time to your understanding and pace.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 05 */}
              <div className="relative pl-9 pb-4">
                <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-[#215ba7] z-10" />
                <div className="flex items-start gap-4">
                  <span className="text-2xl font-bold text-[#215ba7] -mt-1 font-mono">05</span>
                  <div>
                    <h4 className="text-base font-bold text-[#215ba7] mb-1">Reach Your Career Goals</h4>
                    <p className="text-sm text-[#424751] leading-relaxed">
                      Translate your new validated skills directly into career advancement opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="py-16 px-4 md:px-8 w-full flex justify-center pb-20">
          <div className="w-full max-w-4xl bg-[#215ba7] text-white rounded-2xl p-8 sm:p-12 flex flex-col items-center text-center relative overflow-hidden shadow-lg">
            {/* Pattern background */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 relative z-10">
              Ready to bridge the gap?
            </h2>
            <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto mb-8 relative z-10 leading-relaxed">
              Join thousands of professionals accelerating their careers with personalized AI guidance.
            </p>
            <button 
              id="cta-start-assessment-btn"
              onClick={() => setActiveView('assessment')}
              className="px-8 py-3.5 bg-white text-[#215ba7] font-bold text-sm rounded-full hover:bg-[#f2f3fa] transition-all duration-200 shadow-md relative z-10 cursor-pointer"
            >
              Start Your Free Assessment
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#e7e8ef] py-8 px-4 md:px-8 border-t border-[#c2c6d3] mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#424751]">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#737782]" />
            <span className="font-bold text-[#191c20]">EduSage © 2025</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <button 
              onClick={() => setIsAccessibilityOpen(true)}
              className="hover:text-[#215ba7] transition-colors"
            >
              Accessibility Statement
            </button>
            <span className="hover:text-[#215ba7] transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-[#215ba7] transition-colors cursor-pointer">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
