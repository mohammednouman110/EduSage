export type LanguageCode = 'en' | 'hi' | 'kn' | 'ta' | 'te' | 'ml' | 'mr' | 'bn';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
];

export type FontSize = 'normal' | 'large' | 'xlarge';
export type ContrastMode = 'default' | 'high-contrast-dark' | 'high-contrast-light' | 'night-vision-amber';
export type LearningStyle = 'visual' | 'text' | 'audio' | 'interactive' | 'project';

export interface AccessibilityPreferences {
  fontSize: FontSize;
  contrastMode: ContrastMode;
  dyslexicFont: boolean;
  reducedMotion: boolean;
  textSpacing: boolean;
  simplifiedUI: boolean;
  captionsEnabled: boolean;
  textToSpeech: boolean;
  speechToText: boolean;
  screenReaderOptimized: boolean;
  autoAudioExplanations: boolean;
}

export interface LearningPreferences {
  primaryLanguage: LanguageCode;
  learningStyles: LearningStyle[];
  dailyGoalMinutes: number;
  explanationDepth: 'beginner-friendly' | 'balanced' | 'technical-in-depth';
  pace: 'relaxed' | 'moderate' | 'intensive';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  ageRange: string;
  educationLevel: string;
  courseOrDegree: string;
  currentOccupation?: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  interests: string[];
  targetCareerId?: string;
  targetCareerTitle?: string;
  avatarUrl?: string;
  createdAt: string;
  isDemoUser?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Technical' | 'Analytical' | 'Domain Knowledge' | 'Soft Skills' | 'Tooling';
  currentLevel: number; // 0 - 100
  targetLevel: number; // 0 - 100
  status: 'critical-gap' | 'developing' | 'mastered';
  priority: 'high' | 'medium' | 'low';
  lastEvaluated?: string;
  recommendedActions: string[];
}

export interface AssessmentQuestion {
  id: string;
  skillId: string;
  skillName: string;
  questionText: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  codeSnippet?: string;
  practicalHint?: string;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  careerGoal: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  skillBreakdown: {
    skillName: string;
    score: number;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    feedback: string;
  }[];
  criticalGaps: string[];
  recommendedFocus: string;
  completedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  adaptiveTip?: string;
}

export interface LearningModule {
  id: string;
  title: string;
  phaseNumber: number;
  phaseTitle: string;
  estimatedMinutes: number;
  skillTarget: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'locked' | 'in-progress' | 'completed';
  objectives: string[];
  summary: string;
  contentMarkdown: string;
  keyTakeaways: string[];
  practicalExercise: {
    title: string;
    prompt: string;
    sampleSolution: string;
    starterCode?: string;
  };
  quiz: QuizQuestion[];
  userScore?: number;
  resources: {
    title: string;
    type: 'article' | 'video' | 'documentation' | 'interactive';
    url: string;
    durationOrPages?: string;
  }[];
}

export interface CareerPath {
  id: string;
  title: string;
  category: string;
  description: string;
  matchScore: number; // 0 - 100
  averageSalaryIndia: string;
  globalDemandLevel: 'Very High' | 'High' | 'Moderate';
  requiredSkills: {
    name: string;
    requiredLevel: number;
    importance: 'Must-Have' | 'Important' | 'Nice-to-Have';
  }[];
  whyMatch: {
    positives: string[];
    gapsToClose: string[];
    aiInsight: string;
  };
  sampleRoles: string[];
  topHiringIndustries: string[];
}

export interface CareerRoadmapPhase {
  phaseNumber: number;
  title: string;
  durationWeeks: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  description: string;
  milestones: {
    id: string;
    title: string;
    type: 'course' | 'project' | 'certification' | 'portfolio' | 'interview-prep';
    completed: boolean;
    skillsAwarded: string[];
  }[];
}

export interface CareerRoadmap {
  careerId: string;
  careerTitle: string;
  readinessScore: {
    technicalSkills: number;
    problemSolving: number;
    projects: number;
    communication: number;
    portfolio: number;
    overall: number;
  };
  phases: CareerRoadmapPhase[];
  capstoneProjects: {
    id: string;
    title: string;
    description: string;
    difficulty: 'Intermediate' | 'Advanced';
    skillsTrained: string[];
    deliverables: string[];
  }[];
  interviewPrepTopics: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  language: LanguageCode;
  timestamp: string;
  simplifiedVersion?: string;
  suggestedFollowups?: string[];
  audioUrl?: string;
  isAudioPlaying?: boolean;
}

export interface AnalyticsData {
  weeklyStudyHours: { day: string; hours: number; target: number }[];
  skillMasteryRadar: { subject: string; current: number; target: number; fullMark: number }[];
  quizPerformanceHistory: { date: string; score: number; topic: string }[];
  careerReadinessTrend: { month: string; readiness: number }[];
  stats: {
    totalHoursSpent: number;
    currentStreakDays: number;
    lessonsCompleted: number;
    quizzesMastered: number;
    skillsUpgraded: number;
  };
}

export interface LearningResource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'documentation' | 'course' | 'project';
  skillGap: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  language: LanguageCode;
  url: string;
  source: string;
  description: string;
  isSaved?: boolean;
}
