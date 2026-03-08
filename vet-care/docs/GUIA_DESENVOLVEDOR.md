# VetCare — Guia do Desenvolvedor

Este documento é voltado a desenvolvedores que vão dar suporte, evoluir ou entender o projeto VetCare. Ele cobre visão geral, tecnologias, estrutura do código, funções principais, instalação no Windows e informações técnicas relevantes.

## 1. Visão geral do projeto

### O que é o VetCare

- Agenda e registra **consultas** (data/hora, diagnóstico, prescrição)
- Pode “finalizar” uma consulta e simular o envio de um resumo/receita por e-mail ao tutor

### Estado atual

## 2. Stack e tecnologias

| **Next.js 15** | Framework React com App Router; rotas em `app/`, SSR quando aplicável. |
| **React 19** | Biblioteca de UI; componentes e hooks. |
| **localStorage** | Persistência de login e de dados (tutores, pets, consultas) por `veterinarioId`. |

### Onde cada tecnologia é utilizada no código

Esta subseção indica **em que arquivos e em que parte do sistema** cada tecnologia aparece, para o desenvolvedor localizar rapidamente onde atuam.

#### TypeScript

- **Configuração:** `tsconfig.json` (compilação), `next-env.d.ts` (tipos do Next.js).
- **Tipos e interfaces:** `lib/types.ts` — define `Veterinario`, `VeterinarioLogado`, `Tutor`, `Pet`, `Consulta`. Esses tipos são usados em todo o projeto.
- **Uso nos arquivos:** Todos os arquivos de código da aplicação são `.ts` ou `.tsx`. As interfaces de `lib/types.ts` são importadas em `lib/mockData.ts`, `context/AuthContext.tsx`, e nas páginas (ex.: `app/(sistema)/tutores-pets/page.tsx`, `app/(sistema)/consulta/ConsultaForm.tsx`). Parâmetros de componentes e funções são tipados (ex.: `{ children: React.ReactNode }`, `ConsultaFormProps`).
- **Path alias:** No `tsconfig.json`, `"@/*": ["./*"]` permite importar com `@/lib/types`, `@/context/AuthContext`, etc.

#### React (React.js)

- **Onde aparece:** Todo o front-end é React. Componentes funcionais e hooks em:
  - **Layouts e páginas:** `app/layout.tsx`, `app/page.tsx`, `app/login/page.tsx`, todas as páginas em `app/(sistema)/` (home, agenda, tutores-pets, consulta).
  - **Componentes reutilizáveis:** `app/components/Header.tsx`, `app/components/Footer.tsx`, `app/(sistema)/consulta/ConsultaForm.tsx`, `app/(sistema)/SistemaGuard.tsx`.
  - **Context:** `context/AuthContext.tsx`, `context/Providers.tsx`.
- **Hooks usados:** `useState`, `useEffect`, `useCallback`, `useMemo`, `useContext` (via hook customizado `useAuth`), e em navegação `useRouter`, `useParams` (Next.js).
- **Client Components:** Arquivos que usam estado ou hooks têm `'use client'` no topo (login, Header, todas as páginas do sistema, ConsultaForm, SistemaGuard, AuthContext).

#### Next.js

- **Rotas (App Router):** A estrutura de pastas em `app/` define as URLs: `app/page.tsx` → `/`, `app/login/page.tsx` → `/login`, `app/(sistema)/home/page.tsx` → `/home`, `app/(sistema)/agenda/page.tsx` → `/agenda`, `app/(sistema)/consulta/nova/page.tsx` → `/consulta/nova`, `app/(sistema)/consulta/[id]/page.tsx` → `/consulta/:id`. O grupo `(sistema)` não altera a URL.
- **Layouts:** `app/layout.tsx` é o layout raiz (HTML, body, Providers). `app/(sistema)/layout.tsx` envolve as rotas protegidas (Header, Footer, SistemaGuard + children).
- **Navegação e redirecionamento:** Uso de `next/navigation`: `redirect()` em `app/page.tsx`, `useRouter()` e `router.replace()` nas páginas de login e consulta, `<Link>` do `next/link` no Header e nas páginas (home, agenda, etc.).
- **Configuração:** `next.config.ts` na raiz do projeto.

#### Tailwind CSS

- **Configuração:** `tailwind.config.ts` (content em `app/**` e `components/**`), `postcss.config.mjs`, e import em `app/globals.css` (`@tailwind base/components/utilities`).
- **Onde é usado:** Classes utilitárias Tailwind em todos os componentes e páginas, por exemplo:
  - **Layout e espaçamento:** `flex`, `grid`, `gap-4`, `p-4`, `mt-6`, `max-w-7xl`, `min-h-screen`.
  - **Tipografia e cores:** `text-zinc-800`, `text-sm`, `font-bold`, `text-white`, `bg-zinc-50`.
  - **Bordas e sombras:** `border`, `rounded-lg`, `shadow-sm`.
  - **Interatividade:** `hover:bg-zinc-50`, `focus:ring-2`.
- **Estilos globais:** Em `app/globals.css` há também classes customizadas (ex.: `.app-header`, `.app-logo`, `.app-link`) que complementam o Tailwind; algumas vêm dos conceitos do antigo App.css.

#### React Context (useContext)

- **Implementação:** Em `context/AuthContext.tsx`:
  - `createContext` para criar o contexto de autenticação.
  - `useContext` é usado dentro do hook customizado `useAuth()`, que retorna `{ veterinario, loading, login, logout }`.
- **Provider:** O `AuthProvider` envolve a aplicação em `context/Providers.tsx`, que é usado em `app/layout.tsx`. Assim, todo o app tem acesso ao contexto.
- **Onde o contexto é consumido (useAuth):**
  - `app/components/Header.tsx` — exibe nome e CRMV do veterinário e chama `logout()` no botão Sair.
  - `app/login/page.tsx` — chama `login()` no submit e usa `veterinario`/`loading` para redirecionar se já logado.
  - `app/(sistema)/SistemaGuard.tsx` — usa `veterinario` e `loading` para decidir se redireciona para `/login` ou renderiza as crianças.
  - Páginas do sistema (home, agenda, tutores-pets, ConsultaForm) — usam `useAuth()` para obter `veterinario.id` e filtrar tutores, pets e consultas por `veterinarioId`.

Ou seja: **useContext** (via `useAuth`) é a forma como o estado do usuário logado (veterinário) e as ações de login/logout ficam disponíveis em qualquer componente que precise deles.

### Ferramentas de desenvolvimento

- **Node.js** — runtime (recomendado LTS, ex.: 20.x).
- **npm** — gerenciador de pacotes (vem com o Node).
- **ESLint** — lint com `eslint-config-next`.

A pasta **`src/`** é legado do Create React App e **não é usada** pelo Next.js (está em `exclude` no `tsconfig.json`). O que vale é a pasta **`app/`**, **`context/`**, **`lib/`** e **`public/`**.

---

## 3. Estrutura do projeto

Estrutura relevante (ignorando `node_modules` e `.next`):

```
vet-care/
├── app/                          # App Router (Next.js)
│   ├── layout.tsx                # Layout raiz; envolve com Providers
│   ├── page.tsx                  # Rota / → redireciona para /login
│   ├── globals.css               # Estilos globais + Tailwind + classes do App (logo, header, etc.)
│   ├── login/
│   │   └── page.tsx              # Tela de login (/login)
│   ├── (sistema)/                # Grupo de rotas: layout compartilhado + proteção
│   │   ├── layout.tsx            # Layout com Header, Footer e SistemaGuard
│   │   ├── SistemaGuard.tsx      # Redireciona para /login se não logado
│   │   ├── home/page.tsx         # Dashboard (/home)
│   │   ├── agenda/page.tsx       # Agenda de consultas (/agenda)
│   │   ├── tutores-pets/page.tsx # Cadastro tutores e pets (/tutores-pets)
│   │   ├── consulta/
│   │   │   ├── ConsultaForm.tsx   # Formulário compartilhado (nova/editar)
│   │   │   ├── nova/page.tsx     # Nova consulta (/consulta/nova)
│   │   │   └── [id]/page.tsx     # Editar consulta (/consulta/:id)
│   │   └── usuarios/page.tsx     # Página legada (pode ser removida)
│   └── components/
│       ├── Header.tsx            # Cabeçalho (logo, nav, usuário, Sair)
│       └── Footer.tsx            # Rodapé
├── context/
│   ├── AuthContext.tsx           # Context de autenticação (login, logout, veterinario)
│   └── Providers.tsx             # Envolve a app com AuthProvider
├── lib/
│   ├── types.ts                  # Interfaces TypeScript (Veterinario, Tutor, Pet, Consulta)
│   └── mockData.ts               # Dados mock + funções de leitura/escrita no localStorage
├── public/
│   ├── logo.svg                  # Logo usado no Header e na tela de login
│   └── ...                       # Outros assets estáticos
├── docs/
│   ├── MANUAL_DO_USUARIO.md      # Manual para o usuário final (veterinário)
│   └── GUIA_DESENVOLVEDOR.md     # Este guia
├── package.json
├── package-lock.json
├── tsconfig.json                  # TypeScript; path @/* → ./*
├── next.config.ts                 # Configuração do Next.js
├── tailwind.config.ts             # Tailwind (content: app/, components/)
├── postcss.config.mjs            # PostCSS (Tailwind + Autoprefixer)
└── next-env.d.ts                 # Tipos do Next (não editar)
```

### Rotas (URLs)

| Rota             | Arquivo                                | Descrição                         |
| ---------------- | -------------------------------------- | --------------------------------- |
| `/`              | `app/page.tsx`                         | Redireciona para `/login`         |
| `/login`         | `app/login/page.tsx`                   | Tela de login                     |
| `/home`          | `app/(sistema)/home/page.tsx`          | Dashboard (protegida)             |
| `/agenda`        | `app/(sistema)/agenda/page.tsx`        | Lista de consultas (protegida)    |
| `/tutores-pets`  | `app/(sistema)/tutores-pets/page.tsx`  | Cadastro tutores/pets (protegida) |
| `/consulta/nova` | `app/(sistema)/consulta/nova/page.tsx` | Nova consulta (protegida)         |
| `/consulta/[id]` | `app/(sistema)/consulta/[id]/page.tsx` | Editar consulta (protegida)       |

Todas as rotas dentro de `(sistema)` usam o mesmo layout (Header + Footer) e passam pelo `SistemaGuard` (exigem login).

---

## 4. Modelo de dados e tipos

Arquivo: **`lib/types.ts`**.

- **Veterinario** — `id`, `nome`, `crmv`, `email`, `senha` (usado só no mock para login).
- **VeterinarioLogado** — mesmo que acima, sem `senha`; é o que fica no Context e no localStorage após o login.
- **Tutor** — `id`, `nome`, `telefone`, `email`, `veterinarioId`.
- **Pet** — `id`, `nome`, `especie`, `raca`, `tutorId`, `veterinarioId`.
- **Consulta** — `id`, `dataHora` (string ISO), `diagnostico`, `prescricao`, `petId`, `veterinarioId`.

Toda entidade operada pelo usuário (Tutor, Pet, Consulta) tem `veterinarioId` para isolamento por veterinário.

---

## 5. Persistência e mock (lib/mockData.ts)

### Chaves no localStorage

- **`vetcare_user`** — objeto `VeterinarioLogado` (sem senha). Definido no `AuthContext` ao fazer login; removido no logout.
- **`vetcare_tutores_${vetId}`** — array de `Tutor` do veterinário `vetId`.
- **`vetcare_pets_${vetId}`** — array de `Pet` do veterinário `vetId`.
- **`vetcare_consultas_${vetId}`** — array de `Consulta` do veterinário `vetId`.

### Funções exportadas

| Função                                      | Descrição                                                                                     |
| ------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `getVeterinarioPorEmailSenha(email, senha)` | Retorna `Veterinario` do array mock se credenciais batem; usado no login.                     |
| `getTutores(vetId)`                         | Lê do localStorage; se vazio, grava dados iniciais mock e retorna. Sempre filtra por `vetId`. |
| `setTutores(vetId, tutores)`                | Grava array de tutores no localStorage (já filtrado por `vetId` internamente).                |
| `getPets(vetId)`                            | Idem `getTutores`, para pets.                                                                 |
| `setPets(vetId, pets)`                      | Grava array de pets.                                                                          |
| `getConsultas(vetId)`                       | Idem para consultas.                                                                          |
| `setConsultas(vetId, consultas)`            | Grava array de consultas.                                                                     |

As funções `get*` verificam `typeof window` e retornam fallback em ambiente sem `window` (ex.: SSR), evitando erro no build.

### Dados iniciais (seed)

- Dois veterinários: `maria@vetcare.com` / `123456` e `joao@vetcare.com` / `123456`.
- Tutores e pets iniciais estão associados ao primeiro vet (`vet-1`). Ao abrir a app com localStorage vazio, esses dados são gravados na primeira leitura.

---

## 6. Autenticação (context/AuthContext.tsx)

- **AuthProvider** — Provider que mantém em estado: `veterinario: VeterinarioLogado | null` e `loading: boolean`. No mount, tenta restaurar `vetcare_user` do localStorage. Expõe `login` e `logout`.
- **login(email, senha)** — chama `getVeterinarioPorEmailSenha`; se existir, salva no state e em `vetcare_user` (sem senha) e retorna `true`; senão retorna `false`.
- **logout()** — zera o state e remove `vetcare_user` do localStorage.
- **useAuth()** — hook que retorna `{ veterinario, loading, login, logout }`. Deve ser usado apenas dentro de `AuthProvider`.

O **Providers** (`context/Providers.tsx`) envolve a aplicação com `AuthProvider` e é usado no **layout raiz** (`app/layout.tsx`).

---

## 7. Proteção de rotas (SistemaGuard)

O layout de `(sistema)` renderiza **SistemaGuard** em volta do conteúdo. O guard:

1. Usa `useAuth()` para obter `veterinario` e `loading`.
2. Enquanto `loading`, mostra “Carregando...”.
3. Se não está mais carregando e não há `veterinario`, chama `router.replace('/login')`.
4. Se há `veterinario`, renderiza os `children` (layout com Header, Footer e página).

Assim, todas as páginas em `app/(sistema)/` exigem usuário logado.

---

## 8. Componentes principais

- **Header** — Logo VetCare, links (Início, Agenda, Tutores e Pets, Nova consulta), nome/CRMV do usuário e botão Sair. Usa `useAuth()` para nome, CRMV e `logout`. Client component (`'use client'`).
- **Footer** — Rodapé com marca e links (Suporte, Termos). Estilo alinhado ao tema (ex.: app-header).
- **ConsultaForm** — Formulário único para nova consulta e edição. Recebe `consultaId` opcional; se vier, carrega a consulta e preenche os campos. Salva via `setConsultas`. Botão “Finalizar e enviar resumo ao tutor” monta um texto de resumo e exibe em `alert` (simulação de e-mail). Client component.

Páginas que precisam de estado, hooks ou localStorage são **Client Components** (`'use client'` no topo). Layout raiz e componentes que só usam `children` podem permanecer Server Components.

---

## 9. Estilos

- **app/globals.css** — Importa Tailwind (`base`, `components`, `utilities`), define fontes/body (estilo herdado do antigo `index.css`), animação do logo e classes como `.app-header`, `.app-link`, `.app-button-primary`, `.app-logo` (conceitos do antigo `App.css`).
- **Tailwind** — Classes utilitárias nos componentes. Config em `tailwind.config.ts`; `content` em `app/**` e `components/**`.
- **Path alias** — No código usa-se `@/` para a raiz do projeto (ex.: `@/lib/types`, `@/context/AuthContext`), definido em `tsconfig.json` → `paths: { "@/*": ["./*"] }`.

---

## 10. Guia de instalação (Windows)

### Pré-requisitos

1. **Node.js (LTS)**
   - Acesse [https://nodejs.org](https://nodejs.org).
   - Baixe a versão **LTS** (recomendado 20.x ou superior).
   - Execute o instalador e siga as etapas (incluir “Add to PATH” se oferecido).
   - No PowerShell ou no CMD, confira:
     ```bash
     node -v
     npm -v
     ```

2. **Git**
   - Baixe em [https://git-scm.com/download/win](https://git-scm.com/download/win).
   - Instale com as opções padrão.
   - Confira:
     ```bash
     git --version
     ```

### Clonar e instalar o projeto

1. Abra **PowerShell** ou **Prompt de Comando** e vá para a pasta onde quer o repositório (ex.: `C:\projetos`).

2. Clone o repositório (substitua pela URL real do repositório):

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd VetCare
   cd vet-care
   ```

   Se o projeto já estiver em uma pasta local, apenas:

   ```bash
   cd C:\caminho\para\VetCare\vet-care
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Abra o navegador em **http://localhost:3000**.
   - A raiz redireciona para `/login`.
   - Use por exemplo: **maria@vetcare.com** / **123456**.

### Comandos úteis

| Comando         | Descrição                                                             |
| --------------- | --------------------------------------------------------------------- |
| `npm run dev`   | Sobe o servidor de desenvolvimento (hot reload).                      |
| `npm run build` | Gera o build de produção na pasta `.next`.                            |
| `npm run start` | Sobe o servidor com o build de produção (rodar após `npm run build`). |
| `npm run lint`  | Executa o ESLint no projeto.                                          |

---

## 11. Dicas para desenvolvimento e suporte

- **Alterar dados iniciais** — Edite os arrays e constantes em `lib/mockData.ts` (tutores, pets, consultas, veterinários).
- **Novas rotas** — Crie pastas/arquivos em `app/` seguindo o App Router; para rotas protegidas, coloque dentro de `app/(sistema)/`.
- **Novos tipos** — Adicione em `lib/types.ts` e use nos componentes e em `mockData` se for persistir.
- **Trocar localStorage por API** — Mantenha a mesma interface em `lib/mockData.ts` (ou crie um módulo `lib/api.ts`) e troque as implementações por `fetch`; o AuthContext pode chamar um endpoint de login em vez de `getVeterinarioPorEmailSenha`.
- **Envio real de e-mail** — No fluxo “Finalizar e enviar resumo ao tutor”, substituir o `alert` por uma chamada a um endpoint que envie o e-mail (ex.: backend com Nodemailer, Resend, etc.).
- **Pasta `src/`** — Pode ser removida; não é usada pelo Next.js. O que importa é `app/`, `context/`, `lib/`, `public/` e os arquivos de config na raiz.

---

## 12. Referências rápidas

- [Next.js App Router](https://nextjs.org/docs/app)
- [React Context](https://react.dev/reference/react/useContext)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

_Documento mantido para o projeto VetCare — uso interno da equipe de desenvolvimento._
