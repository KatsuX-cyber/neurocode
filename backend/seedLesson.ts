import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const content = JSON.stringify({
  title: 'Estruturas Condicionais: IF e ELSE',
  challenge: 'Crie uma variável `idade` e um `if/else` que imprima "Pode entrar" se idade >= 18, e "Não pode entrar" caso contrário.',
  steps: [
    {
      id: 1,
      text: 'Imagine que você é um segurança de balada. Você só deixa entrar quem tem 18 anos ou mais.',
    },
    {
      id: 2,
      text: 'Na programação, usamos a palavra `if` (se) para tomar essa decisão. Se a idade for maior ou igual a 18, a pessoa entra.',
    },
    {
      id: 3,
      text: 'Caso contrário, usamos o `else` (senão). Se não for maior que 18, a pessoa não entra.',
    }
  ]
});

const codeTemplate = `let idade = 16;\n\n// Escreva seu if e else abaixo\n`;

const validationLogic = `
function validate(outputStr, code) {
    if (outputStr.includes("Não pode entrar") && code.includes("idade = 16")) {
       return true;
    } else if (outputStr.includes("Pode entrar") && (code.includes("idade = 18") || code.includes("idade = 20") || code.includes("idade >= 18"))) {
       return true;
    }
    return false;
}
validate;
`;

async function main() {
  const lesson = await prisma.lesson.findFirst();
  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        content: content,
        codeTemplate: codeTemplate,
        validationLogic: validationLogic
      }
    });
    console.log('Lesson updated successfully:', lesson.id);
  } else {
    console.log('No lesson found');
  }
}
main();
