// ============================================================
// NAIS — Personalization Engine
// Interest-based content personalization
// "A personalização deve ocorrer sem alterar o conceito ensinado."
// ============================================================

import type { SpecialInterest } from './learnerModel';

// === Interest Context ===

export interface InterestContext {
  interest: SpecialInterest;

  // Example substitutions per domain
  exampleTitle: string;
  exampleContent: string;
  exampleVariable: string;
  exampleValue: string;
  exampleClassName: string;

  // Concept-specific analogies
  analogies: Record<string, string>;
}

// === Interest Database ===

export const INTEREST_CONTEXTS: Record<SpecialInterest, InterestContext> = {
  pokemon: {
    interest: 'pokemon',
    exampleTitle: 'Pokédex',
    exampleContent: 'Time Pokémon do Ash',
    exampleVariable: 'pokemonNome',
    exampleValue: 'Pikachu',
    exampleClassName: 'Treinador',
    analogies: {
      html_h1: 'A tag <h1> é como o nome do Pokémon no topo da Pokédex — grande e impossível de ignorar.',
      html_p: 'A tag <p> é como a descrição do Pokémon na Pokédex — o texto que explica suas habilidades.',
      css_color: 'Mudar a cor do texto é como escolher o tipo do Pokémon — fogo é vermelho, água é azul.',
      css_background: 'O background-color é como o campo de batalha — define o cenário do combate.',
      js_console: 'console.log() é como o Pokédex anunciando o nome do Pokémon em voz alta.',
      js_variable: 'Uma variável é como uma Pokébola — guarda um Pokémon (valor) dentro, e tem um nome.',
      java_print: 'System.out.println() é como o narrador da Liga Pokémon anunciando o vencedor.',
      java_variable: 'Uma variável String é como a ficha de um Pokémon — guarda o nome dele.',
    },
  },

  futebol: {
    interest: 'futebol',
    exampleTitle: 'Escalação do Time',
    exampleContent: 'Seleção dos Sonhos',
    exampleVariable: 'nomeJogador',
    exampleValue: 'Neymar',
    exampleClassName: 'Jogador',
    analogies: {
      html_h1: 'A tag <h1> é como o nome do time no placar do estádio — grande e destaque.',
      html_p: 'A tag <p> é como a narração do jogo — conta o que está acontecendo.',
      css_color: 'Mudar a cor é como escolher a cor da camisa do time.',
      css_background: 'O background-color é como a cor do gramado — define o cenário.',
      js_console: 'console.log() é como o narrador gritando GOOOL na TV.',
      js_variable: 'Uma variável é como a posição de um jogador — pode mudar de atacante para meia.',
      java_print: 'System.out.println() é como o placar eletrônico mostrando o resultado.',
      java_variable: 'Uma variável String é como a camisa do jogador — tem o nome estampado.',
    },
  },

  astronomia: {
    interest: 'astronomia',
    exampleTitle: 'Exploração de Marte',
    exampleContent: 'Missão Espacial 2030',
    exampleVariable: 'planetaNome',
    exampleValue: 'Marte',
    exampleClassName: 'Planeta',
    analogies: {
      html_h1: 'A tag <h1> é como o nome da missão no painel de controle da NASA.',
      html_p: 'A tag <p> é como o relatório de missão — descreve o que os astronautas encontraram.',
      css_color: 'Mudar a cor é como ver Marte vermelho vs Terra azul — cada planeta tem sua cor.',
      css_background: 'O background-color é como o espaço profundo — preto infinito.',
      js_console: 'console.log() é como o rádio da nave enviando uma mensagem para a Terra.',
      js_variable: 'Uma variável é como as coordenadas de um planeta — armazena uma posição que muda.',
      java_print: 'System.out.println() é como o computador de bordo exibindo dados na tela.',
      java_variable: 'Uma variável String é como o registro de um planeta — guarda seu nome.',
    },
  },

  carros: {
    interest: 'carros',
    exampleTitle: 'Garagem dos Sonhos',
    exampleContent: 'Coleção de Carros',
    exampleVariable: 'modeloCarro',
    exampleValue: 'Ferrari',
    exampleClassName: 'Carro',
    analogies: {
      html_h1: 'A tag <h1> é como a marca do carro no capô — grande e visível.',
      html_p: 'A tag <p> é como as especificações técnicas do carro — motor, potência, velocidade.',
      css_color: 'Mudar a cor é como pintar o carro — vermelho Ferrari, azul BMW.',
      css_background: 'O background-color é como o asfalto da pista — define o cenário.',
      js_console: 'console.log() é como o velocímetro mostrando a velocidade na tela.',
      js_variable: 'Uma variável é como o tanque de gasolina — armazena um valor que pode mudar.',
      java_print: 'System.out.println() é como o painel do carro exibindo informações.',
      java_variable: 'Uma variável String é como a placa do carro — identifica com um nome.',
    },
  },

  anime: {
    interest: 'anime',
    exampleTitle: 'Lista de Animes',
    exampleContent: 'Meus Animes Favoritos',
    exampleVariable: 'nomePersonagem',
    exampleValue: 'Naruto',
    exampleClassName: 'Personagem',
    analogies: {
      html_h1: 'A tag <h1> é como o título do anime que aparece na abertura — grande e marcante.',
      html_p: 'A tag <p> é como a sinopse do episódio — conta o que vai acontecer.',
      css_color: 'Mudar a cor é como a transformação do personagem — Super Saiyajin fica dourado.',
      css_background: 'O background-color é como o cenário do anime — vila da folha, escola, espaço.',
      js_console: 'console.log() é como o personagem gritando o nome do golpe em voz alta.',
      js_variable: 'Uma variável é como o chakra do Naruto — armazena energia que pode ser usada.',
      java_print: 'System.out.println() é como a legenda do anime mostrando o que o personagem disse.',
      java_variable: 'Uma variável String é como o nome de um jutsu — guarda o texto.',
    },
  },

  tecnologia: {
    interest: 'tecnologia',
    exampleTitle: 'Meu App',
    exampleContent: 'Projeto Tech Inovador',
    exampleVariable: 'nomeApp',
    exampleValue: 'NeuroCode',
    exampleClassName: 'App',
    analogies: {
      html_h1: 'A tag <h1> é como o nome do app na App Store — a primeira coisa que o usuário vê.',
      html_p: 'A tag <p> é como a descrição do app — explica o que ele faz.',
      css_color: 'Mudar a cor é como personalizar o tema do seu app — modo escuro, modo claro.',
      css_background: 'O background-color é como a cor de fundo do app — define a atmosfera.',
      js_console: 'console.log() é como uma notificação push — mostra uma mensagem para você.',
      js_variable: 'Uma variável é como a memória RAM — armazena dados temporariamente.',
      java_print: 'System.out.println() é como o terminal do programador exibindo resultados.',
      java_variable: 'Uma variável String é como um campo de texto num formulário — guarda o input.',
    },
  },

  musica: {
    interest: 'musica',
    exampleTitle: 'Minha Playlist',
    exampleContent: 'Top Músicas do Ano',
    exampleVariable: 'nomeMusica',
    exampleValue: 'Bohemian Rhapsody',
    exampleClassName: 'Musica',
    analogies: {
      html_h1: 'A tag <h1> é como o nome da música que aparece na tela — grande e destaque.',
      html_p: 'A tag <p> é como a letra da música — o conteúdo principal.',
      css_color: 'Mudar a cor é como mudar o mood da playlist — azul para relaxar, vermelho para agitar.',
      css_background: 'O background-color é como a iluminação do palco — define o clima do show.',
      js_console: 'console.log() é como a caixa de som tocando a música — emite som (dados).',
      js_variable: 'Uma variável é como um setlist — armazena a música atual que está tocando.',
      java_print: 'System.out.println() é como o display do amplificador mostrando a faixa.',
      java_variable: 'Uma variável String é como o título da música salvo na biblioteca.',
    },
  },

  trens: {
    interest: 'trens',
    exampleTitle: 'Estação Central',
    exampleContent: 'Horários dos Trens',
    exampleVariable: 'nomeLinha',
    exampleValue: 'Expresso Orient',
    exampleClassName: 'Trem',
    analogies: {
      html_h1: 'A tag <h1> é como o letreiro da estação de trem — grande e visível a distância.',
      html_p: 'A tag <p> é como o quadro de horários — informações organizadas.',
      css_color: 'Mudar a cor é como a pintura dos vagões — cada linha tem sua cor.',
      css_background: 'O background-color é como a plataforma da estação — o chão que sustenta tudo.',
      js_console: 'console.log() é como o alto-falante da estação anunciando o próximo trem.',
      js_variable: 'Uma variável é como um trilho — direciona o trem (dado) para um destino.',
      java_print: 'System.out.println() é como o painel eletrônico de partidas exibindo o destino.',
      java_variable: 'Uma variável String é como a etiqueta do vagão — identifica a linha.',
    },
  },

  culinaria: {
    interest: 'culinaria',
    exampleTitle: 'Livro de Receitas',
    exampleContent: 'Receita do Chef',
    exampleVariable: 'nomeReceita',
    exampleValue: 'Bolo de Chocolate',
    exampleClassName: 'Receita',
    analogies: {
      html_h1: 'A tag <h1> é como o nome da receita no topo da página — o prato principal.',
      html_p: 'A tag <p> é como o modo de preparo — as instruções passo a passo.',
      css_color: 'Mudar a cor é como escolher o ingrediente — chocolate é marrom, morango é vermelho.',
      css_background: 'O background-color é como a bancada da cozinha — o espaço de trabalho.',
      js_console: 'console.log() é como provar o prato e dizer se ficou bom.',
      js_variable: 'Uma variável é como um pote na bancada — guarda um ingrediente com uma etiqueta.',
      java_print: 'System.out.println() é como a ficha do pedido saindo na cozinha.',
      java_variable: 'Uma variável String é como o nome do ingrediente escrito na etiqueta.',
    },
  },

  jogos: {
    interest: 'jogos',
    exampleTitle: 'Score Board',
    exampleContent: 'Ranking dos Jogadores',
    exampleVariable: 'nomeHeroi',
    exampleValue: 'Link',
    exampleClassName: 'Personagem',
    analogies: {
      html_h1: 'A tag <h1> é como o título do jogo na tela de início — GAME START!',
      html_p: 'A tag <p> é como a caixa de diálogo do NPC — mostra o texto da história.',
      css_color: 'Mudar a cor é como trocar a skin do personagem.',
      css_background: 'O background-color é como o mapa do jogo — define o cenário da fase.',
      js_console: 'console.log() é como o chat do jogo — mostra mensagens na tela.',
      js_variable: 'Uma variável é como o inventário — guarda um item com um nome.',
      java_print: 'System.out.println() é como o HUD do jogo exibindo seus pontos.',
      java_variable: 'Uma variável String é como o save game — armazena o nome do jogador.',
    },
  },

  filmes: {
    interest: 'filmes',
    exampleTitle: 'Minha Filmoteca',
    exampleContent: 'Top 10 Filmes',
    exampleVariable: 'nomeFilme',
    exampleValue: 'Interestelar',
    exampleClassName: 'Filme',
    analogies: {
      html_h1: 'A tag <h1> é como o título do filme no cartaz do cinema — grande e chamativo.',
      html_p: 'A tag <p> é como a sinopse — conta do que o filme trata.',
      css_color: 'Mudar a cor é como o filtro de cor do diretor — azul para sci-fi, quente para drama.',
      css_background: 'O background-color é como o cenário do filme — define a atmosfera.',
      js_console: 'console.log() é como a narração do filme — conta o que está acontecendo.',
      js_variable: 'Uma variável é como o roteiro — guarda a fala do personagem.',
      java_print: 'System.out.println() é como as legendas do filme — exibem o texto na tela.',
      java_variable: 'Uma variável String é como o nome do personagem escrito no roteiro.',
    },
  },

  natureza: {
    interest: 'natureza',
    exampleTitle: 'Guia da Floresta',
    exampleContent: 'Espécies da Amazônia',
    exampleVariable: 'nomeAnimal',
    exampleValue: 'Arara-azul',
    exampleClassName: 'Animal',
    analogies: {
      html_h1: 'A tag <h1> é como a placa na entrada do parque — identifica o lugar.',
      html_p: 'A tag <p> é como a descrição da espécie no guia — conta as características.',
      css_color: 'Mudar a cor é como as cores da natureza — verde da floresta, azul do oceano.',
      css_background: 'O background-color é como o habitat — floresta, oceano, deserto.',
      js_console: 'console.log() é como o canto de um pássaro — emite um som (dado) para o mundo.',
      js_variable: 'Uma variável é como um ninho — guarda algo precioso (valor) em segurança.',
      java_print: 'System.out.println() é como a ficha técnica do animal no zoológico.',
      java_variable: 'Uma variável String é como a placa com o nome da espécie.',
    },
  },
};

// === Personalization Functions ===

/**
 * Gets the best analogy for a concept based on the learner's interests.
 * Falls back to the first interest, then to a generic message.
 */
export function getPersonalizedAnalogy(
  conceptKey: string,
  interests: SpecialInterest[],
): string | null {
  for (const interest of interests) {
    const ctx = INTEREST_CONTEXTS[interest];
    // Look for exact concept key or partial match
    const analogy = ctx.analogies[conceptKey];
    if (analogy) return analogy;

    // Try partial match (e.g. "html_h1_tag" → "html_h1")
    const partialKey = Object.keys(ctx.analogies).find(k => conceptKey.startsWith(k));
    if (partialKey) return ctx.analogies[partialKey];
  }
  return null;
}

/**
 * Personalizes a challenge instruction by substituting generic content
 * with interest-based content.
 */
export function personalizeChallenge(
  instruction: string,
  interests: SpecialInterest[],
): string {
  if (interests.length === 0) return instruction;

  const ctx = INTEREST_CONTEXTS[interests[0]];

  // Replace common generic terms with interest-based ones
  let personalized = instruction;
  personalized = personalized.replace(/[""]Bem-vindo[""]|"Bem-vindo"/g, `"${ctx.exampleTitle}"`);
  personalized = personalized.replace(/[""]Olá[""]|"Olá"/g, `"${ctx.exampleContent}"`);
  personalized = personalized.replace(/[""]Hello[""]|"Hello"/g, `"${ctx.exampleValue}"`);

  return personalized;
}

/**
 * Generates personalized code template for a lesson.
 */
export function personalizeCodeTemplate(
  template: string,
  language: string,
  interests: SpecialInterest[],
): string {
  if (interests.length === 0) return template;

  const ctx = INTEREST_CONTEXTS[interests[0]];

  let personalized = template;

  // Substitute variable names and values
  personalized = personalized.replace(/nome|name/gi, ctx.exampleVariable);
  personalized = personalized.replace(/"Alice"|"Bob"|"Bem-vindo"/g, `"${ctx.exampleValue}"`);

  return personalized;
}

/**
 * Gets the primary InterestContext for a learner.
 * Returns null if no interests are set.
 */
export function getPrimaryInterestContext(
  interests: SpecialInterest[],
): InterestContext | null {
  if (interests.length === 0) return null;
  return INTEREST_CONTEXTS[interests[0]];
}
