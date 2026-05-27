// ============================================================
// Motor de Feedback — Gerador de mensagens contextuais
// Feedback psicologicamente seguro, construtivo e adaptativo
// Base: Hattie & Timperley (2007), Dweck (2006)
// ============================================================

import type { AdaptiveState, FeedbackMessage } from '../types';

// --- Bancos de mensagens ---

const SUCCESS_MESSAGES: FeedbackMessage[] = [
  { text: 'Isso aí!', type: 'success', emoji: '✨' },
  { text: 'Mandou bem!', type: 'success', emoji: '👏' },
  { text: 'Correto! Continue assim.', type: 'success', emoji: '🎯' },
  { text: 'Excelente raciocínio!', type: 'success', emoji: '🧠' },
  { text: 'Perfeito!', type: 'success', emoji: '🚀' },
  { text: 'Você está evoluindo!', type: 'success', emoji: '📈' },
];

const PERSISTENCE_MESSAGES: FeedbackMessage[] = [
  { text: 'Persistência recompensada!', type: 'success', emoji: '💪' },
  { text: 'Você não desistiu — isso é o que importa.', type: 'success', emoji: '🌟' },
  { text: 'Cada tentativa te ensinou algo. Agora você domina!', type: 'success', emoji: '🏆' },
  { text: 'Difícil, mas você conseguiu! Isso é aprender de verdade.', type: 'success', emoji: '🎖️' },
];

const LESSON_COMPLETE_MESSAGES: FeedbackMessage[] = [
  { text: 'Lição concluída! Você sabe algo novo que ontem não sabia.', type: 'success', emoji: '🎓' },
  { text: 'Mais uma lição no seu cinto de ferramentas!', type: 'success', emoji: '🛠️' },
  { text: 'Progresso real. Cada lição te deixa mais forte.', type: 'success', emoji: '💎' },
];

const ENCOURAGEMENT_BY_STATE: Record<AdaptiveState, string[]> = {
  flow: [
    'Você está voando! 🚀',
    'Flow total! Continue assim.',
    'Esse ritmo está incrível!',
  ],
  learning: [
    'Bom ritmo! Cada passo conta.',
    'Você está no caminho certo.',
    'Progresso constante é o melhor tipo de progresso.',
  ],
  struggling: [
    'Calma, este conceito é desafiante. Vamos juntos.',
    'Muitos alunos precisam de mais prática aqui. É completamente normal.',
    'Está difícil? Isso significa que seu cérebro está aprendendo algo novo.',
  ],
  frustrated: [
    'Respira fundo. Errar faz parte do processo.',
    'Que tal usar uma dica? Não há problema nenhum nisso.',
    'Este é um dos exercícios mais desafiantes. Você está indo bem.',
  ],
  disengaged: [
    'Tudo bem aí? Seu progresso está salvo.',
    'Uma pausa pode ajudar. Volte quando quiser!',
    'Às vezes o melhor é descansar e voltar amanhã mais forte.',
  ],
};

// --- Funções exportadas ---

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Feedback para exercício/desafio completado com sucesso.
 * Mensagens diferentes para quem acertou de primeira vs. quem persistiu.
 */
export function getSuccessFeedback(attempts: number): FeedbackMessage {
  if (attempts >= 4) return pickRandom(PERSISTENCE_MESSAGES);
  return pickRandom(SUCCESS_MESSAGES);
}

/**
 * Feedback para quando o aluno erra.
 * Progressivo: fica mais acolhedor conforme o número de tentativas.
 * 
 * NUNCA diz "ERRADO" ou "INCORRETO". 
 * Linguagem de processo, não de julgamento (Dweck, 2006).
 */
export function getErrorFeedback(attempt: number): FeedbackMessage {
  if (attempt === 1) {
    return {
      text: 'Não foi dessa vez. Revise o código com calma.',
      type: 'encouragement',
      emoji: '🔍',
    };
  }
  if (attempt === 2) {
    return {
      text: 'Quase lá! Que tal usar uma dica? Não há penalização.',
      type: 'hint',
      emoji: '💡',
    };
  }
  if (attempt === 3) {
    return {
      text: 'Este conceito é desafiante. Use as dicas — elas existem para ajudar.',
      type: 'hint',
      emoji: '🤝',
    };
  }
  return {
    text: 'Sem pressa. Muitos alunos precisam de várias tentativas nesta parte.',
    type: 'encouragement',
    emoji: '🌱',
  };
}

/**
 * Mensagem de encorajamento baseada no estado cognitivo atual.
 */
export function getEncouragement(state: AdaptiveState): string {
  return pickRandom(ENCOURAGEMENT_BY_STATE[state]);
}

/**
 * Feedback para checkpoint (MCQ).
 */
export function getCheckpointFeedback(
  correct: boolean,
  explanation: string
): FeedbackMessage {
  if (correct) {
    return { text: `Correto! ${explanation}`, type: 'success', emoji: '✅' };
  }
  return {
    text: `Não exatamente. ${explanation}`,
    type: 'info',
    emoji: '📘',
  };
}

/**
 * Mensagem de lição completa.
 */
export function getLessonCompleteFeedback(): FeedbackMessage {
  return pickRandom(LESSON_COMPLETE_MESSAGES);
}

/**
 * Mensagem de sugestão de pausa.
 * NUNCA bloqueia. Apenas informa e sugere.
 */
export function getBreakMessage(
  severity: 'gentle' | 'firm'
): FeedbackMessage {
  if (severity === 'gentle') {
    return {
      text: 'Você está indo muito bem! Uma pausa de 5 minutos ajuda o cérebro a consolidar.',
      type: 'info',
      emoji: '☕',
    };
  }
  return {
    text: 'Seu cérebro merece um descanso. Estudos mostram que pausas melhoram a retenção. Progresso salvo!',
    type: 'info',
    emoji: '🧘',
  };
}

/**
 * Mensagem de retorno após ausência.
 * NUNCA culpa. Sempre celebra o retorno.
 */
export function getReturnMessage(
  strategy: 'normal' | 'warmup' | 'review' | 'diagnostic'
): FeedbackMessage {
  switch (strategy) {
    case 'normal':
      return { text: 'Bom te ver! Vamos continuar de onde paramos.', type: 'info', emoji: '👋' };
    case 'warmup':
      return { text: 'Que bom ter você de volta! Preparamos uma revisão rápida.', type: 'info', emoji: '🌅' };
    case 'review':
      return { text: 'Sentimos sua falta! Vamos relembrar os conceitos antes de avançar.', type: 'info', emoji: '🔄' };
    case 'diagnostic':
      return { text: 'Bem-vindo de volta! Muita coisa pode parecer nova. Vamos recapitular juntos.', type: 'info', emoji: '🌱' };
  }
}
