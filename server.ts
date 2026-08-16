import express from 'express';
import path from 'path';
import * as archiverNamespace from 'archiver';
const archiver = (archiverNamespace as any).default || archiverNamespace;
import { createServer as createViteServer } from 'vite';
import { dataStore } from './server/storage.js';
import { askAiTutor, generateAdaptiveRecommendationExplanation } from './server/aiService.js';
import { 
  getSupabase, 
  isSupabaseConfigured, 
  saveUserToSupabase, 
  getUserFromSupabase, 
  saveAssessmentToSupabase 
} from './server/supabase.js';
import { UserProfile, AccessibilityPreferences, LearningPreferences, Skill } from './src/types.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to extract active user ID from request headers or query or session
  const getRequestUserId = (req: express.Request): string => {
    const headerId = (req.headers['x-user-id'] as string) || (req.query.userId as string);
    if (headerId && dataStore.users.has(headerId)) {
      return headerId;
    }
    return currentActiveUserId || 'demo-alex';
  };

  // Direct ZIP download of the codebase
  app.get('/api/download-zip', (req, res) => {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="edusage-project.zip"');

    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    archive.on('error', (err: any) => {
      console.error('Archive error:', err);
      if (!res.headersSent) {
        res.status(500).send({ error: err.message });
      }
    });

    archive.pipe(res);

    archive.glob('**/*', {
      cwd: process.cwd(),
      ignore: [
        'node_modules/**',
        'dist/**',
        '.git/**',
        '.cache/**',
        '.tmp/**',
        'package-lock.json',
      ],
      dot: true,
    });

    archive.finalize();
  });

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Current User Profile
  app.get('/api/users/me', async (req, res) => {
    const userId = getRequestUserId(req);
    const user = dataStore.users.get(userId) || dataStore.users.get('demo-alex')!;
    const accessibility = dataStore.accessibilityPrefs.get(user.id);
    const learningPrefs = dataStore.learningPrefs.get(user.id);
    res.json({ 
      user, 
      accessibility, 
      learningPrefs,
      supabaseConnected: isSupabaseConfigured() 
    });
  });

  // Check Supabase storage status
  app.get('/api/storage/status', (req, res) => {
    res.json({
      configured: isSupabaseConfigured(),
      provider: 'Supabase',
      syncEnabled: isSupabaseConfigured()
    });
  });

  // Update Profile
  app.put('/api/users/profile', async (req, res) => {
    const userId = getRequestUserId(req);
    const existing = dataStore.users.get(userId) || dataStore.users.get('demo-alex')!;
    const careerChanged = (req.body.targetCareerTitle && req.body.targetCareerTitle !== existing.targetCareerTitle) ||
      (req.body.targetCareerId && req.body.targetCareerId !== existing.targetCareerId) ||
      (req.body.experienceLevel && req.body.experienceLevel !== existing.experienceLevel);

    const updated: UserProfile = { ...existing, ...req.body };
    dataStore.users.set(updated.id, updated);

    // If career or level changed, update skills and roadmap dynamically
    if (careerChanged) {
      dataStore.initializeNewUser(updated);
    }

    // Asynchronously sync to Supabase if configured
    if (isSupabaseConfigured()) {
      saveUserToSupabase(updated).catch(err => console.warn('Supabase sync background error:', err));
    }

    res.json({ 
      success: true, 
      user: updated, 
      skills: dataStore.userSkills.get(updated.id),
      roadmap: dataStore.careerRoadmaps.get(updated.id),
      modules: dataStore.learningModules.get(updated.id),
      supabaseSynced: isSupabaseConfigured() 
    });
  });

  // Switch demo or logged-in user
  app.post('/api/demo/switch-user', (req, res) => {
    const { userId } = req.body;
    if (dataStore.users.has(userId)) {
      currentActiveUserId = userId;
      const user = dataStore.users.get(userId);
      const accessibility = dataStore.accessibilityPrefs.get(userId);
      const learningPrefs = dataStore.learningPrefs.get(userId);
      return res.json({ success: true, user, accessibility, learningPrefs });
    }
    res.status(404).json({ error: 'User not found' });
  });

  // Auth: Sign In
  app.post('/api/auth/login', async (req, res) => {
    const { email } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    // First check local in-memory store
    for (const [id, user] of dataStore.users.entries()) {
      if (user.email.toLowerCase() === cleanEmail) {
        currentActiveUserId = id;
        return res.json({
          success: true,
          user,
          accessibility: dataStore.accessibilityPrefs.get(id),
          learningPrefs: dataStore.learningPrefs.get(id),
          supabaseSynced: isSupabaseConfigured(),
        });
      }
    }

    // Next check Supabase if connected
    if (isSupabaseConfigured()) {
      const supabaseUser = await getUserFromSupabase(cleanEmail);
      if (supabaseUser) {
        dataStore.users.set(supabaseUser.id, supabaseUser);
        currentActiveUserId = supabaseUser.id;
        if (!dataStore.careerRoadmaps.has(supabaseUser.id)) {
          dataStore.initializeNewUser(supabaseUser);
        }
        return res.json({
          success: true,
          user: supabaseUser,
          accessibility: dataStore.accessibilityPrefs.get(supabaseUser.id) || dataStore.accessibilityPrefs.get('demo-alex'),
          learningPrefs: dataStore.learningPrefs.get(supabaseUser.id) || dataStore.learningPrefs.get('demo-alex'),
          supabaseSynced: true,
        });
      }
    }

    // If not found, return 404 so user can sign up instead of silently getting demo data
    res.status(404).json({
      success: false,
      error: `No account found with email "${email}". Please register a new account to begin.`
    });
  });

  // Auth: Sign Up (Fresh New User with Personalized Roadmap)
  app.post('/api/auth/signup', async (req, res) => {
    const { name, email, targetCareerTitle, educationLevel, experienceLevel } = req.body;
    const newId = `user-${Date.now()}`;
    const careerTitle = targetCareerTitle || 'Data Scientist';
    const careerId = careerTitle.toLowerCase().includes('ai')
      ? 'career-ai-engineer'
      : careerTitle.toLowerCase().includes('analyst')
      ? 'career-data-analyst'
      : careerTitle.toLowerCase().includes('cloud') || careerTitle.toLowerCase().includes('devops')
      ? 'career-cloud-devops'
      : 'career-data-scientist';

    const newProfile: UserProfile = {
      id: newId,
      name: name || 'Learner',
      email: email || `user_${Date.now()}@example.com`,
      ageRange: '20-25',
      educationLevel: educationLevel || 'Undergraduate',
      courseOrDegree: 'Computer Science & Engineering',
      experienceLevel: experienceLevel || 'beginner',
      interests: ['Technology', 'AI', 'Problem Solving'],
      targetCareerId: careerId,
      targetCareerTitle: careerTitle,
      createdAt: new Date().toISOString(),
      isDemoUser: false,
    };

    const newAccessibility: AccessibilityPreferences = {
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
      autoAudioExplanations: false,
    };

    const newLearning: LearningPreferences = {
      primaryLanguage: 'en',
      learningStyles: ['interactive', 'project'],
      dailyGoalMinutes: 30,
      explanationDepth: 'balanced',
      pace: 'moderate',
    };

    dataStore.users.set(newId, newProfile);
    dataStore.accessibilityPrefs.set(newId, newAccessibility);
    dataStore.learningPrefs.set(newId, newLearning);

    // Initialize fresh customized skills, modules, roadmap, chat
    const { skills, modules, roadmap } = dataStore.initializeNewUser(newProfile);

    // Sync to Supabase if configured
    if (isSupabaseConfigured()) {
      await saveUserToSupabase(newProfile);
    }

    currentActiveUserId = newId;
    res.json({ 
      success: true, 
      user: newProfile, 
      skills,
      modules,
      roadmap,
      accessibility: newAccessibility, 
      learningPrefs: newLearning,
      supabaseSynced: isSupabaseConfigured()
    });
  });

  // Accessibility Preferences
  app.get('/api/accessibility/preferences', (req, res) => {
    const userId = getRequestUserId(req);
    const prefs = dataStore.accessibilityPrefs.get(userId) || dataStore.accessibilityPrefs.get('demo-alex');
    res.json(prefs);
  });

  app.put('/api/accessibility/preferences', (req, res) => {
    const userId = getRequestUserId(req);
    const existing = dataStore.accessibilityPrefs.get(userId) || dataStore.accessibilityPrefs.get('demo-alex')!;
    const updated: AccessibilityPreferences = { ...existing, ...req.body };
    dataStore.accessibilityPrefs.set(userId, updated);
    res.json({ success: true, accessibility: updated });
  });

  // Learning Preferences
  app.get('/api/learning/preferences', (req, res) => {
    const userId = getRequestUserId(req);
    const prefs = dataStore.learningPrefs.get(userId) || dataStore.learningPrefs.get('demo-alex');
    res.json(prefs);
  });

  app.put('/api/learning/preferences', (req, res) => {
    const userId = getRequestUserId(req);
    const existing = dataStore.learningPrefs.get(userId) || dataStore.learningPrefs.get('demo-alex')!;
    const updated: LearningPreferences = { ...existing, ...req.body };
    dataStore.learningPrefs.set(userId, updated);
    res.json({ success: true, learningPrefs: updated });
  });

  // Skills and Skill Gaps
  app.get('/api/skills', (req, res) => {
    const userId = getRequestUserId(req);
    const skills = dataStore.userSkills.get(userId) || dataStore.userSkills.get('demo-alex') || [];
    res.json({ skills });
  });

  app.get('/api/skills/gaps', (req, res) => {
    const userId = getRequestUserId(req);
    const skills = dataStore.userSkills.get(userId) || dataStore.userSkills.get('demo-alex') || [];
    const criticalGaps = skills.filter((s) => s.status === 'critical-gap' || s.currentLevel < s.targetLevel - 25);
    const developing = skills.filter((s) => s.status === 'developing');
    const strong = skills.filter((s) => s.currentLevel >= 75);
    res.json({ criticalGaps, developing, strong, allSkills: skills });
  });

  // Assessment Questions
  app.get('/api/assessment/questions', (req, res) => {
    const userId = getRequestUserId(req);
    const user = dataStore.users.get(userId) || dataStore.users.get('demo-alex')!;
    const questions = dataStore.getAssessmentQuestionsForCareer(user.targetCareerId || 'career-data-scientist');
    res.json({ questions, careerGoal: user.targetCareerTitle });
  });

  // Submit Assessment Result
  app.post('/api/assessment/submit', (req, res) => {
    const userId = getRequestUserId(req);
    const { answers, careerGoal } = req.body;
    const user = dataStore.users.get(userId) || dataStore.users.get('demo-alex')!;
    const questions = dataStore.getAssessmentQuestionsForCareer(user.targetCareerId || 'career-data-scientist');

    let correctCount = 0;
    const skillScores: Record<string, { total: number; correct: number; skillName: string }> = {};

    questions.forEach((q) => {
      const selectedOptionId = answers[q.id];
      const correctOption = q.options.find((o) => o.isCorrect);
      const isCorrect = selectedOptionId === correctOption?.id;
      if (isCorrect) correctCount++;

      if (!skillScores[q.skillId]) {
        skillScores[q.skillId] = { total: 0, correct: 0, skillName: q.skillName };
      }
      skillScores[q.skillId].total++;
      if (isCorrect) skillScores[q.skillId].correct++;
    });

    const scorePercentage = Math.round((correctCount / (questions.length || 1)) * 100);

    // Update user skills dynamically
    const currentSkills = dataStore.userSkills.get(userId) || [];
    const updatedSkills: Skill[] = currentSkills.map((s) => {
      if (skillScores[s.id]) {
        const perf = (skillScores[s.id].correct / skillScores[s.id].total) * 100;
        const newLevel = Math.round((s.currentLevel + perf) / 2);
        return {
          ...s,
          currentLevel: newLevel,
          status: newLevel < 50 ? 'critical-gap' : newLevel < 75 ? 'developing' : 'mastered',
          lastEvaluated: new Date().toISOString().split('T')[0],
        };
      }
      return s;
    });

    dataStore.userSkills.set(userId, updatedSkills);

    // Save assessment results to Supabase if configured
    if (isSupabaseConfigured()) {
      saveAssessmentToSupabase(userId, {
        careerId: user.targetCareerId || 'career-data-scientist',
        careerGoal: careerGoal || user.targetCareerTitle,
        overallScore: scorePercentage,
        skillScores,
      }).catch(err => console.warn('Supabase assessment background sync error:', err));
    }

    res.json({
      success: true,
      scorePercentage,
      correctCount,
      totalQuestions: questions.length,
      updatedSkills,
      criticalGaps: updatedSkills.filter((s) => s.status === 'critical-gap').map((s) => s.name),
      supabaseSynced: isSupabaseConfigured(),
    });
  });

  // Learning Modules & Progress
  app.get('/api/learning/modules', (req, res) => {
    const userId = getRequestUserId(req);
    const modules = dataStore.learningModules.get(userId) || dataStore.learningModules.get('demo-alex') || [];
    res.json({ modules });
  });

  app.get('/api/learning/module/:id', (req, res) => {
    const userId = getRequestUserId(req);
    const modules = dataStore.learningModules.get(userId) || dataStore.learningModules.get('demo-alex') || [];
    const module = modules.find((m) => m.id === req.params.id);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }
    res.json({ module });
  });

  // Submit Module Quiz (Adaptive mastery engine)
  app.post('/api/learning/module/:id/quiz', (req, res) => {
    const userId = getRequestUserId(req);
    const { answers } = req.body;
    const modules = dataStore.learningModules.get(userId) || dataStore.learningModules.get('demo-alex') || [];
    const module = modules.find((m) => m.id === req.params.id);

    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    let correctCount = 0;
    module.quiz.forEach((q, idx) => {
      if (answers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / (module.quiz.length || 1)) * 100);
    module.userScore = score;
    module.status = score >= 70 ? 'completed' : 'in-progress';

    // Update corresponding skill level
    const userSkills = dataStore.userSkills.get(userId) || [];
    const matchingSkill = userSkills.find((s) => s.name === module.skillTarget);
    if (matchingSkill) {
      if (score >= 70) {
        matchingSkill.currentLevel = Math.min(100, matchingSkill.currentLevel + 12);
        if (matchingSkill.currentLevel >= 75) matchingSkill.status = 'developing';
        if (matchingSkill.currentLevel >= 85) matchingSkill.status = 'mastered';
      }
    }

    res.json({
      success: true,
      score,
      passed: score >= 70,
      feedback:
        score >= 70
          ? 'Excellent work! You mastered this concept. System unlocked the next module.'
          : 'Good effort. The AI Tutor has generated a simplified breakdown and targeted practice for your weak spots.',
      adaptiveRecommendation:
        score >= 70
          ? 'Ready to proceed to real-world applied exercises.'
          : 'Review Bayes Theorem foundation and try the interactive code sandbox.',
    });
  });

  // Career Paths & Recommendations
  app.get('/api/careers', (req, res) => {
    const careers = dataStore.getAllCareerPaths();
    res.json({ careers });
  });

  app.get('/api/careers/:id', (req, res) => {
    const careers = dataStore.getAllCareerPaths();
    const career = careers.find((c) => c.id === req.params.id);
    if (!career) return res.status(404).json({ error: 'Career not found' });
    res.json({ career });
  });

  // Career Roadmap
  app.get('/api/careers/:id/roadmap', (req, res) => {
    const userId = getRequestUserId(req);
    let roadmap = dataStore.careerRoadmaps.get(userId);
    if (!roadmap) {
      const user = dataStore.users.get(userId) || dataStore.users.get('demo-alex')!;
      const skills = dataStore.userSkills.get(userId) || dataStore.getBaselineSkillsForCareer(user.targetCareerTitle);
      roadmap = dataStore.generateTailoredRoadmap(user.targetCareerTitle, user.targetCareerId, skills);
      dataStore.careerRoadmaps.set(userId, roadmap);
    }
    res.json({ roadmap });
  });

  // Explicit dynamic roadmap generator
  app.post('/api/roadmap/generate', (req, res) => {
    const userId = getRequestUserId(req);
    const { careerTitle, experienceLevel } = req.body;
    const user = dataStore.users.get(userId) || dataStore.users.get('demo-alex')!;
    
    const targetTitle = careerTitle || user.targetCareerTitle || 'Data Scientist';
    const targetId = targetTitle.toLowerCase().includes('ai')
      ? 'career-ai-engineer'
      : targetTitle.toLowerCase().includes('analyst')
      ? 'career-data-analyst'
      : targetTitle.toLowerCase().includes('cloud') || targetTitle.toLowerCase().includes('devops')
      ? 'career-cloud-devops'
      : 'career-data-scientist';

    const level = experienceLevel || user.experienceLevel || 'beginner';
    const updatedUser: UserProfile = {
      ...user,
      targetCareerTitle: targetTitle,
      targetCareerId: targetId,
      experienceLevel: level
    };
    dataStore.users.set(user.id, updatedUser);

    const { skills, modules, roadmap } = dataStore.initializeNewUser(updatedUser);

    res.json({
      success: true,
      user: updatedUser,
      roadmap,
      skills,
      modules
    });
  });

  // Toggle milestone completion in roadmap
  app.post('/api/roadmap/milestone/:id/toggle', (req, res) => {
    const userId = getRequestUserId(req);
    const milestoneId = req.params.id;
    const roadmap = dataStore.careerRoadmaps.get(userId);
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }

    let found = false;
    let completed = false;
    let completedCount = 0;
    let totalCount = 0;

    for (const phase of roadmap.phases) {
      for (const ms of phase.milestones) {
        totalCount++;
        if (ms.id === milestoneId) {
          ms.completed = !ms.completed;
          found = true;
          completed = ms.completed;
        }
        if (ms.completed) completedCount++;
      }
    }

    if (!found) {
      return res.status(404).json({ error: 'Milestone not found' });
    }

    // Update readiness score
    const newProgress = Math.min(100, Math.round((completedCount / (totalCount || 1)) * 100));
    roadmap.readinessScore.projects = Math.min(100, 15 + Math.round(newProgress * 0.8));
    roadmap.readinessScore.overall = Math.min(100, Math.round(
      (roadmap.readinessScore.technicalSkills * 0.4) +
      (roadmap.readinessScore.problemSolving * 0.3) +
      (roadmap.readinessScore.projects * 0.3)
    ));

    dataStore.careerRoadmaps.set(userId, roadmap);
    res.json({ success: true, milestoneId, completed, roadmap });
  });

  // AI Tutor Chat
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const userId = getRequestUserId(req);
      const { message, language, currentModuleTitle, requestSimplified } = req.body;
      const user = dataStore.users.get(userId) || dataStore.users.get('demo-alex')!;
      const accessibility = dataStore.accessibilityPrefs.get(user.id);
      const learningPrefs = dataStore.learningPrefs.get(user.id);
      const skills = dataStore.userSkills.get(user.id);

      const aiResponse = await askAiTutor({
        user,
        accessibility,
        learningPrefs,
        skills,
        userQuery: message,
        language,
        currentModuleTitle,
        requestSimplified,
      });

      // Save to chat history
      const history = dataStore.chatHistories.get(user.id) || [];
      const userMsg = {
        id: `user-${Date.now()}`,
        sender: 'user' as const,
        text: message,
        language: aiResponse.language,
        timestamp: new Date().toISOString(),
      };
      const assistantMsg = {
        id: `ai-${Date.now()}`,
        sender: 'assistant' as const,
        text: aiResponse.text,
        simplifiedVersion: aiResponse.simplifiedVersion,
        suggestedFollowups: aiResponse.suggestedFollowups,
        language: aiResponse.language,
        timestamp: new Date().toISOString(),
      };

      history.push(userMsg, assistantMsg);
      dataStore.chatHistories.set(user.id, history);

      res.json({ response: assistantMsg });
    } catch (err: any) {
      console.error('Error handling AI chat:', err);
      res.status(500).json({ error: 'Failed to process AI chat request' });
    }
  });

  app.get('/api/ai/history', (req, res) => {
    const userId = getRequestUserId(req);
    const user = dataStore.users.get(userId) || dataStore.users.get('demo-alex')!;
    const history = dataStore.chatHistories.get(user.id) || [];
    res.json({ history });
  });

  // Resources
  app.get('/api/resources', (req, res) => {
    const userId = getRequestUserId(req);
    const all = dataStore.getAllResources();
    const saved = dataStore.savedResources.get(userId) || new Set();
    const enriched = all.map((r) => ({
      ...r,
      isSaved: saved.has(r.id),
    }));
    res.json({ resources: enriched });
  });

  app.post('/api/resources/toggle-save', (req, res) => {
    const userId = getRequestUserId(req);
    const { resourceId } = req.body;
    let saved = dataStore.savedResources.get(userId);
    if (!saved) {
      saved = new Set();
      dataStore.savedResources.set(userId, saved);
    }
    if (saved.has(resourceId)) {
      saved.delete(resourceId);
    } else {
      saved.add(resourceId);
    }
    res.json({ success: true, isSaved: saved.has(resourceId) });
  });

  // Analytics
  app.get('/api/analytics', (req, res) => {
    const userId = getRequestUserId(req);
    const user = dataStore.users.get(userId) || dataStore.users.get('demo-alex')!;
    const userSkills = dataStore.userSkills.get(userId) || [];
    const modules = dataStore.learningModules.get(userId) || [];
    const roadmap = dataStore.careerRoadmaps.get(userId);

    const radarData = userSkills.map((s) => ({
      subject: s.name.split(' ')[0],
      current: s.currentLevel,
      target: s.targetLevel,
      fullMark: 100,
    }));

    const isDemo = user.isDemoUser !== false && (user.id === 'demo-alex' || user.id === 'demo-priya');
    const completedModules = modules.filter((m) => m.status === 'completed').length;
    const scoredModules = modules.filter((m) => typeof m.userScore === 'number');

    const totalHours = isDemo
      ? 38.5
      : Number((completedModules * 0.5 + (scoredModules.length > 0 ? 0.8 : 0.2)).toFixed(1));

    const streak = isDemo ? 6 : 1;
    const lessonsCompleted = isDemo ? 8 : completedModules;
    const quizzesMastered = isDemo ? 6 : modules.filter((m) => (m.userScore || 0) >= 70).length;
    const skillsUpgraded = isDemo ? 4 : userSkills.filter((s) => s.currentLevel >= 60).length;
    const currentReadiness = roadmap?.readinessScore?.overall || (isDemo ? 63 : 22);

    res.json({
      weeklyStudyHours: isDemo ? [
        { day: 'Mon', hours: 1.5, target: 1.0 },
        { day: 'Tue', hours: 2.0, target: 1.0 },
        { day: 'Wed', hours: 0.8, target: 1.0 },
        { day: 'Thu', hours: 2.5, target: 1.0 },
        { day: 'Fri', hours: 1.8, target: 1.0 },
        { day: 'Sat', hours: 3.2, target: 1.5 },
        { day: 'Sun', hours: 2.2, target: 1.5 },
      ] : [
        { day: 'Mon', hours: 0.0, target: 1.0 },
        { day: 'Tue', hours: 0.0, target: 1.0 },
        { day: 'Wed', hours: 0.0, target: 1.0 },
        { day: 'Thu', hours: 0.0, target: 1.0 },
        { day: 'Fri', hours: 0.0, target: 1.0 },
        { day: 'Sat', hours: 0.0, target: 1.0 },
        { day: 'Today', hours: totalHours, target: 1.0 },
      ],
      skillMasteryRadar: radarData,
      quizPerformanceHistory: isDemo ? [
        { date: 'Aug 06', score: 65, topic: 'Python Basics' },
        { date: 'Aug 08', score: 78, topic: 'Pandas Aggregation' },
        { date: 'Aug 10', score: 72, topic: 'Bayes Theorem' },
        { date: 'Aug 12', score: 85, topic: 'SQL Window Functions' },
      ] : scoredModules.map((m, idx) => ({
        date: `Quiz ${idx + 1}`,
        score: m.userScore || 0,
        topic: m.title.split(':')[0]
      })),
      careerReadinessTrend: isDemo ? [
        { month: 'May', readiness: 42 },
        { month: 'Jun', readiness: 49 },
        { month: 'Jul', readiness: 56 },
        { month: 'Aug', readiness: 63 },
      ] : [
        { month: 'Start', readiness: 15 },
        { month: 'Current', readiness: currentReadiness },
      ],
      stats: {
        totalHoursSpent: totalHours,
        currentStreakDays: streak,
        lessonsCompleted: lessonsCompleted,
        quizzesMastered: quizzesMastered,
        skillsUpgraded: skillsUpgraded,
      },
    });
  });

  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Inclusive AI Learning Server running on http://localhost:${PORT}`);
  });
}

startServer();
