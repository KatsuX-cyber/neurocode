import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Brain, 
  Target, 
  Coffee, 
  Type, 
  Palette, 
  MonitorPlay,
  Volume2,
  BookOpen
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { CognitiveMode, SensoryPreferences } from '../../types';

export const CognitiveSettings = () => {
  const { cognitiveMode, setCognitiveMode, preferences, updatePreferences } = useAppStore();

  const modes: { id: CognitiveMode; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
    { id: 'standard', label: 'Padrão', desc: 'Experiência equilibrada', icon: <Brain className="w-6 h-6" />, color: 'bg-surface' },
    { id: 'energetic', label: 'Energético', desc: 'Mais estimulação visual e ritmo acelerado', icon: <Zap className="w-6 h-6" />, color: 'bg-secondary/20 text-secondary border-secondary/50' },
    { id: 'focus', label: 'Foco', desc: 'Menos distrações, UI minimalista', icon: <Target className="w-6 h-6" />, color: 'bg-primary/20 text-primary border-primary/50' },
    { id: 'calm', label: 'Calmo', desc: 'Baixa carga sensorial, fontes maiores', icon: <Coffee className="w-6 h-6" />, color: 'bg-success/20 text-success border-success/50' },
  ];

  const colorSchemes = [
    { id: 'dark', label: 'Escuro (Padrão)', bg: '#0f172a' },
    { id: 'cream', label: 'Creme', bg: '#FFF8E7' },
    { id: 'light-blue', label: 'Azul Suave', bg: '#E8F0FE' },
    { id: 'light-green', label: 'Verde Suave', bg: '#E6F5EC' },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Seção 1: Modos Cognitivos */}
      <section className="bg-surface/50 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Perfil Cognitivo
        </h2>
        <p className="text-muted text-sm mb-6">
          Escolha o perfil que melhor se adapta a como o seu cérebro funciona hoje.
          Nós adaptamos o ritmo, a interface e o feedback automaticamente.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modes.map((mode) => {
            const isActive = cognitiveMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setCognitiveMode(mode.id)}
                className={`relative p-5 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-3 ${
                  isActive 
                    ? `border-primary shadow-lg shadow-primary/20 ${mode.color}` 
                    : 'border-white/5 bg-background hover:border-white/20'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeMode" 
                    className="absolute inset-0 bg-primary/10 rounded-2xl" 
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={`p-3 rounded-xl z-10 ${isActive ? '' : 'bg-surface text-muted'}`}>
                  {mode.icon}
                </div>
                <div className="z-10">
                  <h3 className={`font-bold ${isActive ? '' : 'text-main'}`}>{mode.label}</h3>
                  <p className={`text-xs mt-1 ${isActive ? 'opacity-90' : 'text-muted'}`}>{mode.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Seção 2: Preferências Sensoriais */}
      <section className="bg-surface/50 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Palette className="w-5 h-5 text-secondary" />
          Acessibilidade Sensorial
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Tipografia */}
          <div className="space-y-5">
            <h3 className="font-semibold text-sm text-muted uppercase tracking-wider flex items-center gap-2">
              <Type className="w-4 h-4" /> Tipografia
            </h3>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">Tamanho da Fonte</label>
              <select 
                value={preferences.fontSize}
                onChange={(e) => updatePreferences({ fontSize: e.target.value as SensoryPreferences['fontSize'] })}
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none"
              >
                <option value="normal">Normal</option>
                <option value="large">Grande (+15%)</option>
                <option value="xlarge">Extra Grande (+30%)</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Fonte (Dislexia)</label>
              <select 
                value={preferences.fontFamily}
                onChange={(e) => updatePreferences({ fontFamily: e.target.value as SensoryPreferences['fontFamily'] })}
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none"
              >
                <option value="inter">Padrão (Inter)</option>
                <option value="opendyslexic">OpenDyslexic</option>
              </select>
            </div>
          </div>

          {/* Interface Visual */}
          <div className="space-y-5">
            <h3 className="font-semibold text-sm text-muted uppercase tracking-wider flex items-center gap-2">
              <MonitorPlay className="w-4 h-4" /> Interface Visual
            </h3>

            <div className="space-y-3">
              <label className="text-sm font-medium">Esquema de Cores (Estresse Visual)</label>
              <div className="flex gap-3">
                {colorSchemes.map((scheme) => (
                  <button
                    key={scheme.id}
                    onClick={() => updatePreferences({ colorScheme: scheme.id as SensoryPreferences['colorScheme'] })}
                    className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${
                      preferences.colorScheme === scheme.id ? 'border-primary scale-110 shadow-lg shadow-primary/30' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: scheme.bg }}
                    title={scheme.label}
                  />
                ))}
              </div>
              <p className="text-xs text-muted">Tons suaves reduzem a fadiga ocular.</p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Animações</label>
              <select 
                value={preferences.animationLevel}
                onChange={(e) => updatePreferences({ animationLevel: e.target.value as SensoryPreferences['animationLevel'] })}
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none"
              >
                <option value="full">Completas</option>
                <option value="moderate">Moderadas</option>
                <option value="minimal">Mínimas (Recomendado para TDAH)</option>
                <option value="none">Desativadas (Recomendado para Sobrecarga)</option>
              </select>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
