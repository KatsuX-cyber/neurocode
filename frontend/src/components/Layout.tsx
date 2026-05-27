import React, { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { BookOpen, Home, Trophy, User, Zap, BrainCircuit, Maximize2, Minimize2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';

export const Layout = () => {
  const { isFocusMode, toggleFocusMode, xp, streak, cognitiveMode, preferences } = useAppStore();
  const location = useLocation();

  // Sync cognitive mode and preferences to CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-mode', cognitiveMode);
    root.setAttribute('data-scheme', preferences.colorScheme);
    root.setAttribute('data-font', preferences.fontFamily);
    root.setAttribute('data-fontsize', preferences.fontSize);
  }, [cognitiveMode, preferences.colorScheme, preferences.fontFamily, preferences.fontSize]);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-main font-sans selection:bg-primary selection:text-white">
      
      {/* Sidebar - Hidden in Focus Mode */}
      <AnimatePresence>
        {!isFocusMode && (
          <motion.aside 
            initial={{ width: 0, opacity: 0, x: -50 }}
            animate={{ width: 280, opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-[280px] border-r border-surface flex flex-col bg-background/80 backdrop-blur-xl z-20 relative shadow-2xl"
          >
            <div className="p-8 flex items-center gap-4">
              <div className="bg-gradient-to-br from-primary to-secondary p-2.5 rounded-2xl shadow-lg shadow-primary/30 animate-glow">
                <BrainCircuit className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-muted">NeuroCode</h1>
            </div>

            <nav className="flex-1 px-5 space-y-3 mt-4">
              <NavItem to="/" icon={<Home />} label="Dashboard" active={location.pathname === '/'} />
              <NavItem to="/courses" icon={<BookOpen />} label="Cursos" active={location.pathname.startsWith('/courses')} />
              <NavItem to="/achievements" icon={<Trophy />} label="Conquistas" active={location.pathname === '/achievements'} />
              <NavItem to="/profile" icon={<User />} label="Perfil" active={location.pathname === '/profile'} />
            </nav>

            <div className="p-6">
              <div className="bg-surface/50 border border-surface rounded-2xl p-4 flex flex-col gap-3 backdrop-blur-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-muted uppercase tracking-wider">Seu Progresso</span>
                </div>
                <div className="flex items-center justify-between bg-background/50 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="p-1.5 bg-yellow-400/10 rounded-lg group-hover:bg-yellow-400/20 transition-colors">
                      <Zap className="w-5 h-5 text-yellow-400" />
                    </div>
                    <span className="font-bold text-main">{streak} dias</span>
                  </div>
                  <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="p-1.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Trophy className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-primary font-bold">{xp} XP</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative bg-[radial-gradient(ellipse_at_top_right,_var(--color-surface)_0%,_transparent_50%)]">
        {/* Top Header - Minimal in focus mode */}
        <header className={`flex items-center justify-between px-8 py-5 transition-all duration-300 ${isFocusMode ? 'bg-transparent absolute w-full z-30 pointer-events-none' : 'bg-transparent z-10'}`}>
          <div className="flex items-center gap-4 pointer-events-auto">
            {isFocusMode && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 bg-surface/80 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-2xl border border-primary/20"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20"></div>
                  <BrainCircuit className="w-5 h-5 text-primary relative" />
                </div>
                <span className="text-sm font-bold tracking-wide">MODO FOCO ATIVO</span>
              </motion.div>
            )}
          </div>
          
          <button 
            onClick={toggleFocusMode}
            className={`pointer-events-auto p-3 rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-lg ${
              isFocusMode 
                ? 'bg-surface/80 backdrop-blur-xl border border-white/10 hover:border-primary text-main' 
                : 'bg-surface hover:bg-surface/80 text-muted hover:text-main'
            }`}
            title="Alternar Modo Foco"
          >
            {isFocusMode ? (
              <>
                <Minimize2 className="w-5 h-5" />
                <span className="text-sm font-bold">Sair do Foco</span>
              </>
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 relative scroll-smooth">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) => {
  return (
    <Link 
      to={to} 
      className={`group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden ${
        active 
          ? 'text-white font-semibold' 
          : 'text-muted hover:text-main'
      }`}
    >
      {active && (
        <motion.div 
          layoutId="activeNavBackground"
          className="absolute inset-0 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-2xl z-0"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      
      <div className={`relative z-10 p-2 rounded-xl transition-all duration-300 ${active ? 'bg-primary shadow-lg shadow-primary/40 text-white' : 'bg-surface group-hover:bg-surface/80 text-muted group-hover:text-main'}`}>
        {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
      </div>
      <span className="relative z-10 tracking-wide">{label}</span>
    </Link>
  );
};
