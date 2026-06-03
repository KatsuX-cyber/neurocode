import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Limpando dados antigos do banco de dados...');
  await prisma.progress.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();

  console.log('🚀 Criando as 4 trilhas de conhecimento com formato ARPERC...');

  // ============================================================
  // 1. HTML: Fundações da Web
  // ============================================================
  await prisma.course.create({
    data: {
      title: 'HTML: Fundações da Web',
      description: 'Aprenda a estruturar páginas web. Domine a marcação que é a base de toda a internet moderna.',
      level: 'BASIC',
      order: 1,
      modules: {
        create: [
          {
            title: 'Módulo 1: Estruturação Básica',
            description: 'Sua primeira página web, entendendo elementos e tags.',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'A Base de Tudo (Tags)',
                  language: 'html',
                  order: 1,
                  content: JSON.stringify({
                    title: 'Sua primeira Tag HTML',
                    concept: 'Tags HTML',
                    blocks: [
                      {
                        id: 'hook-1',
                        type: 'hook',
                        content: 'Toda página que você visita na internet — Google, YouTube, Instagram — tem um esqueleto invisível feito de HTML. Sem ele, o navegador não saberia o que é um título, um parágrafo ou uma imagem. Você está prestes a aprender a linguagem que sustenta toda a web.'
                      },
                      {
                        id: 'explain-1',
                        type: 'explain',
                        title: 'O que são Tags?',
                        content: 'HTML usa "etiquetas" chamadas Tags para dar significado ao conteúdo. Pense nelas como placas que dizem ao navegador: "isso aqui é um título" ou "isso aqui é um parágrafo". Toda tag tem uma abertura e um fechamento.',
                        code: '<h1>Isso é um título</h1>\n<p>Isso é um parágrafo</p>'
                      },
                      {
                        id: 'explain-2',
                        type: 'explain',
                        title: 'Anatomia de uma Tag',
                        content: 'A tag de título mais importante se chama h1. Você abre com <h1>, escreve o texto, e fecha com </h1>. A barra "/" indica fechamento. Sem ela, o navegador não sabe onde o título termina.',
                        code: '<h1>Bem-vindo ao meu site</h1>'
                      },
                      {
                        id: 'practice-1',
                        type: 'practice',
                        content: 'Agora é sua vez! No editor ao lado, tente escrever uma tag <h1> com qualquer texto que você quiser. Observe o resultado no preview abaixo.'
                      },
                      {
                        id: 'checkpoint-1',
                        type: 'checkpoint',
                        content: 'Vamos verificar o que você entendeu:',
                        checkpoint: {
                          question: 'Qual é a forma correta de criar um título principal em HTML?',
                          options: [
                            '<title>Meu Título</title>',
                            '<h1>Meu Título</h1>',
                            '<header>Meu Título</header>',
                            '<heading>Meu Título</heading>'
                          ],
                          correctIndex: 1,
                          explanation: 'A tag <h1> é usada para o título principal do conteúdo. <title> é o título da aba do navegador, não do conteúdo visível.'
                        }
                      },
                      {
                        id: 'reward-1',
                        type: 'reward',
                        content: 'Excelente! Você já sabe criar o elemento mais fundamental de uma página web. A tag <h1> é como a manchete de um jornal — é a primeira coisa que o visitante lê. Agora vamos colocar isso em prática no desafio final!'
                      }
                    ],
                    challenge: {
                      instruction: 'Use a tag <h1> para escrever exatamente "Bem-vindo".',
                      hints: [
                        'Lembre-se: toda tag HTML tem abertura <tag> e fechamento </tag>.',
                        'A tag de título principal é <h1>. O texto vai entre a abertura e o fechamento: <h1>texto aqui</h1>.',
                        'A resposta completa é: <h1>Bem-vindo</h1>'
                      ]
                    }
                  }),
                  codeTemplate: `<!-- Escreva sua tag h1 abaixo -->\n`,
                  validationLogic: `
function validate(outputStr, code) {
  // CVS Layer 1: concept presence — has h1 tag structure?
  var hasOpen  = code.includes('<h1>');
  var hasClose = code.includes('</h1>');
  // CVS Layer 2: structural correctness — both open and close present
  if (hasOpen && hasClose) return true;
  // CVS Layer 1 partial: opening tag found but no closing (concept_understood)
  // Backend returns false; Lesson.tsx shows getErrorFeedback which is handled in UI
  return false;
}
validate;
`
                },
                {
                  title: 'Parágrafos e Estrutura',
                  language: 'html',
                  order: 2,
                  content: JSON.stringify({
                    title: 'Organizando Texto com Parágrafos',
                    concept: 'Parágrafos HTML',
                    blocks: [
                      {
                        id: 'hook-2',
                        type: 'hook',
                        content: 'Imagine um livro sem parágrafos — todo o texto grudado em um bloco gigante. Impossível de ler, né? O HTML tem uma tag especial só para organizar texto em blocos legíveis.'
                      },
                      {
                        id: 'explain-2a',
                        type: 'explain',
                        title: 'A tag <p>',
                        content: 'A tag <p> (de "paragraph") cria um parágrafo. O navegador automaticamente adiciona espaço acima e abaixo de cada parágrafo, tornando o texto mais legível.',
                        code: '<p>Este é o primeiro parágrafo.</p>\n<p>Este é o segundo parágrafo.</p>'
                      },
                      {
                        id: 'practice-2',
                        type: 'practice',
                        content: 'No editor, tente criar dois parágrafos usando a tag <p>. Observe como o navegador separa automaticamente o texto.'
                      },
                      {
                        id: 'checkpoint-2',
                        type: 'checkpoint',
                        content: 'Verificação rápida:',
                        checkpoint: {
                          question: 'O que acontece se você escrever dois textos sem usar a tag <p>?',
                          options: [
                            'Eles aparecem em linhas separadas automaticamente',
                            'Eles ficam grudados na mesma linha',
                            'O navegador gera um erro',
                            'Eles desaparecem'
                          ],
                          correctIndex: 1,
                          explanation: 'Sem tags de estruturação, o HTML ignora quebras de linha no código. Os textos ficam grudados. A tag <p> resolve isso.'
                        }
                      },
                      {
                        id: 'reward-2',
                        type: 'reward',
                        content: 'Ótimo! Agora você sabe usar <h1> para títulos e <p> para parágrafos. Esses dois elementos são os blocos fundamentais de qualquer página de conteúdo na web.'
                      }
                    ],
                    challenge: {
                      instruction: 'Crie uma página com um título <h1> dizendo "Meu Blog" e um parágrafo <p> com qualquer texto.',
                      hints: [
                        'Você precisa usar duas tags: <h1> para o título e <p> para o parágrafo.',
                        'Escreva primeiro o <h1>Meu Blog</h1> e depois o <p>seu texto aqui</p>.',
                        'Exemplo completo: <h1>Meu Blog</h1>\n<p>Bem-vindo ao meu blog pessoal!</p>'
                      ]
                    }
                  }),
                  codeTemplate: `<!-- Crie seu título e parágrafo abaixo -->\n`,
                  validationLogic: `
function validate(outputStr, code) {
  var lower = code.toLowerCase();
  // CVS Layer 1: concept presence — correct tag structure exists?
  var hasH1  = code.includes('<h1>') && code.includes('</h1>');
  var hasP   = code.includes('<p>')  && code.includes('</p>');
  // CVS Layer 2: content accuracy — title text present (case-insensitive, accent-insensitive)
  var normalized = lower.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  var hasTitle = normalized.includes('meu blog');
  // Pass: structural correctness + concept presence (title content is flexible)
  if (hasH1 && hasP) return true;
  return false;
}
validate;
`
                }
              ]
            }
          }
        ]
      }
    }
  });

  // ============================================================
  // 2. CSS: Estilo e Design
  // ============================================================
  await prisma.course.create({
    data: {
      title: 'CSS: Estilo e Design',
      description: 'Foco em estilização. Aprenda a pintar, posicionar e dar vida real às suas páginas web estruturadas.',
      level: 'BASIC',
      order: 2,
      modules: {
        create: [
          {
            title: 'Módulo 1: Cores e Estética',
            description: 'Dando cor ao texto e fundo.',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'Injetando Cores',
                  language: 'css',
                  order: 1,
                  content: JSON.stringify({
                    title: 'Colorindo a Web',
                    concept: 'Propriedade color',
                    blocks: [
                      {
                        id: 'hook-css1',
                        type: 'hook',
                        content: 'Imagine poder pegar qualquer elemento da sua página e pintar da cor que quiser — texto azul, fundo amarelo, bordas vermelhas. O CSS é literalmente o pincel da web.'
                      },
                      {
                        id: 'explain-css1',
                        type: 'explain',
                        title: 'Seletores e Propriedades',
                        content: 'No CSS, você primeiro SELECIONA o elemento (pelo nome da tag, como h1 ou p) e depois aplica PROPRIEDADES visuais dentro de chaves { }. A propriedade "color" muda a cor do texto.',
                        code: 'h1 {\n  color: blue;\n}'
                      },
                      {
                        id: 'explain-css2',
                        type: 'explain',
                        title: 'Cores em CSS',
                        content: 'O CSS aceita cores por nome (red, blue, green), por código hexadecimal (#FF0000), ou por função rgb(255, 0, 0). Para começar, usar nomes é mais simples.',
                        code: 'p {\n  color: red;\n}\n\ndiv {\n  color: #00FF00;\n}'
                      },
                      {
                        id: 'practice-css1',
                        type: 'practice',
                        content: 'No editor, tente mudar a cor de um parágrafo (p) para verde. Use a propriedade "color" com o valor "green".'
                      },
                      {
                        id: 'checkpoint-css1',
                        type: 'checkpoint',
                        content: 'Vamos verificar:',
                        checkpoint: {
                          question: 'Qual propriedade CSS altera a cor do TEXTO de um elemento?',
                          options: [
                            'background-color',
                            'text-color',
                            'color',
                            'font-color'
                          ],
                          correctIndex: 2,
                          explanation: 'A propriedade "color" altera a cor do texto. "background-color" muda o fundo. "text-color" e "font-color" não existem em CSS.'
                        }
                      },
                      {
                        id: 'reward-css1',
                        type: 'reward',
                        content: 'Você acaba de dar seu primeiro passo no design web! Com a propriedade "color", você pode transformar qualquer texto monocromático em algo vibrante e expressivo.'
                      }
                    ],
                    challenge: {
                      instruction: 'Deixe o texto do h1 com a cor azul usando "color: blue;".',
                      hints: [
                        'Você precisa selecionar o elemento h1 e abrir chaves { }.',
                        'Dentro das chaves, escreva a propriedade "color" seguida de dois-pontos, o valor "blue", e ponto-e-vírgula.',
                        'A resposta é: h1 { color: blue; }'
                      ]
                    }
                  }),
                  codeTemplate: `h1 {\n  /* Escreva sua regra CSS aqui */\n\n}`,
                  validationLogic: `
function validate(outputStr, code) {
   if (code.includes('color') && code.includes('blue')) return true;
   return false;
}
validate;
`
                },
                {
                  title: 'Pintando Fundos',
                  language: 'css',
                  order: 2,
                  content: JSON.stringify({
                    title: 'Background Color',
                    concept: 'Propriedade background-color',
                    blocks: [
                      {
                        id: 'hook-css2',
                        type: 'hook',
                        content: 'Até agora, seus elementos têm fundo transparente. Mas e se você pudesse criar blocos coloridos, como cards, botões ou seções destacadas? A propriedade background-color faz exatamente isso.'
                      },
                      {
                        id: 'explain-css2a',
                        type: 'explain',
                        title: 'background-color',
                        content: 'A propriedade background-color pinta o FUNDO de um elemento. Funciona da mesma forma que color, mas afeta a área atrás do texto.',
                        code: 'body {\n  background-color: lightgray;\n}\n\nh1 {\n  background-color: yellow;\n}'
                      },
                      {
                        id: 'practice-css2',
                        type: 'practice',
                        content: 'Tente mudar o fundo do body para uma cor escura (como "darkblue") e veja como a página inteira muda.'
                      },
                      {
                        id: 'checkpoint-css2',
                        type: 'checkpoint',
                        content: 'Verificação:',
                        checkpoint: {
                          question: 'Qual a diferença entre "color" e "background-color"?',
                          options: [
                            'São a mesma propriedade',
                            '"color" muda o fundo, "background-color" muda o texto',
                            '"color" muda o texto, "background-color" muda o fundo',
                            'Nenhuma — ambas mudam tudo'
                          ],
                          correctIndex: 2,
                          explanation: '"color" afeta o texto do elemento. "background-color" afeta a cor de fundo. São propriedades complementares.'
                        }
                      },
                      {
                        id: 'reward-css2',
                        type: 'reward',
                        content: 'Agora você domina as duas formas fundamentais de cor em CSS: texto (color) e fundo (background-color). Com essas duas, você já pode criar layouts visualmente distintos!'
                      }
                    ],
                    challenge: {
                      instruction: 'Mude a cor de fundo do body para "black" e a cor do texto do body para "white".',
                      hints: [
                        'Você precisa selecionar "body" e definir duas propriedades dentro das chaves.',
                        'As propriedades são: background-color para o fundo e color para o texto.',
                        'Resposta: body { background-color: black; color: white; }'
                      ]
                    }
                  }),
                  codeTemplate: `body {\n  /* Mude o fundo e a cor do texto */\n\n}`,
                  validationLogic: `
function validate(outputStr, code) {
   if (code.includes('background-color') && code.includes('black') && code.includes('color') && code.includes('white')) return true;
   return false;
}
validate;
`
                }
              ]
            }
          }
        ]
      }
    }
  });

  // ============================================================
  // 3. JavaScript: Interatividade
  // ============================================================
  await prisma.course.create({
    data: {
      title: 'JavaScript: Interatividade',
      description: 'Foco em lógica e interatividade. A linguagem viva da web que faz a página pensar e reagir ao usuário.',
      level: 'BASIC',
      order: 3,
      modules: {
        create: [
          {
            title: 'Módulo 1: Lógica Inicial',
            description: 'Variáveis, tipos de dados e o console.',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'Comunicando com o JS',
                  language: 'javascript',
                  order: 1,
                  content: JSON.stringify({
                    title: 'Hello World em JavaScript',
                    concept: 'console.log',
                    blocks: [
                      {
                        id: 'hook-js1',
                        type: 'hook',
                        content: 'HTML é o esqueleto, CSS é a pele. Mas a página ainda está "morta" — ela não pensa, não reage, não decide. JavaScript é o cérebro da web. Ele faz a página tomar decisões inteligentes.'
                      },
                      {
                        id: 'explain-js1',
                        type: 'explain',
                        title: 'O console.log()',
                        content: 'Para conversar com o computador e ver o que ele está "pensando", usamos o comando console.log(). Ele imprime mensagens no Console — uma janela especial que desenvolvedores usam para depurar código.',
                        code: 'console.log("Olá, mundo!");\nconsole.log("Meu primeiro JS!");'
                      },
                      {
                        id: 'explain-js2',
                        type: 'explain',
                        title: 'Strings (Textos)',
                        content: 'Quando você quer escrever um texto literal no código, precisa colocá-lo entre aspas duplas ou simples. Isso cria uma "String" — que é como o computador entende textos.',
                        code: 'console.log("Isso é uma string");\nconsole.log(\'Isso também!\');'
                      },
                      {
                        id: 'practice-js1',
                        type: 'practice',
                        content: 'No editor, tente escrever console.log("Seu Nome"); e clique em Executar. Observe a mensagem aparecendo no console abaixo.'
                      },
                      {
                        id: 'checkpoint-js1',
                        type: 'checkpoint',
                        content: 'Hora de verificar:',
                        checkpoint: {
                          question: 'O que acontece se você escrever console.log(Hello) sem aspas?',
                          options: [
                            'Imprime "Hello" normalmente',
                            'O computador procura uma variável chamada Hello (e dá erro se não existir)',
                            'Nada acontece',
                            'O navegador fecha'
                          ],
                          correctIndex: 1,
                          explanation: 'Sem aspas, o JavaScript interpreta "Hello" como o nome de uma variável. Se ela não existe, dá um erro. Textos literais SEMPRE precisam de aspas.'
                        }
                      },
                      {
                        id: 'reward-js1',
                        type: 'reward',
                        content: 'Você acabou de se comunicar com o computador! O console.log() é a ferramenta #1 de todo desenvolvedor. Você vai usá-lo milhares de vezes na sua carreira.'
                      }
                    ],
                    challenge: {
                      instruction: 'Use o comando console.log("Hello JS") para imprimir exatamente "Hello JS" no console.',
                      hints: [
                        'O comando começa com console.log e o texto vai entre parênteses e aspas.',
                        'O texto precisa ser EXATAMENTE "Hello JS" — com H e J maiúsculos e espaço entre as palavras.',
                        'A resposta é: console.log("Hello JS");'
                      ]
                    }
                  }),
                  codeTemplate: `// Imprima sua mensagem abaixo\n`,
                  validationLogic: `
function validate(outputStr, code) {
   if (outputStr.includes('Hello JS')) return true;
   return false;
}
validate;
`
                },
                {
                  title: 'Caixas de Memória (Variáveis)',
                  language: 'javascript',
                  order: 2,
                  content: JSON.stringify({
                    title: 'Armazenando Informações',
                    concept: 'Variáveis (let)',
                    blocks: [
                      {
                        id: 'hook-js2',
                        type: 'hook',
                        content: 'E se você pudesse pedir ao computador para LEMBRAR de alguma coisa? "Computador, guarda o número 42 para mim." É exatamente isso que variáveis fazem — são caixas de memória etiquetadas.'
                      },
                      {
                        id: 'explain-js2a',
                        type: 'explain',
                        title: 'Criando variáveis com let',
                        content: 'Usamos a palavra-chave "let" para criar uma variável. Pense nela como criar uma caixa com uma etiqueta. O sinal de = coloca algo dentro dessa caixa.',
                        code: 'let nome = "Maria";\nlet idade = 25;\n\nconsole.log(nome);  // Imprime: Maria\nconsole.log(idade); // Imprime: 25'
                      },
                      {
                        id: 'explain-js2b',
                        type: 'explain',
                        title: 'Tipos de dados',
                        content: 'Variáveis podem guardar textos (strings, entre aspas) ou números (sem aspas). Quando imprimimos uma variável no console.log, NÃO usamos aspas — queremos o conteúdo, não o nome.',
                        code: 'let fruta = "Maçã";\nconsole.log(fruta);   // Imprime: Maçã\nconsole.log("fruta"); // Imprime: fruta (o texto literal)'
                      },
                      {
                        id: 'practice-js2',
                        type: 'practice',
                        content: 'Crie uma variável chamada "cor" com o valor "Azul" e imprima no console. Observe a diferença entre console.log(cor) e console.log("cor").'
                      },
                      {
                        id: 'checkpoint-js2',
                        type: 'checkpoint',
                        content: 'Verificação:',
                        checkpoint: {
                          question: 'Qual a diferença entre console.log(nome) e console.log("nome")?',
                          options: [
                            'Nenhuma diferença',
                            'O primeiro imprime o VALOR da variável, o segundo imprime a palavra "nome"',
                            'O primeiro dá erro, o segundo funciona',
                            'Os dois imprimem o valor da variável'
                          ],
                          correctIndex: 1,
                          explanation: 'Sem aspas, o JavaScript busca o conteúdo da variável. Com aspas, trata como texto literal. Essa diferença é fundamental!'
                        }
                      },
                      {
                        id: 'reward-js2',
                        type: 'reward',
                        content: 'Agora você sabe armazenar informações na memória do computador! Variáveis são um dos conceitos mais importantes em programação — tudo depende delas.'
                      }
                    ],
                    challenge: {
                      instruction: 'Crie uma variável chamada "cidade" com o valor "São Paulo" e imprima-a com console.log.',
                      hints: [
                        'Use let para criar a variável e = para atribuir o valor.',
                        'let cidade = "São Paulo"; e depois console.log(cidade); — sem aspas no console.log!',
                        'Código completo:\nlet cidade = "São Paulo";\nconsole.log(cidade);'
                      ]
                    }
                  }),
                  codeTemplate: `// Crie sua variável e imprima abaixo\n`,
                  validationLogic: `
function validate(outputStr, code) {
   if (code.includes('let cidade') && outputStr.includes('São Paulo')) return true;
   return false;
}
validate;
`
                }
              ]
            }
          }
        ]
      }
    }
  });

  // ============================================================
  // 4. Java: Backend Profissional
  // ============================================================
  await prisma.course.create({
    data: {
      title: 'Java: Backend Profissional',
      description: 'Foco em backend e orientação a objetos. Uma das linguagens mais robustas e usadas no mercado corporativo.',
      level: 'BASIC',
      order: 4,
      modules: {
        create: [
          {
            title: 'Módulo 1: Estrutura da Linguagem',
            description: 'O método main, tipagem forte e variáveis em Java.',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'Seu primeiro Java',
                  language: 'java',
                  order: 1,
                  content: JSON.stringify({
                    title: 'Hello, Java!',
                    concept: 'System.out.println',
                    blocks: [
                      {
                        id: 'hook-java1',
                        type: 'hook',
                        content: 'Java roda em bilhões de dispositivos — de servidores bancários a apps Android. É uma das linguagens mais empregáveis do mundo. Nesta lição, você vai fazer seu primeiro programa Java falar.'
                      },
                      {
                        id: 'explain-java1',
                        type: 'explain',
                        title: 'A estrutura obrigatória',
                        content: 'Todo programa Java precisa de uma "classe" (class) e um método especial chamado "main" — que é o ponto de partida. Pense no main como a porta da frente de uma casa.',
                        code: 'public class Main {\n  public static void main(String[] args) {\n    // Seu código aqui\n  }\n}'
                      },
                      {
                        id: 'explain-java2',
                        type: 'explain',
                        title: 'Imprimindo texto',
                        content: 'Para o Java "falar", usamos System.out.println(). É como o console.log do JavaScript, mas com um nome mais comprido. Textos vão entre aspas duplas e todo comando termina com ponto-e-vírgula ;',
                        code: 'System.out.println("Olá, Java!");'
                      },
                      {
                        id: 'practice-java1',
                        type: 'practice',
                        content: 'No editor, dentro do método main, escreva System.out.println("Teste"); e execute. Observe a saída no console.'
                      },
                      {
                        id: 'checkpoint-java1',
                        type: 'checkpoint',
                        content: 'Verificação:',
                        checkpoint: {
                          question: 'Por que todo comando em Java termina com ponto-e-vírgula (;)?',
                          options: [
                            'É apenas uma convenção opcional',
                            'Indica ao compilador onde cada instrução termina',
                            'Serve para comentar o código',
                            'Não é necessário em Java moderno'
                          ],
                          correctIndex: 1,
                          explanation: 'O ponto-e-vírgula é OBRIGATÓRIO em Java. Ele diz ao compilador: "esta instrução acabou aqui". Sem ele, o código não compila.'
                        }
                      },
                      {
                        id: 'reward-java1',
                        type: 'reward',
                        content: 'Parabéns! Você escreveu e executou seu primeiro programa Java. Agora você entende a estrutura básica que toda aplicação Java segue: classe → main → código.'
                      }
                    ],
                    challenge: {
                      instruction: 'Dentro do bloco main, use System.out.println() para imprimir exatamente a palavra "Start!".',
                      hints: [
                        'O comando vai dentro do método main, entre as chaves { }.',
                        'Escreva: System.out.println("Start!"); — com S maiúsculo e ponto de exclamação.',
                        'Código completo dentro do main:\n    System.out.println("Start!");'
                      ]
                    }
                  }),
                  codeTemplate: `public class Main {\n  public static void main(String[] args) {\n    // Escreva seu comando aqui\n    \n  }\n}`,
                  validationLogic: `
function validate(outputStr, code) {
   if (outputStr.trim() === "Start!") return true;
   return false;
}
validate;
`
                },
                {
                  title: 'Caixas de Memória (Variáveis)',
                  language: 'java',
                  order: 2,
                  content: JSON.stringify({
                    title: 'Variáveis em Java',
                    concept: 'Variáveis tipadas',
                    blocks: [
                      {
                        id: 'hook-java2',
                        type: 'hook',
                        content: 'No JavaScript, uma variável pode guardar qualquer coisa. Em Java, é diferente: você precisa dizer EXATAMENTE o tipo da caixa antes de guardar algo. É como ter caixas específicas para sapatos, livros e ferramentas.'
                      },
                      {
                        id: 'explain-java2a',
                        type: 'explain',
                        title: 'Tipagem forte',
                        content: 'Java é uma linguagem "fortemente tipada". Isso significa que você declara o tipo da variável ANTES do nome. Para textos, use String (com S maiúsculo). Para números inteiros, use int.',
                        code: 'String nome = "Alice";\nint idade = 25;\n\nSystem.out.println(nome);\nSystem.out.println(idade);'
                      },
                      {
                        id: 'practice-java2',
                        type: 'practice',
                        content: 'Crie uma variável String chamada "linguagem" com o valor "Java" e imprima usando System.out.println.'
                      },
                      {
                        id: 'checkpoint-java2',
                        type: 'checkpoint',
                        content: 'Verificação:',
                        checkpoint: {
                          question: 'Qual a diferença entre String e int em Java?',
                          options: [
                            'Nenhuma — são intercambiáveis',
                            'String guarda textos entre aspas, int guarda números inteiros',
                            'String guarda números, int guarda textos',
                            'Ambas guardam qualquer tipo de dado'
                          ],
                          correctIndex: 1,
                          explanation: 'String é para textos (sempre entre aspas). int é para números inteiros (sem aspas). Java não permite misturá-los.'
                        }
                      },
                      {
                        id: 'reward-java2',
                        type: 'reward',
                        content: 'Agora você entende tipagem forte — um conceito que separa Java de linguagens mais permissivas. Essa rigidez é o que torna Java tão confiável para sistemas críticos!'
                      }
                    ],
                    challenge: {
                      instruction: 'Crie uma variável do tipo String chamada "nome" com valor "Alice" e imprima-a.',
                      hints: [
                        'Declare com: String nome = "Alice";',
                        'Depois imprima com: System.out.println(nome);',
                        'Código completo dentro do main:\n    String nome = "Alice";\n    System.out.println(nome);'
                      ]
                    }
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
              ]
            }
          }
        ]
      }
    }
  });

  console.log('✅ Seed concluído: 4 cursos criados com formato ARPERC!');
  console.log('📊 Total: 4 cursos, 4 módulos, 8 lições com blocos interativos');
}

main().catch(console.error).finally(() => prisma.$disconnect());
