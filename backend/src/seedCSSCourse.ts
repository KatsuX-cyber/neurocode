/**
 * seedCSSCourse.ts — Orquestrador do Curso CSS NeuroCode
 * Importa e combina os dois arquivos de dados (Part1 + Part2)
 * e cria o curso completo com 65 aulas em 11 módulos.
 *
 * Para executar:
 *   cd backend
 *   npx ts-node src/seedCSSCourse.ts
 */

import { PrismaClient } from '@prisma/client';
import { cssPart1Modules } from './seedCSSPart1';
import { cssPart2Modules } from './seedCSSPart2';

const prisma = new PrismaClient();
const allModules = [...cssPart1Modules, ...cssPart2Modules];

async function main() {
  console.log('🧹 Removendo curso CSS antigo (se existir)...');
  const oldCourse = await prisma.course.findFirst({
    where: { title: { contains: 'CSS' } },
  });
  if (oldCourse) {
    const modules = await prisma.module.findMany({ where: { courseId: oldCourse.id } });
    for (const mod of modules) {
      const lessons = await prisma.lesson.findMany({ where: { moduleId: mod.id } });
      for (const lesson of lessons) {
        await prisma.progress.deleteMany({ where: { lessonId: lesson.id } });
      }
      await prisma.lesson.deleteMany({ where: { moduleId: mod.id } });
    }
    await prisma.module.deleteMany({ where: { courseId: oldCourse.id } });
    await prisma.course.delete({ where: { id: oldCourse.id } });
    console.log('✅ Curso antigo removido.');
  }

  console.log('🚀 Criando curso CSS: Estilo e Design com 65 lições em 11 módulos...');

  const course = await prisma.course.create({
    data: {
      title: 'CSS: Estilo e Design',
      description:
        'Aprenda a transformar estrutura HTML em interfaces bonitas, responsivas e animadas. ' +
        'Do seu primeiro color até layouts Grid e animações com @keyframes — CSS do zero ao profissional.',
      level: 'BASIC',
      order: 2,
    },
  });

  let totalLessons = 0;

  for (const modData of allModules) {
    console.log(`  📦 Criando: ${modData.title} (${modData.lessons.length} aulas)...`);
    const mod = await prisma.module.create({
      data: {
        title: modData.title,
        description: modData.description,
        order: modData.order,
        courseId: course.id,
      },
    });

    for (const lessonData of modData.lessons) {
      await prisma.lesson.create({
        data: {
          title: lessonData.title,
          language: lessonData.language,
          order: lessonData.order,
          codeTemplate: lessonData.codeTemplate,
          validationLogic: lessonData.validationLogic,
          content: lessonData.content,
          moduleId: mod.id,
        },
      });
      totalLessons++;
    }
  }

  console.log('\n✅ Seed concluído com sucesso!');
  console.log(`📊 Criado: 1 curso · ${allModules.length} módulos · ${totalLessons} lições CSS`);
  console.log('🎯 Cobertura: Seletores → Tipografia → Box Model → Flexbox → Grid → Responsividade → Animações → Projeto Final');
  console.log('\n🌐 Acesse: http://localhost:5173/courses — "CSS: Estilo e Design"');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
