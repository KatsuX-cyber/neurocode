import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import vm from 'vm';

const prisma = new PrismaClient();

export const getCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { order: 'asc' },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });
    res.json(courses);
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

export const getLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const lesson = await prisma.lesson.findUnique({
      where: { id },
    });

    if (!lesson) {
      res.status(404).json({ error: 'Lição não encontrada' });
      return;
    }

    // Find the next lesson in the same module
    const nextLesson = await prisma.lesson.findFirst({
      where: {
        moduleId: lesson.moduleId,
        order: { gt: lesson.order },
      },
      orderBy: { order: 'asc' },
      select: { id: true, title: true },
    });

    res.json({ ...lesson, nextLesson: nextLesson || null });
  } catch (error) {
    console.error('Erro ao buscar lição:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

export const saveProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, lessonId, status, savedCode } = req.body;

    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        status,
        savedCode,
        completedAt: status === 'COMPLETED' ? new Date() : undefined,
      },
      create: {
        userId,
        lessonId,
        status,
        savedCode,
        completedAt: status === 'COMPLETED' ? new Date() : undefined,
      },
    });

    res.json(progress);
  } catch (error) {
    console.error('Erro ao salvar progresso:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

export const validateLessonCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { code, userId } = req.body;

    const lesson = await prisma.lesson.findUnique({
      where: { id },
    });

    if (!lesson) {
      res.status(404).json({ error: 'Lição não encontrada' });
      return;
    }

    let success = false;
    let outputStr = '';

    const language = lesson.language || 'javascript';

    if (language === 'html' || language === 'css') {
       outputStr = code;
       if (lesson.validationLogic) {
           // CVS fix: execute the validation block as a script (declares `validate`),
           // then call validate() explicitly — avoids SyntaxError from bare `validate;`
           const validationScriptStr = `${lesson.validationLogic}\nvalidate(outputStr, code)`;
           const validationContext = vm.createContext({ outputStr, code });
           try {
             success = vm.runInContext(validationScriptStr, validationContext);
           } catch(e) {
             // Log so malformed validationLogic is visible in server output
             console.error(`[CVS] validationLogic threw for lesson ${id}:`, e);
             success = false;
           }
       } else {
           success = true;
       }
    } else if (language === 'java') {
       try {
         const response = await fetch('https://emkc.org/api/v2/piston/execute', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             language: 'java',
             version: '15.0.2',
             files: [{ name: 'Main.java', content: code }]
           })
         });
         const data = await response.json();
         
         if (data.run) {
            outputStr = data.run.output;
            if (data.run.code !== 0 && data.run.stderr) {
                outputStr = data.run.stderr;
            }
         } else {
            outputStr = data.message || "Erro de compilação/execução na Piston API";
         }

         if (lesson.validationLogic) {
             // CVS fix: execute the validation block as a script (declares `validate`),
             // then call validate() explicitly — avoids SyntaxError from bare `validate;`
             const validationScriptStr = `${lesson.validationLogic}\nvalidate(outputStr, code)`;
             const validationContext = vm.createContext({ outputStr, code });
             try {
               success = vm.runInContext(validationScriptStr, validationContext);
             } catch(e) {
               console.error(`[CVS] validationLogic threw for lesson ${id} (java):`, e);
               success = false;
             }
         } else {
             success = (data.run && data.run.code === 0);
         }
       } catch (err: any) {
         outputStr = `Erro: ${err.message}`;
         success = false;
       }
    } else {
      // Javascript (default)
      const logs: string[] = [];
      const sandbox = {
        console: {
          log: (...args: any[]) => logs.push(args.join(' ')),
        }
      };

      const context = vm.createContext(sandbox);

      try {
        const script = new vm.Script(code);
        script.runInContext(context, { timeout: 1000 });
        
        outputStr = logs.join('\n');

        if (lesson.validationLogic) {
            // CVS fix: execute the validation block as a script (declares `validate`),
            // then call validate() explicitly — avoids SyntaxError from bare `validate;`
            const validationScriptStr = `${lesson.validationLogic}\nvalidate(outputStr, code)`;
            const validationContext = vm.createContext({ outputStr, code });
            try {
              success = vm.runInContext(validationScriptStr, validationContext);
            } catch(e) {
              console.error(`[CVS] validationLogic threw for lesson ${id} (js):`, e);
              success = false;
            }
        } else {
            success = true;
        }
      } catch (err: any) {
        outputStr = `Erro: ${err.message}`;
        success = false;
      }
    }

    if (success && userId) {
        try {
          await prisma.progress.upsert({
             where: { userId_lessonId: { userId, lessonId: id } },
             update: { status: 'COMPLETED', savedCode: code, completedAt: new Date() },
             create: { userId, lessonId: id, status: 'COMPLETED', savedCode: code, completedAt: new Date() }
          });
          
          await prisma.user.update({
             where: { id: userId },
             data: { xp: { increment: 20 } }
          });
        } catch (progressError) {
          // Progresso não pôde ser salvo (ex: userId não existe) — não interrompe a resposta
          console.warn(`[Progress] Não foi possível salvar progresso para userId=${userId}:`, progressError instanceof Error ? progressError.message : progressError);
        }
    }

    res.json({ success, output: outputStr });

  } catch (error) {
    console.error('Erro na validação do código:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

