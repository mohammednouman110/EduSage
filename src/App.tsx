import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AccessibilityToolbar } from './components/accessibility/AccessibilityToolbar';
import { AccessibilityPanel } from './components/accessibility/AccessibilityPanel';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AITutorFloating } from './components/ai/AITutorFloating';
import { AITutorModal } from './components/ai/AITutorModal';
import { AuthModal } from './components/auth/AuthModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { LearningPlanPage } from './pages/LearningPlanPage';
import { ModuleDetailPage } from './pages/ModuleDetailPage';
import { CareersPage } from './pages/CareersPage';
import { CareerRoadmapPage } from './pages/CareerRoadmapPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { AITutorPage } from './pages/AITutorPage';

const MainAppContent: React.FC = () => {
  const { 
    activeView, 
    isLoading,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode
  } = useApp();

  const renderActiveView = () => {
    switch (activeView) {
      case 'landing':
        return <LandingPage />;
      case 'login':
      case 'auth':
        return <LoginPage />;
      case 'onboarding':
        return <OnboardingPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'assessment':
        return <AssessmentPage />;
      case 'skills':
        return <SkillGapPage />;
      case 'learning':
        return <LearningPlanPage />;
      case 'module-detail':
        return <ModuleDetailPage />;
      case 'careers':
        return <CareersPage />;
      case 'roadmap':
        return <CareerRoadmapPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'resources':
        return <ResourcesPage />;
      case 'ai-tutor':
        return <AITutorPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-blue-200 selection:text-blue-900">
      {/* Top Quick Accessibility Controls */}
      <AccessibilityToolbar />

      {/* Primary Brand Navigation Bar */}
      {activeView !== 'login' && activeView !== 'auth' && <Navbar />}

      {/* Main Content Area */}
      <main id="main-content-viewport" className="flex-1" tabIndex={-1}>
        {isLoading && (
          <div className="bg-[#215ba7] text-white text-[11px] font-semibold py-1 px-4 text-center animate-pulse">
            Syncing adaptive profile & skill diagnostics...
          </div>
        )}
        {renderActiveView()}
      </main>

      {/* Semantic Footer */}
      {activeView !== 'login' && activeView !== 'auth' && <Footer />}

      {/* Floating AI Assistant Action Button */}
      <AITutorFloating />

      {/* AI Tutor Chat Dialog */}
      <AITutorModal />

      {/* User Sign In / Registration Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      {/* Full Accessibility Preferences Drawer */}
      <AccessibilityPanel />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
