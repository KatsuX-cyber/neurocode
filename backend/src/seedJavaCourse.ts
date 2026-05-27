import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Limpando dados antigos do banco de dados...');
  await prisma.progress.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();

  console.log('Criando o Curso Java: Do Zero ao Profissional...');

  const course = await prisma.course.create({
    data: {
      title: 'Java: Do Zero ao Profissional',
      description: 'Domine uma das linguagens mais poderosas do mercado. Aprenda lógica, orientação a objetos e construa software real com confiança e prática extrema.',
      level: 'BASIC',
      order: 1,
    }
  });

  // MÓDULO 1
  const mod1 = await prisma.module.create({
    data: {
      title: 'Módulo 1: Fundamentos e Variáveis',
      description: 'Como o computador armazena dados e se comunica com o mundo externo.',
      courseId: course.id,
      order: 1,
    }
  });

  await prisma.lesson.create({
    data: {
      title: '1. Hello, Java!',
      language: 'java',
      moduleId: mod1.id,
      order: 1,
      content: JSON.stringify({
        title: 'Seu primeiro código em Java',
        challenge: 'Dentro do método main, use System.out.println() para imprimir exatamente a frase "Start!".',
        steps: [
          { id: 1, text: 'Todo programa em Java precisa de um ponto de partida. Ele é como a porta da frente de uma casa.' },
          { id: 2, text: 'Esse ponto de partida é um bloco especial chamado `main` (principal, em inglês).' },
          { id: 3, text: 'Para o computador "falar" algo na tela, nós usamos o comando `System.out.println()`. Ele imprime o texto e pula uma linha no final.' },
          { id: 4, text: 'Lembre-se: todo comando em Java termina com um ponto e vírgula `;`. Pense nele como o ponto final de uma frase.' }
        ]
      }),
      codeTemplate: `public class Main {\n  public static void main(String[] args) {\n    // Escreva seu comando de impressão abaixo\n    \n  }\n}`,
      validationLogic: `
function validate(outputStr, code) {
   if (outputStr.trim() === "Start!") return true;
   return false;
}
validate;
`
    }
  });

  await prisma.lesson.create({
    data: {
      title: '2. Caixas de Memória',
      language: 'java',
      moduleId: mod1.id,
      order: 2,
      content: JSON.stringify({
        title: 'Armazenando Informações em Variáveis',
        challenge: 'Crie uma variável do tipo String chamada `nome` e armazene "Alice". Em seguida, imprima o valor dela.',
        steps: [
          { id: 1, text: 'Para o computador lembrar de alguma informação, usamos Variáveis. Imagine que elas são caixas etiquetadas.' },
          { id: 2, text: 'No Java, você não pode guardar um par de sapatos em uma caixa de chapéu. A linguagem é "fortemente tipada". Você precisa dizer o tipo da caixa.' },
          { id: 3, text: 'Para textos, o tipo da caixa é `String`. Exemplo: `String cor = "Azul";` (textos sempre vão entre aspas duplas).' },
          { id: 4, text: 'Para imprimir o conteúdo da caixa e não a palavra em si, não use aspas no print: `System.out.println(cor);`.' }
        ]
      }),
      codeTemplate: `public class Main {\n  public static void main(String[] args) {\n    // Crie a variável String e imprima\n    \n  }\n}`,
      validationLogic: `
function validate(outputStr, code) {
   if (code.includes('String nome') && outputStr.includes("Alice")) return true;
   return false;
}
validate;
`
    }
  });

  await prisma.lesson.create({
    data: {
      title: '3. Operações Numéricas',
      language: 'java',
      moduleId: mod1.id,
      order: 3,
      content: JSON.stringify({
        title: 'Matemática com Java',
        challenge: 'Crie duas variáveis `int` chamadas `a` (valendo 10) e `b` (valendo 5). Imprima o resultado de `a + b`.',
        steps: [
          { id: 1, text: 'Se para textos usamos `String`, para números inteiros (sem vírgula) usamos `int`.' },
          { id: 2, text: 'Exemplo: `int idade = 25;`' },
          { id: 3, text: 'O Java sabe fazer contas! Os operadores básicos são `+` (soma), `-` (subtração), `*` (multiplicação) e `/` (divisão).' },
          { id: 4, text: 'Você pode somar variáveis diretamente dentro do print: `System.out.println(idade + 5);`' }
        ]
      }),
      codeTemplate: `public class Main {\n  public static void main(String[] args) {\n    // Faça a matemática funcionar\n    \n  }\n}`,
      validationLogic: `
function validate(outputStr, code) {
   if (outputStr.includes("15") && code.includes("int")) return true;
   return false;
}
validate;
`
    }
  });

  // MÓDULO 2
  const mod2 = await prisma.module.create({
    data: {
      title: 'Módulo 2: Controle de Fluxo',
      description: 'Como fazer o programa tomar decisões e repetir tarefas automaticamente.',
      courseId: course.id,
      order: 2,
    }
  });

  await prisma.lesson.create({
    data: {
      title: '1. O Porteiro Virtual (IF)',
      language: 'java',
      moduleId: mod2.id,
      order: 1,
      content: JSON.stringify({
        title: 'Tomando Decisões',
        challenge: 'Crie uma variável `int pontos = 80;`. Use um `if` para imprimir "Passou!" se pontos for maior que 70.',
        steps: [
          { id: 1, text: 'Um programa linear faz as coisas do começo ao fim. Mas a vida real não é assim, tomamos decisões a todo momento.' },
          { id: 2, text: 'No Java, usamos o `if` (Se). Exemplo: `if (idade >= 18)`' },
          { id: 3, text: 'O que o programa deve fazer se a condição for verdadeira vai dentro de chaves `{ }` logo após o if.' },
          { id: 4, text: 'Os operadores de comparação são: `>` (maior), `<` (menor), `==` (igualdade) e `>=` (maior ou igual).' }
        ]
      }),
      codeTemplate: `public class Main {\n  public static void main(String[] args) {\n    int pontos = 80;\n    // Crie seu if abaixo\n    \n  }\n}`,
      validationLogic: `
function validate(outputStr, code) {
   if (outputStr.includes("Passou!") && code.includes("if")) return true;
   return false;
}
validate;
`
    }
  });

  await prisma.lesson.create({
    data: {
      title: '2. E se não? (ELSE)',
      language: 'java',
      moduleId: mod2.id,
      order: 2,
      content: JSON.stringify({
        title: 'Lidando com a negação',
        challenge: 'A variável `pontos` agora vale 50. Faça o código imprimir "Reprovado", adicionando um bloco `else`.',
        steps: [
          { id: 1, text: 'O bloco `if` só roda se a condição for verdadeira. Mas e se não for?' },
          { id: 2, text: 'Nós usamos o `else` (Senão). Ele acopla logo após as chaves de fechamento do `if`.' },
          { id: 3, text: 'Estrutura: `if (condição) { ... } else { ... }`.' },
          { id: 4, text: 'O `else` nunca tem uma condição entre parênteses, pois ele absorve todo e qualquer caso em que o `if` tenha falhado.' }
        ]
      }),
      codeTemplate: `public class Main {\n  public static void main(String[] args) {\n    int pontos = 50;\n    if (pontos > 70) {\n      System.out.println("Passou!");\n    } \n    // Adicione o else aqui\n    \n  }\n}`,
      validationLogic: `
function validate(outputStr, code) {
   if (outputStr.includes("Reprovado") && code.includes("else")) return true;
   return false;
}
validate;
`
    }
  });

  await prisma.lesson.create({
    data: {
      title: '3. Repetições (FOR)',
      language: 'java',
      moduleId: mod2.id,
      order: 3,
      content: JSON.stringify({
        title: 'Automatizando o trabalho',
        challenge: 'Use um loop `for` para imprimir a palavra "Java" exatamente 3 vezes.',
        steps: [
          { id: 1, text: 'E se precisarmos imprimir algo 1000 vezes? Não dá pra copiar e colar, né?' },
          { id: 2, text: 'Para isso existem os loops. O mais famoso é o `for`.' },
          { id: 3, text: 'Ele precisa de três coisas: Início, Fim, e os Passos. Exemplo: `for (int i = 0; i < 5; i++) { ... }`.' },
          { id: 4, text: 'O código dentro das chaves será repetido enquanto a condição (i < 5) for verdadeira.' }
        ]
      }),
      codeTemplate: `public class Main {\n  public static void main(String[] args) {\n    // Crie o loop for\n    \n  }\n}`,
      validationLogic: `
function validate(outputStr, code) {
   const matches = outputStr.match(/Java/g);
   if (matches && matches.length === 3 && code.includes("for")) return true;
   return false;
}
validate;
`
    }
  });

  // MÓDULO 3
  const mod3 = await prisma.module.create({
    data: {
      title: 'Módulo 3: Orientação a Objetos',
      description: 'Diga adeus ao código linear solto. Aprenda a pensar em componentes e entidades reais.',
      courseId: course.id,
      order: 3,
    }
  });

  await prisma.lesson.create({
    data: {
      title: '1. Criando uma Planta Baixa (Classes)',
      language: 'java',
      moduleId: mod3.id,
      order: 1,
      content: JSON.stringify({
        title: 'Sua primeira Classe',
        challenge: 'A classe Carro já existe! No método main, crie a variável do tipo Carro e instancie com `new Carro()`. Imprima a variável.',
        steps: [
          { id: 1, text: 'Programação Orientada a Objetos significa que modelamos o sistema como coisas do mundo real.' },
          { id: 2, text: 'Uma **Classe** é uma planta de arquitetura. Um "molde". Se você tem a planta de um carro, você não tem um carro de verdade ainda para dirigir.' },
          { id: 3, text: 'Para construir um carro a partir do molde (instanciar), usamos a palavra mágica `new`.' },
          { id: 4, text: 'Exemplo: `Carro meuCarro = new Carro();`.' }
        ]
      }),
      codeTemplate: `class Carro {\n  String modelo = "Sedan";\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    // Crie o carro e o imprima\n    \n  }\n}`,
      validationLogic: `
function validate(outputStr, code) {
   if (code.includes("new Carro()") && outputStr.includes("Carro@")) return true;
   return false;
}
validate;
`
    }
  });

  await prisma.lesson.create({
    data: {
      title: '2. Acessando Propriedades',
      language: 'java',
      moduleId: mod3.id,
      order: 2,
      content: JSON.stringify({
        title: 'Olhando dentro do objeto',
        challenge: 'Você tem um objeto `meuCarro`. Mude a cor dele para "Vermelho" e depois imprima a cor.',
        steps: [
          { id: 1, text: 'Todo objeto construído possui atributos (propriedades), como cor, modelo, peso, etc.' },
          { id: 2, text: 'Para acessar as propriedades de um objeto, nós usamos o Ponto `.`. Pense nele como uma chave que abre o objeto.' },
          { id: 3, text: 'Exemplo de leitura: `System.out.println(meuCarro.modelo);`.' },
          { id: 4, text: 'Exemplo de escrita: `meuCarro.cor = "Vermelho";`.' }
        ]
      }),
      codeTemplate: `class Carro {\n  String cor = "Preto";\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Carro meuCarro = new Carro();\n    // Mude a cor e imprima a cor do carro\n    \n  }\n}`,
      validationLogic: `
function validate(outputStr, code) {
   if (code.includes("meuCarro.cor") && outputStr.includes("Vermelho")) return true;
   return false;
}
validate;
`
    }
  });

  await prisma.lesson.create({
    data: {
      title: '3. Ações e Comportamentos (Métodos)',
      language: 'java',
      moduleId: mod3.id,
      order: 3,
      content: JSON.stringify({
        title: 'Fazendo o objeto trabalhar',
        challenge: 'A classe Cachorro tem um método `latir()`. Crie um objeto `Cachorro` chamado `rex` e chame o método para ele latir.',
        steps: [
          { id: 1, text: 'Além de atributos (o que a coisa *é*), um objeto tem métodos (o que a coisa *faz*).' },
          { id: 2, text: 'Métodos são ações. Um Carro pode acelerar, um Cachorro pode latir.' },
          { id: 3, text: 'Assim como as propriedades, acessamos um método também com o ponto `.`, mas os métodos sempre terminam com parênteses `()`.' },
          { id: 4, text: 'Exemplo de uso: `gato.miar();`.' }
        ]
      }),
      codeTemplate: `class Cachorro {\n  void latir() {\n    System.out.println("Au au!");\n  }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    // Crie o cachorro e o faça latir\n    \n  }\n}`,
      validationLogic: `
function validate(outputStr, code) {
   if (code.includes("new Cachorro()") && code.includes("latir()") && outputStr.includes("Au au!")) return true;
   return false;
}
validate;
`
    }
  });

  console.log('Curso Java injetado com sucesso!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
