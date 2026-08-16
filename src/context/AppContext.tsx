import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserProfile,
  AccessibilityPreferences,
  LearningPreferences,
  Skill,
  LearningModule,
  CareerPath,
  CareerRoadmap,
  ChatMessage,
  LanguageCode,
  SUPPORTED_LANGUAGES,
  LearningResource
} from '../types';

interface AppContextType {
  user: UserProfile | null;
  accessibility: AccessibilityPreferences;
  learningPrefs: LearningPreferences;
  skills: Skill[];
  criticalGaps: Skill[];
  modules: LearningModule[];
  currentModuleId: string | null;
  activeCareerRoadmap: CareerRoadmap | null;
  careers: CareerPath[];
  chatHistory: ChatMessage[];
  resources: LearningResource[];
  isLoading: boolean;
  isAiThinking: boolean;
  isSpeaking: boolean;
  activeView: string;
  isAccessibilityOpen: boolean;
  isAiModalOpen: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  
  // Actions
  setActiveView: (view: string) => void;
  setCurrentModuleId: (id: string | null) => void;
  setIsAccessibilityOpen: (open: boolean) => void;
  setIsAiModalOpen: (open: boolean) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setAuthModalMode: (mode: 'signin' | 'signup') => void;
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  logoutUser: () => void;
  updateAccessibility: (prefs: Partial<AccessibilityPreferences>) => Promise<void>;
  updateLearningPrefs: (prefs: Partial<LearningPreferences>) => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  generateRoadmap: (careerTitle: string, experienceLevel?: string) => Promise<any>;
  toggleMilestone: (milestoneId: string) => Promise<any>;
  switchUser: (userId: string) => Promise<void>;
  loginUser: (email: string) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  signupUser: (data: { name: string; email: string; targetCareerTitle: string; educationLevel: string; experienceLevel?: string }) => Promise<any>;
  submitAssessment: (answers: Record<string, string>) => Promise<any>;
  submitQuiz: (moduleId: string, answers: Record<string, number>) => Promise<any>;
  sendChatMessage: (message: string, lang?: LanguageCode, requestSimplified?: boolean) => Promise<any>;
  toggleSaveResource: (resourceId: string) => Promise<void>;
  speakText: (text: string, lang?: LanguageCode) => void;
  stopSpeaking: () => void;
  refreshData: () => Promise<void>;
}

const defaultAccessibility: AccessibilityPreferences = {
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
  autoAudioExplanations: false
};

const defaultLearning: LearningPreferences = {
  primaryLanguage: 'en',
  learningStyles: ['interactive', 'project', 'visual'],
  dailyGoalMinutes: 30,
  explanationDepth: 'balanced',
  pace: 'moderate'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accessibility, setAccessibility] = useState<AccessibilityPreferences>(defaultAccessibility);
  const [learningPrefs, setLearningPrefs] = useState<LearningPreferences>(defaultLearning);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
  const [activeCareerRoadmap, setActiveCareerRoadmap] = useState<CareerRoadmap | null>(null);
  const [careers, setCareers] = useState<CareerPath[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<string>('landing');
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const getStoredUserId = (): string => {
    try {
      return localStorage.getItem('edusage_user_id') || 'demo-alex';
    } catch {
      return 'demo-alex';
    }
  };

  const setStoredUserId = (id: string) => {
    try {
      localStorage.setItem('edusage_user_id', id);
    } catch (e) {
      console.warn('Could not persist to localStorage:', e);
    }
  };

  const getAuthHeaders = (overrideId?: string) => {
    const uid = overrideId || user?.id || getStoredUserId();
    return {
      'Content-Type': 'application/json',
      'x-user-id': uid
    };
  };

  const logoutUser = () => {
    try {
      localStorage.removeItem('edusage_user_id');
    } catch (e) {
      console.warn(e);
    }
    switchUser('demo-alex');
    setActiveView('landing');
  };

  // Apply visual accessibility CSS classes to body
  useEffect(() => {
    const classList = document.body.classList;
    
    // Clean existing
    classList.remove(
      'font-size-large',
      'font-size-xlarge',
      'theme-high-contrast-dark',
      'theme-high-contrast-light',
      'theme-night-vision-amber',
      'font-dyslexic',
      'text-spacing-wide',
      'reduced-motion'
    );

    if (accessibility.fontSize === 'large') classList.add('font-size-large');
    if (accessibility.fontSize === 'xlarge') classList.add('font-size-xlarge');
    if (accessibility.contrastMode === 'high-contrast-dark') classList.add('theme-high-contrast-dark');
    if (accessibility.contrastMode === 'high-contrast-light') classList.add('theme-high-contrast-light');
    if (accessibility.contrastMode === 'night-vision-amber') classList.add('theme-night-vision-amber');
    if (accessibility.dyslexicFont) classList.add('font-dyslexic');
    if (accessibility.textSpacing) classList.add('text-spacing-wide');
    if (accessibility.reducedMotion) classList.add('reduced-motion');
  }, [accessibility]);

  // Keyboard shortcut for Accessibility Panel: Alt + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAccessibilityOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const refreshData = async (overrideUserId?: string) => {
    try {
      setIsLoading(true);
      const uid = overrideUserId || user?.id || getStoredUserId();
      const headers = { 'x-user-id': uid };

      const [userRes, skillsRes, modulesRes, careersRes, chatRes, resRes] = await Promise.all([
        fetch('/api/users/me', { headers }).then(r => r.json()),
        fetch('/api/skills', { headers }).then(r => r.json()),
        fetch('/api/learning/modules', { headers }).then(r => r.json()),
        fetch('/api/careers', { headers }).then(r => r.json()),
        fetch('/api/ai/history', { headers }).then(r => r.json()),
        fetch('/api/resources', { headers }).then(r => r.json()),
      ]);

      if (userRes.user) {
        setUser(userRes.user);
        setStoredUserId(userRes.user.id);
        if (userRes.accessibility) setAccessibility(userRes.accessibility);
        if (userRes.learningPrefs) setLearningPrefs(userRes.learningPrefs);
      }
      if (skillsRes.skills) setSkills(skillsRes.skills);
      if (modulesRes.modules) setModules(modulesRes.modules);
      if (careersRes.careers) setCareers(careersRes.careers);
      if (chatRes.history) setChatHistory(chatRes.history);
      if (resRes.resources) setResources(resRes.resources);

      // Fetch roadmap tailored for this user
      const targetId = userRes.user?.targetCareerId || 'career-data-scientist';
      const roadmapRes = await fetch(`/api/careers/${targetId}/roadmap`, { headers }).then(r => r.json());
      if (roadmapRes.roadmap) setActiveCareerRoadmap(roadmapRes.roadmap);
    } catch (e) {
      console.error('Failed to fetch app data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const updateAccessibility = async (prefs: Partial<AccessibilityPreferences>) => {
    const updated = { ...accessibility, ...prefs };
    setAccessibility(updated);
    try {
      await fetch('/api/accessibility/preferences', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(prefs),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const updateLearningPrefs = async (prefs: Partial<LearningPreferences>) => {
    const updated = { ...learningPrefs, ...prefs };
    setLearningPrefs(updated);
    try {
      await fetch('/api/learning/preferences', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(prefs),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...profileData };
    setUser(updated);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
      }).then(r => r.json());
      if (res.skills) setSkills(res.skills);
      if (res.roadmap) setActiveCareerRoadmap(res.roadmap);
      if (res.modules) setModules(res.modules);
    } catch (e) {
      console.error(e);
    }
  };

  const generateRoadmap = async (careerTitle: string, experienceLevel?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ careerTitle, experienceLevel }),
      }).then(r => r.json());
      if (res.success) {
        if (res.user) setUser(res.user);
        if (res.roadmap) setActiveCareerRoadmap(res.roadmap);
        if (res.skills) setSkills(res.skills);
        if (res.modules) setModules(res.modules);
      }
      return res;
    } catch (e) {
      console.error('Failed to generate roadmap:', e);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMilestone = async (milestoneId: string) => {
    try {
      const res = await fetch(`/api/roadmap/milestone/${milestoneId}/toggle`, {
        method: 'POST',
        headers: getAuthHeaders(),
      }).then(r => r.json());
      if (res.success && res.roadmap) {
        setActiveCareerRoadmap(res.roadmap);
      }
      return res;
    } catch (e) {
      console.error('Failed to toggle milestone:', e);
      return null;
    }
  };

  const switchUser = async (userId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/demo/switch-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      }).then(r => r.json());
      if (res.success) {
        setStoredUserId(userId);
        await refreshData(userId);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async (email: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).then(r => r.json());
      if (res.success && res.user) {
        setStoredUserId(res.user.id);
        await refreshData(res.user.id);
        setActiveView('dashboard');
        return { success: true, user: res.user };
      } else {
        return { success: false, error: res.error || 'User not found' };
      }
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signupUser = async (data: { name: string; email: string; targetCareerTitle: string; educationLevel: string; experienceLevel?: string }) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => r.json());
      if (res.success && res.user) {
        setStoredUserId(res.user.id);
        setUser(res.user);
        if (res.skills) setSkills(res.skills);
        if (res.modules) setModules(res.modules);
        if (res.roadmap) setActiveCareerRoadmap(res.roadmap);
        if (res.accessibility) setAccessibility(res.accessibility);
        if (res.learningPrefs) setLearningPrefs(res.learningPrefs);

        // Fetch fresh chat history for new user
        const chatRes = await fetch('/api/ai/history', {
          headers: { 'x-user-id': res.user.id }
        }).then(r => r.json());
        if (chatRes.history) setChatHistory(chatRes.history);

        setActiveView('onboarding');
      }
      return res;
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const submitAssessment = async (answers: Record<string, string>) => {
    try {
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ answers, careerGoal: user?.targetCareerTitle }),
      }).then(r => r.json());
      if (res.success) {
        if (res.updatedSkills) setSkills(res.updatedSkills);
      }
      return res;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const submitQuiz = async (moduleId: string, answers: Record<string, number>) => {
    try {
      const res = await fetch(`/api/learning/module/${moduleId}/quiz`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ answers }),
      }).then(r => r.json());
      if (res.success) {
        await refreshData();
      }
      return res;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const sendChatMessage = async (message: string, lang?: LanguageCode, requestSimplified?: boolean) => {
    setIsAiThinking(true);
    const activeLang = lang || learningPrefs.primaryLanguage || 'en';
    const userMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      sender: 'user',
      text: message,
      language: activeLang,
      timestamp: new Date().toISOString()
    };
    setChatHistory((prev) => [...prev, userMsg]);

    try {
      const activeMod = modules.find((m) => m.id === currentModuleId);
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          message,
          language: activeLang,
          currentModuleTitle: activeMod?.title,
          requestSimplified
        }),
      }).then(r => r.json());

      if (res.response) {
        setChatHistory((prev) => [...prev, res.response]);
        if (accessibility.autoAudioExplanations) {
          speakText(res.response.text, activeLang);
        }
        return res.response;
      }
    } catch (e) {
      console.error('Failed to send AI chat message:', e);
    } finally {
      setIsAiThinking(false);
    }
  };

  const toggleSaveResource = async (resourceId: string) => {
    try {
      const res = await fetch('/api/resources/toggle-save', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ resourceId }),
      }).then(r => r.json());

      setResources((prev) =>
        prev.map((r) => (r.id === resourceId ? { ...r, isSaved: res.isSaved } : r))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const speakText = (text: string, lang?: LanguageCode) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Clean markdown symbols, code blocks, and brackets for smooth natural speech
    const cleanText = text
      .replace(/```[\s\S]*?```/g, ' Code snippet omitted. ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[*#_$[\]()]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    if (!cleanText) return;

    const targetLang: LanguageCode = lang || learningPrefs.primaryLanguage || 'en';
    
    // Map language code to BCP 47 locale codes
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

    const bcpCode = langMap[targetLang] || 'en-US';
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = bcpCode;
    utterance.rate = accessibility.fontSize === 'xlarge' ? 0.9 : 1.0;

    // Pick best matching voice from available synthesis voices in the user's preferred language
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const languageKeywords: Record<LanguageCode, string[]> = {
        en: ['en-us', 'en-in', 'en-gb', 'english'],
        hi: ['hi-in', 'hindi', 'hi_in', 'hi'],
        kn: ['kn-in', 'kannada', 'kn_in', 'kn'],
        ta: ['ta-in', 'tamil', 'ta_in', 'ta'],
        te: ['te-in', 'telugu', 'te_in', 'te'],
        ml: ['ml-in', 'malayalam', 'ml_in', 'ml'],
        mr: ['mr-in', 'marathi', 'mr_in', 'mr'],
        bn: ['bn-in', 'bengali', 'bangla', 'bn_bd', 'bn']
      };

      const keywords = languageKeywords[targetLang] || ['en'];
      
      const matchingVoice = 
        voices.find(v => v.lang.toLowerCase() === bcpCode.toLowerCase()) ||
        voices.find(v => keywords.some(k => v.lang.toLowerCase().includes(k))) ||
        voices.find(v => keywords.some(k => v.name.toLowerCase().includes(k))) ||
        voices.find(v => v.lang.toLowerCase().startsWith(targetLang));

      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const criticalGaps = skills.filter((s) => s.status === 'critical-gap' || s.currentLevel < s.targetLevel - 25);

  return (
    <AppContext.Provider
      value={{
        user,
        accessibility,
        learningPrefs,
        skills,
        criticalGaps,
        modules,
        currentModuleId,
        activeCareerRoadmap,
        careers,
        chatHistory,
        resources,
        isLoading,
        isAiThinking,
        isSpeaking,
        activeView,
        isAccessibilityOpen,
        isAiModalOpen,
        isAuthModalOpen,
        authModalMode,
        setActiveView,
        setCurrentModuleId,
        setIsAccessibilityOpen,
        setIsAiModalOpen,
        setIsAuthModalOpen,
        setAuthModalMode,
        openAuthModal,
        logoutUser,
        updateAccessibility,
        updateLearningPrefs,
        updateUserProfile,
        generateRoadmap,
        toggleMilestone,
        switchUser,
        loginUser,
        signupUser,
        submitAssessment,
        submitQuiz,
        sendChatMessage,
        toggleSaveResource,
        speakText,
        stopSpeaking,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
