/**
 * seedHTMLCourse.ts
 * NeuroCode — Seed completo do curso "HTML: Fundações da Web"
 * 20 lições no formato ARPERC, organizadas em 5 módulos.
 *
 * Metodologia: lesson_rules.md + curriculum_html.md + metodologia_educacional_completa.md
 * Formato JSON: LessonContentV2 (aicontext.md §8)
 *
 * Para executar:
 *   cd backend
 *   npx ts-node src/seedHTMLCourse.ts
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Removendo curso HTML antigo (se existir)...');
  const oldCourse = await prisma.course.findFirst({ where: { title: { contains: 'HTML' } } });
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
  }

  console.log('🚀 Criando curso HTML: Fundações da Web com 20 lições ARPERC...');

  await prisma.course.create({
    data: {
      title: 'HTML: Fundações da Web',
      description:
        'Aprenda a estruturar páginas web do zero. Do seu primeiro parágrafo até formulários completos — o HTML é a base de toda a internet.',
      level: 'BASIC',
      order: 1,
      modules: {
        create: [
          // ================================================================
          // MÓDULO 1 — O Canvas Digital (Aulas 1–4)
          // ================================================================
          {
            title: 'Módulo 1: O Canvas Digital',
            description:
              'Entenda o que é HTML e como criar seus primeiros elementos de texto na tela.',
            order: 1,
            lessons: {
              create: [
                // -------------------------------------------------------
                // AULA 1 — Sua Primeira Página HTML
                // -------------------------------------------------------
                {
                  title: 'Sua Primeira Página HTML',
                  language: 'html',
                  order: 1,
                  codeTemplate: `<!-- Escreva seu primeiro HTML aqui -->
`,
                  validationLogic: `
function validate(outputStr, code) {
  var lower = code.toLowerCase();
  // CVS Layer 1: conceito presente — existe alguma tag HTML?
  var hasAnyTag = /<[a-z][\s\S]*?>/i.test(code);
  // CVS Layer 2: estrutura básica de documento
  var hasDoctype = lower.includes('<!doctype html>');
  var hasHtml    = lower.includes('<html') && lower.includes('</html>');
  var hasBody    = lower.includes('<body') && lower.includes('</body>');
  if (hasDoctype && hasHtml && hasBody) return true;
  if (hasAnyTag) return true;
  return false;
}
validate;
`,
                  content: JSON.stringify({
                    title: 'Sua Primeira Página HTML',
                    concept: 'Estrutura básica HTML',
                    blocks: [
                      {
                        id: 'hook-1',
                        type: 'hook',
                        content:
                          'Toda página que você visita na internet — Google, YouTube, Wikipedia — começa com um arquivo HTML. Sem esse arquivo, o navegador não sabe nem por onde começar. Hoje você vai criar o esqueleto da sua primeira página do zero.',
                      },
                      {
                        id: 'explain-1a',
                        type: 'explain',
                        title: 'O que é HTML?',
                        content:
                          'HTML é uma linguagem de marcação. Isso significa que ela usa "etiquetas" (chamadas tags) para dizer ao navegador o que cada parte do conteúdo é. Pense assim: o navegador lê o HTML como instruções de montagem.',
                        code: '<!-- Isso é um comentário. O navegador ignora este texto. -->\n<h1>Título da página</h1>\n<p>Um parágrafo de texto.</p>',
                      },
                      {
                        id: 'explain-1b',
                        type: 'explain',
                        title: 'A estrutura obrigatória',
                        content:
                          'Um documento HTML completo precisa de três partes: o aviso de tipo (<!DOCTYPE html>), o contêiner raiz (<html>), e o corpo visível (<body>). O <head> fica invisível — guarda informações para o navegador.',
                        code: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Meu Site</title>\n  </head>\n  <body>\n    <h1>Olá, mundo!</h1>\n  </body>\n</html>',
                      },
                      {
                        id: 'practice-1',
                        type: 'practice',
                        content:
                          'No editor ao lado, tente escrever a estrutura completa: <!DOCTYPE html>, <html>, <head> com um <title>, e <body> com um <h1> de sua escolha. Observe o resultado no preview!',
                      },
                      {
                        id: 'checkpoint-1',
                        type: 'checkpoint',
                        content: 'Hora de verificar o que você aprendeu:',
                        checkpoint: {
                          question: 'Qual tag contém TODO o conteúdo VISÍVEL de uma página HTML?',
                          options: ['<html>', '<head>', '<body>', '<title>'],
                          correctIndex: 2,
                          explanation:
                            'O <body> é onde fica tudo que o visitante vai ver: títulos, parágrafos, imagens, links. O <head> é invisível — guarda metadados como o título da aba do navegador.',
                        },
                      },
                      {
                        id: 'reward-1',
                        type: 'reward',
                        content:
                          'Fantástico! Você acabou de entender a estrutura que bilhões de páginas na internet usam. Cada site que você visitar agora vai fazer mais sentido. Próximo passo: colocar conteúdo de verdade nessa estrutura!',
                      },
                    ],
                    challenge: {
                      instruction:
                        'Crie uma estrutura HTML completa com <!DOCTYPE html>, <html>, <head> com <title>Minha Página</title>, e <body> com qualquer conteúdo.',
                      hints: [
                        'Comece sempre com <!DOCTYPE html> — isso diz ao navegador que é um documento HTML moderno.',
                        'Dentro do <html>, você precisa de dois filhos: <head> (informações) e <body> (conteúdo visível).',
                        'Estrutura completa:\n<!DOCTYPE html>\n<html>\n  <head>\n    <title>Minha Página</title>\n  </head>\n  <body>\n    <h1>Olá!</h1>\n  </body>\n</html>',
                      ],
                    },
                  }),
                },

                // -------------------------------------------------------
                // AULA 2 — Parágrafos de Texto
                // -------------------------------------------------------
                {
                  title: 'Parágrafos de Texto',
                  language: 'html',
                  order: 2,
                  codeTemplate: `<!-- Crie seus parágrafos abaixo -->
`,
                  validationLogic: `
function validate(outputStr, code) {
  var hasOpen  = code.includes('<p>') || code.includes('<p ');
  var hasClose = code.includes('</p>');
  if (hasOpen && hasClose) return true;
  return false;
}
validate;
`,
                  content: JSON.stringify({
                    title: 'Organizando Texto com Parágrafos',
                    concept: 'Tag <p>',
                    blocks: [
                      {
                        id: 'hook-2',
                        type: 'hook',
                        content:
                          'Imagine um livro inteiro escrito sem nenhum parágrafo — texto grudado em um bloco enorme, sem respiro. Impossível de ler! O HTML tem uma solução elegante para isso.',
                      },
                      {
                        id: 'explain-2a',
                        type: 'explain',
                        title: 'A tag <p>',
                        content:
                          'A tag <p> cria um parágrafo. O "p" vem de "paragraph". O navegador automaticamente adiciona espaço antes e depois de cada parágrafo, tornando o texto mais respirável.',
                        code: '<p>Este é o primeiro parágrafo.</p>\n<p>Este é o segundo parágrafo.</p>',
                      },
                      {
                        id: 'explain-2b',
                        type: 'explain',
                        title: 'Por que não basta apertar Enter?',
                        content:
                          'O HTML ignora quebras de linha no código-fonte. Se você escrever dois textos separados por Enter sem nenhuma tag, eles vão aparecer grudados na mesma linha. A tag <p> é quem resolve isso.',
                        code: '<!-- Isso NÃO cria dois parágrafos: -->\nTexto um\nTexto dois\n\n<!-- Isso SIM cria dois parágrafos: -->\n<p>Texto um</p>\n<p>Texto dois</p>',
                      },
                      {
                        id: 'practice-2',
                        type: 'practice',
                        content:
                          'No editor, crie três parágrafos sobre qualquer assunto que você goste. Observe como cada <p> separa o texto automaticamente.',
                      },
                      {
                        id: 'checkpoint-2',
                        type: 'checkpoint',
                        content: 'Verificação rápida:',
                        checkpoint: {
                          question:
                            'O que acontece se você escrever dois textos sem usar a tag <p>?',
                          options: [
                            'Eles aparecem em linhas separadas automaticamente',
                            'Eles ficam grudados na mesma linha',
                            'O navegador gera um erro vermelho',
                            'O texto desaparece completamente',
                          ],
                          correctIndex: 1,
                          explanation:
                            'O HTML não respeita a formatação do código-fonte (como espaços e Enter). Sem tags de estrutura, os textos ficam colados. A tag <p> cria a separação visual que esperamos.',
                        },
                      },
                      {
                        id: 'reward-2',
                        type: 'reward',
                        content:
                          'Muito bem! Agora você sabe criar texto estruturado em HTML. A tag <p> vai estar presente em praticamente toda página que você criar. Você está construindo sua base!',
                      },
                    ],
                    challenge: {
                      instruction:
                        'Crie dois parágrafos: o primeiro com o texto "Aprender HTML é incrível." e o segundo com "Cada dia descobro algo novo."',
                      hints: [
                        'Cada parágrafo precisa de uma tag <p> de abertura e uma </p> de fechamento.',
                        'Escreva os dois parágrafos um embaixo do outro, cada um dentro de suas tags <p>.',
                        'Exemplo:\n<p>Aprender HTML é incrível.</p>\n<p>Cada dia descobro algo novo.</p>',
                      ],
                    },
                  }),
                },

                // -------------------------------------------------------
                // AULA 3 — Títulos com Hierarquia
                // -------------------------------------------------------
                {
                  title: 'Títulos com Hierarquia',
                  language: 'html',
                  order: 3,
                  codeTemplate: `<!-- Experimente diferentes níveis de título abaixo -->
`,
                  validationLogic: `
function validate(outputStr, code) {
  var hasH1 = code.includes('<h1>') || code.includes('<h1 ');
  var hasH2 = code.includes('<h2>') || code.includes('<h2 ');
  if (hasH1 && hasH2) return true;
  if (hasH1 && code.includes('</h1>')) return true;
  return false;
}
validate;
`,
                  content: JSON.stringify({
                    title: 'Títulos que Dão Significado',
                    concept: 'Tags <h1> a <h6>',
                    blocks: [
                      {
                        id: 'hook-3',
                        type: 'hook',
                        content:
                          'Pense em um livro: tem um título principal na capa, capítulos numerados e subtítulos dentro de cada capítulo. O HTML replica essa hierarquia com exatamente seis níveis de títulos.',
                      },
                      {
                        id: 'explain-3a',
                        type: 'explain',
                        title: 'Os 6 níveis de título',
                        content:
                          'O HTML tem títulos de <h1> (o mais importante) até <h6> (o menos importante). O número indica a importância. Em uma página, deve existir apenas UM <h1> — o título principal.',
                        code: '<h1>Título Principal</h1>\n<h2>Subtítulo</h2>\n<h3>Seção menor</h3>\n<h4>Sub-seção</h4>',
                      },
                      {
                        id: 'explain-3b',
                        type: 'explain',
                        title: 'Por que a hierarquia importa?',
                        content:
                          'Os títulos não são só visuais. Leitores de tela para pessoas cegas usam h1–h6 para navegar pela página. O Google também usa essa hierarquia para entender o conteúdo. Usar a ordem certa é essencial.',
                        code: '<!-- Correto: hierarquia respeitada -->\n<h1>Culinária Brasileira</h1>\n<h2>Pratos Típicos</h2>\n<h3>Feijão Tropeiro</h3>',
                      },
                      {
                        id: 'practice-3',
                        type: 'practice',
                        content:
                          'No editor, crie uma estrutura de títulos para um site sobre seu hobby favorito. Use h1 para o tema principal e h2 para subcategorias.',
                      },
                      {
                        id: 'checkpoint-3',
                        type: 'checkpoint',
                        content: 'Vamos checar sua compreensão:',
                        checkpoint: {
                          question:
                            'Quantos <h1> uma página HTML bem estruturada deve ter?',
                          options: ['Sem limite', 'Exatamente um', 'Pelo menos três', 'Nenhum'],
                          correctIndex: 1,
                          explanation:
                            'Uma página deve ter exatamente um <h1> — o título principal que descreve o tema geral. Vários <h1> confundem mecanismos de busca e leitores de tela.',
                        },
                      },
                      {
                        id: 'reward-3',
                        type: 'reward',
                        content:
                          'Excelente! Você dominou os títulos HTML. Agora sabe que <h1> a <h6> não são apenas tamanhos de texto — eles criam uma hierarquia de significado que beneficia SEO e acessibilidade.',
                      },
                    ],
                    challenge: {
                      instruction:
                        'Crie uma estrutura com um <h1> chamado "Meu Portfólio", um <h2> chamado "Projetos" e um <h3> chamado "Projeto 1".',
                      hints: [
                        'O h1 é o maior e mais importante. Use para o título principal da página.',
                        'O h2 vem depois do h1 na hierarquia — é um subtítulo ou seção.',
                        'Código:\n<h1>Meu Portfólio</h1>\n<h2>Projetos</h2>\n<h3>Projeto 1</h3>',
                      ],
                    },
                  }),
                },

                // -------------------------------------------------------
                // AULA 4 — Negrito e Itálico
                // -------------------------------------------------------
                {
                  title: 'Negrito e Itálico',
                  language: 'html',
                  order: 4,
                  codeTemplate: `<!-- Experimente <strong> e <em> abaixo -->
<p>Escreva aqui e destaque palavras importantes.</p>
`,
                  validationLogic: `
function validate(outputStr, code) {
  var hasStrong = code.includes('<strong>') && code.includes('</strong>');
  var hasEm     = code.includes('<em>') && code.includes('</em>');
  if (hasStrong && hasEm) return true;
  if (hasStrong || hasEm) return true;
  return false;
}
validate;
`,
                  content: JSON.stringify({
                    title: 'Dando Ênfase ao Texto',
                    concept: 'Tags <strong> e <em>',
                    blocks: [
                      {
                        id: 'hook-4',
                        type: 'hook',
                        content:
                          'Ao falar, mudamos o tom de voz para enfatizar palavras importantes. Na escrita, usamos negrito e itálico. O HTML tem tags específicas para isso — e elas vão além do visual.',
                      },
                      {
                        id: 'explain-4a',
                        type: 'explain',
                        title: '<strong> — Importância',
                        content:
                          'A tag <strong> deixa o texto em negrito e sinaliza IMPORTÂNCIA para o navegador e leitores de tela. Use quando algo é crítico ou urgente — não apenas para decoração visual.',
                        code: '<p>Nunca compartilhe sua <strong>senha</strong> com ninguém.</p>',
                      },
                      {
                        id: 'explain-4b',
                        type: 'explain',
                        title: '<em> — Ênfase',
                        content:
                          'A tag <em> deixa o texto em itálico e significa ênfase. Use para termos técnicos, títulos de obras, ou palavras que você diria com inflexão na voz. Leitores de tela pronunciam com ênfase.',
                        code: '<p>O livro <em>O Pequeno Príncipe</em> foi escrito por Saint-Exupéry.</p>\n<p>Você <em>realmente</em> quer fazer isso?</p>',
                      },
                      {
                        id: 'practice-4',
                        type: 'practice',
                        content:
                          'Escreva um parágrafo sobre algo que você gosta. Use <strong> para a palavra mais importante e <em> para um título ou termo especial.',
                      },
                      {
                        id: 'checkpoint-4',
                        type: 'checkpoint',
                        content: 'Verificação:',
                        checkpoint: {
                          question:
                            'Qual é a diferença semântica entre <strong> e <em>?',
                          options: [
                            'Nenhuma — os dois fazem a mesma coisa visualmente',
                            '<strong> indica importância crítica; <em> indica ênfase de voz',
                            '<strong> é para títulos; <em> é para parágrafos',
                            '<strong> só funciona em inglês; <em> é universal',
                          ],
                          correctIndex: 1,
                          explanation:
                            '<strong> comunica importância (ex: aviso de perigo). <em> comunica ênfase tonal (ex: palavra enfatizada na fala). Ambos têm significado além do visual — leitores de tela os interpretam diferente.',
                        },
                      },
                      {
                        id: 'reward-4',
                        type: 'reward',
                        content:
                          'Você agora escreve HTML com significado! <strong> e <em> mostram que você não está apenas estilizando texto — está comunicando intenção. Isso é HTML profissional.',
                      },
                    ],
                    challenge: {
                      instruction:
                        'Crie um parágrafo com a frase: "Programar é uma habilidade <strong>essencial</strong> no século <em>XXI</em>." usando as tags corretas.',
                      hints: [
                        'Identifique qual palavra precisa de importância (<strong>) e qual precisa de ênfase (<em>).',
                        '"essencial" é a palavra crítica — use <strong>. "XXI" é um termo especial — use <em>.',
                        'Código:\n<p>Programar é uma habilidade <strong>essencial</strong> no século <em>XXI</em>.</p>',
                      ],
                    },
                  }),
                },
              ],
            },
          },

          // ================================================================
          // MÓDULO 2 — Listas, Links e Imagens (Aulas 5–9)
          // ================================================================
          {
            title: 'Módulo 2: Listas, Links e Imagens',
            description:
              'Organize informações em listas, conecte páginas com links e adicione imagens.',
            order: 2,
            lessons: {
              create: [
                // -------------------------------------------------------
                // AULA 5 — Listas de Pontos (ul/li)
                // -------------------------------------------------------
                {
                  title: 'Listas de Pontos',
                  language: 'html',
                  order: 1,
                  codeTemplate: `<!-- Crie sua lista aqui -->
`,
                  validationLogic: `
function validate(outputStr, code) {
  var hasUl = (code.includes('<ul>') || code.includes('<ul ')) && code.includes('</ul>');
  var hasLi = (code.includes('<li>') || code.includes('<li ')) && code.includes('</li>');
  if (hasUl && hasLi) return true;
  return false;
}
validate;
`,
                  content: JSON.stringify({
                    title: 'Listas Não Ordenadas',
                    concept: 'Tags <ul> e <li>',
                    blocks: [
                      {
                        id: 'hook-5',
                        type: 'hook',
                        content:
                          'Listas de compras, ingredientes de receita, funcionalidades de um app — nossa mente organiza o mundo em listas. O HTML tem uma forma elegante de criar isso visualmente.',
                      },
                      {
                        id: 'explain-5a',
                        type: 'explain',
                        title: 'ul e li trabalham juntos',
                        content:
                          'Uma lista não ordenada usa duas tags em parceria: <ul> (unordered list) define a lista inteira, e <li> (list item) define cada item dentro dela. Pense no <ul> como o carrinho de supermercado e cada <li> como um produto.',
                        code: '<ul>\n  <li>Maçã</li>\n  <li>Banana</li>\n  <li>Laranja</li>\n</ul>',
                      },
                      {
                        id: 'explain-5b',
                        type: 'explain',
                        title: 'Indentação: bom hábito',
                        content:
                          'Repare que os <li> ficam recuados (indentados) dentro do <ul>. Isso não é obrigatório para o navegador, mas torna o código muito mais legível. Desenvolvedores profissionais sempre indentem o código.',
                        code: '<!-- Difícil de ler: -->\n<ul><li>Item 1</li><li>Item 2</li></ul>\n\n<!-- Fácil de ler: -->\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>',
                      },
                      {
                        id: 'practice-5',
                        type: 'practice',
                        content:
                          'Crie uma lista com pelo menos 3 coisas que você gosta (filmes, jogos, animais, comidas — o que preferir!). Use <ul> como contêiner e <li> para cada item.',
                      },
                      {
                        id: 'checkpoint-5',
                        type: 'checkpoint',
                        content: 'Verificação:',
                        checkpoint: {
                          question: 'Qual tag define um ITEM INDIVIDUAL dentro de uma lista?',
                          options: ['<ul>', '<list>', '<li>', '<item>'],
                          correctIndex: 2,
                          explanation:
                            '<li> significa "list item" — cada elemento individual da lista. O <ul> é só o contêiner da lista inteira. <list> e <item> não existem em HTML.',
                        },
                      },
                      {
                        id: 'reward-5',
                        type: 'reward',
                        content:
                          'Ótimo trabalho! Listas são uma das formas mais poderosas de organizar informação na web. Menus de navegação, por exemplo, são construídos com <ul> e <li>!',
                      },
                    ],
                    challenge: {
                      instruction:
                        'Crie uma lista não ordenada com 4 linguagens de programação: HTML, CSS, JavaScript e Python.',
                      hints: [
                        'Comece com <ul> e feche com </ul>. Cada linguagem fica dentro de um <li>.',
                        'Certifique-se que cada <li> também tem seu fechamento </li>.',
                        'Código:\n<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n  <li>Python</li>\n</ul>',
                      ],
                    },
                  }),
                },

                // -------------------------------------------------------
                // AULA 6 — Listas Numeradas (ol/li)
                // -------------------------------------------------------
                {
                  title: 'Listas Numeradas',
                  language: 'html',
                  order: 2,
                  codeTemplate: `<!-- Crie sua lista numerada aqui -->
`,
                  validationLogic: `
function validate(outputStr, code) {
  var hasOl = (code.includes('<ol>') || code.includes('<ol ')) && code.includes('</ol>');
  var hasLi = (code.includes('<li>') || code.includes('<li ')) && code.includes('</li>');
  if (hasOl && hasLi) return true;
  return false;
}
validate;
`,
                  content: JSON.stringify({
                    title: 'Listas Ordenadas',
                    concept: 'Tags <ol> e <li>',
                    blocks: [
                      {
                        id: 'hook-6',
                        type: 'hook',
                        content:
                          'Passo 1: ligar o computador. Passo 2: abrir o editor. Passo 3: escrever código. Quando a ordem importa, usamos listas numeradas — e o HTML faz isso automaticamente.',
                      },
                      {
                        id: 'explain-6a',
                        type: 'explain',
                        title: 'A diferença: ol vs ul',
                        content:
                          'Basta trocar <ul> por <ol> (ordered list). O navegador automaticamente numera os itens. Os <li> são exatamente os mesmos — você não precisa digitar "1.", "2.", etc.',
                        code: '<ol>\n  <li>Abra o editor de código</li>\n  <li>Digite o HTML</li>\n  <li>Salve o arquivo</li>\n  <li>Abra no navegador</li>\n</ol>',
                      },
                      {
                        id: 'explain-6b',
                        type: 'explain',
                        title: 'Quando usar ul vs ol?',
                        content:
                          'Regra simples: se a ordem importa (receita, tutorial, ranking), use <ol>. Se a ordem não importa (lista de ingredientes, funcionalidades), use <ul>. O HTML comunica intenção.',
                        code: '<!-- A ordem importa: -->  \n<ol>\n  <li>Misture os ingredientes</li>\n  <li>Leve ao forno</li>\n</ol>\n\n<!-- A ordem não importa: -->\n<ul>\n  <li>Farinha</li>\n  <li>Ovos</li>\n</ul>',
                      },
                      {
                        id: 'practice-6',
                        type: 'practice',
                        content:
                          'Crie uma lista numerada com os 3 passos para fazer algo que você sabe fazer bem (um jogo, uma receita, uma atividade física).',
                      },
                      {
                        id: 'checkpoint-6',
                        type: 'checkpoint',
                        content: 'Vamos checar:',
                        checkpoint: {
                          question:
                            'Qual tag você usaria para criar um ranking "Top 5 Melhores Filmes"?',
                          options: ['<ul>', '<ol>', '<list>', '<ranking>'],
                          correctIndex: 1,
                          explanation:
                            'Como a posição 1 é diferente da posição 5, a ordem IMPORTA. Use <ol> (ordered list). O navegador vai numerar automaticamente, comunicando a hierarquia do ranking.',
                        },
                      },
                      {
                        id: 'reward-6',
                        type: 'reward',
                        content:
                          'Agora você domina os dois tipos de lista HTML. E percebeu algo importante: HTML não é só sobre aparência — é sobre comunicar o SIGNIFICADO do conteúdo.',
                      },
                    ],
                    challenge: {
                      instruction:
                        'Crie uma lista ordenada com os passos para fazer uma busca no Google: 1) Abrir o navegador, 2) Digitar google.com, 3) Escrever o que quer buscar, 4) Apertar Enter.',
                      hints: [
                        'Use <ol> como contêiner (não <ul>) — porque a ordem dos passos importa.',
                        'Cada passo fica dentro de um <li>. O número aparece automaticamente.',
                        'Código:\n<ol>\n  <li>Abrir o navegador</li>\n  <li>Digitar google.com</li>\n  <li>Escrever o que quer buscar</li>\n  <li>Apertar Enter</li>\n</ol>',
                      ],
                    },
                  }),
                },

                // -------------------------------------------------------
                // AULA 7 — Links e Atributos
                // -------------------------------------------------------
                {
                  title: 'Links e Atributos',
                  language: 'html',
                  order: 3,
                  codeTemplate: `<!-- Crie um link aqui -->
`,
                  validationLogic: `
function validate(outputStr, code) {
  var hasAnchor = code.includes('<a ') && code.includes('</a>');
  var hasHref   = code.includes('href=');
  if (hasAnchor && hasHref) return true;
  return false;
}
validate;
`,
                  content: JSON.stringify({
                    title: 'Portais para a Web',
                    concept: 'Tag <a> e atributo href',
                    blocks: [
                      {
                        id: 'hook-7',
                        type: 'hook',
                        content:
                          'A web se chama "web" (teia) porque páginas se conectam umas às outras via links. Um link clicável é tão essencial para a internet quanto as estradas são para as cidades.',
                      },
                      {
                        id: 'explain-7a',
                        type: 'explain',
                        title: 'A tag <a> e o atributo href',
                        content:
                          'A tag <a> (anchor = âncora) cria links. Ela precisa de um ATRIBUTO chamado href para saber para onde apontar. Atributos são informações extras dentro da tag de abertura.',
                        code: '<a href="https://www.google.com">Visitar o Google</a>',
                      },
                      {
                        id: 'explain-7b',
                        type: 'explain',
                        title: 'Abrindo em nova aba',
                        content:
                          'O atributo target="_blank" faz o link abrir em uma nova aba. Isso é útil quando você quer que o visitante não saia da sua página. Basta adicionar o atributo depois do href.',
                        code: '<a href="https://www.wikipedia.org" target="_blank">\n  Abrir Wikipedia em nova aba\n</a>',
                      },
                      {
                        id: 'practice-7',
                        type: 'practice',
                        content:
                          'Crie um link para seu site favorito. Experimente também adicionar target="_blank" para abrir em nova aba.',
                      },
                      {
                        id: 'checkpoint-7',
                        type: 'checkpoint',
                        content: 'Hora de verificar:',
                        checkpoint: {
                          question: 'Qual atributo define o DESTINO de um link HTML?',
                          options: ['src', 'link', 'href', 'url'],
                          correctIndex: 2,
                          explanation:
                            'href (hypertext reference) é o atributo que define para onde o link vai. "src" é usado para imagens e scripts. "link" e "url" não são atributos válidos para a tag <a>.',
                        },
                      },
                      {
                        id: 'reward-7',
                        type: 'reward',
                        content:
                          'Você acabou de criar sua primeira conexão na web! Aprendeu também o conceito de atributos — que são informações extras que você passa para as tags. Isso vai aparecer o tempo todo a partir de agora.',
                      },
                    ],
                    challenge: {
                      instruction:
                        'Crie um link com o texto "Explorar o Universo" que aponte para "https://www.nasa.gov" e abra em nova aba.',
                      hints: [
                        'A tag é <a> e precisa do atributo href com a URL.',
                        'Para abrir em nova aba, adicione target="_blank" dentro da tag <a>.',
                        'Código:\n<a href="https://www.nasa.gov" target="_blank">Explorar o Universo</a>',
                      ],
                    },
                  }),
                },

                // -------------------------------------------------------
                // AULA 8 — Imagens
                // -------------------------------------------------------
                {
                  title: 'Imagens na Página',
                  language: 'html',
                  order: 4,
                  codeTemplate: `<!-- Adicione uma imagem aqui -->
`,
                  validationLogic: `
function validate(outputStr, code) {
  var hasImg = code.includes('<img');
  var hasSrc = code.includes('src=');
  var hasAlt = code.includes('alt=');
  if (hasImg && hasSrc && hasAlt) return true;
  if (hasImg && hasSrc) return true;
  return false;
}
validate;
`,
                  content: JSON.stringify({
                    title: 'Adicionando Imagens',
                    concept: 'Tag <img>, atributos src e alt',
                    blocks: [
                      {
                        id: 'hook-8',
                        type: 'hook',
                        content:
                          'Páginas sem imagens parecem livros sem ilustrações. Uma imagem vale mais que mil palavras — e em HTML, você pode adicioná-las com uma única linha de código.',
                      },
                      {
                        id: 'explain-8a',
                        type: 'explain',
                        title: 'A tag <img> — sem fechamento!',
                        content:
                          'A tag <img> é especial: ela não tem tag de fechamento separada. É uma "tag vazia". Ela usa o atributo src (source = fonte) para saber qual imagem mostrar.',
                        code: '<img src="https://via.placeholder.com/300x200" alt="Uma imagem de exemplo">',
                      },
                      {
                        id: 'explain-8b',
                        type: 'explain',
                        title: 'O atributo alt — acessibilidade obrigatória',
                        content:
                          'O atributo alt descreve a imagem em texto. Ele aparece quando a imagem não carrega, e é lido por leitores de tela para pessoas com deficiência visual. Nunca omita o alt — é uma questão de inclusão.',
                        code: '<!-- Bom: alt descritivo -->\n<img src="cachorro.jpg" alt="Cachorro golden retriever correndo na praia">\n\n<!-- Ruim: alt vazio ou ausente -->\n<img src="cachorro.jpg">',
                      },
                      {
                        id: 'practice-8',
                        type: 'practice',
                        content:
                          'Adicione uma imagem usando uma URL pública. Você pode usar https://via.placeholder.com/400x300 como URL de teste. Não esqueça do alt descritivo!',
                      },
                      {
                        id: 'checkpoint-8',
                        type: 'checkpoint',
                        content: 'Verificação:',
                        checkpoint: {
                          question: 'Para que serve o atributo alt na tag <img>?',
                          options: [
                            'Define o tamanho da imagem',
                            'Descreve a imagem para acessibilidade e quando ela não carrega',
                            'Define a cor da borda da imagem',
                            'É opcional e não tem função prática',
                          ],
                          correctIndex: 1,
                          explanation:
                            'O alt tem dois papéis: descrever a imagem para leitores de tela (acessibilidade para cegos) e exibir texto quando a imagem falha ao carregar. Sempre escreva um alt descritivo e significativo.',
                        },
                      },
                      {
                        id: 'reward-8',
                        type: 'reward',
                        content:
                          'Fantástico! Você não só aprendeu a adicionar imagens — aprendeu a fazê-lo de forma acessível. Isso coloca você à frente de muitos desenvolvedores que ignoram o atributo alt.',
                      },
                    ],
                    challenge: {
                      instruction:
                        'Crie uma imagem usando a URL "https://via.placeholder.com/500x300" com o texto alternativo "Banner do meu site".',
                      hints: [
                        'A tag <img> não tem fechamento separado. Ela é autocontida.',
                        'Dois atributos são necessários: src com a URL e alt com a descrição.',
                        'Código:\n<img src="https://via.placeholder.com/500x300" alt="Banner do meu site">',
                      ],
                    },
                  }),
                },

                // -------------------------------------------------------
                // AULA 9 — Separadores e Quebras de Linha
                // -------------------------------------------------------
                {
                  title: 'Separadores e Quebras de Linha',
                  language: 'html',
                  order: 5,
                  codeTemplate: `<!-- Use <hr> e <br> abaixo -->
<h2>Seção 1</h2>
<p>Texto da primeira seção.</p>

`,
                  validationLogic: `
function validate(outputStr, code) {
  var hasHr = code.includes('<hr>') || code.includes('<hr/>') || code.includes('<hr />');
  var hasBr = code.includes('<br>') || code.includes('<br/>') || code.includes('<br />');
  if (hasHr || hasBr) return true;
  return false;
}
validate;
`,
                  content: JSON.stringify({
                    title: 'Separadores Visuais',
                    concept: 'Tags <hr> e <br>',
                    blocks: [
                      {
                        id: 'hook-9',
                        type: 'hook',
                        content:
                          'Em documentos de papel, usamos linhas horizontais para separar seções e breaks para quebrar parágrafos. O HTML tem tags específicas para esses dois casos — e ambas são "tags vazias" como o <img>.',
                      },
                      {
                        id: 'explain-9a',
                        type: 'explain',
                        title: '<hr> — Linha Horizontal',
                        content:
                          'A tag <hr> (horizontal rule) cria uma linha horizontal de separação. Ela não precisa de fechamento. Use para separar seções distintas de conteúdo, como um divisor visual entre tópicos.',
                        code: '<h2>Receitas Doces</h2>\n<p>Pudim, brigadeiro, mousse de chocolate...</p>\n\n<hr>\n\n<h2>Receitas Salgadas</h2>\n<p>Macarrão, risoto, frango grelhado...</p>',
                      },
                      {
                        id: 'explain-9b',
                        type: 'explain',
                        title: '<br> — Quebra de Linha',
                        content:
                          'A tag <br> (break) insere uma quebra de linha sem criar um novo parágrafo. É útil para endereços, poemas ou letras de música onde a quebra de linha é parte do significado.',
                        code: '<p>\n  Rua das Flores, 123<br>\n  Bairro Jardins<br>\n  São Paulo - SP\n</p>',
                      },
                      {
                        id: 'practice-9',
                        type: 'practice',
                        content:
                          'Crie duas seções separadas por <hr>. Na segunda seção, use <br> para formatar um endereço ou uma letra de música em linhas separadas.',
                      },
                      {
                        id: 'checkpoint-9',
                        type: 'checkpoint',
                        content: 'Vamos checar:',
                        checkpoint: {
                          question: 'Qual a diferença entre <br> e criar um novo <p>?',
                          options: [
                            'Nenhuma diferença — são iguais',
                            '<br> quebra a linha dentro do mesmo bloco; <p> cria um novo parágrafo com mais espaço',
                            '<br> é para títulos; <p> é para parágrafos',
                            '<br> adiciona espaço extra; <p> não adiciona',
                          ],
                          correctIndex: 1,
                          explanation:
                            '<br> apenas muda de linha, mantendo o texto no mesmo bloco (sem espaço extra). Um novo <p> cria um bloco separado com margem acima e abaixo. Use <br> quando quiser quebra de linha sem espaçamento extra.',
                        },
                      },
                      {
                        id: 'reward-9',
                        type: 'reward',
                        content:
                          'Agora você conhece as tags de separação do HTML. <hr> e <br> são simples, mas muito utilizadas. E você notou que algumas tags HTML não precisam de fechamento — são chamadas de "void elements".',
                      },
                    ],
                    challenge: {
                      instruction:
                        'Crie duas seções de conteúdo separadas por um <hr>, e dentro da segunda seção use <br> para formatar um endereço em três linhas.',
                      hints: [
                        '<hr> vai entre as duas seções — ele cria a linha divisória sozinho.',
                        'Dentro de um <p>, use <br> ao final de cada linha do endereço (exceto a última).',
                        'Código:\n<h2>Seção 1</h2>\n<p>Conteúdo aqui.</p>\n<hr>\n<h2>Endereço</h2>\n<p>Rua X<br>Bairro Y<br>Cidade Z</p>',
                      ],
                    },
                  }),
                },
              ],
            },
          },

          // ================================================================
          // MÓDULO 3 — Estrutura Semântica (Aulas 10–13)
          // ================================================================
          {
            title: 'Módulo 3: Estrutura Semântica',
            description:
              'Aprenda a organizar o HTML com significado real — não apenas visualmente.',
            order: 3,
            lessons: {
              create: [
                // -------------------------------------------------------
                // AULA 10 — Cabeçalho, Principal e Rodapé
                // -------------------------------------------------------
                {
                  title: 'Cabeçalho, Principal e Rodapé',
                  language: 'html',
                  order: 1,
                  codeTemplate: `<!DOCTYPE html>
<html>
  <body>
    <!-- Adicione header, main e footer aqui -->
  </body>
</html>
`,
                  validationLogic: `
function validate(outputStr, code) {
  var lower = code.toLowerCase();
  var hasHeader = lower.includes('<header') && lower.includes('</header>');
  var hasMain   = lower.includes('<main')   && lower.includes('</main>');
  var hasFooter = lower.includes('<footer') && lower.includes('</footer>');
  if (hasHeader && hasMain && hasFooter) return true;
  if (hasHeader || hasMain || hasFooter) return true;
  return false;
}
validate;
`,
                  content: JSON.stringify({
                    title: 'Regiões da Página',
                    concept: 'Tags semânticas: <header>, <main>, <footer>',
                    blocks: [
                      {
                        id: 'hook-10',
                        type: 'hook',
                        content:
                          'Um jornal tem capa (onde fica o nome e a data), o corpo das notícias e o rodapé com publicidade. Um site tem a mesma estrutura — e o HTML moderno tem tags específicas para cada região.',
                      },
                      {
                        id: 'explain-10a',
                        type: 'explain',
                        title: 'As três regiões principais',
                        content:
                          'Toda página pode ser dividida em: <header> (cabeçalho — logo, menu, slogan), <main> (conteúdo principal — artigos, produtos, informações) e <footer> (rodapé — copyright, links legais). Cada uma tem um significado claro.',
                        code: '<header>\n  <h1>NeuroCode</h1>\n  <nav>Menu aqui</nav>\n</header>\n\n<main>\n  <p>Conteúdo principal</p>\n</main>\n\n<footer>\n  <p>© 2026 NeuroCode</p>\n</footer>',
                      },
                      {
                        id: 'explain-10b',
                        type: 'explain',
                        title: 'Por que não usar só <div>?',
                        content:
                          'Antes, tudo era <div class="header">, <div class="footer">. Com as tags semânticas, o código se explica sozinho. Leitores de tela navegam diretamente ao <main>. Buscadores entendem melhor o conteúdo.',
                        code: '<!-- Antes (sem semântica): -->\n<div class="header">...</div>\n<div class="content">...</div>\n\n<!-- Agora (com semântica): -->\n<header>...</header>\n<main>...</main>',
                      },
                      {
                        id: 'practice-10',
                        type: 'practice',
                        content:
                          'Monte a estrutura de um site simples usando <header>, <main> e <footer>. Coloque um h1 no header, um parágrafo no main e um copyright no footer.',
                      },
                      {
                        id: 'checkpoint-10',
                        type: 'checkpoint',
                        content: 'Verificação:',
                        checkpoint: {
                          question: 'Onde deve ficar o conteúdo PRINCIPAL e ÚNICO de uma página?',
                          options: ['<div>', '<header>', '<main>', '<section>'],
                          correctIndex: 2,
                          explanation:
                            '<main> é a tag para o conteúdo principal e único da página. Deve existir apenas um <main> por página. Leitores de tela pulam direto para ele quando o usuário pede "ir ao conteúdo principal".',
                        },
                      },
                      {
                        id: 'reward-10',
                        type: 'reward',
                        content:
                          'Você está escrevendo HTML semântico — isso é o que separa iniciantes de desenvolvedores profissionais. Semântica melhora acessibilidade, SEO e manutenibilidade do código.',
                      },
                    ],
                    challenge: {
                      instruction:
                        'Crie uma página com <header> contendo um <h1> "Meu Blog", <main> com um <p> de texto livre, e <footer> com "© 2026 Meu Nome".',
                      hints: [
                        'Coloque as três tags dentro do <body>. Cada uma com seu conteúdo dentro.',
                        'Lembre: <header> para o topo, <main> para o centro, <footer> para o rodapé.',
                        'Estrutura:\n<header><h1>Meu Blog</h1></header>\n<main><p>Texto...</p></main>\n<footer><p>© 2026 Meu Nome</p></footer>',
                      ],
                    },
                  }),
                },

                // -------------------------------------------------------
                // AULA 11 — Seções e Artigos
                // -------------------------------------------------------
                {
                  title: 'Seções e Artigos',
                  language: 'html',
                  order: 2,
                  codeTemplate: `<main>
  <!-- Adicione <section> e <article> aqui -->
</main>
`,
                  validationLogic: `
function validate(outputStr, code) {
  var lower = code.toLowerCase();
  var hasSection = lower.includes('<section') && lower.includes('</section>');
  var hasArticle = lower.includes('<article') && lower.includes('</article>');
  if (hasSection || hasArticle) return true;
  return false;
}
validate;
`,
                  content: JSON.stringify({
                    title: 'Organizando o Conteúdo',
                    concept: 'Tags <section> e <article>',
                    blocks: [
                      {
                        id: 'hook-11',
                        type: 'hook',
                        content:
                          'Um livro tem capítulos, e cada capítulo tem partes. O <main> de uma página funciona igual — ele pode ter seções e artigos distintos, cada um com seu propósito claro.',
                      },
                      {
                        id: 'explain-11a',
                        type: 'explain',
                        title: '<section> — Divisão temática',
                        content:
                          '<section> agrupa conteúdo relacionado dentro de uma mesma página. Use quando você tem um conjunto de informações que formam um bloco temático. Cada seção geralmente tem seu próprio título.',
                        code: '<section>\n  <h2>Sobre Mim</h2>\n  <p>Sou estudante de programação...</p>\n</section>\n\n<section>\n  <h2>Meus Projetos</h2>\n  <p>Lista de projetos aqui...</p>\n</section>',
                      },
                      {
                        id: 'explain-11b',
                        type: 'explain',
                        title: '<article> — Conteúdo autônomo',
                        content:
                          '<article> é para conteúdo que faz sentido sozinho, fora do contexto da página — como um post de blog, uma notícia ou um comentário. Pense assim: se você copiasse o <article> para outro lugar, ele ainda faria sentido?',
                        code: '<article>\n  <h2>HTML para Iniciantes</h2>\n  <p>Publicado em 30/05/2026</p>\n  <p>HTML é a linguagem da web...</p>\n</article>',
                      },
                      {
                        id: 'practice-11',
                        type: 'practice',
                        content:
                          'Crie uma página de blog com duas seções: uma com artigos recentes usando <article>, e outra de apresentação usando <section>.',
                      },
                      {
                        id: 'checkpoint-11',
                        type: 'checkpoint',
                        content: 'Hora de verificar:',
                        checkpoint: {
                          question:
                            'Qual tag você usaria para um post de blog individual (que faz sentido sozinho)?',
                          options: ['<section>', '<div>', '<article>', '<part>'],
                          correctIndex: 2,
                          explanation:
                            '<article> é para conteúdo autônomo que pode ser redistribuído (RSS, redes sociais) sem perder contexto. <section> é para agrupar conteúdo relacionado dentro de uma página.',
                        },
                      },
                      {
                        id: 'reward-11',
                        type: 'reward',
                        content:
                          'Você está dominando a semântica HTML! Saber quando usar <section> vs <article> é um sinal de maturidade técnica. Continue assim!',
                      },
                    ],
                    challenge: {
                      instruction:
                        'Crie um <main> com uma <section> chamada "Destaques" (com h2 e p) e um <article> com um post fictício com h2, data e parágrafo de conteúdo.',
                      hints: [
                        '<section> é para agrupar temas. <article> é para conteúdo autônomo. Ambos ficam dentro do <main>.',
                        'Cada um precisa de um título h2 para boa prática semântica.',
                        'Exemplo:\n<main>\n  <section>\n    <h2>Destaques</h2>\n    <p>Conteúdo destacado...</p>\n  </section>\n  <article>\n    <h2>Meu Primeiro Post</h2>\n    <p>30/05/2026</p>\n    <p>Hoje aprendi HTML!</p>\n  </article>\n</main>',
                      ],
                    },
                  }),
                },

                // -------------------------------------------------------
                // AULA 12 — Div e Span (Contêineres Genéricos)
                // -------------------------------------------------------
                {
                  title: 'Div e Span — Contêineres Genéricos',
                  language: 'html',
                  order: 3,
                  codeTemplate: `<!-- Use <div> e <span> abaixo -->
`,
                  validationLogic: `
function validate(outputStr, code) {
  var lower = code.toLowerCase();
  var hasDiv  = lower.includes('<div') && lower.includes('</div>');
  var hasSpan = lower.includes('<span') && lower.includes('</span>');
  if (hasDiv && hasSpan) return true;
  if (hasDiv || hasSpan) return true;
  return false;
}
validate;
`,
                  content: JSON.stringify({
                    title: 'Caixas e Destaques Genéricos',
                    concept: 'Tags <div> e <span>',
                    blocks: [
                      {
                        id: 'hook-12',
                        type: 'hook',
                        content:
                          'Às vezes você precisa de um contêiner sem significado específico — apenas uma "caixa" para agrupar coisas ou uma "etiqueta" para estilizar uma palavra. O HTML tem dois elementos exatamente para isso.',
                      },
                      {
                        id: 'explain-12a',
                        type: 'explain',
                        title: '<div> — Caixa de bloco',
                        content:
                          '<div> é um contêiner de bloco genérico. Ele ocupa toda a largura disponível e começa em uma nova linha. Use quando nenhuma tag semântica (header, section, article) se aplica ao conteúdo.',
                        code: '<div>\n  <h3>Card de Produto</h3>\n  <p>Descrição do produto</p>\n  <p>R$ 99,90</p>\n</div>',
                      },
                      {
                        id: 'explain-12b',
                        type: 'explain',
                        title: '<span> — Etiqueta inline',
                        content:
                          '<span> é um contêiner inline — fica dentro do fluxo do texto, sem quebrar linha. Use para destacar partes específicas de texto que você quer estilizar com CSS depois.',
                        code: '<p>\n  O preço caiu de \n  <span>R$ 200</span> para \n  <span>R$ 99,90</span>!\n</p>',
                      },
                      {
                        id: 'practice-12',
                        type: 'practice',
                        content:
                          'Crie um card de produto usando <div> para o contêiner, e use <span> para destacar o preço dentro de um parágrafo.',
                      },
                      {
                        id: 'checkpoint-12',
                        type: 'checkpoint',
                        content: 'Verificação:',
                        checkpoint: {
                          question:
                            'Qual a principal diferença entre <div> e <span>?',
                          options: [
                            'São idênticos — apenas nomes diferentes',
                            '<div> é para texto; <span> é para imagens',
                            '<div> é bloco (ocupa linha inteira); <span> é inline (fica no fluxo do texto)',
                            '<div> é HTML5; <span> é HTML antigo',
                          ],
                          correctIndex: 2,
                          explanation:
                            '<div> é um elemento de bloco — começa em nova linha e ocupa toda a largura. <span> é inline — fica dentro do texto sem quebrar linha. Essa diferença determina como eles se comportam no layout.',
                        },
                      },
                      {
                        id: 'reward-12',
                        type: 'reward',
                        content:
                          'Muito bem! <div> e <span> são os contêineres mais usados em projetos reais, especialmente quando combinados com CSS. Agora você tem todas as ferramentas de estrutura HTML!',
                      },
                    ],
                    challenge: {
                      instruction:
                        'Crie um <div> com um título h3 "Produto Especial" e um parágrafo onde o preço "R$ 49,90" está dentro de um <span>.',
                      hints: [
                        '<div> envolve todo o card. <span> fica dentro do parágrafo, ao redor do preço.',
                        'Pense no <span> como uma etiqueta colada em uma palavra específica.',
                        'Código:\n<div>\n  <h3>Produto Especial</h3>\n  <p>Por apenas <span>R$ 49,90</span>!</p>\n</div>',
                      ],
                    },
                  }),
                },

                // -------------------------------------------------------
                // AULA 13 — Comentários HTML
                // -------------------------------------------------------
                {
                  title: 'Comentários no Código',
                  language: 'html',
                  order: 4,
                  codeTemplate: `<!-- Adicione comentários ao código abaixo -->
<h1>Meu Site</h1>
<p>Bem-vindo!</p>
`,
                  validationLogic: `
function validate(outputStr, code) {
  var hasComment = code.includes('<!--') && code.includes('-->');
  if (hasComment) return true;
  return false;
}
validate;
`,
                  content: JSON.stringify({
                    title: 'Deixando Notas no Código',
                    concept: 'Comentários HTML <!-- -->',
                    blocks: [
                      {
                        id: 'hook-13',
                        type: 'hook',
                        content:
                          'Imagine montar um quebra-cabeça e deixar bilhetinhos explicando por que cada peça vai em cada lugar. Quando alguém (ou você mesmo no futuro!) abrir o código, vai entender imediatamente. Isso é o que comentários fazem.',
                      },
                      {
                        id: 'explain-13a',
                        type: 'explain',
                        title: 'Sintaxe do comentário',
                        content:
                          'Em HTML, comentários começam com <!-- e terminam com -->. Tudo entre esses símbolos é completamente ignorado pelo navegador — não aparece na página. Só quem lê o código-fonte vê.',
                        code: '<!-- Este é um comentário. O navegador ignora isso. -->\n<p>Isso aparece na página.</p>',
                      },
                      {
                        id: 'explain-13b',
                        type: 'explain',
                        title: 'Quando usar comentários?',
                        content:
                          'Use comentários para: explicar seções do código, deixar lembretes para si mesmo, marcar onde uma seção começa e termina, ou desativar temporariamente um trecho de código sem apagar.',
                        code: '<!-- ===== INÍCIO DO CABEÇALHO ===== -->\n<header>\n  <h1>Meu Site</h1>\n</header>\n<!-- ===== FIM DO CABEÇALHO ===== -->\n\n<!-- TODO: Adicionar menu de navegação aqui -->\n',
                      },
                      {
                        id: 'practice-13',
                        type: 'practice',
                        content:
                          'Pegue o template do editor. Adicione pelo menos dois comentários: um antes do h1 explicando o que é, e um antes do parágrafo com uma nota para o futuro.',
                      },
                      {
                        id: 'checkpoint-13',
                        type: 'checkpoint',
                        content: 'Vamos verificar:',
                        checkpoint: {
                          question: 'O que acontece com o conteúdo de um comentário HTML?',
                          options: [
                            'Aparece em itálico na página',
                            'É executado como código',
                            'É completamente ignorado pelo navegador — não aparece',
                            'Aparece como texto cinza',
                          ],
                          correctIndex: 2,
                          explanation:
                            'O navegador ignora completamente o conteúdo entre <!-- e -->. Comentários existem APENAS para humanos que leem o código-fonte. Eles são invisíveis na página renderizada.',
                        },
                      },
                      {
                        id: 'reward-13',
                        type: 'reward',
                        content:
                          'Você agora escreve código comentado — uma prática essencial no trabalho em equipe. Comentários bem escritos são um presente para o "você do futuro" que vai manter esse código meses depois.',
                      },
                    ],
                    challenge: {
                      instruction:
                        'Adicione três comentários ao template: antes do <h1> (identificando o título), antes do <p> (com uma nota de desenvolvimento) e um comentário de TODO para adicionar algo depois.',
                      hints: [
                        'Comentários começam com <!-- e terminam com -->.',
                        'Coloque o comentário na linha ANTES do elemento que ele descreve.',
                        'Exemplo:\n<!-- Título principal da página -->\n<h1>Meu Site</h1>\n<!-- Parágrafo de boas-vindas -->\n<p>Bem-vindo!</p>\n<!-- TODO: Adicionar imagem aqui -->',
                      ],
                    },
                  }),
                },
              ],
            },
          },

          // ================================================================
          // MÓDULO 4 — Tabelas e Formulários (Aulas 14–18)
          // ================================================================
          {
            title: 'Módulo 4: Tabelas e Formulários',
            description:
              'Organize dados em tabelas e crie formulários para coletar informações dos usuários.',
            order: 4,
            lessons: {
              create: [
                // -------------------------------------------------------
                // AULA 14 — Tabelas Simples
                // -------------------------------------------------------
                {
                  title: 'Tabelas de Dados',
                  language: 'html',
                  order: 1,
                  codeTemplate: `<!-- Crie sua tabela aqui -->
`,
                  validationLogic: `
function validate(outputStr, code) {
  var lower = code.toLowerCase();
  var hasTable = lower.includes('<table') && lower.includes('</table>');
  var hasTr    = lower.includes('<tr') && lower.includes('</tr>');
  var hasTd    = lower.includes('<td') && lower.includes('</td>');
  if (hasTable && hasTr && hasTd) return true;
  return false;
}
validate;
`,
                  content: JSON.stringify({
                    title: 'Organizando Dados em Tabelas',
                    concept: 'Tags <table>, <tr>, <td> e <th>',
                    blocks: [
                      {
                        id: 'hook-14',
                        type: 'hook',
                        content:
                          'Quando você vê uma planilha de dados, um calendário ou uma tabela de preços em um site — tudo isso é feito com a tag <table> em HTML. Dados que se encaixam em linhas e colunas merecem uma tabela.',
                      },
                      {
                        id: 'explain-14a',
                        type: 'explain',
                        title: 'Estrutura de uma tabela',
                        content:
                          'Uma tabela HTML usa quatro tags em conjunto: <table> (a tabela toda), <tr> (table row = linha), <th> (table header = cabeçalho da coluna) e <td> (table data = célula de dado). Pense em linhas e colunas como uma planilha.',
                        code: '<table>\n  <tr>\n    <th>Nome</th>\n    <th>Nota</th>\n  </tr>\n  <tr>\n    <td>Ana</td>\n    <td>9.5</td>\n  </tr>\n  <tr>\n    <td>Carlos</td>\n    <td>8.0</td>\n  </tr>\n</table>',
                      },
                      {
                        id: 'explain-14b',
                        type: 'explain',
                        title: '<th> vs <td>',
                        content:
                          '<th> é o cabeçalho da coluna — aparece em negrito por padrão e tem significado semântico. <td> é uma célula de dados normal. Usar <th> no cabeçalho ajuda leitores de tela a entenderem a tabela.',
                        code: '<table>\n  <tr>\n    <!-- th = cabeçalho (negrito automático) -->\n    <th>Produto</th>\n    <th>Preço</th>\n  </tr>\n  <tr>\n    <!-- td = dado normal -->\n    <td>Notebook</td>\n    <td>R$ 2.500</td>\n  </tr>\n</table>',
                      },
                      {
                        id: 'practice-14',
                        type: 'practice',
                        content:
                          'Crie uma tabela simples de 3 linhas e 2 colunas. Pode ser uma lista de filmes favoritos com nome e ano, ou jogos com nome e plataforma.',
                      },
                      {
                        id: 'checkpoint-14',
                        type: 'checkpoint',
                        content: 'Verificação:',
                        checkpoint: {
                          question: 'Qual tag representa uma LINHA em uma tabela HTML?',
                          options: ['<td>', '<line>', '<tr>', '<row>'],
                          correctIndex: 2,
                          explanation:
                            '<tr> significa "table row" (linha da tabela). Dentro de cada <tr> ficam as células: <th> para cabeçalhos e <td> para dados. <line> e <row> não existem em HTML.',
                        },
                      },
                      {
                        id: 'reward-14',
                        type: 'reward',
                        content:
                          'Excelente! Você construiu uma tabela HTML do zero. Tabelas são poderosas para apresentar dados comparativos — preços, horários, estatísticas. Use com sabedoria!',
                      },
                    ],
                    challenge: {
                      instruction:
                        'Crie uma tabela com cabeçalhos "Linguagem" e "Criada em", e três linhas: HTML/1991, CSS/1996, JavaScript/1995.',
                      hints: [
                        'Comece com <table>, adicione uma linha de <th> (cabeçalhos) e depois as linhas de <td> (dados).',
                        'Cada linha começa com <tr> e termina com </tr>. Dentro ficam as células.',
                        'Código:\n<table>\n  <tr><th>Linguagem</th><th>Criada em</th></tr>\n  <tr><td>HTML</td><td>1991</td></tr>\n  <tr><td>CSS</td><td>1996</td></tr>\n  <tr><td>JavaScript</td><td>1995</td></tr>\n</table>',
                      ],
                    },
                  }),
                },

                // -------------------------------------------------------
                // AULA 15 — Formulários com Input de Texto
                // -------------------------------------------------------
                {
                  title: 'Formulários e Campos de Texto',
                  language: 'html',
                  order: 2,
                  codeTemplate: `<!-- Crie seu formulário aqui -->
`,
                  validationLogic: `
function validate(outputStr, code) {
  var lower = code.toLowerCase();
  var hasForm  = lower.includes('<form') && lower.includes('</form>');
  var hasInput = lower.includes('<input');
  var hasLabel = lower.includes('<label') && lower.includes('</label>');
  if (hasForm && hasInput) return true;
  return false;
}
validate;
`,
                  content: JSON.stringify({
                    title: 'Coletando Informações dos Usuários',
                    concept: 'Tags <form>, <input> e <label>',
                    blocks: [
                      {
                        id: 'hook-15',
                        type: 'hook',
                        content:
                          'Cadastros, login, pesquisa, contato — toda vez que você digita algo em um site e envia, você está usando um formulário HTML. Eles são a porta de entrada de toda interação do usuário com um sistema.',
                      },
                      {
                        id: 'explain-15a',
                        type: 'explain',
                        title: 'A tag <form>',
                        content:
                          '<form> é o contêiner de todos os campos. Ele define uma "área de coleta de dados". Tudo que está dentro do <form> faz parte do mesmo conjunto de informações que será enviado.',
                        code: '<form>\n  <!-- Campos de entrada ficam aqui dentro -->\n</form>',
                      },
                      {
                        id: 'explain-15b',
                        type: 'explain',
                        title: '<input> e <label>',
                        content:
                          '<input type="text"> cria uma caixa de texto. O <label> é a etiqueta que descreve o campo — como o rótulo de um pote. Para conectar o label ao input, use o atributo for (no label) e id (no input) com o mesmo valor.',
                        code: '<form>\n  <label for="nome">Seu nome:</label>\n  <input type="text" id="nome" placeholder="Ex: Ana">\n</form>',
                      },
                      {
                        id: 'practice-15',
                        type: 'practice',
                        content:
                          'Crie um formulário com dois campos: um para nome e outro para cidade. Não esqueça dos <label> para cada input.',
                      },
                      {
                        id: 'checkpoint-15',
                        type: 'checkpoint',
                        content: 'Verificação:',
                        checkpoint: {
                          question:
                            'Para que serve o atributo for no <label> e o id no <input>?',
                          options: [
                            'São decorativos — não têm função real',
                            'Conectam o label ao input para acessibilidade (clicar no label foca o campo)',
                            'Definem o tipo de dado que o campo aceita',
                            'Enviam os dados para o servidor',
                          ],
                          correctIndex: 1,
                          explanation:
                            'Quando for e id têm o mesmo valor, clicar no <label> coloca o cursor no <input> correspondente. Isso é crucial para acessibilidade — usuários de leitores de tela e pessoas com dificuldade motora dependem disso.',
                        },
                      },
                      {
                        id: 'reward-15',
                        type: 'reward',
                        content:
                          'Você criou seu primeiro formulário HTML! E mais importante: com labels acessíveis. Isso faz uma diferença enorme para usuários com deficiência. Parabéns pela escolha consciente.',
                      },
                    ],
                    challenge: {
                      instruction:
                        'Crie um formulário de contato com dois campos: um para "Nome" (id="nome") e um para "Email" (id="email"), cada um com seu <label> corretamente conectado.',
                      hints: [
                        'O atributo for do label deve ser igual ao atributo id do input correspondente.',
                        'Use type="text" para o nome e type="email" para o email.',
                        'Código:\n<form>\n  <label for="nome">Nome:</label>\n  <input type="text" id="nome">\n  <label for="email">Email:</label>\n  <input type="email" id="email">\n</form>',
                      ],
                    },
                  }),
                },

                // -------------------------------------------------------
                // AULA 16 — Tipos de Input
                // -------------------------------------------------------
                {
                  title: 'Tipos de Input',
                  language: 'html',
                  order: 3,
                  codeTemplate: `<!-- Experimente diferentes tipos de input -->
<form>
  
</form>
`,
                  validationLogic: `
function validate(outputStr, code) {
  var lower = code.toLowerCase();
  var hasEmail    = lower.includes('type="email"') || lower.includes("type='email'");
  var hasPassword = lower.includes('type="password"') || lower.includes("type='password'");
  var hasNumber   = lower.includes('type="number"') || lower.includes("type='number'");
  if (hasEmail || hasPassword || hasNumber) return true;
  return false;
}
validate;
`,
                  content: JSON.stringify({
                    title: 'Inputs Especializados',
                    concept: 'Tipos de <input>: email, password, number',
                    blocks: [
                      {
                        id: 'hook-16',
                        type: 'hook',
                        content:
                          'Um campo de email deve validar automaticamente o formato. Um campo de senha deve esconder os caracteres. Um campo numérico deve aceitar apenas números. O HTML tem tudo isso embutido — você só precisa escolher o type certo.',
                      },
                      {
                        id: 'explain-16a',
                        type: 'explain',
                        title: 'Tipos especializados',
                        content:
                          'O atributo type do <input> muda o comportamento do campo. Cada tipo oferece validação e interface otimizadas — no celular, o teclado muda automaticamente dependendo do type.',
                        code: '<input type="email" placeholder="seu@email.com">\n<input type="password" placeholder="Sua senha">\n<input type="number" placeholder="Sua idade">',
                      },
                      {
                        id: 'explain-16b',
                        type: 'explain',
                        title: 'Mais atributos úteis',
                        content:
                          'Além do type, você pode usar: placeholder (texto de exemplo dentro do campo), required (torna o campo obrigatório), min e max (para números), e maxlength (limite de caracteres).',
                        code: '<input \n  type="number" \n  min="18" \n  max="120" \n  placeholder="Sua idade"\n  required>',
                      },
                      {
                        id: 'practice-16',
                        type: 'practice',
                        content:
                          'Crie um formulário de cadastro com campos de email, senha e idade (number). Adicione placeholder em cada um.',
                      },
                      {
                        id: 'checkpoint-16',
                        type: 'checkpoint',
                        content: 'Vamos checar:',
                        checkpoint: {
                          question:
                            'Qual type de input esconde automaticamente os caracteres digitados?',
                          options: ['hidden', 'secret', 'password', 'secure'],
                          correctIndex: 2,
                          explanation:
                            'type="password" transforma cada caractere em um ponto ou asterisco enquanto o usuário digita. Isso é comportamento nativo do navegador — sem precisar de JavaScript!',
                        },
                      },
                      {
                        id: 'reward-16',
                        type: 'reward',
                        content:
                          'Agora você sabe usar os tipos de input certos para cada situação! Cada type correto melhora a experiência do usuário e adiciona validação automática sem precisar de código extra.',
                      },
                    ],
                    challenge: {
                      instruction:
                        'Crie um formulário de cadastro com três campos: Email (type="email"), Senha (type="password") e Idade (type="number" com min="16" e max="120").',
                      hints: [
                        'Cada campo é um <input> com o type apropriado. Adicione labels para acessibilidade.',
                        'O campo de número pode ter atributos min e max para limitar os valores aceitos.',
                        'Código:\n<form>\n  <label for="email">Email:</label>\n  <input type="email" id="email">\n  <label for="senha">Senha:</label>\n  <input type="password" id="senha">\n  <label for="idade">Idade:</label>\n  <input type="number" id="idade" min="16" max="120">\n</form>',
                      ],
                    },
                  }),
                },

                // -------------------------------------------------------
                // AULA 17 — Checkbox e Radio
                // -------------------------------------------------------
                {
                  title: 'Checkbox e Radio',
                  language: 'html',
                  order: 4,
                  codeTemplate: `<!-- Crie checkboxes e radios aqui -->
<form>
  
</form>
`,
                  validationLogic: `
function validate(outputStr, code) {
  var lower = code.toLowerCase();
  var hasCheckbox = lower.includes('type="checkbox"') || lower.includes("type='checkbox'");
  var hasRadio    = lower.includes('type="radio"') || lower.includes("type='radio'");
  if (hasCheckbox && hasRadio) return true;
  if (hasCheckbox || hasRadio) return true;
  return false;
}
validate;
`,
                  content: JSON.stringify({
                    title: 'Escolhas e Seleções',
                    concept: 'Inputs type="checkbox" e type="radio"',
                    blocks: [
                      {
                        id: 'hook-17',
                        type: 'hook',
                        content:
                          'Preferências de pizza: você pode escolher várias coberturas (checkbox) ou apenas um tamanho (radio). Esses dois tipos de input são fundamentais para formulários de pesquisa, cadastro e configurações.',
                      },
                      {
                        id: 'explain-17a',
                        type: 'explain',
                        title: 'Checkbox — múltipla escolha',
                        content:
                          'type="checkbox" permite que o usuário marque vários itens ao mesmo tempo. Cada checkbox é independente. O atributo name pode ser o mesmo para agrupar visualmente, mas cada um é selecionável independentemente.',
                        code: '<p>Quais linguagens você conhece?</p>\n<input type="checkbox" id="html" name="lang" value="html">\n<label for="html">HTML</label>\n\n<input type="checkbox" id="css" name="lang" value="css">\n<label for="css">CSS</label>',
                      },
                      {
                        id: 'explain-17b',
                        type: 'explain',
                        title: 'Radio — escolha única',
                        content:
                          'type="radio" permite selecionar APENAS UMA opção do grupo. Para criar um grupo, todos os radios precisam ter o MESMO valor no atributo name. Selecionar um desseleciona automaticamente os outros do grupo.',
                        code: '<p>Qual seu nível?</p>\n<input type="radio" id="ini" name="nivel" value="iniciante">\n<label for="ini">Iniciante</label>\n\n<input type="radio" id="int" name="nivel" value="intermediario">\n<label for="int">Intermediário</label>',
                      },
                      {
                        id: 'practice-17',
                        type: 'practice',
                        content:
                          'Crie uma pequena pesquisa: checkboxes para hobbies (pode marcar vários) e radios para frequência de estudo (apenas um).',
                      },
                      {
                        id: 'checkpoint-17',
                        type: 'checkpoint',
                        content: 'Verificação:',
                        checkpoint: {
                          question:
                            'Como você faz um grupo de radios onde apenas UM pode ser selecionado?',
                          options: [
                            'Adicionando o atributo unique em cada radio',
                            'Colocando todos dentro de um <group>',
                            'Dando o mesmo valor ao atributo name em todos os radios do grupo',
                            'É automático — radios sempre funcionam em exclusão mútua',
                          ],
                          correctIndex: 2,
                          explanation:
                            'O atributo name cria o grupo. Todos os radios com o mesmo name pertencem ao mesmo grupo e se excluem mutuamente. Se tiverem names diferentes, são grupos separados e independentes.',
                        },
                      },
                      {
                        id: 'reward-17',
                        type: 'reward',
                        content:
                          'Você agora conhece os dois tipos de seleção do HTML! Checkboxes para "pode marcar vários", radios para "só pode escolher um". Esse padrão aparece em todo formulário profissional.',
                      },
                    ],
                    challenge: {
                      instruction:
                        'Crie um formulário com: checkboxes para cores favoritas (Vermelho, Azul, Verde) e radios para tamanho de camiseta (P, M, G) com o mesmo name="tamanho".',
                      hints: [
                        'Para checkboxes: cada um tem seu próprio id e label. Não precisam ter o mesmo name.',
                        'Para radios: TODOS devem ter name="tamanho" para funcionar como grupo exclusivo.',
                        'Exemplo de radio:\n<input type="radio" id="p" name="tamanho" value="P">\n<label for="p">P</label>',
                      ],
                    },
                  }),
                },

                // -------------------------------------------------------
                // AULA 18 — Botões
                // -------------------------------------------------------
                {
                  title: 'Botões de Ação',
                  language: 'html',
                  order: 5,
                  codeTemplate: `<!-- Crie botões aqui -->
<form>
  
</form>
`,
                  validationLogic: `
function validate(outputStr, code) {
  var lower = code.toLowerCase();
  var hasButton = lower.includes('<button') && lower.includes('</button>');
  var hasSubmit = lower.includes('type="submit"') || lower.includes('submit');
  if (hasButton || hasSubmit) return true;
  return false;
}
validate;
`,
                  content: JSON.stringify({
                    title: 'Ações com Botões',
                    concept: 'Tag <button> e input type="submit"',
                    blocks: [
                      {
                        id: 'hook-18',
                        type: 'hook',
                        content:
                          'Formulários sem botão são como portas sem maçaneta — você monta tudo, mas o usuário não consegue enviar. O botão é a ação final, o ponto de confirmação de qualquer interação.',
                      },
                      {
                        id: 'explain-18a',
                        type: 'explain',
                        title: 'A tag <button>',
                        content:
                          'A tag <button> é a forma moderna de criar botões. Ela aceita HTML dentro (você pode colocar texto e ícones). O type="submit" envia o formulário. O type="button" é para ações JavaScript.',
                        code: '<button type="submit">Enviar</button>\n<button type="button">Cancelar</button>\n<button type="reset">Limpar tudo</button>',
                      },
                      {
                        id: 'explain-18b',
                        type: 'explain',
                        title: 'Botão no contexto de um formulário',
                        content:
                          'Um <button type="submit"> dentro de um <form> vai enviar todos os dados preenchidos. O type="reset" limpa todos os campos do formulário. Sempre defina o type para evitar comportamento inesperado.',
                        code: '<form>\n  <label for="nome">Nome:</label>\n  <input type="text" id="nome">\n  \n  <button type="submit">Cadastrar</button>\n  <button type="reset">Limpar</button>\n</form>',
                      },
                      {
                        id: 'practice-18',
                        type: 'practice',
                        content:
                          'Complete o formulário template com um botão de envio e um botão de limpar. Observe o comportamento do type="reset" quando você preenche e clica em Limpar.',
                      },
                      {
                        id: 'checkpoint-18',
                        type: 'checkpoint',
                        content: 'Verificação:',
                        checkpoint: {
                          question:
                            'O que acontece quando você clica em <button type="reset"> dentro de um formulário?',
                          options: [
                            'Apaga o formulário da página',
                            'Envia o formulário',
                            'Limpa todos os campos e volta ao estado inicial',
                            'Não faz nada sem JavaScript',
                          ],
                          correctIndex: 2,
                          explanation:
                            'type="reset" apaga tudo que foi digitado nos campos do formulário e volta cada campo ao seu valor padrão. É comportamento nativo do HTML — sem precisar de JavaScript!',
                        },
                      },
                      {
                        id: 'reward-18',
                        type: 'reward',
                        content:
                          'Parabéns! Você completou o módulo de formulários! Agora você pode criar formulários completos com campos de texto, email, senha, checkbox, radio e botões. Isso cobre a grande maioria dos formulários na web.',
                      },
                    ],
                    challenge: {
                      instruction:
                        'Crie um formulário com um campo de nome, um campo de email, e dois botões: "Enviar" (type="submit") e "Cancelar" (type="reset").',
                      hints: [
                        'O <button> precisa ter o atributo type definido: submit ou reset.',
                        'Coloque os botões após os campos, ainda dentro do <form>.',
                        'Código dos botões:\n<button type="submit">Enviar</button>\n<button type="reset">Cancelar</button>',
                      ],
                    },
                  }),
                },
              ],
            },
          },

          // ================================================================
          // MÓDULO 5 — Semântica Avançada e Boas Práticas (Aulas 19–20)
          // ================================================================
          {
            title: 'Módulo 5: Semântica e Boas Práticas',
            description:
              'Entenda por que semântica importa e como preparar sua página para o mundo real.',
            order: 5,
            lessons: {
              create: [
                // -------------------------------------------------------
                // AULA 19 — Por que Semântica HTML Importa
                // -------------------------------------------------------
                {
                  title: 'Por que Semântica Importa',
                  language: 'html',
                  order: 1,
                  codeTemplate: `<!-- Reescreva este código usando tags semânticas -->
<div>
  <div>Logo e Navegação</div>
  <div>Conteúdo principal do site</div>
  <div>Rodapé com informações</div>
</div>
`,
                  validationLogic: `
function validate(outputStr, code) {
  var lower = code.toLowerCase();
  var hasHeader  = lower.includes('<header') && lower.includes('</header>');
  var hasMain    = lower.includes('<main') && lower.includes('</main>');
  var hasFooter  = lower.includes('<footer') && lower.includes('</footer>');
  var hasNav     = lower.includes('<nav') && lower.includes('</nav>');
  var hasSection = lower.includes('<section') && lower.includes('</section>');
  var semanticCount = [hasHeader, hasMain, hasFooter, hasNav, hasSection].filter(Boolean).length;
  if (semanticCount >= 2) return true;
  return false;
}
validate;
`,
                  content: JSON.stringify({
                    title: 'HTML com Significado',
                    concept: 'Semântica HTML: acessibilidade, SEO e manutenção',
                    blocks: [
                      {
                        id: 'hook-19',
                        type: 'hook',
                        content:
                          'Dois sites podem parecer idênticos na tela. Mas por dentro, um usa <div> para tudo e o outro usa tags semânticas. O Google, os leitores de tela e seus colegas de equipe conseguem distinguir os dois — e preferem muito o segundo.',
                      },
                      {
                        id: 'explain-19a',
                        type: 'explain',
                        title: 'O problema dos divs genéricos',
                        content:
                          'Antes do HTML5, tudo era <div>. <div class="header">, <div class="nav">, <div class="footer">. Isso funciona visualmente, mas não comunica significado. Um robô (Google, leitor de tela) precisa de pistas sobre o que cada coisa É.',
                        code: '<!-- Sem semântica (HTML4 / mau uso): -->\n<div class="header">Logo</div>\n<div class="nav">Menu</div>\n<div class="main">Conteúdo</div>\n<div class="footer">Rodapé</div>',
                      },
                      {
                        id: 'explain-19b',
                        type: 'explain',
                        title: 'Tags semânticas e seus benefícios',
                        content:
                          'Tags como <header>, <nav>, <main>, <article>, <section>, <aside> e <footer> comunicam propósito. Isso melhora: (1) Acessibilidade — leitores de tela navegam por regiões. (2) SEO — Google entende a estrutura. (3) Manutenção — código mais legível.',
                        code: '<!-- Com semântica (HTML5 correto): -->\n<header>Logo</header>\n<nav>Menu</nav>\n<main>Conteúdo</main>\n<footer>Rodapé</footer>',
                      },
                      {
                        id: 'practice-19',
                        type: 'practice',
                        content:
                          'Veja o template no editor — ele usa <div> para tudo. Reescreva substituindo cada <div> pela tag semântica correta: header, main, footer.',
                      },
                      {
                        id: 'checkpoint-19',
                        type: 'checkpoint',
                        content: 'Vamos verificar:',
                        checkpoint: {
                          question: 'Qual das opções descreve melhor HTML semântico?',
                          options: [
                            'Usar muitas tags para deixar o código bonito',
                            'Usar tags que descrevem o SIGNIFICADO e PROPÓSITO do conteúdo',
                            'Evitar usar <div> em qualquer situação',
                            'Usar apenas as 5 tags mais populares',
                          ],
                          correctIndex: 1,
                          explanation:
                            'HTML semântico significa escolher a tag que melhor descreve O QUE o conteúdo É, não apenas como ele deve aparecer. <nav> diz "isso é navegação", <article> diz "este conteúdo é autônomo".',
                        },
                      },
                      {
                        id: 'reward-19',
                        type: 'reward',
                        content:
                          'Você agora pensa em HTML de forma profissional! Semântica é um dos conceitos que separa um desenvolvedor mediano de um excelente. Continue aplicando isso em todo projeto.',
                      },
                    ],
                    challenge: {
                      instruction:
                        'Reescreva o template do editor trocando os <div> por tags semânticas: <header>, <main> e <footer>. O conteúdo pode permanecer o mesmo.',
                      hints: [
                        'Identifique o propósito de cada <div>: é cabeçalho? É conteúdo principal? É rodapé?',
                        'Substitua apenas a tag, mantendo o conteúdo de texto dentro.',
                        'Resultado:\n<header>Logo e Navegação</header>\n<main>Conteúdo principal do site</main>\n<footer>Rodapé com informações</footer>',
                      ],
                    },
                  }),
                },

                // -------------------------------------------------------
                // AULA 20 — Meta Tags, Viewport e Head Completo
                // -------------------------------------------------------
                {
                  title: 'Meta Tags e o Head Completo',
                  language: 'html',
                  order: 2,
                  codeTemplate: `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <!-- Adicione meta tags aqui -->
    <title>Meu Site</title>
  </head>
  <body>
    <h1>Olá, mundo!</h1>
  </body>
</html>
`,
                  validationLogic: `
function validate(outputStr, code) {
  var lower = code.toLowerCase();
  var hasCharset  = lower.includes('charset');
  var hasViewport = lower.includes('viewport');
  var hasTitle    = lower.includes('<title') && lower.includes('</title>');
  if (hasCharset && hasViewport && hasTitle) return true;
  if (hasCharset || hasViewport) return true;
  return false;
}
validate;
`,
                  content: JSON.stringify({
                    title: 'Preparando sua Página para o Mundo Real',
                    concept: 'Meta tags: charset, viewport e description',
                    blocks: [
                      {
                        id: 'hook-20',
                        type: 'hook',
                        content:
                          'Você já criou páginas bonitas e bem estruturadas. Mas há informações invisíveis que todo site profissional precisa — informações para o navegador, para o Google e para dispositivos móveis. Hoje completamos o <head>.',
                      },
                      {
                        id: 'explain-20a',
                        type: 'explain',
                        title: 'Meta tags essenciais',
                        content:
                          '<meta charset="UTF-8"> garante que acentos e caracteres especiais apareçam corretamente. <meta name="viewport"> faz a página se adaptar a telas de celular. <meta name="description"> é o texto que aparece no Google.',
                        code: '<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <meta name="description" content="Aprenda HTML do zero com NeuroCode">\n  <title>NeuroCode — Aprenda HTML</title>\n</head>',
                      },
                      {
                        id: 'explain-20b',
                        type: 'explain',
                        title: 'lang e acessibilidade',
                        content:
                          'O atributo lang na tag <html> declara o idioma da página. Isso ajuda leitores de tela a pronunciar corretamente e o Google a indexar no idioma certo. Use lang="pt-BR" para português brasileiro.',
                        code: '<!-- Declarar o idioma da página -->\n<html lang="pt-BR">\n  <head>...</head>\n  <body>...</body>\n</html>',
                      },
                      {
                        id: 'practice-20',
                        type: 'practice',
                        content:
                          'Complete o <head> do template com: charset UTF-8, viewport para mobile e uma meta description sobre você ou seu site imaginário.',
                      },
                      {
                        id: 'checkpoint-20',
                        type: 'checkpoint',
                        content: 'Verificação final:',
                        checkpoint: {
                          question:
                            'Para que serve a meta tag de viewport?',
                          options: [
                            'Define a cor de fundo da página',
                            'Faz a página se adaptar corretamente a telas de tamanhos diferentes (responsividade)',
                            'Define a velocidade de carregamento da página',
                            'Conecta a página a uma câmera do dispositivo',
                          ],
                          correctIndex: 1,
                          explanation:
                            'A meta viewport instrui o navegador mobile a renderizar a página na largura real do dispositivo, sem diminuir tudo para caber em uma tela "virtual" de desktop. Sem ela, sites aparecem minúsculos em celulares.',
                        },
                      },
                      {
                        id: 'reward-20',
                        type: 'reward',
                        content:
                          '🎉 Parabéns! Você completou as 20 primeiras aulas de HTML! Você agora sabe criar páginas completas, semânticas, acessíveis e preparadas para mobile. Isso é uma base sólida para construir qualquer coisa na web. O CSS vai ser seu próximo superpoder!',
                      },
                    ],
                    challenge: {
                      instruction:
                        'Complete o template com: (1) meta charset="UTF-8", (2) meta viewport com content="width=device-width, initial-scale=1.0", e (3) uma meta description com uma frase sobre você.',
                      hints: [
                        'As três meta tags ficam dentro do <head>, antes ou depois do <title>.',
                        'charset e viewport são as mais críticas — sem charset, acentos podem quebrar; sem viewport, o site fica ruim no celular.',
                        'Código completo:\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<meta name="description" content="Meu primeiro site HTML">',
                      ],
                    },
                  }),
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('✅ Seed concluído com sucesso!');
  console.log('📊 Criado: 1 curso, 5 módulos, 20 lições HTML no formato ARPERC.');
  console.log('🎯 Cobertura: Tags essenciais, semântica, formulários e boas práticas.');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
