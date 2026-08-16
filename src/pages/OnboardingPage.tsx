import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  GraduationCap, 
  Briefcase, 
  ChevronDown,
  Globe,
  Sparkles,
  Check,
  CheckCircle2,
  Volume2,
  Eye,
  Sliders
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguageCode, LearningStyle } from '../types';

export const OnboardingPage: React.FC = () => {
  const { 
    user, 
    updateUserProfile, 
    accessibility, 
    updateAccessibility, 
    learningPrefs, 
    updateLearningPrefs, 
    setActiveView 
  } = useApp();

  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || 'Jane Doe',
    education: 'Bachelor\'s Degree',
    courseOrRole: user?.courseOrDegree || 'Computer Science Student',
    aiExperience: user?.experienceLevel || 'beginner',
    primaryLanguage: learningPrefs.primaryLanguage || 'en',
    learningStyles: learningPrefs.learningStyles || ['interactive', 'visual'],
    interests: user?.interests || ['Artificial Intelligence', 'Data Science'],
    targetCareer: user?.targetCareerTitle || 'Data Scientist',
  });

  const stepNames = ['Profile', 'Learning', 'Access', 'Interests', 'Career'];

  const availableInterests = [
    'Artificial Intelligence & GenAI',
    'Data Science & Analytics',
    'Machine Learning Engineering',
    'Full Stack Web Development',
    'Cloud Computing & MLOps',
    'Cybersecurity & Network Defense',
    'UI/UX & Product Design',
    'Business & Quantitative Analytics'
  ];

  const suggestedCareers = [
    { title: 'Data Scientist', category: 'Data & AI', match: '94% Match' },
    { title: 'ML Engineer', category: 'Machine Learning', match: '89% Match' },
    { title: 'AI Full Stack Engineer', category: 'Software & AI', match: '96% Match' },
    { title: 'Cloud Data Architect', category: 'Infrastructure', match: '88% Match' },
    { title: 'Business Intelligence Analyst', category: 'Analytics', match: '91% Match' },
  ];

  const handleNext = async () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleComplete();
    }
  };

  const handleComplete = async () => {
    const careerId = formData.targetCareer.toLowerCase().includes('ai') 
      ? 'career-ai-engineer' 
      : formData.targetCareer.toLowerCase().includes('analyst')
      ? 'career-data-analyst'
      : formData.targetCareer.toLowerCase().includes('cloud') || formData.targetCareer.toLowerCase().includes('devops')
      ? 'career-cloud-devops'
      : 'career-data-scientist';

    await updateUserProfile({
      name: formData.name || 'Alex',
      educationLevel: formData.education,
      courseOrDegree: formData.courseOrRole,
      experienceLevel: formData.aiExperience as any,
      interests: formData.interests,
      targetCareerTitle: formData.targetCareer,
      targetCareerId: careerId
    });

    await updateLearningPrefs({
      primaryLanguage: formData.primaryLanguage as LanguageCode,
      learningStyles: formData.learningStyles,
    });

    setActiveView('dashboard');
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists ? prev.interests.filter(i => i !== interest) : [...prev.interests, interest]
      };
    });
  };

  const toggleLearningStyle = (style: LearningStyle) => {
    setFormData((prev) => {
      const exists = prev.learningStyles.includes(style);
      return {
        ...prev,
        learningStyles: exists ? prev.learningStyles.filter(s => s !== style) : [...prev.learningStyles, style]
      };
    });
  };

  return (
    <div className="bg-[#f9f9ff] text-[#191c20] antialiased min-h-screen flex flex-col items-center justify-start py-0 sm:py-6">
      {/* Mobile Constraint Wrapper */}
      <main className="w-full max-w-md min-h-screen sm:min-h-[840px] flex flex-col bg-white relative border-x border-[#c2c6d3] sm:rounded-2xl sm:shadow-lg sm:my-4 overflow-hidden">
        {/* Onboarding Header */}
        <header className="flex flex-col w-full px-4 pt-4 pb-3 bg-white border-b border-[#ededf4]">
          {/* Top App Bar / Back & Skip */}
          <div className="flex justify-between items-center w-full mb-3 h-11">
            <button 
              onClick={() => {
                if (currentStep > 1) {
                  setCurrentStep(currentStep - 1);
                } else {
                  setActiveView('landing');
                }
              }}
              className="flex items-center justify-center w-10 h-10 rounded-full text-[#191c20] hover:bg-[#ededf4] transition-colors focus:outline-none focus:ring-2 focus:ring-[#215ba7]"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-[#191c20]" />
            </button>
            <button 
              onClick={() => setActiveView('dashboard')}
              className="text-sm font-medium text-[#215ba7] hover:text-[#4075c1] px-3 py-1.5 rounded-lg hover:bg-[#f2f3fa] transition-colors"
            >
              Skip
            </button>
          </div>

          {/* Progress Indicator: Linear */}
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#215ba7]">Step {currentStep} of 5</span>
              <span className="text-[#424751] font-medium">{stepNames[currentStep - 1]}</span>
            </div>
            <div className="w-full h-2 bg-[#e1e2e9] rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-[#215ba7] rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
            {/* Textual step preview */}
            <div className="flex w-full justify-between mt-1">
              {stepNames.map((name, idx) => (
                <button
                  key={name}
                  onClick={() => setCurrentStep(idx + 1)}
                  className={`text-[11px] transition-colors ${
                    currentStep === idx + 1 
                      ? 'text-[#215ba7] font-bold' 
                      : currentStep > idx + 1 
                        ? 'text-[#424751] font-medium' 
                        : 'text-[#424751] opacity-40'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Canvas / Form Content */}
        <div className="flex-1 overflow-y-auto px-4 py-5 pb-24">
          {/* STEP 1: Profile */}
          {currentStep === 1 && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#191c20] mb-1.5">
                  Let's set up your Profile
                </h1>
                <p className="text-sm text-[#424751] leading-relaxed">
                  Tell us a bit about yourself so we can tailor your learning experience.
                </p>
              </div>

              <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                {/* Full Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#191c20]" htmlFor="name">
                    Full Name
                  </label>
                  <div className="relative flex items-center input-glow rounded-lg border border-[#c2c6d3] bg-white transition-all">
                    <User className="w-4 h-4 absolute left-3.5 text-[#737782] pointer-events-none" />
                    <input 
                      className="w-full pl-10 pr-3 py-2.5 bg-transparent border-none rounded-lg text-sm text-[#191c20] placeholder:text-[#737782] focus:ring-0 focus:outline-none h-[44px]"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      type="text"
                    />
                  </div>
                </div>

                {/* Education Level */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#191c20]" htmlFor="education">
                    Education Level
                  </label>
                  <div className="relative flex items-center input-glow rounded-lg border border-[#c2c6d3] bg-white transition-all">
                    <GraduationCap className="w-4 h-4 absolute left-3.5 text-[#737782] pointer-events-none" />
                    <select 
                      className="w-full pl-10 pr-9 py-2.5 bg-transparent border-none rounded-lg text-sm text-[#191c20] appearance-none focus:ring-0 focus:outline-none h-[44px] cursor-pointer"
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    >
                      <option value="Select your education" disabled>Select your education</option>
                      <option value="High School">High School</option>
                      <option value="Bachelor's Degree">Bachelor's Degree</option>
                      <option value="Master's Degree">Master's Degree</option>
                      <option value="Ph.D. or Higher">Ph.D. or Higher</option>
                      <option value="Self-Taught / Other">Self-Taught / Other</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3.5 text-[#737782] pointer-events-none" />
                  </div>
                </div>

                {/* Current Course or Role */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#191c20]" htmlFor="course">
                    Current Course or Role
                  </label>
                  <div className="relative flex items-center input-glow rounded-lg border border-[#c2c6d3] bg-white transition-all">
                    <Briefcase className="w-4 h-4 absolute left-3.5 text-[#737782] pointer-events-none" />
                    <input 
                      className="w-full pl-10 pr-3 py-2.5 bg-transparent border-none rounded-lg text-sm text-[#191c20] placeholder:text-[#737782] focus:ring-0 focus:outline-none h-[44px]"
                      id="course"
                      name="course"
                      value={formData.courseOrRole}
                      onChange={(e) => setFormData({ ...formData, courseOrRole: e.target.value })}
                      placeholder="e.g. Computer Science Student"
                      type="text"
                    />
                  </div>
                </div>

                {/* Experience Level Segmented Control */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <label className="text-xs font-semibold text-[#191c20]">
                    AI Experience Level
                  </label>
                  <div className="flex w-full bg-[#e1e2e9] rounded-lg p-1 border border-[#c2c6d3]">
                    {[
                      { id: 'beginner', label: 'Beginner' },
                      { id: 'intermediate', label: 'Intermed' },
                      { id: 'advanced', label: 'Advanced' }
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, aiExperience: lvl.id })}
                        className={`flex-1 text-center py-2 rounded-md text-xs font-medium transition-all h-[36px] flex items-center justify-center ${
                          formData.aiExperience === lvl.id
                            ? 'bg-white text-[#215ba7] font-bold shadow-xs'
                            : 'text-[#424751] hover:text-[#191c20]'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: Learning Preferences */}
          {currentStep === 2 && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#191c20] mb-1.5">
                  Learning Preferences
                </h1>
                <p className="text-sm text-[#424751] leading-relaxed">
                  Choose your preferred explanation language and learning modalities.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-[#191c20] mb-2 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#215ba7]" />
                    Language for AI Tutoring
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setFormData({ ...formData, primaryLanguage: lang.code })}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          formData.primaryLanguage === lang.code
                            ? 'border-[#215ba7] bg-[#f2f3fa] text-[#215ba7] font-bold ring-1 ring-[#215ba7]'
                            : 'border-[#c2c6d3] hover:border-[#737782] text-[#424751]'
                        }`}
                      >
                        <div className="text-xs font-bold">{lang.nativeName}</div>
                        <div className="text-[10px] text-[#737782]">{lang.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#191c20] mb-2 block">
                    Preferred Styles (Select multiple)
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'interactive' as LearningStyle, label: 'Interactive Practice', desc: 'Code sandboxes and step-by-step challenges' },
                      { id: 'project' as LearningStyle, label: 'Project-Based', desc: 'Real-world case studies and milestone projects' },
                      { id: 'visual' as LearningStyle, label: 'Visual & Diagrams', desc: 'Intuitive flowcharts, matrices, and charts' },
                      { id: 'audio' as LearningStyle, label: 'Audio & Narration', desc: 'Voice readouts in regional languages' },
                    ].map((style) => {
                      const isSelected = formData.learningStyles.includes(style.id);
                      return (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => toggleLearningStyle(style.id)}
                          className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                            isSelected
                              ? 'border-[#215ba7] bg-[#f2f3fa] text-[#215ba7] ring-1 ring-[#215ba7]'
                              : 'border-[#c2c6d3] text-[#424751]'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold text-[#191c20]">{style.label}</div>
                            <div className="text-[11px] text-[#424751]">{style.desc}</div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#215ba7]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Accessibility */}
          {currentStep === 3 && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#191c20] mb-1.5">
                  Accessibility & Comfort
                </h1>
                <p className="text-sm text-[#424751] leading-relaxed">
                  Customize the interface to suit your comfort and sensory requirements.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    title: 'Larger Text Display',
                    desc: 'Increases base typography for effortless reading',
                    active: accessibility.fontSize !== 'normal',
                    toggle: () => updateAccessibility({ fontSize: accessibility.fontSize === 'normal' ? 'large' : 'normal' }),
                  },
                  {
                    title: 'Text-to-Speech & Read Aloud',
                    desc: 'Listen to lessons and quiz questions out loud',
                    active: accessibility.textToSpeech,
                    toggle: () => updateAccessibility({ textToSpeech: !accessibility.textToSpeech }),
                  },
                  {
                    title: 'Dyslexia-Friendly Font',
                    desc: 'Optimized letter shapes and letter spacing',
                    active: accessibility.dyslexicFont,
                    toggle: () => updateAccessibility({ dyslexicFont: !accessibility.dyslexicFont }),
                  },
                  {
                    title: 'Cognitive Focus Mode',
                    desc: 'Reduces visual distractions and simplifies layout',
                    active: accessibility.simplifiedUI,
                    toggle: () => updateAccessibility({ simplifiedUI: !accessibility.simplifiedUI }),
                  },
                ].map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={item.toggle}
                    className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                      item.active
                        ? 'border-[#215ba7] bg-[#f2f3fa] text-[#215ba7] ring-1 ring-[#215ba7]'
                        : 'border-[#c2c6d3] text-[#424751]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-[#191c20]">{item.title}</div>
                      <div className="text-[11px] text-[#424751]">{item.desc}</div>
                    </div>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${item.active ? 'bg-[#215ba7] border-[#215ba7] text-white' : 'border-[#c2c6d3]'}`}>
                      {item.active && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Interests */}
          {currentStep === 4 && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#191c20] mb-1.5">
                  Select Your Interests
                </h1>
                <p className="text-sm text-[#424751] leading-relaxed">
                  Select the domains you wish to master or explore.
                </p>
              </div>

              <div className="space-y-2">
                {availableInterests.map((interest) => {
                  const isSelected = formData.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-[#215ba7] bg-[#f2f3fa] text-[#215ba7] font-semibold ring-1 ring-[#215ba7]'
                          : 'border-[#c2c6d3] text-[#424751]'
                      }`}
                    >
                      <span className="text-xs font-medium text-[#191c20]">{interest}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#215ba7]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Career Goal */}
          {currentStep === 5 && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#191c20] mb-1.5">
                  Target Career Role
                </h1>
                <p className="text-sm text-[#424751] leading-relaxed">
                  We'll benchmark your current competencies against hiring requirements for this role.
                </p>
              </div>

              <div className="space-y-2.5 mb-4">
                {suggestedCareers.map((c) => {
                  const isSelected = formData.targetCareer === c.title;
                  return (
                    <button
                      key={c.title}
                      type="button"
                      onClick={() => setFormData({ ...formData, targetCareer: c.title })}
                      className={`w-full p-3.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-[#215ba7] bg-[#f2f3fa] ring-1 ring-[#215ba7]'
                          : 'border-[#c2c6d3] text-[#424751]'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-[#191c20]">{c.title}</div>
                        <div className="text-[10px] text-[#737782]">{c.category}</div>
                      </div>
                      <span className="text-[11px] font-semibold text-[#215ba7] px-2 py-0.5 rounded-full bg-[#d6e3ff]">
                        {c.match}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="sticky bottom-0 left-0 w-full p-4 bg-white border-t border-[#c2c6d3]">
          <button 
            id="onboarding-next-btn"
            onClick={handleNext}
            className="w-full h-[48px] flex items-center justify-center gap-2 bg-[#215ba7] text-white rounded-lg font-semibold text-sm hover:bg-[#4075c1] transition-colors focus:outline-none focus:ring-2 focus:ring-[#215ba7] focus:ring-offset-2 cursor-pointer shadow-xs"
            type="button"
          >
            <span>{currentStep === 5 ? 'Finish & Launch Dashboard' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};
