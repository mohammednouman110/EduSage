import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home,
  Compass, 
  Sparkles, 
  GraduationCap, 
  BarChart3, 
  BookMarked, 
  Target, 
  Layers, 
  Menu, 
  X, 
  TrendingUp,
  LogIn,
  UserPlus,
  User,
  ChevronDown,
  LogOut,
  Bird
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    user, 
    activeView, 
    setActiveView, 
    switchUser, 
    setIsAiModalOpen,
    openAuthModal,
    logoutUser,
    criticalGaps
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'assessment', label: 'Adaptive Assessment', icon: Sparkles },
    { id: 'skills', label: 'Skill Gap Matrix', icon: Layers, badge: criticalGaps.length > 0 ? `${criticalGaps.length} Gaps` : undefined },
    { id: 'learning', label: 'Learning Path', icon: GraduationCap },
    { id: 'careers', label: 'Career Intelligence', icon: Target },
    { id: 'roadmap', label: 'Career Roadmap', icon: TrendingUp },
    { id: 'ai-tutor', label: 'EduSage Tutor', icon: GraduationCap },
    { id: 'resources', label: 'Resources', icon: BookMarked },
    { id: 'analytics', label: 'Progress', icon: BarChart3 },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-10 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand with EduSage */}
          <div className="flex items-center gap-3">
            <button
              id="brand-logo-btn"
              onClick={() => setActiveView('landing')}
              className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-[#215ba7] text-white flex items-center justify-center shadow-xs group-hover:bg-[#1a4a8a] transition-colors">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#191c20] tracking-tight text-base sm:text-lg">
                    Edu<span className="text-[#215ba7]">Sage</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#d6e3ff] text-[#001b3d]">
                    Adaptive AI
                  </span>
                </div>
                <p className="text-[11px] text-[#424751] font-medium hidden sm:block">
                  Adaptive Learning & Career Intelligence
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}-btn`}
                  onClick={() => setActiveView(item.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors relative ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-orange-100 text-orange-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Medium Screens Nav (Subset) */}
          <nav className="hidden lg:flex xl:hidden items-center gap-1">
            {navItems.slice(0, 6).map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}-btn`}
                  onClick={() => setActiveView(item.id)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors relative ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Account / Auth Dropdown */}
            <div className="relative">
              <button
                id="user-account-dropdown-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-medium transition-colors"
                aria-expanded={userDropdownOpen}
              >
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="max-w-[80px] sm:max-w-[110px] truncate font-bold text-xs">
                  {user?.name || 'User'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900">{user?.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
                    <div className="text-[10px] font-semibold text-blue-600 mt-0.5">
                      {user?.targetCareerTitle || 'Data Scientist'}
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveView('login');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-[#f2f3fa] flex items-center gap-2 font-medium"
                    >
                      <LogIn className="w-3.5 h-3.5 text-[#215ba7]" />
                      <span>Dedicated Login Page</span>
                    </button>
                    <button
                      onClick={() => {
                        openAuthModal('signin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-[#f2f3fa] flex items-center gap-2"
                    >
                      <LogIn className="w-3.5 h-3.5 text-[#215ba7]" />
                      <span>Sign In with Another Account</span>
                    </button>
                    <button
                      onClick={() => {
                        openAuthModal('signup');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-[#f2f3fa] flex items-center gap-2"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Create New User Profile</span>
                    </button>
                  </div>

                  <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Switch Demo Personas
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          switchUser('demo-alex');
                          setUserDropdownOpen(false);
                          setActiveView('dashboard');
                        }}
                        className={`flex-1 py-1 px-2 rounded-md text-[11px] font-semibold border ${
                          user?.id === 'demo-alex' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Alex
                      </button>
                      <button
                        onClick={() => {
                          switchUser('demo-priya');
                          setUserDropdownOpen(false);
                          setActiveView('dashboard');
                        }}
                        className={`flex-1 py-1 px-2 rounded-md text-[11px] font-semibold border ${
                          user?.id === 'demo-priya' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Priya
                      </button>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        logoutUser();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out (Back to Landing)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* AI Assistant Quick Launcher */}
            <button
              id="header-ai-tutor-btn"
              onClick={() => setIsAiModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Ask EduSage AI</span>
            </button>

            {/* Mobile menu button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          {/* Quick Sign In / Register in Mobile Drawer */}
          <div className="flex gap-2 mb-2 pb-2 border-b border-slate-100">
            <button
              onClick={() => { openAuthModal('signin'); setMobileMenuOpen(false); }}
              className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-blue-600" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => { openAuthModal('signup'); setMobileMenuOpen(false); }}
              className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>New User</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => { switchUser('demo-alex'); setMobileMenuOpen(false); }}
              className={`p-2 text-xs rounded-lg font-medium border ${user?.id === 'demo-alex' ? 'bg-blue-50 border-blue-400 text-blue-800' : 'border-slate-200'}`}
            >
              Alex (Data Science)
            </button>
            <button
              onClick={() => { switchUser('demo-priya'); setMobileMenuOpen(false); }}
              className={`p-2 text-xs rounded-lg font-medium border ${user?.id === 'demo-priya' ? 'bg-blue-50 border-blue-400 text-blue-800' : 'border-slate-200'}`}
            >
              Priya (Hindi/AI)
            </button>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full p-2.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                  isActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-blue-600" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

