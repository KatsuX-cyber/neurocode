import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Criando curso e aulas para testar múltiplas linguagens...');

  const course = await prisma.course.create({
    data: {
      title: 'Explorando Linguagens de Programação',
      description: 'Um curso focado em testar a execução real de HTML, CSS, JavaScript e Java.',
      level: 'BASIC',
      order: 1,
    }
  });

  const moduleObj = await prisma.module.create({
    data: {
      title: 'Módulo 1: Conhecendo as Tecnologias',
      description: 'Testes práticos no editor real.',
      courseId: course.id,
      order: 1,
    }
  });

  // HTML
  await prisma.lesson.create({
    data: {
      title: '1. Sua Primeira Página HTML',
      language: 'html',
      moduleId: moduleObj.id,
      order: 1,
      content: JSON.stringify({
        title: 'Criando um título em HTML',
        challenge: 'Crie uma tag <h1> com o texto "Olá HTML".',
        steps: [
          { id: 1, text: 'HTML é a linguagem de marcação da web.' },
          { id: 2, text: 'Você pode criar títulos usando a tag <h1>.' }
        ]
      }),
      codeTemplate: `<!-- Escreva seu código aqui -->\n<h1>Olá HTML</h1>\n<p>Esta é uma página de verdade sendo renderizada.</p>`,
      validationLogic: `
function validate(outputStr, code) {
   if (code.toLowerCase().includes("<h1>") && code.toLowerCase().includes("olá html")) {
      return true;
   }
   return false;
}
validate;
`
    }
  });

  // CSS
  await prisma.lesson.create({
    data: {
      title: '2. Estilizando com CSS',
      language: 'css',
      moduleId: moduleObj.id,
      order: 2,
      content: JSON.stringify({
        title: 'Mudando a cor do fundo',
        challenge: 'Mude o background-color do body para blue.',
        steps: [
          { id: 1, text: 'CSS é usado para estilizar os elementos HTML.' },
          { id: 2, text: 'Altere a propriedade background-color.' }
        ]
      }),
      codeTemplate: `body {\n  background-color: blue;\n  color: white;\n}`,
      validationLogic: `
function validate(outputStr, code) {
   if (code.toLowerCase().includes("background-color") && code.toLowerCase().includes("blue")) {
      return true;
   }
   return false;
}
validate;
`
    }
  });

  // JavaScript
  await prisma.lesson.create({
    data: {
      title: '3. Lógica com JavaScript',
      language: 'javascript',
      moduleId: moduleObj.id,
      order: 3,
      content: JSON.stringify({
        title: 'Testando JS Node',
        challenge: 'Imprima "Rodando no Backend!" usando console.log',
        steps: [
          { id: 1, text: 'O JS pode rodar no navegador e no servidor.' },
          { id: 2, text: 'Agora ele roda no nosso próprio NodeJS backend!' }
        ]
      }),
      codeTemplate: `console.log("Rodando no Backend!");`,
      validationLogic: `
function validate(outputStr, code) {
   if (outputStr.includes("Rodando no Backend!")) return true;
   return false;
}
validate;
`
    }
  });

  // Java
  await prisma.lesson.create({
    data: {
      title: '4. Compilando Java de Verdade',
      language: 'java',
      moduleId: moduleObj.id,
      order: 4,
      content: JSON.stringify({
        title: 'Hello World em Java',
        challenge: 'Imprima "Olá, Java!" usando System.out.println',
        steps: [
          { id: 1, text: 'Java é uma linguagem compilada fortemente tipada.' },
          { id: 2, text: 'Seu código será enviado para a Piston API para ser compilado e executado em um container isolado!' }
        ]
      }),
      codeTemplate: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Olá, Java!");\n  }\n}`,
      validationLogic: `
function validate(outputStr, code) {
   if (outputStr.includes("Olá, Java!")) return true;
   return false;
}
validate;
`
    }
  });

  console.log('Curso e lições criados com sucesso!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
