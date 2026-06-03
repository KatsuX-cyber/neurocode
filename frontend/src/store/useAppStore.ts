import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  CognitiveMode,
  AdaptiveState,
  SessionMetrics,
  ExerciseAttempt,
  StreakData,
  SensoryPreferences,
} from '../types';
import { classifyState } from '../engine/adaptiveEngine';
import type { LearnerProfile, SpecialInterest } from '../engine/learnerModel';
import type { StrategyType } from '../engine/strategyEngine';
import type { StuckAnalysis } from '../engine/stuckDetector';
import type { DecisionAction } from '../engine/decisionEngine';
import {
  createDefaultProfile,
  updateProfileAfterAttempt,
  loadProfileFromBackend,
  saveProfileToBackend,
} from '../engine/learnerModel';

// === Defaults ===

const DEFAULT_PREFERENCES: SensoryPreferences = {
  animationLevel: 'moderate',
  fontSize: 'normal',
  lineSpacing: 'normal',
  colorScheme: 'dark',
  soundEnabled: false,
  fontFamily: 'inter',
};

const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  bestStreak: 0,
  totalStudyDays: 0,
  daysThisMonth: 0,
  lastStudyDate: null,
};

const FRESH_SESSION: SessionMetrics = {
  startTime: Date.now(),
  exercisesAttempted: 0,
  exercisesCorrect: 0,
  hintsUsed: 0,
  blocksCompleted: 0,
  errorsInRow: 0,
};

// === Store Interface ===

interface AppState {
  // --- UI ---
  isFocusMode: boolean;
  toggleFocusMode: () => void;

  // --- Cognitive Mode (replaces binary learningProfile) ---
  cognitiveMode: CognitiveMode;
  setCognitiveMode: (mode: CognitiveMode) => void;

  // --- Backward compatibility ---
  learningProfile: 'atypical' | 'typical';
  setLearningProfile: (profile: 'atypical' | 'typical') => void;

  // --- Course ---
  activeCourseId: string | null;
  setActiveCourseId: (id: string) => void;

  // --- Progress & XP ---
  xp: number;
  addXp: (amount: number) => void;
  completedLessons: string[];
  completeLesson: (lessonId: string) => void;

  // --- Streak (saudável) ---
  streakData: StreakData;
  streak: number; // backward compat alias
  recordStudyDay: () => void;

  // --- Session Metrics ---
  sessionMetrics: SessionMetrics;
  resetSession: () => void;
  recordExercise: (success: boolean, hintsUsed: number) => void;
  incrementBlocks: () => void;

  // --- Exercise History (rolling window) ---
  exerciseHistory: ExerciseAttempt[];
  addExerciseAttempt: (attempt: ExerciseAttempt) => void;

  // --- Adaptive State ---
  adaptiveState: AdaptiveState;
  recalculateState: () => void;

  // --- Sensory Preferences ---
  preferences: SensoryPreferences;
  updatePreferences: (prefs: Partial<SensoryPreferences>) => void;

  // ============================================================
  // NAIS — Adaptive Intelligence State
  // ============================================================

  // --- Learner Profile ---
  learnerProfile: LearnerProfile | null;
  naisLoading: boolean;
  loadLearnerProfile: (userId: string) => Promise<void>;
  setLearnerProfile: (profile: LearnerProfile) => void;
  updateLearnerAfterAttempt: (
    conceptKey: string,
    success: boolean,
    timeSpent: number,
    hintsUsed: number,
    strategy: string,
  ) => void;
  syncLearnerToBackend: () => Promise<void>;

  // --- Interests ---
  addSpecialInterest: (interest: SpecialInterest) => void;
  removeSpecialInterest: (interest: SpecialInterest) => void;

  // --- Strategy & Decision ---
  currentStrategy: StrategyType;
  setCurrentStrategy: (strategy: StrategyType) => void;
  lastStuckAnalysis: StuckAnalysis | null;
  setLastStuckAnalysis: (analysis: StuckAnalysis | null) => void;
  lastDecision: DecisionAction | null;
  setLastDecision: (decision: DecisionAction | null) => void;
}

// === Store ===

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // --- UI ---
      isFocusMode: false,
      toggleFocusMode: () => set((s) => ({ isFocusMode: !s.isFocusMode })),

      // --- Cognitive Mode ---
      cognitiveMode: 'standard',
      setCognitiveMode: (mode) =>
        set({
          cognitiveMode: mode,
          learningProfile:
            mode === 'focus' || mode === 'calm' ? 'atypical' : 'typical',
        }),

      // --- Backward compatibility ---
      learningProfile: 'typical',
      setLearningProfile: (profile) =>
        set({
          learningProfile: profile,
          cognitiveMode: profile === 'atypical' ? 'calm' : 'standard',
        }),

      // --- Course ---
      activeCourseId: null,
      setActiveCourseId: (id) => set({ activeCourseId: id }),

      // --- XP ---
      xp: 0,
      addXp: (amount) => set((s) => ({ xp: s.xp + amount })),

      // --- Completed Lessons ---
      completedLessons: [],
      completeLesson: (lessonId) =>
        set((s) => ({
          completedLessons: s.completedLessons.includes(lessonId)
            ? s.completedLessons
            : [...s.completedLessons, lessonId],
        })),

      // --- Streak ---
      streakData: DEFAULT_STREAK,
      streak: 0,
      recordStudyDay: () =>
        set((s) => {
          const today = new Date().toISOString().split('T')[0];
          if (s.streakData.lastStudyDate === today) return s; // Already recorded

          const yesterday = new Date(Date.now() - 86400000)
            .toISOString()
            .split('T')[0];
          const isConsecutive = s.streakData.lastStudyDate === yesterday;

          const newStreak = isConsecutive
            ? s.streakData.currentStreak + 1
            : 1;

          const newData: StreakData = {
            currentStreak: newStreak,
            bestStreak: Math.max(s.streakData.bestStreak, newStreak),
            totalStudyDays: s.streakData.totalStudyDays + 1,
            daysThisMonth: s.streakData.daysThisMonth + 1,
            lastStudyDate: today,
          };

          return { streakData: newData, streak: newStreak };
        }),

      // --- Session ---
      sessionMetrics: FRESH_SESSION,
      resetSession: () => set({ sessionMetrics: { ...FRESH_SESSION, startTime: Date.now() } }),
      recordExercise: (success, hintsUsed) =>
        set((s) => ({
          sessionMetrics: {
            ...s.sessionMetrics,
            exercisesAttempted: s.sessionMetrics.exercisesAttempted + 1,
            exercisesCorrect: s.sessionMetrics.exercisesCorrect + (success ? 1 : 0),
            hintsUsed: s.sessionMetrics.hintsUsed + hintsUsed,
            errorsInRow: success ? 0 : s.sessionMetrics.errorsInRow + 1,
          },
        })),
      incrementBlocks: () =>
        set((s) => ({
          sessionMetrics: {
            ...s.sessionMetrics,
            blocksCompleted: s.sessionMetrics.blocksCompleted + 1,
          },
        })),

      // --- Exercise History ---
      exerciseHistory: [],
      addExerciseAttempt: (attempt) =>
        set((s) => ({
          exerciseHistory: [...s.exerciseHistory.slice(-19), attempt],
        })),

      // --- Adaptive State ---
      adaptiveState: 'learning',
      recalculateState: () =>
        set((s) => ({
          adaptiveState: classifyState(s.exerciseHistory),
        })),

      // --- Preferences ---
      preferences: DEFAULT_PREFERENCES,
      updatePreferences: (prefs) =>
        set((s) => ({
          preferences: { ...s.preferences, ...prefs },
        })),

      // ============================================================
      // NAIS — Adaptive Intelligence
      // ============================================================

      // --- Learner Profile ---
      learnerProfile: null,
      naisLoading: false,

      loadLearnerProfile: async (userId) => {
        set({ naisLoading: true });
        try {
          const profile = await loadProfileFromBackend(userId);
          set({ learnerProfile: profile, naisLoading: false });
        } catch {
          // Fallback to default
          set({ learnerProfile: createDefaultProfile(userId), naisLoading: false });
        }
      },

      setLearnerProfile: (profile) => set({ learnerProfile: profile }),

      updateLearnerAfterAttempt: (conceptKey, success, timeSpent, hintsUsed, strategy) => {
        const current = get().learnerProfile;
        if (!current) return;
        const updated = updateProfileAfterAttempt(current, conceptKey, success, timeSpent, hintsUsed, strategy);
        set({ learnerProfile: updated });
      },

      syncLearnerToBackend: async () => {
        const profile = get().learnerProfile;
        if (profile) {
          await saveProfileToBackend(profile);
        }
      },

      // --- Interests ---
      addSpecialInterest: (interest) => {
        const profile = get().learnerProfile;
        if (!profile) return;
        if (profile.specialInterests.includes(interest)) return;
        set({
          learnerProfile: {
            ...profile,
            specialInterests: [...profile.specialInterests, interest].slice(0, 3), // max 3
          },
        });
      },

      removeSpecialInterest: (interest) => {
        const profile = get().learnerProfile;
        if (!profile) return;
        set({
          learnerProfile: {
            ...profile,
            specialInterests: profile.specialInterests.filter(i => i !== interest),
          },
        });
      },

      // --- Strategy & Decision ---
      currentStrategy: 'technical',
      setCurrentStrategy: (strategy) => set({ currentStrategy: strategy }),

      lastStuckAnalysis: null,
      setLastStuckAnalysis: (analysis) => set({ lastStuckAnalysis: analysis }),

      lastDecision: null,
      setLastDecision: (decision) => set({ lastDecision: decision }),
    }),
    {
      name: 'neurocode-store',
      partialize: (state) => ({
        // Persist only what matters across sessions
        cognitiveMode: state.cognitiveMode,
        learningProfile: state.learningProfile,
        activeCourseId: state.activeCourseId,
        xp: state.xp,
        completedLessons: state.completedLessons,
        streakData: state.streakData,
        streak: state.streak,
        exerciseHistory: state.exerciseHistory,
        preferences: state.preferences,
        isFocusMode: state.isFocusMode,
        // NAIS: persist learner profile locally as cache
        learnerProfile: state.learnerProfile,
        currentStrategy: state.currentStrategy,
      }),
    }
  )
);
