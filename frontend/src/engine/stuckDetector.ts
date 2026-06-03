// ============================================================
// NAIS — Stuck Detector
// Detects when a learner is stuck and diagnoses severity
// "O aluno não falhou. O sistema ainda não encontrou
//  a melhor forma de ensinar."
// ============================================================

import type { ExerciseAttempt, SessionMetrics } from '../types';
import type { LearnerProfile, ConceptState } from './learnerModel';

// === Types ===

export interface StuckSignals {
  /** >2 consecutive similar errors */
  repeatedErrors: boolean;
  /** Same error pattern detected in >2 recent attempts */
  sameErrorPattern: boolean;
  /** >2 hints used on current exercise */
  excessiveHints: boolean;
  /** Time exceeds 3x the learner's average without progress */
  timeWithoutProgress: boolean;
  /** Learner switched exercises without completing */
  exerciseAbandoned: boolean;
  /** Code changes don't follow a logical pattern (random edits) */
  randomCorrections: boolean;
}

export interface StuckAnalysis {
  isStuck: boolean;
  severity: 'none' | 'mild' | 'moderate' | 'severe';
  signals: StuckSignals;
  activeSignalCount: number;
  currentStrategyFailed: boolean;
  /** How many times current strategy has been tried without success */
  currentStrategyAttempts: number;
}

// === Core Detection ===

/**
 * Analyzes whether the learner is stuck on the current concept.
 *
 * Uses 6 independent signals to determine stuckness severity:
 * - mild (1 signal): subtle difficulty, nudge may help
 * - moderate (2-3 signals): clear difficulty, strategy change recommended
 * - severe (4+ signals): significant blockage, major intervention needed
 */
export function analyzeStuckness(
  recentAttempts: ExerciseAttempt[],
  currentAttemptNumber: number,
  hintsUsedThisExercise: number,
  timeSpentThisExercise: number,
  learnerProfile: LearnerProfile,
  conceptKey: string,
  currentStrategy: string,
  codeHistory?: string[], // last N code snapshots from the editor
): StuckAnalysis {
  const concept = learnerProfile.concepts[conceptKey];
  const avgTime = concept?.avgTime || learnerProfile.metrics.avgTimePerExercise || 60;

  const signals: StuckSignals = {
    repeatedErrors: detectRepeatedErrors(recentAttempts),
    sameErrorPattern: detectSameErrorPattern(concept),
    excessiveHints: hintsUsedThisExercise >= 2,
    timeWithoutProgress: timeSpentThisExercise > avgTime * 3,
    exerciseAbandoned: false, // detected externally via navigation events
    randomCorrections: codeHistory ? detectRandomEdits(codeHistory) : false,
  };

  const activeSignalCount = Object.values(signals).filter(Boolean).length;

  // How many times was this strategy tried on this concept without success?
  const strategyAttempts = concept
    ? concept.strategyHistory
        .slice(-6)
        .filter(a => a.strategy === currentStrategy && !a.success)
        .length
    : 0;

  const currentStrategyFailed = strategyAttempts >= 2;

  let severity: StuckAnalysis['severity'] = 'none';
  if (activeSignalCount >= 4) severity = 'severe';
  else if (activeSignalCount >= 2) severity = 'moderate';
  else if (activeSignalCount >= 1) severity = 'mild';

  return {
    isStuck: severity !== 'none',
    severity,
    signals,
    activeSignalCount,
    currentStrategyFailed,
    currentStrategyAttempts: strategyAttempts,
  };
}

// === Signal Detectors ===

/**
 * Detects >2 consecutive failed attempts in recent history.
 */
function detectRepeatedErrors(attempts: ExerciseAttempt[]): boolean {
  if (attempts.length < 3) return false;
  const last3 = attempts.slice(-3);
  return last3.every(a => !a.success);
}

/**
 * Detects the same error pattern appearing in the concept's history.
 * A pattern is repeated if the same errorPattern string appears >2 times.
 */
function detectSameErrorPattern(concept: ConceptState | undefined): boolean {
  if (!concept || concept.errorPatterns.length < 2) return false;

  // Count occurrences of each pattern
  const counts: Record<string, number> = {};
  for (const pattern of concept.errorPatterns) {
    counts[pattern] = (counts[pattern] || 0) + 1;
  }

  // Any pattern appearing >2 times = same error repeating
  return Object.values(counts).some(count => count > 2);
}

/**
 * Detects random/chaotic code edits (no logical pattern).
 * Heuristic: if average Levenshtein-like change ratio between consecutive
 * snapshots is high but none of them made the code longer (productive),
 * the edits are likely random.
 */
function detectRandomEdits(codeHistory: string[]): boolean {
  if (codeHistory.length < 3) return false;

  let randomLikeChanges = 0;
  for (let i = 1; i < codeHistory.length; i++) {
    const prev = codeHistory[i - 1];
    const curr = codeHistory[i];

    // If the code got significantly shorter (deleting) and then longer and then shorter again
    const lengthDiff = Math.abs(curr.length - prev.length);
    const avgLen = (curr.length + prev.length) / 2 || 1;
    const changeRatio = lengthDiff / avgLen;

    // High change ratio with small overall code = likely random
    if (changeRatio > 0.3 && curr.length < 50) {
      randomLikeChanges++;
    }
  }

  // If >60% of edits look random, flag it
  return randomLikeChanges / (codeHistory.length - 1) > 0.6;
}

// === Error Pattern Extraction ===

/**
 * Attempts to categorize an error based on the code and expected outcome.
 * Returns a string pattern like "missing_closing_tag", "wrong_property", etc.
 */
export function extractErrorPattern(
  code: string,
  language: string,
  conceptKey: string,
): string | null {
  const lower = code.toLowerCase().trim();

  if (language === 'html') {
    if (/<\w+>/.test(lower) && !/<\/\w+>/.test(lower)) return 'missing_closing_tag';
    if (/<\/\w+>/.test(lower) && !/<\w+>/.test(lower)) return 'missing_opening_tag';
    if (lower.length === 0) return 'empty_code';
    if (!/</.test(lower)) return 'no_tags_at_all';
    return 'incorrect_structure';
  }

  if (language === 'css') {
    if (!lower.includes('{')) return 'missing_braces';
    if (!lower.includes(':')) return 'missing_colon';
    if (!lower.includes(';')) return 'missing_semicolon';
    return 'wrong_property_value';
  }

  if (language === 'javascript') {
    if (!lower.includes('console.log') && conceptKey.includes('console')) return 'missing_console_log';
    if (!lower.includes('let ') && !lower.includes('const ') && !lower.includes('var ') && conceptKey.includes('variable')) return 'missing_variable_declaration';
    return 'logic_error';
  }

  if (language === 'java') {
    if (!lower.includes('system.out.println') && !lower.includes('system.out.print')) return 'missing_print';
    if (!lower.includes('public static void main')) return 'missing_main_method';
    return 'compilation_error';
  }

  return null;
}
