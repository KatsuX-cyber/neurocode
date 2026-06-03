# NeuroCode — AI Context

> Documento de contexto completo do projeto para assistentes de IA.
> Última atualização: 2026-05-28

---

## 1. Visão Geral

**NeuroCode** é uma plataforma neuroadaptativa de aprendizado de programação, projetada para mentes neurotípicas e neuroatípicas (TDAH, autismo, dislexia, ansiedade). Não possui professores humanos — todo o aprendizado acontece via conteúdo estruturado, exercícios interativos, feedback automático inteligente e sistemas adaptativos que se ajustam ao perfil cognitivo do aluno.

**Repositório:** `KatsuX-cyber/neurocode`
**Autor:** KatsuX-cyber (Pablo)

---

## 2. Stack Tecnológica

| Camada              | Tecnologia                                              |
| ------------------- | ------------------------------------------------------- |
| **Frontend**        | React 19, TypeScript 6, Vite 8                          |
| **Estilização**     | Tailwind CSS 4 (via `@tailwindcss/vite`) + CSS customizado com variáveis cognitivas |
| **Animações**       | Framer Motion 12                                        |
| **Ícones**          | Lucide React                                            |
| **Editor de código**| Monaco Editor (`@monaco-editor/react`)                  |
| **Roteamento**      | React Router DOM 7                                      |
| **Estado global**   | Zustand 5 com middleware `persist` (localStorage)       |
| **Backend**         | Node.js, Express 5, TypeScript 6                        |
| **ORM**             | Prisma 6                                                |
| **Banco de dados**  | SQLite (arquivo `dev.db`)                               |
| **Autenticação**    | bcryptjs + jsonwebtoken (JWT, 7 dias de expiração)      |
| **Execução de código** | `vm` (Node.js sandbox) para JS; Piston API externa para Java |
| **Monorepo**        | `concurrently` (roda frontend + backend em paralelo)    |

---

## 3. Estrutura de Diretórios

```
neurocode/
├── package.json                    # Scripts de orquestração (dev, install:all, build:all)
├── README.md                       # Documentação principal do projeto
├── metodologia_educacional_completa.md  # Documento científico com toda a metodologia
├── guia_de_finalizacao.md          # Checklist de tarefas para finalização
├── plano de implementaçao prog neurodivergente  # Plano original de implementação
│
├── frontend/                       # Aplicação React + Vite
│   ├── index.html                  # Entry HTML
│   ├── vite.config.ts              # Plugins: react() + tailwindcss()
│   ├── package.json                # Dependências do frontend
│   ├── tsconfig.json               # Config TypeScript
│   └── src/
│       ├── main.tsx                # Entry point React (ReactDOM.createRoot)
│       ├── App.tsx                 # Router principal (BrowserRouter)
│       ├── App.css                 # Estilos adicionais do App
│       ├── index.css               # Design system: temas, modos cognitivos, animações
│       ├── types.ts                # Tipos TypeScript compartilhados
│       │
│       ├── components/
│       │   ├── Layout.tsx          # Shell da aplicação: sidebar + header + focus mode
│       │   ├── lesson/
│       │   │   ├── BlockRenderer.tsx    # Renderiza blocos ARPERC (hook/explain/practice/checkpoint/reward)
│       │   │   ├── CodeEditor.tsx       # Editor Monaco integrado
│       │   │   ├── HintSystem.tsx       # Sistema de dicas progressivas (3 níveis)
│       │   │   ├── LessonComplete.tsx   # Tela de conclusão de lição
│       │   │   ├── OutputPanel.tsx      # Painel de saída/resultado do código
│       │   │   └── ProgressBar.tsx      # Barra de progresso da lição
│       │   └── settings/
│       │       └── CognitiveSettings.tsx  # Configurações de perfil cognitivo
│       │
│       ├── engine/
│       │   ├── adaptiveEngine.ts   # Motor NEXUS: classificação de estado, fadiga, dificuldade, XP
│       │   └── feedbackEngine.ts   # Gerador de feedback contextual e psicologicamente seguro
│       │
│       ├── pages/
│       │   ├── Dashboard.tsx       # Painel principal com progresso, XP, streak, cursos
│       │   ├── Courses.tsx         # Catálogo de cursos e módulos
│       │   ├── Lesson.tsx          # Experiência de aula ARPERC completa
│       │   └── Profile.tsx         # Perfil do usuário e configurações cognitivas
│       │
│       └── store/
│           └── useAppStore.ts      # Zustand store com persistência
│
├── backend/                        # API REST Node.js + Express
│   ├── .env                        # DATABASE_URL (sqlite)
│   ├── package.json                # Dependências do backend
│   ├── tsconfig.json               # Config TypeScript
│   ├── prisma.config.ts            # Config Prisma
│   ├── seedLesson.ts               # Seed de lição individual
│   ├── prisma/
│   │   ├── schema.prisma           # Modelos: User, Course, Module, Lesson, Progress
│   │   ├── seed.ts                 # Seed básico
│   │   └── dev.db                  # Banco SQLite de desenvolvimento
│   └── src/
│       ├── index.ts                # Entry point Express (porta 3001)
│       ├── controllers/
│       │   ├── authController.ts   # Register + Login (bcrypt + JWT)
│       │   └── courseController.ts  # CRUD cursos, lições, validação de código
│       ├── routes/
│       │   ├── auth.ts             # POST /api/auth/register, POST /api/auth/login
│       │   └── courses.ts          # GET /api/courses, GET /api/courses/lesson/:id, POST validate, POST progress
│       ├── seedAllCourses.ts       # Seed completo de todos os cursos (HTML, CSS, JS, Java)
│       ├── seedJavaCourse.ts       # Seed específico do curso Java
│       └── seedLanguages.ts        # Seed de linguagens
│
├── services/                       # (vazio — reservado para microserviços futuros)
└── docs/                           # (vazio — reservado para documentação adicional)
```

---

## 4. Modelo de Dados (Prisma)

```
User ──< Progress >── Lesson
                        │
                      Module
                        │
                      Course
```

### User
| Campo      | Tipo     | Descrição                           |
|------------|----------|-------------------------------------|
| id         | String   | UUID, PK                            |
| name       | String   | Nome do usuário                     |
| email      | String   | Unique, login                       |
| password   | String   | Hash bcrypt                         |
| role       | String   | "STUDENT" \| "ADMIN"                |
| xp         | Int      | Pontos de experiência acumulados    |
| streak     | Int      | Dias consecutivos de estudo         |

### Course
| Campo       | Tipo     | Descrição                          |
|-------------|----------|------------------------------------|
| id          | String   | UUID, PK                           |
| title       | String   | Nome do curso (ex: "JavaScript")   |
| description | String   | Descrição do curso                 |
| level       | String   | "BASIC" \| "INTERMEDIATE" \| "ADVANCED" |
| order       | Int      | Ordem de exibição                  |

### Module
| Campo       | Tipo     | Descrição                          |
|-------------|----------|------------------------------------|
| id          | String   | UUID, PK                           |
| title       | String   | Nome do módulo                     |
| description | String   | Descrição do módulo                |
| courseId     | String   | FK → Course                        |
| order       | Int      | Ordem dentro do curso              |

### Lesson
| Campo           | Tipo    | Descrição                                        |
|-----------------|---------|--------------------------------------------------|
| id              | String  | UUID, PK                                         |
| title           | String  | Título da lição                                  |
| language        | String  | "javascript" \| "html" \| "css" \| "java"        |
| content         | String  | JSON stringificado com blocos ARPERC (LessonContentV2) |
| codeTemplate    | String? | Código inicial no editor                         |
| validationLogic | String? | Função JS para validar o código do aluno         |
| moduleId        | String  | FK → Module                                      |
| order           | Int     | Ordem dentro do módulo                           |

### Progress
| Campo       | Tipo      | Descrição                              |
|-------------|-----------|----------------------------------------|
| id          | String    | UUID, PK                               |
| userId      | String    | FK → User                              |
| lessonId    | String    | FK → Lesson                            |
| status      | String    | "IN_PROGRESS" \| "COMPLETED"           |
| savedCode   | String?   | Código salvo pelo aluno                |
| completedAt | DateTime? | Data de conclusão                      |
| @@unique    |           | (userId, lessonId) — um progresso por lição por aluno |

---

## 5. API REST — Endpoints

### Autenticação (`/api/auth`)
| Método | Rota       | Descrição                                 | Body                           |
|--------|------------|-------------------------------------------|--------------------------------|
| POST   | /register  | Cria novo usuário, retorna JWT            | `{ name, email, password }`    |
| POST   | /login     | Autentica usuário, retorna JWT            | `{ email, password }`          |

### Cursos (`/api/courses`)
| Método | Rota                    | Descrição                                           | Body                                    |
|--------|-------------------------|-----------------------------------------------------|-----------------------------------------|
| GET    | /                       | Lista todos os cursos com módulos e lições (nested)  | —                                       |
| GET    | /lesson/:id             | Retorna lição + nextLesson                          | —                                       |
| POST   | /lesson/:id/validate    | Executa e valida o código do aluno                  | `{ code, userId? }`                     |
| POST   | /progress               | Salva progresso do aluno (upsert)                   | `{ userId, lessonId, status, savedCode }` |

### Health
| Método | Rota          | Descrição                |
|--------|---------------|--------------------------|
| GET    | /api/health   | Status da API            |

---

## 6. Arquitetura do Frontend

### Roteamento (React Router v7)
```
/                → Dashboard
/courses         → Courses (catálogo)
/lesson/:id      → Lesson (experiência ARPERC)
/achievements    → Placeholder (em desenvolvimento)
/profile         → Profile + CognitiveSettings
```

Todas as rotas são filhas de `<Layout />`, que renderiza sidebar + header + `<Outlet />`.

### Estado Global (Zustand)
O store `useAppStore` gerencia:
- **UI**: `isFocusMode` (esconde sidebar para concentração)
- **Modo cognitivo**: `cognitiveMode` (standard | energetic | focus | calm)
- **Perfil de aprendizado**: `learningProfile` (typical | atypical) — backward compat
- **Progresso**: `xp`, `completedLessons[]`, `activeCourseId`
- **Streak**: `streakData` (currentStreak, bestStreak, totalStudyDays, lastStudyDate)
- **Métricas de sessão**: `sessionMetrics` (exercisesAttempted, exercisesCorrect, hintsUsed, blocksCompleted, errorsInRow)
- **Histórico de exercícios**: `exerciseHistory[]` (rolling window de 20)
- **Estado adaptativo**: `adaptiveState` (flow | learning | struggling | frustrated | disengaged)
- **Preferências sensoriais**: `preferences` (animationLevel, fontSize, lineSpacing, colorScheme, soundEnabled, fontFamily)

**Persistência**: `localStorage` via middleware `persist`, com `partialize` seletivo.

### Design System (CSS)
O sistema de design usa variáveis CSS controladas por atributos `data-*` no `<html>`:

- `data-mode` → Modo cognitivo (standard, energetic, focus, calm) — controla velocidade de animação, escala de fonte, espaçamento, line-height
- `data-scheme` → Esquema de cores (dark, cream, light-blue, light-green)
- `data-font` → Família tipográfica (inter, opendyslexic)
- `data-fontsize` → Escala de fonte (normal, large, xlarge)

**Paleta principal (dark mode):**
- Background: `#0f172a`
- Surface: `#1e293b`
- Primary: `#8b5cf6` (roxo)
- Secondary: `#0ea5e9` (azul)
- Success: `#10b981` (verde)
- Accent: `#f43f5e` (rosa)

---

## 7. Motor Adaptativo NEXUS

### `adaptiveEngine.ts`
Localizado em `frontend/src/engine/adaptiveEngine.ts`. Funções:

| Função                | Descrição                                                                     |
|-----------------------|-------------------------------------------------------------------------------|
| `classifyState()`     | Classifica estado cognitivo (flow/learning/struggling/frustrated/disengaged) baseado nos últimos 5 exercícios |
| `calculateFatigue()`  | Calcula fadiga (0-1) baseado em tempo de sessão + erros consecutivos          |
| `shouldSuggestBreak()`| Retorna 'none' / 'gentle' / 'firm' para sugestão de pausa                    |
| `getDifficultyFactor()`| Multiplicador de dificuldade (0.4 a 1.15) baseado no estado                  |
| `getReturnStrategy()` | Estratégia de retorno após ausência (normal/warmup/review/diagnostic)         |
| `calculateXpGain()`   | XP ganho com bônus por persistência e acerto na primeira tentativa            |

**Base científica:** Csikszentmihalyi (Flow), Ebbinghaus (Esquecimento), Ericsson (Prática deliberada), Kalyuga (Expertise Reversal), Deci & Ryan (Self-Determination).

### `feedbackEngine.ts`
Localizado em `frontend/src/engine/feedbackEngine.ts`. Funções:

| Função                     | Descrição                                                              |
|----------------------------|------------------------------------------------------------------------|
| `getSuccessFeedback()`     | Mensagem de sucesso (diferente para quem persistiu vs. acertou rápido) |
| `getErrorFeedback()`       | Feedback progressivo de erro — NUNCA diz "errado" ou "incorreto"       |
| `getEncouragement()`       | Encorajamento contextual baseado no estado adaptativo                  |
| `getCheckpointFeedback()`  | Feedback para questões de múltipla escolha                             |
| `getLessonCompleteFeedback()`| Mensagem de conclusão de lição                                       |
| `getBreakMessage()`        | Sugestão de pausa (nunca forçada)                                      |
| `getReturnMessage()`       | Mensagem de boas-vindas após ausência                                  |

**Base científica:** Hattie & Timperley (Feedback), Dweck (Growth Mindset — linguagem de processo, não julgamento).

---

## 8. Metodologia ARPERC

As lições seguem o formato **ARPERC** (Ativação → Recepção → Prática → Exploração → Revisão → Conexão), implementado como blocos no formato `LessonContentV2`:

| Bloco        | BlockType    | Propósito                                    |
|--------------|-------------|----------------------------------------------|
| 🔗 Ativação  | `hook`      | Conecta ao conhecimento prévio               |
| 📖 Recepção  | `explain`   | Apresenta teoria com código de exemplo       |
| 🛠️ Prática   | `practice`  | Exercício hands-on no editor Monaco          |
| ✅ Checkpoint | `checkpoint`| MCQ para verificar compreensão               |
| 🏆 Recompensa | `reward`   | Feedback positivo e celebração               |

O conteúdo de cada lição é armazenado como JSON stringificado no campo `content` da tabela `Lesson`.

### Tipos TypeScript do conteúdo
```typescript
interface LessonContentV2 {
  title: string;
  concept: string;
  blocks: LessonBlock[];
  challenge: ChallengeData;
}

interface LessonBlock {
  id: string;
  type: 'hook' | 'explain' | 'practice' | 'checkpoint' | 'reward';
  title?: string;
  content: string;
  code?: string;           // Para blocos explain
  checkpoint?: CheckpointData;  // Para blocos checkpoint
}

interface ChallengeData {
  instruction: string;
  hints: [string, string, string];  // 3 níveis progressivos
}
```

---

## 9. Sistema de Dicas (HintSystem)

3 níveis progressivos — nunca entrega a resposta direta:
1. **Indicação** — direciona a atenção
2. **Conceitual** — explica o conceito relacionado
3. **Explicação completa** — dá o caminho detalhado, mas não o código

---

## 10. Execução e Validação de Código

O endpoint `POST /api/courses/lesson/:id/validate` executa código de 3 formas:

| Linguagem     | Método de execução                                    |
|---------------|-------------------------------------------------------|
| **JavaScript**| Node.js `vm.Script` com sandbox (timeout 1s)          |
| **HTML/CSS**  | Retorna código como output; valida com `validationLogic` |
| **Java**      | Piston API externa (`emkc.org/api/v2/piston/execute`) |

A `validationLogic` é uma função JS armazenada como string na lição, que recebe `(output, code)` e retorna `boolean`.

---

## 11. Gamificação

- **XP**: +20 por lição completada (via backend); bônus por estado adaptativo e tentativas (frontend)
- **Streak**: Dias consecutivos, com lógica de "freeze" implícita (não pune por dias perdidos)
- **Progresso visual**: Barra de progresso por lição, estatísticas no dashboard

---

## 12. Acessibilidade e Inclusão

- **Modos cognitivos**: standard, energetic, focus, calm — cada um com diferentes velocidades de animação, espaçamentos e tamanhos de fonte
- **Esquemas de cores alternativos**: cream, light-blue, light-green (além do dark padrão)
- **Fonte OpenDyslexic**: Suporte nativo para dislexia
- **Modo Foco**: Esconde sidebar e elementos não essenciais
- **Focus-visible**: Acessibilidade de navegação por teclado
- **prefers-reduced-motion**: Respeita configuração do sistema operacional

---

## 13. Cursos Disponíveis

| Curso          | Linguagem  | Status       |
|----------------|------------|--------------|
| HTML           | html       | ✅ Com seed  |
| CSS            | css        | ✅ Com seed  |
| JavaScript     | javascript | ✅ Com seed  |
| Java           | java       | ✅ Com seed  |

Os seeds estão em:
- `backend/src/seedAllCourses.ts` — HTML, CSS, JS (todas as lições ARPERC)
- `backend/src/seedJavaCourse.ts` — Java
- `backend/src/seedLanguages.ts` — Dados de linguagens

---

## 14. Scripts de Execução

```bash
# Raiz — roda tudo
npm run dev           # Frontend (5173) + Backend (3001) em paralelo
npm run install:all   # Instala deps de frontend + backend
npm run build:all     # Build de produção

# Backend
npm run dev           # nodemon src/index.ts
npm run db:push       # prisma db push
npm run db:seed       # ts-node prisma/seed.ts

# Frontend
npm run dev           # vite (porta 5173)
npm run build         # tsc + vite build
npm run lint          # eslint
```

---

## 15. Convenções do Projeto

- **Idioma do código**: Nomes de variáveis, tipos e funções em **inglês**; comentários, mensagens de UI e feedback em **português brasileiro**
- **Componentes**: Functional components com hooks, exportação named
- **Estilização**: Tailwind CSS 4 utilities + classes CSS customizadas para blocos de lição e animações cognitivas
- **Estado**: Zustand (sem Redux), com `persist` middleware e `partialize` seletivo
- **Banco**: SQLite local (dev.db), sem migrations — usa `prisma db push`
- **Autenticação**: JWT no header (implementada no backend, ainda não totalmente integrada no frontend)
- **Validação**: Backend valida código via `vm` sandbox ou API externa
- **Sem testes automatizados**: Projeto ainda não tem suite de testes

---

## 16. Estado Atual do Projeto

### ✅ Implementado
- Layout completo com sidebar, modo foco, navegação
- Dashboard com progresso, XP, streak, cursos recentes
- Catálogo de cursos com módulos e lições
- Experiência de aula ARPERC completa (BlockRenderer, CodeEditor, HintSystem, OutputPanel, ProgressBar, LessonComplete)
- Motor adaptativo NEXUS (classificação de estado, fadiga, dificuldade)
- Motor de feedback psicologicamente seguro
- Sistema de dicas progressivas (3 níveis)
- Configurações cognitivas (modo, esquema de cores, fonte, animações)
- Backend com autenticação JWT
- API de cursos com validação de código
- Seeds completos para 4 linguagens
- Persistência de estado no localStorage

### 🚧 Em desenvolvimento / Incompleto
- Página de Conquistas (placeholder)
- Página de Perfil (básica)
- Integração completa de autenticação no frontend (login/register UI)
- Diretórios `services/` e `docs/` (vazios)
- Suite de testes
- Deploy / CI/CD

---

## 17. Decisões de Design Importantes

1. **Feedback nunca punitivo**: O sistema NUNCA usa palavras como "errado", "incorreto" ou "falhou". Usa linguagem de processo e crescimento (base: Carol Dweck, Growth Mindset).

2. **Pausas sugeridas, nunca forçadas**: Respeitando a autonomia do aluno (base: Deci & Ryan, Self-Determination Theory).

3. **Rolling window de 20 exercícios**: O histórico é limitado para que o estado adaptativo reflita o desempenho recente, não o acumulado.

4. **Conteúdo como JSON no banco**: As lições são armazenadas como JSON stringificado no campo `content`, permitindo a estrutura ARPERC rica sem tabelas adicionais.

5. **Dual-mode cognitivo**: O sistema suporta tanto o modo binário antigo (typical/atypical) quanto o novo sistema de 4 modos cognitivos, com backward compatibility.

6. **CSS Variables para temas cognitivos**: Em vez de trocar classes, o sistema altera variáveis CSS via atributos `data-*` no `<html>`, permitindo transições suaves entre modos.
