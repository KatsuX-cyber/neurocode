<p align="center">
  <img src="https://img.shields.io/badge/NeuroCode-Aprenda_Programação-7c3aed?style=for-the-badge&logo=brain&logoColor=white" alt="NeuroCode" />
</p>

<h1 align="center">🧠 NeuroCode</h1>

<p align="center">
  <strong>Plataforma neuroadaptativa de aprendizado de programação</strong><br/>
  Projetada para mentes neurotípicas e neuroatípicas
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-Database-003B57?style=flat-square&logo=sqlite&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-Build-646CFF?style=flat-square&logo=vite&logoColor=white" />
</p>

---

## 📖 Sobre o Projeto

O **NeuroCode** é uma plataforma moderna de aprendizado de programação que utiliza princípios de **neuroeducação**, **ciência cognitiva** e **design instrucional adaptativo** para criar uma experiência de ensino extremamente eficiente.

A plataforma **não possui professores humanos** — todo o aprendizado acontece através de conteúdo estruturado, exercícios interativos, feedback automático inteligente e sistemas adaptativos que se ajustam ao perfil cognitivo de cada estudante.

### 🎯 Público-alvo

- Pessoas **neurotípicas** que buscam aprender programação de forma eficiente
- Pessoas **neuroatípicas** (TDAH, autismo, dislexia, ansiedade) que precisam de uma experiência adaptada
- Iniciantes absolutos em programação
- Estudantes que se frustram com métodos tradicionais

---

## ✨ Funcionalidades Principais

### 🧬 Motor Cognitivo Adaptativo
- **Detecção de perfil cognitivo** — ajusta automaticamente o conteúdo com base no desempenho
- **Modos sensoriais** — Focado, Calmo e Energético, com paletas visuais e animações diferentes
- **Sistema de dicas progressivas** — nunca entrega a resposta direta, guia o raciocínio

### 📚 Metodologia ARPERC
Cada aula segue blocos pedagógicos cientificamente fundamentados:

| Bloco | Função |
|-------|--------|
| 🔗 **Ativação** | Conecta o novo conteúdo ao conhecimento prévio |
| 📖 **Recepção** | Apresenta a teoria de forma clara e visual |
| 🛠️ **Prática** | Exercícios hands-on com editor de código integrado |
| 🔍 **Exploração** | Desafios que incentivam a experimentação autônoma |
| 🔄 **Revisão** | Consolida o aprendizado com retrieval practice |
| 🌍 **Conexão** | Mostra aplicações reais do conceito aprendido |

### 🎮 Gamificação Saudável
- Sistema de XP sem punição por dias perdidos
- Streak com "freeze" automático para reduzir ansiedade
- Progresso visual com feedback positivo constante

### 💻 Editor de Código Integrado
- Syntax highlighting para múltiplas linguagens
- Execução de código em tempo real
- Feedback automático com validação inteligente

### 🎨 Interface Adaptativa
- Dark mode nativo
- Transições suaves e micro-animações
- Layout responsivo e acessível
- Modo de foco reduzido para sobrecarga sensorial

---

## 🗂️ Cursos Disponíveis

| Curso | Módulos | Status |
|-------|---------|--------|
| 🟧 **HTML** | Fundamentos, Semântica, Formulários | ✅ Disponível |
| 🔵 **CSS** | Seletores, Box Model, Flexbox, Grid | ✅ Disponível |
| 🟡 **JavaScript** | Variáveis, Funções, DOM, Async | ✅ Disponível |
| ☕ **Java** | OOP, Tipos, Estruturas de Dados | ✅ Disponível |

---

## 🏗️ Arquitetura do Projeto

```
neurocode/
├── frontend/                  # Aplicação React + Vite
│   └── src/
│       ├── components/        # Componentes reutilizáveis
│       │   ├── lesson/        # BlockRenderer, CodeEditor, HintSystem, etc.
│       │   └── settings/      # CognitiveSettings (perfil cognitivo)
│       ├── engine/            # Motor neuroadaptativo
│       │   ├── adaptiveEngine.ts   # Ajuste de dificuldade em tempo real
│       │   └── feedbackEngine.ts   # Feedback cognitivo contextual
│       ├── pages/             # Páginas da aplicação
│       │   ├── Dashboard.tsx  # Painel principal com progresso
│       │   ├── Courses.tsx    # Catálogo de cursos
│       │   ├── Lesson.tsx     # Experiência de aula ARPERC
│       │   └── Profile.tsx    # Perfil e configurações cognitivas
│       ├── store/             # Zustand (estado global com persistência)
│       └── types.ts           # Tipos TypeScript compartilhados
│
├── backend/                   # API Node.js + Express
│   ├── prisma/
│   │   └── schema.prisma      # Modelos: User, Course, Module, Lesson, Progress
│   └── src/
│       ├── controllers/       # Lógica de negócio
│       ├── routes/            # Endpoints REST
│       ├── seedAllCourses.ts  # Seed com aulas ARPERC completas
│       └── index.ts           # Servidor Express
│
└── package.json               # Scripts de orquestração (dev, build, install)
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) v9+

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/KatsuX-cyber/neurocode.git
cd neurocode

# 2. Instale as dependências de todos os módulos
npm run install:all

# 3. Configure o banco de dados
cd backend
npx prisma generate
npx prisma db push
cd ..

# 4. (Opcional) Popule o banco com cursos
cd backend
npx ts-node src/seedAllCourses.ts
cd ..
```

### Executando em Desenvolvimento

```bash
# Roda frontend + backend simultaneamente
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001

### Build de Produção

```bash
npm run build:all
```

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Estilização** | CSS customizado com variáveis cognitivas |
| **Estado** | Zustand com persistência em localStorage |
| **Motor Adaptativo** | TypeScript (adaptiveEngine + feedbackEngine) |
| **Backend** | Node.js, Express, TypeScript |
| **ORM** | Prisma |
| **Banco de Dados** | SQLite |
| **Monorepo** | npm workspaces + concurrently |

---

## 🧪 Metodologia Científica

O NeuroCode é fundamentado em pesquisas de:

- **Retrieval Practice** — Consolidação ativa de memória
- **Espaçamento (Spaced Repetition)** — Revisão em intervalos otimizados
- **Interleaving** — Intercalação de tópicos para retenção profunda
- **Scaffolding Cognitivo** — Suporte gradual que diminui à medida que o aluno progride
- **Carga Cognitiva (Sweller)** — Redução de sobrecarga informacional
- **Flow State (Csikszentmihalyi)** — Equilíbrio dinâmico entre desafio e habilidade
- **Self-Determination Theory** — Autonomia, competência e pertencimento

---

## 📄 Licença

Este projeto é de uso educacional. Todos os direitos reservados © 2026 NeuroCode.

---

<p align="center">
  Feito com 🧠 e ❤️ por <a href="https://github.com/KatsuX-cyber">KatsuX-cyber</a>
</p>
