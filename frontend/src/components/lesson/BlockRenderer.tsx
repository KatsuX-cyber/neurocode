import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle2, XCircle, Sparkles, BookOpen, Code2, Trophy } from 'lucide-react';
import type { LessonBlock, CognitiveMode } from '../../types';
import { getCheckpointFeedback } from '../../engine/feedbackEngine';

interface BlockRendererProps {
  block: LessonBlock;
  onComplete: () => void;
  isActive: boolean;
  isCompleted: boolean;
  cognitiveMode: CognitiveMode;
  /** Whether to auto-show continue button (practice blocks wait for user) */
  showEditor?: boolean;
}

/**
 * Renderiza um bloco ARPERC individual.
 * Cada tipo tem visual e interação distintos:
 * - hook: texto provocativo com borda cyan
 * - explain: conceito + código com borda purple
 * - practice: instrução para usar o editor
 * - checkpoint: MCQ interativo
 * - reward: celebração + recap
 */
export const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  onComplete,
  isActive,
  isCompleted,
  cognitiveMode,
}) => {
  if (!isActive && !isCompleted) return null;

  const animationDuration = cognitiveMode === 'calm' ? 0.5 : 0.3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: isCompleted && !isActive ? 0.5 : 1, y: 0 }}
      transition={{ duration: animationDuration }}
      className={`lesson-block lesson-block--${block.type} ${
        isCompleted && !isActive ? 'scale-[0.98]' : ''
      }`}
    >
      {block.type === 'hook' && (
        <HookContent block={block} onComplete={onComplete} isActive={isActive} />
      )}
      {block.type === 'explain' && (
        <ExplainContent block={block} onComplete={onComplete} isActive={isActive} />
      )}
      {block.type === 'practice' && (
        <PracticeContent block={block} onComplete={onComplete} isActive={isActive} />
      )}
      {block.type === 'checkpoint' && (
        <CheckpointContent block={block} onComplete={onComplete} isActive={isActive} />
      )}
      {block.type === 'reward' && (
        <RewardContent block={block} onComplete={onComplete} isActive={isActive} />
      )}
    </motion.div>
  );
};

// === Block Type Components ===

const ContinueButton: React.FC<{ onClick: () => void; label?: string }> = ({
  onClick,
  label = 'Continuar',
}) => (
  <button
    onClick={onClick}
    className="mt-4 flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
  >
    {label}
    <ChevronRight className="w-4 h-4" />
  </button>
);

// --- Hook ---
const HookContent: React.FC<{
  block: LessonBlock;
  onComplete: () => void;
  isActive: boolean;
}> = ({ block, onComplete, isActive }) => (
  <div>
    <div className="flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-wider mb-3">
      <Sparkles className="w-4 h-4" />
      Contexto
    </div>
    <p className="text-lg leading-relaxed font-medium">{block.content}</p>
    {isActive && <ContinueButton onClick={onComplete} label="Entendi, vamos lá!" />}
  </div>
);

// --- Explain ---
const ExplainContent: React.FC<{
  block: LessonBlock;
  onComplete: () => void;
  isActive: boolean;
}> = ({ block, onComplete, isActive }) => (
  <div>
    <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-3">
      <BookOpen className="w-4 h-4" />
      {block.title || 'Conceito'}
    </div>
    <p className="text-lg leading-relaxed">{block.content}</p>
    {block.code && (
      <div className="lesson-code-block">
        <code>{block.code}</code>
      </div>
    )}
    {isActive && <ContinueButton onClick={onComplete} />}
  </div>
);

// --- Practice ---
const PracticeContent: React.FC<{
  block: LessonBlock;
  onComplete: () => void;
  isActive: boolean;
}> = ({ block, onComplete, isActive }) => (
  <div>
    <div className="flex items-center gap-2 text-success text-xs font-bold uppercase tracking-wider mb-3">
      <Code2 className="w-4 h-4" />
      Hora de Praticar
    </div>
    <p className="text-lg leading-relaxed font-medium">{block.content}</p>
    {block.code && (
      <div className="lesson-code-block">
        <code>{block.code}</code>
      </div>
    )}
    {isActive && (
      <div className="mt-4 flex items-center gap-4">
        <ContinueButton onClick={onComplete} label="Já experimentei!" />
        <span className="text-xs text-muted">Use o editor ao lado para testar →</span>
      </div>
    )}
  </div>
);

// --- Checkpoint ---
const CheckpointContent: React.FC<{
  block: LessonBlock;
  onComplete: () => void;
  isActive: boolean;
}> = ({ block, onComplete, isActive }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  if (!block.checkpoint) return null;

  const { question, options, correctIndex, explanation } = block.checkpoint;
  const isCorrect = selectedOption === correctIndex;

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelectedOption(idx);
    setAnswered(true);
  };

  const feedback = answered ? getCheckpointFeedback(isCorrect, explanation) : null;

  return (
    <div>
      <div className="flex items-center gap-2 text-warning text-xs font-bold uppercase tracking-wider mb-3">
        <CheckCircle2 className="w-4 h-4" />
        Verificação Rápida
      </div>
      <p className="text-lg font-semibold mb-4">{question}</p>

      <div className="space-y-2.5">
        {options.map((option, idx) => {
          let optionClasses = 'bg-background/50 border-white/5 hover:border-primary/40 hover:bg-background/80';

          if (answered) {
            if (idx === correctIndex) {
              optionClasses = 'bg-success/15 border-success/40 text-success';
            } else if (idx === selectedOption) {
              optionClasses = 'bg-accent/10 border-accent/30 text-accent/80';
            } else {
              optionClasses = 'bg-background/30 border-white/5 opacity-50';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={answered}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-3 ${optionClasses}`}
            >
              <span className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center text-xs font-bold shrink-0">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="text-sm font-medium">{option}</span>
              {answered && idx === correctIndex && (
                <CheckCircle2 className="w-4 h-4 text-success ml-auto shrink-0" />
              )}
              {answered && idx === selectedOption && idx !== correctIndex && (
                <XCircle className="w-4 h-4 text-accent ml-auto shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-3.5 rounded-xl text-sm font-medium ${
            isCorrect
              ? 'bg-success/10 border border-success/20 text-success'
              : 'bg-surface/50 border border-white/5'
          }`}
        >
          <span className="mr-2">{feedback.emoji}</span>
          {feedback.text}
        </motion.div>
      )}

      {answered && isActive && (
        <ContinueButton onClick={onComplete} />
      )}
    </div>
  );
};

// --- Reward ---
const RewardContent: React.FC<{
  block: LessonBlock;
  onComplete: () => void;
  isActive: boolean;
}> = ({ block, onComplete, isActive }) => (
  <div>
    <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-3">
      <Trophy className="w-4 h-4" />
      Progresso
    </div>
    <p className="text-lg leading-relaxed font-medium">{block.content}</p>
    {isActive && <ContinueButton onClick={onComplete} label="Ir para o Desafio Final!" />}
  </div>
);
