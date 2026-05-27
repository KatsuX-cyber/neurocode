import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { isV2Content } from '../types';
import type { LessonContentV2, FeedbackMessage, LessonResponse } from '../types';
import { ProgressBar } from '../components/lesson/ProgressBar';
import { BlockRenderer } from '../components/lesson/BlockRenderer';
import { HintSystem } from '../components/lesson/HintSystem';
import { CodeEditor } from '../components/lesson/CodeEditor';
import { OutputPanel } from '../components/lesson/OutputPanel';
import { LessonComplete } from '../components/lesson/LessonComplete';
import { getSuccessFeedback, getErrorFeedback } from '../engine/feedbackEngine';
import { calculateXpGain } from '../engine/adaptiveEngine';

/**
 * Lesson V2 — Experiência interativa neuroadaptativa
 *
 * Fluxo ARPERC:
 * 1. Hook → Contexto provocativo
 * 2. Explain → Conceito + código
 * 3. Practice → Instrução para usar editor
 * 4. Checkpoint → MCQ de verificação
 * 5. Reward → Celebração + recap
 * 6. Challenge → Desafio final com editor + validação
 */
export const Lesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    cognitiveMode,
    isFocusMode,
    toggleFocusMode,
    addXp,
    completeLesson,
    completedLessons,
    recordStudyDay,
    recordExercise,
    incrementBlocks,
    addExerciseAttempt,
    recalculateState,
    adaptiveState,
    resetSession,
  } = useAppStore();

  // --- State ---
  const [lessonData, setLessonData] = useState<LessonResponse | null>(null);
  const [parsedContent, setParsedContent] = useState<LessonContentV2 | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [showChallenge, setShowChallenge] = useState(false);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [previewCode, setPreviewCode] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const [challengeStartTime, setChallengeStartTime] = useState(0);

  // --- Auto-enable focus mode for focus/calm modes ---
  useEffect(() => {
    if ((cognitiveMode === 'focus' || cognitiveMode === 'calm') && !isFocusMode) {
      toggleFocusMode();
    }
  }, [cognitiveMode]);

  // --- Record study day & reset session ---
  useEffect(() => {
    recordStudyDay();
    resetSession();
  }, []);

  // --- Fetch lesson ---
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/courses/lesson/${id}`);
        const data = await res.json();

        setLessonData(data);
        setCode(data.codeTemplate || '');

        // Parse content
        let contentObj = data.content;
        if (typeof data.content === 'string') {
          try { contentObj = JSON.parse(data.content); } catch { /* ignore */ }
        }

        if (isV2Content(contentObj)) {
          setParsedContent(contentObj);
        } else {
          // Convert legacy format to V2
          const legacyContent = contentObj as Record<string, unknown>;
          const v2: LessonContentV2 = convertLegacyToV2(legacyContent);
          setParsedContent(v2);
        }
      } catch (e) {
        console.error('Error loading lesson:', e);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      setIsLoading(true);
      setCurrentBlockIndex(0);
      setShowChallenge(false);
      setIsSuccess(false);
      setAttempts(0);
      setHintsUsed(0);
      setOutput(null);
      setPreviewCode(null);
      setFeedback(null);
      fetchLesson();
    }
  }, [id]);

  // --- Block navigation ---
  const advanceBlock = useCallback(() => {
    if (!parsedContent) return;
    incrementBlocks();

    const nextIndex = currentBlockIndex + 1;
    if (nextIndex >= parsedContent.blocks.length) {
      // All blocks done → show challenge
      setShowChallenge(true);
      setChallengeStartTime(Date.now());
    } else {
      setCurrentBlockIndex(nextIndex);
    }
  }, [currentBlockIndex, parsedContent, incrementBlocks]);

  // --- Run code ---
  const runCode = useCallback(async () => {
    if (!lessonData || !id) return;

    try {
      setIsExecuting(true);
      setFeedback(null);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      // HTML/CSS preview
      if (lessonData.language === 'html' || lessonData.language === 'css') {
        setPreviewCode(code);
      } else {
        setOutput('Executando...');
      }

      const res = await fetch(`http://localhost:3001/api/courses/lesson/${id}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, userId: 'user-teste' }),
      });
      const result = await res.json();

      if (lessonData.language !== 'html' && lessonData.language !== 'css') {
        setOutput(result.output || (result.success ? 'Código validado!' : ''));
      }

      if (result.success) {
        setIsSuccess(true);

        // Calculate XP
        const timeSpent = (Date.now() - challengeStartTime) / 1000;
        const xpGained = calculateXpGain(30, adaptiveState, newAttempts);
        addXp(xpGained);
        completeLesson(id);

        // Record metrics
        recordExercise(true, hintsUsed);
        addExerciseAttempt({
          timestamp: Date.now(),
          timeSpent,
          success: true,
          hintsUsed,
          attempts: newAttempts,
        });
        recalculateState();

        setFeedback(getSuccessFeedback(newAttempts));
      } else {
        // Record failure
        recordExercise(false, hintsUsed);
        setFeedback(getErrorFeedback(newAttempts));
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
      if (lessonData.language !== 'html' && lessonData.language !== 'css') {
        setOutput(`Erro: ${errorMsg}`);
      }
      setIsSuccess(false);
    } finally {
      setIsExecuting(false);
    }
  }, [lessonData, id, code, attempts, hintsUsed, challengeStartTime, adaptiveState]);

  // --- Hint callback ---
  const onHintUsed = useCallback((level: number) => {
    setHintsUsed(level + 1);
  }, []);

  // --- Loading & Error states ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl font-bold text-muted animate-pulse">Carregando aula...</div>
      </div>
    );
  }

  if (!lessonData || !parsedContent) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-xl text-muted">Aula não encontrada.</div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
        </button>
      </div>
    );
  }

  const blocks = parsedContent.blocks;
  const isInChallengePhase = showChallenge;
  const xpForComplete = calculateXpGain(30, adaptiveState, attempts || 1);

  return (
    <div className="flex h-full gap-6">
      {/* ===== LEFT PANEL: Content ===== */}
      <div className="w-5/12 flex flex-col gap-4 overflow-y-auto pr-2 pb-6">
        {/* Progress Bar */}
        <ProgressBar
          blocks={blocks}
          currentIndex={isInChallengePhase ? blocks.length : currentBlockIndex}
          hasChallenge={true}
        />

        {/* Lesson Title */}
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold">{parsedContent.title}</h1>
          <ModeIndicator mode={cognitiveMode} />
        </div>

        {/* Blocks */}
        <div className="space-y-3 flex-1">
          <AnimatePresence mode="sync">
            {blocks.map((block, idx) => (
              <BlockRenderer
                key={block.id}
                block={block}
                onComplete={advanceBlock}
                isActive={!isInChallengePhase && idx === currentBlockIndex}
                isCompleted={isInChallengePhase || idx < currentBlockIndex}
                cognitiveMode={cognitiveMode}
              />
            ))}
          </AnimatePresence>

          {/* Challenge Block */}
          <AnimatePresence>
            {isInChallengePhase && !isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="lesson-block lesson-block--practice mt-4"
              >
                <div className="flex items-center gap-2 text-success text-xs font-bold uppercase tracking-wider mb-3">
                  <HelpCircle className="w-4 h-4" />
                  Desafio Final
                </div>
                <p className="text-lg font-bold leading-relaxed mb-4">
                  {parsedContent.challenge.instruction}
                </p>

                {/* Hint System */}
                <HintSystem
                  hints={parsedContent.challenge.hints}
                  onHintUsed={onHintUsed}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ===== RIGHT PANEL: Editor + Output ===== */}
      <div className="flex-1 flex flex-col gap-4 relative">
        <CodeEditor
          code={code}
          onChange={setCode}
          language={lessonData.language || 'javascript'}
          cognitiveMode={cognitiveMode}
        />

        <OutputPanel
          output={output}
          isExecuting={isExecuting}
          onRun={runCode}
          language={lessonData.language || 'javascript'}
          previewCode={previewCode}
          feedback={feedback}
        />

        {/* Success Overlay */}
        <AnimatePresence>
          {isSuccess && (
            <LessonComplete
              xpGained={xpForComplete}
              conceptName={parsedContent.concept || parsedContent.title}
              nextLesson={lessonData.nextLesson || null}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// === Helper Components ===

const ModeIndicator: React.FC<{ mode: string }> = ({ mode }) => {
  const labels: Record<string, { label: string; color: string }> = {
    standard:  { label: 'Padrão',     color: 'text-muted border-white/10' },
    energetic: { label: 'Energético', color: 'text-secondary border-secondary/30' },
    focus:     { label: 'Foco',       color: 'text-primary border-primary/30' },
    calm:      { label: 'Calmo',      color: 'text-success border-success/30' },
  };
  const meta = labels[mode] || labels.standard;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${meta.color}`}>
      {meta.label}
    </span>
  );
};

// === Legacy Format Converter ===

function convertLegacyToV2(content: Record<string, unknown>): LessonContentV2 {
  const title = (content.title as string) || 'Lição';
  const challenge = (content.challenge as string) || '';

  // Extract steps from atypical or legacy format
  const atypicalSteps = (content.atypical as Record<string, unknown>)?.steps as Array<{id: number; text: string}> | undefined;
  const legacySteps = content.steps as Array<{id: number; text: string}> | undefined;
  const typicalArticle = (content.typical as Record<string, unknown>)?.article as string[] | undefined;

  const steps = atypicalSteps || legacySteps || [];
  const articles = typicalArticle || [];

  // Build blocks from whatever data we have
  const blocks = [];

  if (steps.length > 0) {
    // Convert steps to ARPERC blocks
    blocks.push({
      id: 'hook-legacy',
      type: 'hook' as const,
      content: steps[0]?.text || 'Vamos aprender algo novo!',
    });

    const explainSteps = steps.slice(1, -1);
    if (explainSteps.length > 0) {
      blocks.push({
        id: 'explain-legacy',
        type: 'explain' as const,
        title: 'Conceito',
        content: explainSteps.map(s => s.text).join('\n\n'),
      });
    }

    if (steps.length > 1) {
      blocks.push({
        id: 'reward-legacy',
        type: 'reward' as const,
        content: steps[steps.length - 1]?.text || 'Agora é sua vez!',
      });
    }
  } else if (articles.length > 0) {
    blocks.push({
      id: 'hook-legacy',
      type: 'hook' as const,
      content: articles[0],
    });

    if (articles.length > 1) {
      blocks.push({
        id: 'explain-legacy',
        type: 'explain' as const,
        title: 'Conceito',
        content: articles.slice(1, -1).join('\n\n'),
      });
    }

    blocks.push({
      id: 'reward-legacy',
      type: 'reward' as const,
      content: articles[articles.length - 1] || 'Hora de praticar!',
    });
  }

  return {
    title,
    concept: title,
    blocks,
    challenge: {
      instruction: challenge,
      hints: [
        'Releia o conteúdo da lição com atenção.',
        'Preste atenção na sintaxe — cada detalhe importa.',
        'Tente comparar com os exemplos mostrados acima.',
      ],
    },
  };
}
