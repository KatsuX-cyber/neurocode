// ============================================================
// Motor Adaptativo NEXUS
// Detecta estado cognitivo e sugere adaptações em tempo real
// Base: Heurísticas sobre rolling window de exercícios
// ============================================================

import type { AdaptiveState, ExerciseAttempt, SessionMetrics } from '../types';

/**
 * Classifica o estado cognitivo do aluno baseado nos últimos exercícios.
 * 
 * Estados:
 * - flow: Alta acurácia, ritmo natural, poucas dicas
 * - learning: Acurácia média, progresso constante
 * - struggling: Acurácia baixa, muitas dicas, tempo elevado
 * - frustrated: Múltiplas tentativas falhadas, padrão errático
 * - disengaged: Inatividade ou respostas aleatórias
 * 
 * Base científica: Csikszentmihalyi (1990) — Flow Theory
 */
export function classifyState(history: ExerciseAttempt[]): AdaptiveState {
  if (history.length < 3) return 'learning';

  const recent = history.slice(-5);
  const accuracy = recent.filter(a => a.success).length / recent.length;
  const avgHints = recent.reduce((s, a) => s + a.hintsUsed, 0) / recent.length;
  const avgAttempts = recent.reduce((s, a) => s + a.attempts, 0) / recent.length;

  // Flow: dominando com facilidade
  if (accuracy >= 0.8 && avgHints <= 0.3 && avgAttempts <= 1.5) {
    return 'flow';
  }

  // Learning: progresso saudável
  if (accuracy >= 0.6) {
    return 'learning';
  }

  // Struggling: precisando de mais suporte
  if (accuracy >= 0.35 || avgHints >= 0.5) {
    return 'struggling';
  }

  // Frustrated: muitas tentativas sem sucesso
  if (avgAttempts >= 3) {
    return 'frustrated';
  }

  return 'disengaged';
}

/**
 * Calcula nível de fadiga (0-1) baseado em duração da sessão e erros consecutivos.
 * 
 * Base: Bunce et al. (2010) — atenção cai após 10-18 min;
 *       Ericsson (1993) — prática deliberada máxima ~90 min.
 */
export function calculateFatigue(session: SessionMetrics): number {
  const sessionMinutes = (Date.now() - session.startTime) / 60000;

  // Fator de tempo: fadiga cresce progressivamente
  const timeFactor = Math.min(sessionMinutes / 50, 1);

  // Fator de erros consecutivos
  const errorFactor = Math.min(session.errorsInRow / 5, 1);

  // Composição ponderada
  return Math.min(timeFactor * 0.6 + errorFactor * 0.4, 1);
}

/**
 * Determina se o sistema deve sugerir uma pausa.
 * 
 * IMPORTANTE: Nunca FORÇAR pausa. Apenas sugerir.
 * Base: Deci & Ryan (2000) — autonomia preservada.
 */
export function shouldSuggestBreak(
  session: SessionMetrics
): 'none' | 'gentle' | 'firm' {
  const minutes = (Date.now() - session.startTime) / 60000;
  const fatigue = calculateFatigue(session);

  if (minutes > 90 || fatigue > 0.85) return 'firm';
  if (minutes > 45 || fatigue > 0.65) return 'gentle';
  return 'none';
}

/**
 * Sugere fator de ajuste de dificuldade baseado no estado cognitivo.
 * 
 * Retorna multiplicador (0.4 a 1.2) aplicado à dificuldade atual.
 * Base: Kalyuga (2007) — Expertise Reversal Effect
 */
export function getDifficultyFactor(state: AdaptiveState): number {
  const factors: Record<AdaptiveState, number> = {
    flow: 1.15,
    learning: 1.0,
    struggling: 0.75,
    frustrated: 0.55,
    disengaged: 0.4,
  };
  return factors[state];
}

/**
 * Determina estratégia de retorno baseada no tempo de ausência.
 * 
 * Base: Ebbinghaus (1885) — Curva do Esquecimento;
 *       sem revisão, 70% do material é esquecido em 24h.
 */
export function getReturnStrategy(
  lastDate: string | null
): 'normal' | 'warmup' | 'review' | 'diagnostic' {
  if (!lastDate) return 'normal';

  const daysSince = Math.floor(
    (Date.now() - new Date(lastDate).getTime()) / 86400000
  );

  if (daysSince <= 2) return 'normal';
  if (daysSince <= 7) return 'warmup';
  if (daysSince <= 30) return 'review';
  return 'diagnostic';
}

/**
 * Calcula o XP ganho baseado na dificuldade e estado.
 * Exercícios mais difíceis e resolvidos no estado "struggling" valem mais.
 */
export function calculateXpGain(
  baseXp: number,
  state: AdaptiveState,
  attempts: number
): number {
  const stateMultiplier: Record<AdaptiveState, number> = {
    flow: 1.0,
    learning: 1.0,
    struggling: 1.3, // Recompensa extra por persistência
    frustrated: 1.5,
    disengaged: 1.0,
  };

  // Bonus por resolver com poucas tentativas
  const attemptBonus = attempts === 1 ? 1.2 : 1.0;

  return Math.round(baseXp * stateMultiplier[state] * attemptBonus);
}
