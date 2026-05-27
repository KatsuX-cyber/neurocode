# Guia de Finalização: Plataforma NeuroCode

Este guia foi criado a partir da análise detalhada do plano de implementação atual e do código-fonte (especialmente a estrutura do `Dashboard.tsx`, `Lesson.tsx` e integrações). 

## 1. Estado Atual do Projeto (Onde estamos)
- **Fase 1, 2 e 3 (Concluídas)**: A fundação com React, Vite, Tailwind, Zustand e Monaco Editor está excelente. O Backend com Node e Prisma também já serve as rotas básicas.
- **Integração Parcial**: O `Dashboard.tsx` já busca os cursos na rota `http://localhost:3001/api/courses`.
- **Lições (Lesson.tsx)**: Atualmente a validação do código está sendo feita de forma "mockada" (simulada) no próprio frontend interceptando o `console.log`. Além disso, a lição está estática (`mockLesson`).

## 2. O Que Falta Implementar (Próximos Passos)

Para finalizar a **Fase 4** e a **Fase 5** (Gamificação e Validação Real), você precisará seguir estas etapas:

### Passo A: Validação e Progresso no Backend
1. **Atualizar Prisma Schema**: Certificar-se de que o esquema no `backend/prisma/schema.prisma` tem os campos de progresso por usuário (Ex: tabela `Progress` com `userId`, `lessonId`, `completed`, `code`).
2. **Rota de Validação**: Criar uma rota POST no backend (ex: `/api/lessons/:id/validate`) que recebe o código do usuário.
3. **Execução Segura**: Substituir o `new Function(code)` do frontend por uma validação no backend. (Para o MVP inicial, você pode usar uma API pública como a [Piston API](https://github.com/engineer-man/piston) ou apenas validar a string e o output via regex simples no backend do Node).
4. **Salvar Progresso**: Se o código passar, o backend deve salvar o XP ganho e atualizar o progresso daquele usuário no banco de dados.

### Passo B: Conectar o Frontend com o Backend Real
1. No arquivo `Lesson.tsx`, remover a variável `mockLesson` e fazer um `fetch` (`GET /api/lessons/:id`) para pegar o título, texto e desafio reais do banco.
2. Ao clicar em "Executar Código", enviar o conteúdo do Monaco Editor via `POST` para o backend e aguardar a resposta (Sucesso ou Erro).
3. Atualizar o `Dashboard.tsx` para exibir a barra de progresso baseada nos dados reais que vem do banco de dados (que hoje está estático no index 0).

### Passo C: Gamificação e Refinamentos (Fase 5)
1. Criar um componente global de **Streak** (chamas de dias seguidos) no cabeçalho.
2. Adicionar os sons opcionais (acessibilidade auditiva ao completar um desafio com sucesso).
3. Revisar todo o modo "Dark/Neon" para garantir contraste perfeito.

---

## 3. O "Prompt Mágico" para continuar amanhã

Quando o seu limite diário resetar ou você for usar outra inteligência artificial, copie exatamente o texto abaixo e envie para a IA. Ele tem todo o contexto necessário para que ela faça o trabalho por você sem que você precise explicar tudo de novo.

***

**Copie a partir daqui 👇**

> Olá! Estou construindo a plataforma "NeuroCode", um sistema de ensino de programação gamificado e inclusivo (voltado a pessoas neurodivergentes). O projeto usa React, Vite, Tailwind, Zustand, Monaco Editor no Frontend, e Node, Express, Prisma (PostgreSQL ou SQLite) no Backend.
> 
> **Contexto de onde parei:**
> As Fases de 1 a 3 do meu plano de implementação já estão prontas. O `Dashboard.tsx` e o `Lesson.tsx` já estão com uma interface linda e fluida. No entanto, o `Lesson.tsx` ainda usa dados estáticos (`mockLesson`) e avalia o código Javascript usando `eval` / `new Function()` diretamente no navegador.
> 
> **Seu Objetivo (Sua Task):**
> 1. Modificar o backend (rotas e controllers) para buscar os dados de uma Lição específica a partir do banco de dados Prisma e retornar para o Frontend.
> 2. Criar uma rota de validação de código no backend que recebe o `code` do usuário, executa a verificação, retorna o feedback (console output e status de aprovação) e salva o progresso do usuário no banco (atualizando XP e aulas concluídas).
> 3. Modificar o arquivo `frontend/src/pages/Lesson.tsx` para consumir essa API: remover o Mock, carregar a lição via `fetch` do banco de dados e chamar a rota de validação ao invés de rodar o código localmente.
> 
> Por favor, analise a pasta raiz do meu projeto e faça essas alterações para concluirmos a integração real entre Frontend e Backend de execução de código. Entregue os códigos e me diga quais comandos rodar se for preciso atualizar o banco (como `npx prisma db push`).

**👆 Até aqui**
