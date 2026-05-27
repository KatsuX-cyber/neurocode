// ============================================================
// NeuroCode — Central Type Definitions
// Neuroadaptive Learning Platform
// ============================================================

// === COGNITIVE SYSTEM ===

/** Modos cognitivos que alteram a experiência de aprendizado */
export type CognitiveMode = 'standard' | 'energetic' | 'focus' | 'calm';

/** Estados adaptativos detectados pelo motor NEXUS */
export type AdaptiveState = 'flow' | 'learning' | 'struggling' | 'frustrated' | 'disengaged';

// === LESSON CONTENT (V2 — ARPERC Format) ===

export type BlockType = 'hook' | 'explain' | 'practice' | 'checkpoint' | 'reward';

export interface LessonBlock {
  id: string;
  type: BlockType;
  title?: string;
  content: string;
  /** Exemplo de código para blocos explain */
  code?: string;
  /** Dados de checkpoint (MCQ) */
  checkpoint?: CheckpointData;
}

export interface CheckpointData {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ChallengeData {
  instruction: string;
  /** Dicas em 3 níveis: indicação → conceitual → explicação completa */
  hints: [string, string, string];
}

export interface LessonContentV2 {
  title: string;
  concept: string;
  blocks: LessonBlock[];
  challenge: ChallengeData;
}

// === METRICS & TRACKING ===

export interface ExerciseAttempt {
  timestamp: number;
  timeSpent: number;
  success: boolean;
  hintsUsed: number;
  attempts: number;
}

export interface SessionMetrics {
  startTime: number;
  exercisesAttempted: number;
  exercisesCorrect: number;
  hintsUsed: number;
  blocksCompleted: number;
  errorsInRow: number;
}

// === PERSONALIZATION ===

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  totalStudyDays: number;
  daysThisMonth: number;
  lastStudyDate: string | null;
}

export interface SensoryPreferences {
  animationLevel: 'none' | 'minimal' | 'moderate' | 'full';
  fontSize: 'normal' | 'large' | 'xlarge';
  lineSpacing: 'normal' | 'relaxed' | 'spacious';
  colorScheme: 'dark' | 'cream' | 'light-blue' | 'light-green';
  soundEnabled: boolean;
  fontFamily: 'inter' | 'opendyslexic';
}

// === FEEDBACK ===

export interface FeedbackMessage {
  text: string;
  type: 'success' | 'encouragement' | 'hint' | 'error' | 'info';
  emoji?: string;
}

// === API RESPONSE ===

export interface LessonResponse {
  id: string;
  title: string;
  language: string;
  content: string;
  codeTemplate: string | null;
  validationLogic: string | null;
  moduleId: string;
  order: number;
  nextLesson: { id: string; title: string } | null;
}

// === TYPE GUARD ===

/** Verifica se o conteúdo está no formato V2 (ARPERC) */
export function isV2Content(content: unknown): content is LessonContentV2 {
  return (
    typeof content === 'object' &&
    content !== null &&
    'blocks' in content &&
    Array.isArray((content as Record<string, unknown>).blocks)
  );
}
