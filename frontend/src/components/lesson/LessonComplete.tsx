import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, Home, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getLessonCompleteFeedback } from '../../engine/feedbackEngine';

interface LessonCompleteProps {
  xpGained: number;
  conceptName: string;
  nextLesson: { id: string; title: string } | null;
  onClose?: () => void;
}

/**
 * Overlay de conclusão de lição.
 *
 * Mostra:
 * - Animação de sucesso (suave, não explosiva)
 * - XP ganho
 * - Conceito dominado
 * - Navegação para próxima aula (funcional!)
 * - Opção de voltar ao dashboard
 *
 * Base: Schultz (1997) — dopamina em marcos de progresso
 */
export const LessonComplete: React.FC<LessonCompleteProps> = ({
  xpGained,
  conceptName,
  nextLesson,
  onClose,
}) => {
  const navigate = useNavigate();
  const feedback = getLessonCompleteFeedback();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-surface border-2 border-success/30 p-8 md:p-10 rounded-3xl flex flex-col items-center gap-5 shadow-2xl shadow-success/10 max-w-md w-full mx-4 text-center"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
          className="w-20 h-20 bg-success/15 rounded-full flex items-center justify-center"
        >
          <CheckCircle2 className="w-10 h-10 text-success" />
        </motion.div>

        {/* Title */}
        <h2 className="text-2xl font-black">Lição Concluída!</h2>

        {/* Feedback message */}
        <p className="text-muted text-sm leading-relaxed">
          {feedback.emoji} {feedback.text}
        </p>

        {/* Concept mastered */}
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl border border-primary/20">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">{conceptName}</span>
        </div>

        {/* XP gained */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
        >
          +{xpGained} XP
        </motion.div>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full mt-2">
          {nextLesson ? (
            <button
              onClick={() => navigate(`/lesson/${nextLesson.id}`)}
              className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
            >
              Próxima Aula: {nextLesson.title}
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="py-3 text-sm text-muted font-medium">
              🎉 Você completou todas as aulas deste módulo!
            </div>
          )}

          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-surface hover:bg-surface/80 border border-white/10 text-muted hover:text-main rounded-xl font-semibold flex items-center justify-center gap-2 transition-all text-sm"
          >
            <Home className="w-4 h-4" />
            Voltar ao Dashboard
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
