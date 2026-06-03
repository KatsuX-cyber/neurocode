import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================
// NAIS — Learner Model API
// CRUD para o modelo persistente do aprendiz
// ============================================================

/**
 * GET /api/learner/:userId
 * Busca ou cria o LearnerModel para um usuário.
 */
export const getLearnerModel = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId as string;

    let learner = await prisma.learnerModel.findUnique({
      where: { userId },
      include: { conceptMastery: true },
    });

    // Auto-create if not found — but only if user exists (FK constraint)
    if (!learner) {
      const userExists = await prisma.user.findUnique({ where: { id: userId } });
      if (userExists) {
        const created = await prisma.learnerModel.create({
          data: { userId },
          include: { conceptMastery: true },
        });
        learner = created;
      } else {
        // User doesn't exist in DB — return a virtual default model
        // The frontend will work in-memory via localStorage
        res.json({
          id: 'virtual',
          userId,
          specialInterests: [],
          avgTimePerExercise: 0,
          totalHintsUsed: 0,
          totalExercises: 0,
          totalCorrect: 0,
          avgAccuracy: 0,
          progressSpeed: 1.0,
          estimatedConfidence: 0.5,
          estimatedFatigue: 0,
          estimatedEngagement: 0.7,
          strategyScores: {},
          preferredStrategy: null,
          lastSessionAt: null,
          conceptMastery: [],
        });
        return;
      }
    }

    // Parse JSON fields for the client
    res.json({
      ...learner,
      specialInterests: JSON.parse(learner.specialInterests),
      strategyScores: JSON.parse(learner.strategyScores),
      conceptMastery: learner.conceptMastery.map((cm: { errorPatterns: string; strategyHistory: string; [key: string]: unknown }) => ({
        ...cm,
        errorPatterns: JSON.parse(cm.errorPatterns),
        strategyHistory: JSON.parse(cm.strategyHistory),
      })),
    });
  } catch (error) {
    console.error('[NAIS] Error fetching learner model:', error);
    res.status(500).json({ error: 'Erro ao buscar modelo do aprendiz' });
  }
};

/**
 * PUT /api/learner/:userId
 * Atualiza métricas, interesses e estados do LearnerModel.
 */
export const updateLearnerModel = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId as string;

    // FK-safe: skip DB write if user doesn't exist
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      res.json({ ok: true, virtual: true });
      return;
    }

    const {
      specialInterests,
      avgTimePerExercise,
      totalHintsUsed,
      totalExercises,
      totalCorrect,
      avgAccuracy,
      progressSpeed,
      estimatedConfidence,
      estimatedFatigue,
      estimatedEngagement,
      strategyScores,
      preferredStrategy,
      lastSessionAt,
    } = req.body;

    const data: Record<string, unknown> = {};

    // Only update fields that are provided
    if (specialInterests !== undefined) data.specialInterests = JSON.stringify(specialInterests);
    if (avgTimePerExercise !== undefined) data.avgTimePerExercise = avgTimePerExercise;
    if (totalHintsUsed !== undefined) data.totalHintsUsed = totalHintsUsed;
    if (totalExercises !== undefined) data.totalExercises = totalExercises;
    if (totalCorrect !== undefined) data.totalCorrect = totalCorrect;
    if (avgAccuracy !== undefined) data.avgAccuracy = avgAccuracy;
    if (progressSpeed !== undefined) data.progressSpeed = progressSpeed;
    if (estimatedConfidence !== undefined) data.estimatedConfidence = estimatedConfidence;
    if (estimatedFatigue !== undefined) data.estimatedFatigue = estimatedFatigue;
    if (estimatedEngagement !== undefined) data.estimatedEngagement = estimatedEngagement;
    if (strategyScores !== undefined) data.strategyScores = JSON.stringify(strategyScores);
    if (preferredStrategy !== undefined) data.preferredStrategy = preferredStrategy;
    if (lastSessionAt !== undefined) data.lastSessionAt = new Date(lastSessionAt);

    const learner = await prisma.learnerModel.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });

    res.json({
      ...learner,
      specialInterests: JSON.parse(learner.specialInterests),
      strategyScores: JSON.parse(learner.strategyScores),
    });
  } catch (error) {
    console.error('[NAIS] Error updating learner model:', error);
    res.status(500).json({ error: 'Erro ao atualizar modelo do aprendiz' });
  }
};

/**
 * POST /api/learner/:userId/event
 * Registra um TeachingEvent (tentativa, dica, troca de estratégia, etc.)
 */
export const recordTeachingEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId as string;

    // FK-safe: skip DB write if user doesn't exist
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      res.json({ ok: true, virtual: true });
      return;
    }

    const { lessonId, conceptKey, eventType, strategyUsed, success, timeSpent, hintsUsed, attemptsCount, emotionalState } = req.body;

    // Ensure learner model exists
    let learner = await prisma.learnerModel.findUnique({ where: { userId } });
    if (!learner) {
      learner = await prisma.learnerModel.create({ data: { userId } });
    }

    const event = await prisma.teachingEvent.create({
      data: {
        learnerModelId: learner.id,
        lessonId: lessonId as string || null,
        conceptKey: conceptKey as string,
        eventType: eventType as string,
        strategyUsed: strategyUsed as string || null,
        success: success ?? false,
        timeSpent: timeSpent ?? 0,
        hintsUsed: hintsUsed ?? 0,
        attemptsCount: attemptsCount ?? 0,
        emotionalState: emotionalState as string || null,
      },
    });

    // Auto-update aggregated metrics on the learner model
    if (eventType === 'attempt' || eventType === 'success') {
      const newTotal = learner.totalExercises + 1;
      const newCorrect = learner.totalCorrect + (success ? 1 : 0);
      const newHints = learner.totalHintsUsed + (hintsUsed ?? 0);
      const newAvgTime = learner.totalExercises === 0
        ? (timeSpent ?? 0)
        : (learner.avgTimePerExercise * learner.totalExercises + (timeSpent ?? 0)) / newTotal;

      await prisma.learnerModel.update({
        where: { id: learner.id },
        data: {
          totalExercises: newTotal,
          totalCorrect: newCorrect,
          totalHintsUsed: newHints,
          avgTimePerExercise: newAvgTime,
          avgAccuracy: newCorrect / newTotal,
          lastSessionAt: new Date(),
        },
      });
    }

    res.json(event);
  } catch (error) {
    console.error('[NAIS] Error recording teaching event:', error);
    res.status(500).json({ error: 'Erro ao registrar evento' });
  }
};

/**
 * GET /api/learner/:userId/concepts
 * Busca todos os ConceptMastery de um aluno.
 */
export const getConceptMastery = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId as string;

    const learner = await prisma.learnerModel.findUnique({ where: { userId } });
    if (!learner) {
      res.json([]);
      return;
    }

    const concepts = await prisma.conceptMastery.findMany({
      where: { learnerModelId: learner.id },
      orderBy: { updatedAt: 'desc' },
    });

    res.json(concepts.map((cm: { errorPatterns: string; strategyHistory: string; [key: string]: unknown }) => ({
      ...cm,
      errorPatterns: JSON.parse(cm.errorPatterns),
      strategyHistory: JSON.parse(cm.strategyHistory),
    })));
  } catch (error) {
    console.error('[NAIS] Error fetching concept mastery:', error);
    res.status(500).json({ error: 'Erro ao buscar conceitos' });
  }
};

/**
 * PUT /api/learner/:userId/concepts/:conceptKey
 * Atualiza o mastery de um conceito específico.
 */
export const updateConceptMastery = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId as string;
    const conceptKey = req.params.conceptKey as string;
    const { status, errorCount, errorPatterns, avgTime, strategyHistory } = req.body;

    // Ensure learner model exists
    let learner = await prisma.learnerModel.findUnique({ where: { userId } });
    if (!learner) {
      learner = await prisma.learnerModel.create({ data: { userId } });
    }

    const data: Record<string, unknown> = {};
    if (status !== undefined) data.status = status as string;
    if (errorCount !== undefined) data.errorCount = errorCount;
    if (errorPatterns !== undefined) data.errorPatterns = JSON.stringify(errorPatterns);
    if (avgTime !== undefined) data.avgTime = avgTime;
    if (strategyHistory !== undefined) data.strategyHistory = JSON.stringify(strategyHistory);
    data.lastPracticed = new Date();

    const concept = await prisma.conceptMastery.upsert({
      where: {
        learnerModelId_conceptKey: {
          learnerModelId: learner.id,
          conceptKey,
        },
      },
      update: data,
      create: {
        learnerModelId: learner.id,
        conceptKey,
        ...data,
      },
    });

    res.json({
      ...concept,
      errorPatterns: JSON.parse(concept.errorPatterns),
      strategyHistory: JSON.parse(concept.strategyHistory),
    });
  } catch (error) {
    console.error('[NAIS] Error updating concept mastery:', error);
    res.status(500).json({ error: 'Erro ao atualizar conceito' });
  }
};
