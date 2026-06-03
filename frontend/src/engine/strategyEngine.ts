// ============================================================
// NAIS — Strategy Engine
// Multi-strategy teaching approach with effectiveness scoring
// "Nunca repetir a mesma abordagem mais de duas vezes."
// ============================================================

import type { SpecialInterest, LearnerProfile } from './learnerModel';
import { getPersonalizedAnalogy, INTEREST_CONTEXTS } from './personalizationEngine';

// === Strategy Types ===

export type StrategyType =
  | 'technical'         // Modo 1: formal technical explanation
  | 'analogy_concrete'  // Modo 2: real-world object analogy
  | 'analogy_media'     // Modo 3: media/video analogy
  | 'analogy_interest'  // Modo 4: based on special interest
  | 'visual'            // Modo 5: visual diagram/representation
  | 'step_by_step'      // Modo 6: micro step-by-step
  | 'comparison'        // Modo 7: comparison with known concept
  | 'common_error';     // Modo 8: explain via common mistake

export const ALL_STRATEGIES: StrategyType[] = [
  'technical', 'analogy_concrete', 'analogy_media', 'analogy_interest',
  'visual', 'step_by_step', 'comparison', 'common_error',
];

export const STRATEGY_LABELS: Record<StrategyType, string> = {
  technical:        'Explicação Técnica',
  analogy_concrete: 'Analogia Concreta',
  analogy_media:    'Analogia com Mídia',
  analogy_interest: 'Analogia Personalizada',
  visual:           'Explicação Visual',
  step_by_step:     'Passo a Passo',
  comparison:       'Comparação',
  common_error:     'Pelo Erro Comum',
};

// === Strategy Selection ===

/**
 * Selects the best next teaching strategy for a concept.
 *
 * Rules:
 * 1. Never repeat the same strategy >2 times consecutively
 * 2. Prioritize strategies with highest effectiveness score
 * 3. If learner has interests → boost analogy_interest
 * 4. If current strategy failed → pick the next-best alternative
 */
export function selectNextStrategy(
  learnerProfile: LearnerProfile,
  conceptKey: string,
  currentStrategy: StrategyType | null,
  failedStrategies: StrategyType[],
): StrategyType {
  const concept = learnerProfile.concepts[conceptKey];

  // Count consecutive uses of current strategy
  let consecutiveUses = 0;
  if (concept && currentStrategy) {
    const history = concept.strategyHistory;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].strategy === currentStrategy) consecutiveUses++;
      else break;
    }
  }

  // Score each strategy
  const scored = ALL_STRATEGIES.map(strategy => {
    let score = 50; // base

    // Boost from learner's global strategy scores
    const globalScore = learnerProfile.strategyScores[strategy];
    if (globalScore !== undefined) {
      score = globalScore;
    }

    // Boost from concept-specific history
    if (concept) {
      const conceptAttempts = concept.strategyHistory.filter(a => a.strategy === strategy);
      if (conceptAttempts.length > 0) {
        const successRate = conceptAttempts.filter(a => a.success).length / conceptAttempts.length;
        score = score * 0.4 + successRate * 100 * 0.6;
      }
    }

    // Penalty: if it's the current strategy and used >2 times → heavy penalty
    if (strategy === currentStrategy && consecutiveUses >= 2) {
      score -= 60;
    }

    // Penalty: if it recently failed
    if (failedStrategies.includes(strategy)) {
      score -= 30;
    }

    // Boost: analogy_interest if learner has interests
    if (strategy === 'analogy_interest' && learnerProfile.specialInterests.length > 0) {
      score += 15;
    }

    // Avoid the exact same strategy
    if (strategy === currentStrategy) {
      score -= 10;
    }

    return { strategy, score };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  return scored[0].strategy;
}

// === Strategy Content Generation ===

/**
 * Generates an explanation for a concept using a specific strategy.
 */
export function generateExplanation(
  strategy: StrategyType,
  conceptKey: string,
  language: string,
  interests: SpecialInterest[],
): string {
  const templates = getConceptTemplates(conceptKey, language);
  if (!templates) return templates ?? '';

  switch (strategy) {
    case 'technical':
      return templates.technical;

    case 'analogy_concrete':
      return templates.analogyConcrete;

    case 'analogy_media':
      return templates.analogyMedia;

    case 'analogy_interest': {
      const analogy = getPersonalizedAnalogy(conceptKey, interests);
      if (analogy) return analogy;
      return templates.analogyConcrete; // fallback
    }

    case 'visual':
      return templates.visual;

    case 'step_by_step':
      return templates.stepByStep;

    case 'comparison':
      return templates.comparison;

    case 'common_error':
      return templates.commonError;

    default:
      return templates.technical;
  }
}

/**
 * Generates personalized hints for a concept using a strategy + interest.
 */
export function generateHints(
  strategy: StrategyType,
  conceptKey: string,
  language: string,
  interests: SpecialInterest[],
): [string, string, string] {
  const templates = getConceptTemplates(conceptKey, language);

  // Default fallback hints
  const defaults: [string, string, string] = [
    'Releia o conteúdo da lição com atenção.',
    'Preste atenção na sintaxe — cada detalhe importa.',
    'Tente comparar com os exemplos mostrados acima.',
  ];

  if (!templates || !templates.hints) return defaults;

  // Personalize hint 1 with interest if available
  const hint1 = interests.length > 0 && strategy === 'analogy_interest'
    ? templates.hints[0].replace('{interest}', INTEREST_CONTEXTS[interests[0]]?.exampleTitle || '')
    : templates.hints[0];

  return [hint1, templates.hints[1], templates.hints[2]];
}

// === Concept Template Database ===

interface ConceptTemplates {
  technical: string;
  analogyConcrete: string;
  analogyMedia: string;
  visual: string;
  stepByStep: string;
  comparison: string;
  commonError: string;
  hints: [string, string, string];
}

function getConceptTemplates(conceptKey: string, language: string): ConceptTemplates | null {
  // Normalize key for lookup
  const key = conceptKey.toLowerCase().replace(/[^a-z_]/g, '');

  const templates = CONCEPT_TEMPLATES[key];
  if (templates) return templates;

  // Try language-level fallback
  const langKey = `${language}_generic`;
  return CONCEPT_TEMPLATES[langKey] || null;
}

const CONCEPT_TEMPLATES: Record<string, ConceptTemplates> = {
  // ========== HTML ==========
  html_h1: {
    technical: 'A tag <h1> define o cabeçalho de nível mais alto no HTML. É um elemento de bloco que renderiza texto em tamanho grande e negrito. Deve ser usada uma vez por página para o título principal.',
    analogyConcrete: 'A tag <h1> é como a manchete de um jornal. Quando você abre o jornal, a primeira coisa que vê é o título em letras enormes. O <h1> faz a mesma coisa na web.',
    analogyMedia: 'A tag <h1> é como o título de um vídeo no YouTube. É a primeira coisa que chama sua atenção e diz do que se trata.',
    visual: '🔤 Imagine uma escada de tamanhos: <h1> é o degrau mais alto (texto GRANDE), <h2> é o segundo, e assim por diante até <h6> (texto pequeno). Você está no topo!',
    stepByStep: 'Passo 1: Abra com <h1>\nPasso 2: Escreva qualquer texto\nPasso 3: Feche com </h1>\n\nA barra "/" no fechamento diz ao navegador: "o título acaba aqui".',
    comparison: 'Se <p> é o corpo de um texto (parágrafo), <h1> é o título. Da mesma forma que um livro tem capa (h1) e páginas (p), seu HTML também.',
    commonError: 'Erro muito comum: escrever <h1>Meu Título mas esquecer o </h1>. Sem o fechamento, o navegador não sabe onde o título termina e todo o resto vira título gigante!',
    hints: [
      'Lembre-se: toda tag HTML tem abertura <tag> e fechamento </tag>.',
      'A tag de título principal é <h1>. O texto vai entre a abertura e o fechamento.',
      'A resposta segue o padrão: <h1>seu texto aqui</h1>',
    ],
  },

  html_p: {
    technical: 'A tag <p> cria um parágrafo em HTML. É um elemento de bloco que agrupa texto em unidades lógicas. O navegador adiciona margem acima e abaixo automaticamente.',
    analogyConcrete: 'A tag <p> é como um parágrafo de um livro. Cada <p> é um bloco de texto separado, assim como cada parágrafo de um livro começa numa nova linha.',
    analogyMedia: 'A tag <p> é como uma legenda num post do Instagram. É o texto que acompanha a imagem e conta a história.',
    visual: '📝 Visualize uma página de um livro:\n\n[Título grande] ← h1\n[Bloco de texto] ← p\n[Outro bloco de texto] ← p\n\nCada <p> é um bloco separado.',
    stepByStep: 'Passo 1: Abra com <p>\nPasso 2: Escreva o texto do parágrafo\nPasso 3: Feche com </p>\nPasso 4: Para outro parágrafo, repita!',
    comparison: 'Se <h1> é o título do capítulo, <p> é o texto que conta a história. Juntos, eles formam o conteúdo da página.',
    commonError: 'Erro comum: usar <br> para separar textos em vez de <p>. Com <br> você só quebra a linha. Com <p> você cria um parágrafo semântico — o navegador e o Google entendem melhor.',
    hints: [
      'Você precisa usar duas tags: uma para título e outra para parágrafo.',
      'A tag de parágrafo é <p>. Use junto com <h1> para ter título e texto.',
      'Monte assim: <h1>Título</h1> e abaixo <p>texto</p>',
    ],
  },

  // ========== CSS ==========
  css_color: {
    technical: 'A propriedade CSS "color" define a cor do texto de um elemento. Aceita nomes de cores (blue, red), hex (#0000ff), RGB (rgb(0,0,255)), e HSL.',
    analogyConcrete: 'A propriedade "color" é como uma caneta colorida. Se você pega a caneta azul, tudo que escrever fica azul. O CSS faz o mesmo com o texto na tela.',
    analogyMedia: 'Mudar o "color" é como aplicar um filtro de cor numa foto do Instagram. O conteúdo é o mesmo, mas a aparência muda completamente.',
    visual: '🎨 color: blue → texto AZUL\n🎨 color: red → texto VERMELHO\n🎨 color: green → texto VERDE\n\nA propriedade muda APENAS a cor do texto, não do fundo.',
    stepByStep: 'Passo 1: Escolha o seletor (h1, p, body)\nPasso 2: Abra chaves { }\nPasso 3: Escreva color:\nPasso 4: Escolha a cor (blue, red, etc)\nPasso 5: Termine com ;',
    comparison: 'Assim como "font-size" muda o TAMANHO do texto, "color" muda a COR. Ambas são propriedades que afetam a aparência do texto.',
    commonError: 'Erro comum: escrever "colour" (inglês britânico) em vez de "color" (sem U). CSS usa a grafia americana. Outro erro: esquecer o ponto-e-vírgula ; no final.',
    hints: [
      'Use a propriedade "color" dentro de um seletor CSS.',
      'O formato é: seletor { color: nomedacor; }',
      'Exemplo completo: h1 { color: blue; }',
    ],
  },

  css_background: {
    technical: 'A propriedade CSS "background-color" define a cor de fundo de um elemento. Diferente de "color" (que afeta texto), "background-color" pinta a área atrás do conteúdo.',
    analogyConcrete: 'Se "color" é a cor da tinta da caneta, "background-color" é a cor do papel. Você pode ter caneta branca em papel preto — texto branco em fundo escuro.',
    analogyMedia: 'Mudar o background-color é como trocar o papel de parede do celular. O conteúdo (ícones) fica o mesmo, mas o fundo muda completamente.',
    visual: '🖼️ background-color: black + color: white =\n[████████████████]\n[██ TEXTO BRANCO █]\n[████████████████]\nFundo preto, texto branco.',
    stepByStep: 'Passo 1: Selecione o elemento (body { })\nPasso 2: Adicione background-color: black;\nPasso 3: Adicione color: white;\nPasso 4: Verifique que ambos têm ;',
    comparison: '"color" muda a cor do TEXTO. "background-color" muda a cor do FUNDO. Para um visual escuro, você precisa dos dois: fundo preto E texto branco.',
    commonError: 'Erro comum: definir background-color: black mas esquecer de mudar o color do texto. Resultado: texto preto em fundo preto = invisível! Sempre combine os dois.',
    hints: [
      'Você precisa de DUAS propriedades: uma para o fundo e outra para o texto.',
      'Use background-color para o fundo e color para o texto.',
      'Formato: body { background-color: black; color: white; }',
    ],
  },

  // ========== JavaScript ==========
  js_console: {
    technical: 'console.log() é um método JavaScript que imprime valores no console do navegador. É a ferramenta principal de debugging e output para iniciantes.',
    analogyConcrete: 'console.log() é como um alto-falante para o seu programa. Tudo que você colocar dentro dos parênteses será "falado" (exibido) para você ver.',
    analogyMedia: 'console.log() é como enviar uma mensagem no WhatsApp para si mesmo. O programa escreve uma mensagem e você pode ler na tela.',
    visual: '📢 console.log("Oi") → tela mostra: Oi\n📢 console.log(42) → tela mostra: 42\n📢 console.log("A"+"B") → tela mostra: AB',
    stepByStep: 'Passo 1: Escreva console.log(\nPasso 2: Dentro dos parênteses, coloque o texto entre aspas: "Hello JS"\nPasso 3: Feche os parênteses: )\nPasso 4: Termine com ;',
    comparison: 'Se uma variável GUARDA dados, console.log() MOSTRA dados. Um é o armazém, o outro é a vitrine.',
    commonError: 'Erros comuns:\n1. Esquecer as aspas: console.log(Hello) ← erro! Deve ser console.log("Hello")\n2. Escrever Console.log (C maiúsculo) ← JavaScript diferencia maiúsculas.',
    hints: [
      'Use console.log() com aspas ao redor do texto.',
      'O formato é: console.log("seu texto aqui");',
      'A resposta é: console.log("Hello JS");',
    ],
  },

  js_variable: {
    technical: 'Uma variável é um espaço nomeado na memória que armazena um valor. Em JavaScript, declaramos com "let" (mutável), "const" (imutável), ou "var" (legado).',
    analogyConcrete: 'Uma variável é como uma caixa etiquetada. A etiqueta é o nome (let cidade), e dentro da caixa está o conteúdo ("São Paulo"). Você pode abrir e trocar o conteúdo.',
    analogyMedia: 'Uma variável é como uma pasta no Google Drive. Tem um nome, e dentro tem um arquivo. Você pode renomear a pasta e trocar o arquivo.',
    visual: '📦 let cidade = "São Paulo"\n     ↑      ↑        ↑\n   caixa  nome    conteúdo\n\nDepois: console.log(cidade) → mostra "São Paulo"',
    stepByStep: 'Passo 1: Escreva "let" (cria a caixa)\nPasso 2: Dê um nome: cidade\nPasso 3: Use = para colocar o valor\nPasso 4: Escreva o valor entre aspas: "São Paulo"\nPasso 5: console.log(cidade) para ver o conteúdo',
    comparison: 'Se console.log() é o alto-falante, a variável é a partitura. Primeiro você escreve (let x = "algo"), depois o alto-falante lê (console.log(x)).',
    commonError: 'Erro comum: usar console.log("cidade") com aspas → isso mostra o TEXTO "cidade". Sem aspas: console.log(cidade) mostra o VALOR da variável.',
    hints: [
      'Declare a variável com "let" e dê um nome a ela.',
      'Use o formato: let nomeDaVariavel = "valor";',
      'Depois use console.log(nomeDaVariavel) para exibir o valor.',
    ],
  },

  // ========== Java ==========
  java_print: {
    technical: 'System.out.println() é o método padrão Java para imprimir texto no console. "out" é o stream de saída, "println" adiciona quebra de linha automaticamente.',
    analogyConcrete: 'System.out.println() é como um megafone conectado ao computador. Tudo que você escrever dentro será anunciado na tela.',
    analogyMedia: 'System.out.println() é como o subtítulo de um filme. O programa "fala" e a legendas aparece na tela para você ler.',
    visual: '📺 System.out.println("Start!") → tela mostra: Start!\n📺 System.out.println("Olá") → tela mostra: Olá',
    stepByStep: 'Passo 1: Dentro do main, escreva System.out.println(\nPasso 2: Coloque o texto entre aspas: "Start!"\nPasso 3: Feche: );\nPasso 4: O texto aparece no console ao executar.',
    comparison: 'Em JavaScript: console.log("Oi")\nEm Java: System.out.println("Oi")\nMesma ideia, sintaxe diferente. Java é mais verboso.',
    commonError: 'Erros comuns:\n1. Escrever system (s minúsculo) ← deve ser System\n2. Esquecer o ponto-e-vírgula no final\n3. Usar aspas simples em vez de duplas.',
    hints: [
      'Use System.out.println() dentro do método main.',
      'O texto deve estar entre aspas duplas dentro dos parênteses.',
      'Formato: System.out.println("Start!");',
    ],
  },

  java_variable: {
    technical: 'Em Java, variáveis têm tipo explícito. "String nome" declara uma variável do tipo String chamada "nome". Java é uma linguagem fortemente tipada.',
    analogyConcrete: 'Uma variável Java é como uma pasta com etiqueta de tipo. Uma pasta "String" só aceita texto, uma pasta "int" só aceita números inteiros.',
    analogyMedia: 'Declarar "String nome" é como criar uma coluna numa planilha do Excel com o título "nome" e tipo "texto".',
    visual: '📋 String nome = "Alice";\n   ↑      ↑        ↑\n  tipo   nome    valor\n\nSystem.out.println(nome) → Alice',
    stepByStep: 'Passo 1: Escreva o tipo: String\nPasso 2: Dê um nome: nome\nPasso 3: Use = para atribuir\nPasso 4: Coloque o valor entre aspas: "Alice"\nPasso 5: Termine com ;',
    comparison: 'Em JavaScript: let nome = "Alice" (tipo automático)\nEm Java: String nome = "Alice" (tipo explícito)\nJava exige que você diga O QUE vai na caixa.',
    commonError: 'Erro comum: escrever "string" com s minúsculo. Em Java, tipos começam com maiúscula: String, Int não existe (use int para números), Boolean.',
    hints: [
      'Declare a variável com tipo String e use System.out.println() para exibi-la.',
      'O formato é: String nomeVar = "valor";',
      'Depois imprima: System.out.println(nomeVar);',
    ],
  },

  // ========== Generic Fallbacks ==========
  html_generic: {
    technical: 'HTML usa tags para dar estrutura e significado ao conteúdo de uma página web.',
    analogyConcrete: 'Tags HTML são como etiquetas em caixas — dizem ao navegador o que cada parte do conteúdo é.',
    analogyMedia: 'HTML é como o roteiro de um filme — define a estrutura, enquanto CSS é a direção de arte.',
    visual: '📄 <tag>conteúdo</tag> — toda tag tem abertura e fechamento.',
    stepByStep: '1. Abra com <tag>\n2. Escreva o conteúdo\n3. Feche com </tag>',
    comparison: 'HTML estrutura (esqueleto) + CSS aparência (pele) + JS comportamento (cérebro).',
    commonError: 'O erro mais básico em HTML é esquecer de fechar as tags. Toda <tag> precisa de uma </tag>.',
    hints: ['Verifique se suas tags estão abertas e fechadas.', 'Cada tag tem o formato <tag>conteúdo</tag>.', 'Não esqueça a barra / na tag de fechamento.'],
  },

  css_generic: {
    technical: 'CSS define a aparência visual dos elementos HTML usando propriedades e valores.',
    analogyConcrete: 'CSS é como a tinta e a decoração de uma casa — o HTML é a estrutura, CSS é o visual.',
    analogyMedia: 'CSS é como um filtro do Instagram — muda a aparência sem mudar o conteúdo.',
    visual: 'seletor { propriedade: valor; } — é sempre nesse formato.',
    stepByStep: '1. Escolha o seletor\n2. Abra chaves { }\n3. Escreva propriedade: valor;\n4. Feche }',
    comparison: 'CSS é para aparência, HTML é para estrutura. Um sem o outro funciona, mas juntos são poderosos.',
    commonError: 'Erros comuns em CSS: esquecer o ; depois do valor e esquecer de fechar as chaves }.',
    hints: ['Use o formato: seletor { propriedade: valor; }', 'Não esqueça o ponto-e-vírgula.', 'Propriedades comuns: color, background-color, font-size.'],
  },

  javascript_generic: {
    technical: 'JavaScript é uma linguagem de programação que adiciona interatividade às páginas web.',
    analogyConcrete: 'Se HTML é o esqueleto e CSS é a pele, JavaScript é o cérebro — faz as coisas acontecerem.',
    analogyMedia: 'JavaScript é como os efeitos especiais de um filme — traz movimento e interação.',
    visual: 'let x = 10;\nconsole.log(x); → mostra 10',
    stepByStep: '1. Declare variáveis com let\n2. Escreva lógica\n3. Use console.log() para ver resultados',
    comparison: 'JavaScript roda no navegador (como um app). Python roda no servidor. Ambos fazem lógica.',
    commonError: 'Erro comum: confundir = (atribuição) com === (comparação). let x = 5 DEFINE. x === 5 COMPARA.',
    hints: ['Revise a sintaxe JavaScript.', 'Use console.log() para ver o que seu código está fazendo.', 'Variáveis são declaradas com let.'],
  },

  java_generic: {
    technical: 'Java é uma linguagem orientada a objetos fortemente tipada. Todo código fica dentro de classes.',
    analogyConcrete: 'Java é como uma fábrica com regras rígidas — tudo tem seu lugar e tipo definido.',
    analogyMedia: 'Java é como uma receita de restaurante — cada ingrediente tem medida exata (tipos).',
    visual: 'public class Main {\n  public static void main(String[] args) {\n    // seu código aqui\n  }\n}',
    stepByStep: '1. Crie a classe: public class Main\n2. Crie o main: public static void main(String[] args)\n3. Escreva seu código dentro do main',
    comparison: 'Java vs JavaScript: nomes parecidos, mas são bem diferentes. Java é compilado e tipado. JS é interpretado.',
    commonError: 'Erro comum: esquecer o public static void main — sem ele, o Java não sabe por onde começar.',
    hints: ['Todo código Java precisa estar dentro do método main.', 'Verifique se a classe e o arquivo têm o mesmo nome.', 'Use System.out.println() para output.'],
  },
};

/**
 * Maps a lesson concept (from seed data) to a strategy template key.
 * Uses the lesson language and title to determine the concept key.
 */
export function lessonToConceptKey(language: string, title: string): string {
  const lower = title.toLowerCase();

  if (language === 'html') {
    if (lower.includes('tag') || lower.includes('h1') || lower.includes('base')) return 'html_h1';
    if (lower.includes('parág') || lower.includes('estrutura')) return 'html_p';
    return 'html_generic';
  }

  if (language === 'css') {
    if (lower.includes('cor') || lower.includes('injetando')) return 'css_color';
    if (lower.includes('fundo') || lower.includes('pintando')) return 'css_background';
    return 'css_generic';
  }

  if (language === 'javascript') {
    if (lower.includes('comunicando') || lower.includes('console') || lower.includes('js')) return 'js_console';
    if (lower.includes('variáve') || lower.includes('caixa') || lower.includes('memória')) return 'js_variable';
    return 'javascript_generic';
  }

  if (language === 'java') {
    if (lower.includes('primeiro') || lower.includes('print') || lower.includes('start')) return 'java_print';
    if (lower.includes('variáve') || lower.includes('caixa') || lower.includes('memória')) return 'java_variable';
    return 'java_generic';
  }

  return `${language}_generic`;
}
