// ============================================================
// NAIS — Emotional Adapter
// Adapts UI tone, text density, and help frequency based on
// the learner's emotional state.
// Base: Csikszentmihalyi (1990), Dweck (2006)
// ============================================================

import type { AdaptiveState } from '../types';

// === Types ===

export type EmotionalTone = 'celebratory' | 'warm' | 'supportive' | 'gentle' | 'calm';

export interface EmotionalAdaptation {
  /** How much text to show */
  textAmount: 'minimal' | 'normal' | 'detailed';
  /** Explanation depth */
  explanationDepth: 'shallow' | 'normal' | 'deep';
  /** Frequency of positive messages */
  positiveReinforcement: 'low' | 'normal' | 'high' | 'maximum';
  /** How actively the system offers help */
  helpFrequency: 'passive' | 'normal' | 'proactive';
  /** Overall tone of messages */
  tone: EmotionalTone;
  /** Whether to show encouraging message before exercise */
  showPreExerciseEncouragement: boolean;
  /** Whether to normalize difficulty ("muitos alunos erram aqui") */
  normalizeDifficulty: boolean;
  /** Whether to automatically offer a hint */
  autoOfferHint: boolean;
  /** Time (ms) before auto-offering hint, 0 = disabled */
  autoHintDelayMs: number;
}

// === Core Function ===

/**
 * Returns the full emotional adaptation configuration for a given state.
 *
 * | State       | Tone         | Text     | Depth   | Reinforcement | Help      |
 * |-------------|-------------|----------|---------|---------------|-----------|
 * | flow        | celebratory | minimal  | shallow | low           | passive   |
 * | learning    | warm        | normal   | normal  | normal        | normal    |
 * | struggling  | supportive  | detailed | deep    | high          | proactive |
 * | frustrated  | gentle      | minimal  | shallow | maximum       | proactive |
 * | disengaged  | calm        | minimal  | shallow | normal        | passive   |
 */
export function getEmotionalAdaptation(state: AdaptiveState): EmotionalAdaptation {
  switch (state) {
    case 'flow':
      return {
        textAmount: 'minimal',
        explanationDepth: 'shallow',
        positiveReinforcement: 'low',
        helpFrequency: 'passive',
        tone: 'celebratory',
        showPreExerciseEncouragement: false,
        normalizeDifficulty: false,
        autoOfferHint: false,
        autoHintDelayMs: 0,
      };

    case 'learning':
      return {
        textAmount: 'normal',
        explanationDepth: 'normal',
        positiveReinforcement: 'normal',
        helpFrequency: 'normal',
        tone: 'warm',
        showPreExerciseEncouragement: false,
        normalizeDifficulty: false,
        autoOfferHint: false,
        autoHintDelayMs: 0,
      };

    case 'struggling':
      return {
        textAmount: 'detailed',
        explanationDepth: 'deep',
        positiveReinforcement: 'high',
        helpFrequency: 'proactive',
        tone: 'supportive',
        showPreExerciseEncouragement: true,
        normalizeDifficulty: true,
        autoOfferHint: true,
        autoHintDelayMs: 45000, // 45 seconds
      };

    case 'frustrated':
      return {
        textAmount: 'minimal',
        explanationDepth: 'shallow',
        positiveReinforcement: 'maximum',
        helpFrequency: 'proactive',
        tone: 'gentle',
        showPreExerciseEncouragement: true,
        normalizeDifficulty: true,
        autoOfferHint: true,
        autoHintDelayMs: 20000, // 20 seconds
      };

    case 'disengaged':
      return {
        textAmount: 'minimal',
        explanationDepth: 'shallow',
        positiveReinforcement: 'normal',
        helpFrequency: 'passive',
        tone: 'calm',
        showPreExerciseEncouragement: false,
        normalizeDifficulty: false,
        autoOfferHint: false,
        autoHintDelayMs: 0,
      };
  }
}

// === Tone-Specific Message Generators ===

/**
 * Returns a pre-exercise encouragement message based on emotional tone.
 */
export function getPreExerciseMessage(tone: EmotionalTone): string {
  switch (tone) {
    case 'celebratory':
      return 'Vamos lá! Você está voando! 🚀';
    case 'warm':
      return 'Hora de praticar o que aprendeu!';
    case 'supportive':
      return 'Sem pressa. Você tem todas as ferramentas que precisa. Use as dicas se quiser.';
    case 'gentle':
      return 'Relaxa. Não há pressa. Tente quando estiver pronto — seu progresso está salvo.';
    case 'calm':
      return 'Quando estiver pronto, tente o exercício abaixo.';
  }
}

/**
 * Returns a normalization message (reduces anxiety).
 * "Muitos alunos erram aqui" — normalizes the difficulty.
 */
export function getNormalizationMessage(): string {
  const messages = [
    'Este é um dos exercícios que mais gera dúvidas. É completamente normal precisar de mais tempo.',
    '67% dos alunos precisam de mais de uma tentativa nesta parte.',
    'Este conceito é desafiante para a maioria. Use as dicas sem hesitar.',
    'Você não é o único que acha isso difícil — é um conceito que leva tempo para solidificar.',
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Returns a strategy switch message — explains to the learner
 * that the system is trying a different approach.
 * NEVER says "you failed". Always frames it as system adaptation.
 */
export function getStrategySwitchMessage(tone: EmotionalTone): string {
  switch (tone) {
    case 'celebratory':
    case 'warm':
      return 'Vou explicar de um jeito diferente — pode clarear mais.';
    case 'supportive':
      return 'Vamos tentar uma abordagem diferente. Às vezes um novo ângulo faz toda a diferença.';
    case 'gentle':
      return 'Sem problema. Vou mudar a explicação — cada pessoa aprende de um jeito diferente.';
    case 'calm':
      return 'Tentando uma explicação alternativa para este conceito.';
  }
}

/**
 * Wraps a feedback message with emotional adaptation.
 * Adds pre/post content based on the tone.
 */
export function adaptFeedbackToTone(
  feedbackText: string,
  tone: EmotionalTone,
  isError: boolean,
): string {
  if (!isError) return feedbackText;

  switch (tone) {
    case 'gentle':
    case 'supportive':
      // Sandwich: positive → constructive → encouraging
      return `Bom esforço! ${feedbackText} Você está progredindo.`;
    case 'celebratory':
    case 'warm':
      return feedbackText;
    case 'calm':
      return feedbackText;
  }
}
