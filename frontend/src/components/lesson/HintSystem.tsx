import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

interface HintSystemProps {
  hints: [string, string, string];
  /** Callback when hint is revealed (for metrics) */
  onHintUsed?: (level: number) => void;
}

const HINT_LABELS = [
  { label: 'Dica Nível 1 — Indicação', icon: '🔍' },
  { label: 'Dica Nível 2 — Conceito', icon: '💡' },
  { label: 'Dica Nível 3 — Explicação', icon: '📖' },
];

/**
 * Sistema de dicas em 3 níveis progressivos.
 *
 * Nível 1: Indicação sutil ("Olhe para a linha X")
 * Nível 2: Dica conceitual ("O operador % retorna o resto")
 * Nível 3: Explicação completa com exemplo
 *
 * Autonomia preservada: o aluno escolhe quando pedir ajuda.
 * Sem penalização: usar dicas NUNCA remove XP ou progresso.
 *
 * Base: Hattie & Timperley (2007) — feedback progressivo
 */
export const HintSystem: React.FC<HintSystemProps> = ({ hints, onHintUsed }) => {
  const [revealedLevel, setRevealedLevel] = useState(-1);
  const [isExpanded, setIsExpanded] = useState(false);

  const revealNextHint = () => {
    const nextLevel = revealedLevel + 1;
    if (nextLevel < 3) {
      setRevealedLevel(nextLevel);
      setIsExpanded(true);
      onHintUsed?.(nextLevel);
    }
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-surface/30 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-surface/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-warning/10 rounded-lg">
            <Lightbulb className="w-4 h-4 text-warning" />
          </div>
          <span className="text-sm font-semibold">
            {revealedLevel >= 0
              ? `${revealedLevel + 1} de 3 dicas reveladas`
              : 'Precisa de ajuda?'}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted" />
        )}
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 space-y-3">
              {/* Revealed hints */}
              {hints.map((hint, idx) => {
                if (idx > revealedLevel) return null;
                const meta = HINT_LABELS[idx];
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 bg-background/50 rounded-xl border border-white/5"
                  >
                    <div className="text-xs font-bold text-warning/80 mb-1.5 flex items-center gap-1.5">
                      <span>{meta.icon}</span>
                      {meta.label}
                    </div>
                    <p className="text-sm leading-relaxed">{hint}</p>
                  </motion.div>
                );
              })}

              {/* Reveal button or "all revealed" */}
              {revealedLevel < 2 ? (
                <button
                  onClick={revealNextHint}
                  className="w-full py-2.5 px-4 rounded-xl bg-warning/10 hover:bg-warning/20 text-warning text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  {revealedLevel < 0
                    ? 'Ver Dica Nível 1'
                    : `Ver Dica Nível ${revealedLevel + 2}`}
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs text-muted py-2 justify-center">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Todas as dicas reveladas. Sem penalização no seu progresso.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
