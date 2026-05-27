import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Create default user
  const hashedPassword = await bcrypt.hash('123456', 10);
  const user = await prisma.user.upsert({
    where: { email: 'aluno@neurocode.com' },
    update: {},
    create: {
      name: 'Aluno Teste',
      email: 'aluno@neurocode.com',
      password: hashedPassword,
      xp: 120,
      streak: 3
    },
  });

  // 2. Create Course
  const course = await prisma.course.create({
    data: {
      title: 'Lógica de Programação e Fundamentos',
      description: 'O início da sua jornada. Aprenda a pensar como um programador passo a passo.',
      level: 'BASIC',
      order: 1,
      modules: {
        create: [
          {
            title: 'Módulo 1: O Início da Jornada',
            description: 'Aprenda os conceitos básicos: variáveis e tipos de dados.',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'Hello World',
                  content: 'Bem-vindo! Todo programador começa dizendo "Olá, Mundo!". Use o comando console.log para isso.',
                  codeTemplate: 'console.log("Olá, Mundo!");',
                  validationLogic: 'output.includes("Olá, Mundo!")',
                  order: 1
                }
              ]
            }
          },
          {
            title: 'Módulo 2: Tomando Decisões',
            description: 'Estruturas condicionais (if, else) e operadores lógicos.',
            order: 2,
            lessons: {
              create: [
                {
                  title: 'Estruturas Condicionais: IF e ELSE',
                  content: 'Imagine que você é um segurança de balada. Você só deixa entrar quem tem 18 anos ou mais. Na programação, usamos a palavra `if` (se) para tomar essa decisão. Se a idade for maior ou igual a 18, a pessoa entra. Caso contrário, usamos o `else` (senão). Se não for maior que 18, a pessoa não entra.',
                  codeTemplate: 'let idade = 16;\n\n// Escreva seu if e else abaixo\n',
                  validationLogic: 'output.includes("Não pode entrar") && code.includes("idade = 16")',
                  order: 1
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
