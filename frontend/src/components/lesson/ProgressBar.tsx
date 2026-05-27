import React from 'react';
import { motion } from 'framer-motion';
import type { LessonBlock, BlockType } from '../../types';
import { Sparkles, BookOpen, Code2, CheckCircle2, Trophy, Lightbulb } from 'lucide-react';

// === Icons & Labels per block type ===

const BLOCK_META: Record<BlockType, { icon: React.ReactNode; label: string }> = {
  hook:       { icon: <Sparkles className="w-3.5 h-3.5" />, label: 'Contexto' },
  explain:    { icon: <BookOpen className="w-3.5 h-3.5" />, label: 'Conceito' },
  practice:   { icon: <Code2 className="w-3.5 h-3.5" />, label: 'Prática' },
  checkpoint: { icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: 'Verificação' },
  reward:     { icon: <Trophy className="w-3.5 h-3.5" />, label: 'Progresso' },
};

// === ProgressBar Props ===

interface ProgressBarProps {
  blocks: LessonBlock[];
  currentIndex: number;
  /** Include challenge as final segment */
  hasChallenge?: boolean;
}

/**
 * Barra de progresso segmentada para lições ARPERC.
 * Mostra cada bloco como um segmento com ícone.
 * Blocos completados = filled, atual = highlighted, futuros = dimmed.
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  blocks,
  currentIndex,
  hasChallenge = true,
}) => {
  const totalSteps = blocks.length + (hasChallenge ? 1 : 0);
  const progressPercent = ((currentIndex + 1) / totalSteps) * 100;

  return (
    <div className="w-full mb-6">
      {/* Overall progress bar */}
      <div className="w-full bg-surface/60 h-2 rounded-full overflow-hidden mb-4 border border-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {/* Segmented steps */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {blocks.map((block, idx) => {
          const meta = BLOCK_META[block.type];
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isFuture = idx > currentIndex;

          return (
            <div
              key={block.id}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                isCompleted
                  ? 'bg-success/20 text-success'
                  : isCurrent
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-surface/30 text-muted/50'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                meta.icon
              )}
              <span className={isFuture ? 'opacity-40' : ''}>{meta.label}</span>
            </div>
          );
        })}

        {/* Challenge step */}
        {hasChallenge && (
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
              currentIndex >= blocks.length
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-surface/30 text-muted/50 opacity-40'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Desafio</span>
          </div>
        )}
      </div>
    </div>
  );
};
