import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { SPECIAL_INTERESTS, INTEREST_LABELS } from '../../engine/learnerModel';
import type { SpecialInterest } from '../../engine/learnerModel';

/**
 * Interest Picker — Seleção de interesses especiais
 *
 * Grid visual com emojis/labels para o aluno escolher até 3 interesses.
 * Os interesses personalizam exemplos, analogias e exercícios.
 */
export const InterestPicker: React.FC = () => {
  const {
    learnerProfile,
    addSpecialInterest,
    removeSpecialInterest,
    syncLearnerToBackend,
  } = useAppStore();

  const selectedInterests = learnerProfile?.specialInterests || [];

  const handleToggle = (interest: SpecialInterest) => {
    if (selectedInterests.includes(interest)) {
      removeSpecialInterest(interest);
    } else {
      if (selectedInterests.length >= 3) return; // max 3
      addSpecialInterest(interest);
    }

    // Sync after a short delay (debounce-like)
    setTimeout(() => {
      syncLearnerToBackend();
    }, 500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">Seus Interesses</h3>
          <p className="text-sm text-muted mt-0.5">
            Escolha até 3 interesses. Usamos isso para personalizar exemplos e exercícios.
          </p>
        </div>
        <span className="text-xs text-muted bg-surface px-3 py-1 rounded-full">
          {selectedInterests.length}/3 selecionados
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {SPECIAL_INTERESTS.map((interest) => {
          const meta = INTEREST_LABELS[interest];
          const isSelected = selectedInterests.includes(interest);
          const isDisabled = !isSelected && selectedInterests.length >= 3;

          return (
            <motion.button
              key={interest}
              whileHover={!isDisabled ? { scale: 1.03 } : undefined}
              whileTap={!isDisabled ? { scale: 0.97 } : undefined}
              onClick={() => handleToggle(interest)}
              disabled={isDisabled}
              className={`
                relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center
                ${isSelected
                  ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                  : isDisabled
                    ? 'border-white/5 bg-background/30 opacity-40 cursor-not-allowed'
                    : 'border-white/10 bg-background hover:border-white/20 hover:bg-surface/30'
                }
              `}
            >
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  layoutId="interest-check"
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                >
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}

              <span className="text-3xl">{meta.emoji}</span>
              <span className={`text-sm font-semibold ${isSelected ? 'text-primary' : ''}`}>
                {meta.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Preview of personalization */}
      {selectedInterests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-xl bg-surface/50 border border-white/5 text-sm"
        >
          <p className="text-muted mb-2 font-medium">✨ Personalização ativa:</p>
          <p className="text-main leading-relaxed">
            Seus exercícios usarão exemplos com{' '}
            {selectedInterests.map((i, idx) => (
              <span key={i}>
                <span className="font-bold text-primary">
                  {INTEREST_LABELS[i].emoji} {INTEREST_LABELS[i].label}
                </span>
                {idx < selectedInterests.length - 2 && ', '}
                {idx === selectedInterests.length - 2 && ' e '}
              </span>
            ))}
            {' '}para tornar o aprendizado mais interessante para você.
          </p>
        </motion.div>
      )}
    </div>
  );
};
