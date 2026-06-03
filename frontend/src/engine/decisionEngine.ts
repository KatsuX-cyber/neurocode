// ============================================================
// NAIS — Decision Engine
// Central algorithm: "What's the best next action for this
// learner right now?"
//
// Algorithm priority:
// 1. Safety checks (fatigue, session time → suggest break)
// 2. Severe stuck → review prerequisite or switch strategy
// 3. Moderate stuck → offer hint or re-explain
// 4. Mild stuck → show personalized example
// 5. Flow state → advance difficulty
// 6. Default → continue
// ============================================================

import type { SessionMetrics } from '../types';
import type { LearnerProfile } from './learnerModel';
import type { StuckAnalysis } from './stuckDetector';
import type { StrategyType } from './strategyEngine';
import { selectNextStrategy } from './strategyEngine';
import { calculateFatigue } from './adaptiveEngine';

// === Decision Actions ===

export type DecisionAction =
  | { type: 'continue'; reason: string }
  | { type: 'explain_again'; strategy: StrategyType; explanation: string; reason: string }
  | { type: 'switch_strategy'; newStrategy: StrategyType; reason: string }
  | { type: 'show_personalized_example'; reason: string }
  | { type: 'reduce_difficulty'; reason: string }
  | { type: 'offer_hint'; level: 1 | 2 | 3; reason: string }
  | { type: 'review_prerequisite'; conceptKey: string; reason: string }
  | { type: 'suggest_break'; severity: 'gentle' | 'firm'; reason: string }
  | { type: 'advance'; reason: string };

// === Core Decision Algorithm ===

/**
 * The central decision function. Called after every exercise attempt
 * to determine the system's next pedagogical action.
 *
 * Decision tree:
 * 1. Fatigue/time → suggest break
 * 2. Severe stuck → major intervention
 * 3. Moderate stuck → medium intervention
 * 4. Mild stuck → light nudge
 * 5. Flow → advance
 * 6. Learning → continue
 */
export function decideNextAction(
  learner: LearnerProfile,
  conceptKey: string,
  stuckAnalysis: StuckAnalysis,
  sessionMetrics: SessionMetrics,
  currentStrategy: StrategyType,
  hintsUsedThisExercise: number,
): DecisionAction {

  const fatigue = calculateFatigue(sessionMetrics);
  const sessionMinutes = (Date.now() - sessionMetrics.startTime) / 60000;

  // ─── Priority 1: Safety checks (break suggestions) ───

  if (sessionMinutes > 90 || fatigue > 0.85) {
    return {
      type: 'suggest_break',
      severity: 'firm',
      reason: `Sessão de ${Math.round(sessionMinutes)}min com fadiga ${Math.round(fatigue * 100)}%.`,
    };
  }

  if (sessionMinutes > 45 || fatigue > 0.65) {
    return {
      type: 'suggest_break',
      severity: 'gentle',
      reason: `Sessão de ${Math.round(sessionMinutes)}min — pausa sugerida para consolidação.`,
    };
  }

  // ─── Priority 2: Severe stuck ───

  if (stuckAnalysis.severity === 'severe') {
    // Check if a prerequisite concept is fragile
    const fragilePrerequisite = findFragilePrerequisite(learner, conceptKey);
    if (fragilePrerequisite) {
      return {
        type: 'review_prerequisite',
        conceptKey: fragilePrerequisite,
        reason: `Conceito prerequisito "${fragilePrerequisite}" está frágil — revisar antes de continuar.`,
      };
    }

    // Switch to a completely different strategy
    const failedStrategies = getFailedStrategies(learner, conceptKey);
    const newStrategy = selectNextStrategy(learner, conceptKey, currentStrategy, failedStrategies);

    if (newStrategy !== currentStrategy) {
      return {
        type: 'switch_strategy',
        newStrategy,
        reason: `Travamento severo após ${stuckAnalysis.currentStrategyAttempts} tentativas com "${currentStrategy}". Trocando para "${newStrategy}".`,
      };
    }

    // Last resort: reduce difficulty
    return {
      type: 'reduce_difficulty',
      reason: 'Todas as estratégias tentadas — reduzindo complexidade do exercício.',
    };
  }

  // ─── Priority 3: Moderate stuck ───

  if (stuckAnalysis.severity === 'moderate') {
    // If hints haven't been fully used, offer next hint
    if (hintsUsedThisExercise < 2) {
      const nextLevel = (hintsUsedThisExercise + 1) as 1 | 2 | 3;
      return {
        type: 'offer_hint',
        level: nextLevel,
        reason: `Dificuldade moderada — oferecendo dica nível ${nextLevel}.`,
      };
    }

    // All hints used, try re-explaining with new strategy
    if (stuckAnalysis.currentStrategyFailed) {
      const failedStrategies = getFailedStrategies(learner, conceptKey);
      const newStrategy = selectNextStrategy(learner, conceptKey, currentStrategy, failedStrategies);
      return {
        type: 'explain_again',
        strategy: newStrategy,
        explanation: '',
        reason: `Dicas esgotadas + estratégia "${currentStrategy}" falhou. Re-explicando com "${newStrategy}".`,
      };
    }

    return {
      type: 'offer_hint',
      level: Math.min(hintsUsedThisExercise + 1, 3) as 1 | 2 | 3,
      reason: 'Dificuldade moderada — dica proativa.',
    };
  }

  // ─── Priority 4: Mild stuck ───

  if (stuckAnalysis.severity === 'mild') {
    // If learner has interests, show personalized example
    if (learner.specialInterests.length > 0) {
      return {
        type: 'show_personalized_example',
        reason: 'Dificuldade leve — mostrando exemplo personalizado com interesse do aluno.',
      };
    }

    // Otherwise just offer a hint
    if (hintsUsedThisExercise < 1) {
      return {
        type: 'offer_hint',
        level: 1,
        reason: 'Dificuldade leve — oferecendo primeira dica.',
      };
    }

    return { type: 'continue', reason: 'Dificuldade leve, dica já usada.' };
  }

  // ─── Priority 5: Flow state ───

  const concept = learner.concepts[conceptKey];
  const isInFlow = learner.estimatedConfidence > 0.8 && learner.estimatedEngagement > 0.7;
  const isMastering = concept && concept.status === 'mastered';

  if (isInFlow || isMastering) {
    return {
      type: 'advance',
      reason: `Aluno em flow (confiança ${Math.round(learner.estimatedConfidence * 100)}%, engajamento ${Math.round(learner.estimatedEngagement * 100)}%).`,
    };
  }

  // ─── Priority 6: Default → continue ───

  return { type: 'continue', reason: 'Progresso normal.' };
}

// === Helpers ===

/**
 * Finds a prerequisite concept that is fragile or critical.
 * Uses a simple concept dependency map.
 */
function findFragilePrerequisite(
  learner: LearnerProfile,
  conceptKey: string,
): string | null {
  const prerequisites = CONCEPT_PREREQUISITES[conceptKey];
  if (!prerequisites) return null;

  for (const prereq of prerequisites) {
    const prereqState = learner.concepts[prereq];
    if (prereqState && (prereqState.status === 'fragile' || prereqState.status === 'critical')) {
      return prereq;
    }
  }

  return null;
}

/**
 * Gets strategies that have failed for a concept (< 30% success rate).
 */
function getFailedStrategies(
  learner: LearnerProfile,
  conceptKey: string,
): StrategyType[] {
  const concept = learner.concepts[conceptKey];
  if (!concept) return [];

  const stats: Record<string, { successes: number; total: number }> = {};
  for (const attempt of concept.strategyHistory) {
    if (!stats[attempt.strategy]) stats[attempt.strategy] = { successes: 0, total: 0 };
    stats[attempt.strategy].total++;
    if (attempt.success) stats[attempt.strategy].successes++;
  }

  const failed: StrategyType[] = [];
  for (const [strategy, data] of Object.entries(stats)) {
    if (data.total >= 2 && data.successes / data.total < 0.3) {
      failed.push(strategy as StrategyType);
    }
  }

  return failed;
}

// === Concept Prerequisites ===
// Simple dependency graph for prerequisite review

const CONCEPT_PREREQUISITES: Record<string, string[]> = {
  html_p:           ['html_h1'],
  css_color:        ['html_h1', 'html_p'],
  css_background:   ['css_color'],
  js_variable:      ['js_console'],
  java_variable:    ['java_print'],
};
