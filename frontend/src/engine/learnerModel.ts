// ============================================================
// NAIS — Learner Model
// Persistent cognitive profile of the learner
// ============================================================

// === Special Interests ===

export const SPECIAL_INTERESTS = [
  'pokemon', 'futebol', 'astronomia', 'carros',
  'anime', 'tecnologia', 'musica', 'trens',
  'culinaria', 'jogos', 'filmes', 'natureza',
] as const;

export type SpecialInterest = typeof SPECIAL_INTERESTS[number];

export const INTEREST_LABELS: Record<SpecialInterest, { label: string; emoji: string }> = {
  pokemon:     { label: 'Pokémon',      emoji: '⚡' },
  futebol:     { label: 'Futebol',      emoji: '⚽' },
  astronomia:  { label: 'Astronomia',   emoji: '🚀' },
  carros:      { label: 'Carros',       emoji: '🏎️' },
  anime:       { label: 'Anime',        emoji: '🎌' },
  tecnologia:  { label: 'Tecnologia',   emoji: '💻' },
  musica:      { label: 'Música',       emoji: '🎵' },
  trens:       { label: 'Trens',        emoji: '🚂' },
  culinaria:   { label: 'Culinária',    emoji: '🍳' },
  jogos:       { label: 'Jogos',        emoji: '🎮' },
  filmes:      { label: 'Filmes',       emoji: '🎬' },
  natureza:    { label: 'Natureza',     emoji: '🌿' },
};

// === Concept Mastery ===

export type ConceptStatus = 'unknown' | 'fragile' | 'learning' | 'mastered' | 'critical';

export interface StrategyAttempt {
  strategy: string;
  success: boolean;
  timestamp: number;
}

export interface ConceptState {
  conceptKey: string;
  status: ConceptStatus;
  errorCount: number;
  errorPatterns: string[];
  avgTime: number;
  lastPracticed: number | null;
  strategyHistory: StrategyAttempt[];
}

// === Learner Profile ===

export interface LearnerProfile {
  userId: string;
  specialInterests: SpecialInterest[];

  // Concept mastery map
  concepts: Record<string, ConceptState>;

  // Aggregated metrics
  metrics: {
    avgTimePerExercise: number;
    totalHintsUsed: number;
    totalExercises: number;
    totalCorrect: number;
    avgAccuracy: number;
    progressSpeed: number;
  };

  // Estimated cognitive states (0.0 - 1.0)
  estimatedConfidence: number;
  estimatedFatigue: number;
  estimatedEngagement: number;

  // Long-term strategy memory
  strategyScores: Record<string, number>; // strategyId → effectiveness (0-100)
  preferredStrategy: string | null;

  // Session tracking
  lastSessionAt: number | null;
}

// === Factory ===

export function createDefaultProfile(userId: string): LearnerProfile {
  return {
    userId,
    specialInterests: [],
    concepts: {},
    metrics: {
      avgTimePerExercise: 0,
      totalHintsUsed: 0,
      totalExercises: 0,
      totalCorrect: 0,
      avgAccuracy: 0,
      progressSpeed: 1.0,
    },
    estimatedConfidence: 0.5,
    estimatedFatigue: 0,
    estimatedEngagement: 0.7,
    strategyScores: {},
    preferredStrategy: null,
    lastSessionAt: null,
  };
}

// === Computed Helpers ===

/**
 * Determines concept status based on error count and recent success rate.
 */
export function computeConceptStatus(concept: ConceptState): ConceptStatus {
  const recent = concept.strategyHistory.slice(-5);
  if (recent.length === 0) return 'unknown';

  const recentSuccessRate = recent.filter(a => a.success).length / recent.length;

  // Critical: >5 errors and < 20% recent success
  if (concept.errorCount > 5 && recentSuccessRate < 0.2) return 'critical';

  // Mastered: > 80% recent success and > 3 attempts
  if (recentSuccessRate >= 0.8 && recent.length >= 3) return 'mastered';

  // Fragile: some successes but inconsistent
  if (recentSuccessRate < 0.5 && concept.errorCount > 2) return 'fragile';

  return 'learning';
}

/**
 * Returns the most effective strategy for a concept based on history.
 * Falls back to null if no history exists.
 */
export function getBestStrategyFor(concept: ConceptState): string | null {
  if (concept.strategyHistory.length === 0) return null;

  // Group by strategy, compute success rate
  const stats: Record<string, { successes: number; total: number }> = {};
  for (const attempt of concept.strategyHistory) {
    if (!stats[attempt.strategy]) stats[attempt.strategy] = { successes: 0, total: 0 };
    stats[attempt.strategy].total++;
    if (attempt.success) stats[attempt.strategy].successes++;
  }

  let bestStrategy: string | null = null;
  let bestRate = -1;
  for (const [strategy, data] of Object.entries(stats)) {
    const rate = data.successes / data.total;
    if (rate > bestRate) {
      bestRate = rate;
      bestStrategy = strategy;
    }
  }

  return bestStrategy;
}

/**
 * Updates a LearnerProfile after an exercise attempt.
 * Pure function — returns a new profile, does not mutate.
 */
export function updateProfileAfterAttempt(
  profile: LearnerProfile,
  conceptKey: string,
  success: boolean,
  timeSpent: number,
  hintsUsed: number,
  strategy: string,
): LearnerProfile {
  const newProfile = { ...profile };
  newProfile.concepts = { ...profile.concepts };
  newProfile.metrics = { ...profile.metrics };
  newProfile.strategyScores = { ...profile.strategyScores };

  // Update or create concept state
  const existing = profile.concepts[conceptKey];
  const concept: ConceptState = existing
    ? { ...existing, strategyHistory: [...existing.strategyHistory], errorPatterns: [...existing.errorPatterns] }
    : {
        conceptKey,
        status: 'unknown',
        errorCount: 0,
        errorPatterns: [],
        avgTime: 0,
        lastPracticed: null,
        strategyHistory: [],
      };

  // Record attempt
  concept.strategyHistory.push({ strategy, success, timestamp: Date.now() });
  if (concept.strategyHistory.length > 20) concept.strategyHistory.shift(); // rolling window

  if (!success) {
    concept.errorCount++;
  }

  // Update timing
  concept.avgTime = concept.avgTime === 0
    ? timeSpent
    : (concept.avgTime * 0.7 + timeSpent * 0.3); // exponential moving average
  concept.lastPracticed = Date.now();

  // Recompute status
  concept.status = computeConceptStatus(concept);
  newProfile.concepts[conceptKey] = concept;

  // Update aggregate metrics
  const m = newProfile.metrics;
  m.totalExercises++;
  if (success) m.totalCorrect++;
  m.totalHintsUsed += hintsUsed;
  m.avgAccuracy = m.totalCorrect / m.totalExercises;
  m.avgTimePerExercise = m.avgTimePerExercise === 0
    ? timeSpent
    : (m.avgTimePerExercise * 0.8 + timeSpent * 0.2);

  // Update strategy score (exponential moving average)
  const currentScore = newProfile.strategyScores[strategy] ?? 50;
  const delta = success ? 10 : -8;
  newProfile.strategyScores[strategy] = Math.max(0, Math.min(100, currentScore + delta));

  // Update estimated states
  const recentAttempts = Object.values(newProfile.concepts)
    .flatMap(c => c.strategyHistory.slice(-3))
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 8);

  if (recentAttempts.length > 0) {
    const recentSuccessRate = recentAttempts.filter(a => a.success).length / recentAttempts.length;
    newProfile.estimatedConfidence = recentSuccessRate * 0.6 + newProfile.estimatedConfidence * 0.4;
    newProfile.estimatedEngagement = Math.min(1, newProfile.estimatedEngagement + (success ? 0.05 : -0.08));
    newProfile.estimatedEngagement = Math.max(0, newProfile.estimatedEngagement);
  }

  newProfile.lastSessionAt = Date.now();

  return newProfile;
}

// === API Sync ===

const API_BASE = 'http://localhost:3001/api/learner';

/**
 * Loads LearnerProfile from the backend API.
 */
export async function loadProfileFromBackend(userId: string): Promise<LearnerProfile> {
  try {
    const res = await fetch(`${API_BASE}/${userId}`);
    const data = await res.json();

    // Convert API response to LearnerProfile
    const concepts: Record<string, ConceptState> = {};
    if (data.conceptMastery) {
      for (const cm of data.conceptMastery) {
        concepts[cm.conceptKey] = {
          conceptKey: cm.conceptKey,
          status: cm.status as ConceptStatus,
          errorCount: cm.errorCount,
          errorPatterns: cm.errorPatterns,
          avgTime: cm.avgTime,
          lastPracticed: cm.lastPracticed ? new Date(cm.lastPracticed).getTime() : null,
          strategyHistory: cm.strategyHistory,
        };
      }
    }

    return {
      userId,
      specialInterests: data.specialInterests ?? [],
      concepts,
      metrics: {
        avgTimePerExercise: data.avgTimePerExercise ?? 0,
        totalHintsUsed: data.totalHintsUsed ?? 0,
        totalExercises: data.totalExercises ?? 0,
        totalCorrect: data.totalCorrect ?? 0,
        avgAccuracy: data.avgAccuracy ?? 0,
        progressSpeed: data.progressSpeed ?? 1.0,
      },
      estimatedConfidence: data.estimatedConfidence ?? 0.5,
      estimatedFatigue: data.estimatedFatigue ?? 0,
      estimatedEngagement: data.estimatedEngagement ?? 0.7,
      strategyScores: data.strategyScores ?? {},
      preferredStrategy: data.preferredStrategy ?? null,
      lastSessionAt: data.lastSessionAt ? new Date(data.lastSessionAt).getTime() : null,
    };
  } catch (e) {
    console.warn('[NAIS] Failed to load profile from backend, using defaults:', e);
    return createDefaultProfile(userId);
  }
}

/**
 * Saves LearnerProfile to the backend API.
 */
export async function saveProfileToBackend(profile: LearnerProfile): Promise<void> {
  try {
    await fetch(`${API_BASE}/${profile.userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        specialInterests: profile.specialInterests,
        avgTimePerExercise: profile.metrics.avgTimePerExercise,
        totalHintsUsed: profile.metrics.totalHintsUsed,
        totalExercises: profile.metrics.totalExercises,
        totalCorrect: profile.metrics.totalCorrect,
        avgAccuracy: profile.metrics.avgAccuracy,
        progressSpeed: profile.metrics.progressSpeed,
        estimatedConfidence: profile.estimatedConfidence,
        estimatedFatigue: profile.estimatedFatigue,
        estimatedEngagement: profile.estimatedEngagement,
        strategyScores: profile.strategyScores,
        preferredStrategy: profile.preferredStrategy,
        lastSessionAt: profile.lastSessionAt ? new Date(profile.lastSessionAt).toISOString() : null,
      }),
    });

    // Sync concept mastery
    for (const concept of Object.values(profile.concepts)) {
      await fetch(`${API_BASE}/${profile.userId}/concepts/${concept.conceptKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: concept.status,
          errorCount: concept.errorCount,
          errorPatterns: concept.errorPatterns,
          avgTime: concept.avgTime,
          strategyHistory: concept.strategyHistory,
        }),
      });
    }
  } catch (e) {
    console.warn('[NAIS] Failed to sync profile to backend:', e);
  }
}
