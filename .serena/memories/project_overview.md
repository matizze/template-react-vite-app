# Project Overview — template-react-vite-app

Boilerplate React 19 + TypeScript + Vite com **autenticação mockada (JWT em cookie)** e **CRUD de tarefas (HTTP mock + Dexie por trás)**. Pensado como ponto de partida para apps que precisam de:
- Camada de domínio testável (use-cases com DI)
- HTTP cliente plugável (mock → real sem mexer nos use-cases)
- Persistência local opcional via Dexie
- Páginas no padrão MVVM (index/model/view/skeleton)
- shadcn/ui (style `radix-luma`, baseColor `neutral`)

## Stack principal
- **React 19** + **TypeScript ~6.0** + **Vite 8**.
- **React Compiler** habilitado via `@rolldown/plugin-babel` + `babel-plugin-react-compiler` (preset em `vite.config.ts`).
- **Tailwind CSS 4** via `@tailwindcss/vite` (sem `tailwind.config.js`; tokens em `src/index.css` com `@theme inline`).
- **shadcn/ui** style `radix-luma`, baseColor `neutral`, ícones `lucide` (`components.json`).
- **Wouter** para roteamento (não react-router).
- **TanStack Query v5** para queries/mutations.
- **Dexie 4** (IndexedDB) como persistência local — por trás do mock HTTP para tasks.
- **`@fontsource-variable/inter`** como fonte default.
- **Radix UI** primitives (`radix-ui` v1.4 monolítico).

## Convenções de tooling
- Alias `@/*` → `./src/*` configurado em `tsconfig.json`, `tsconfig.app.json` e `vite.config.ts`.
- ESLint flat config: `js.recommended` + `tseslint.recommended` + `react-hooks.recommended` + `react-refresh/vite`. Override em `src/components/ui/**` desliga `react-refresh/only-export-components` (shadcn co-exporta variants junto do componente).
- TS strict-ish: `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, `erasableSyntaxOnly`, `moduleResolution: bundler`.
- Scripts: `dev` (vite), `build` (`tsc -b && vite build`), `lint`, `preview`.

## Layout de diretórios
```
src/
  main.tsx               # entry: monta <AppProvider><App/></AppProvider>
  App.tsx                # router (Switch/Route do wouter) + ProtectedRoute
  index.css              # tema shadcn neutral (oklch tokens), @theme inline
  providers/
    app.provider.tsx     # composer (QueryProvider → ServiceProvider)
    query.provider.tsx
    service.provider.tsx
    service.context.ts
  services/
    contracts/           # IUseCase, IHttpClient, IAppDB
    auth/                # SignIn, SignOut, GetCurrentUser
    tasks/               # List, Get, Create, Update, Delete, Toggle
    schemas/             # User, Task
    errors/              # UIError (code + message)
    registry.ts          # createAllServices({ httpClient })
  http/
    mock.client.ts       # MockHttpClient — auth + tasks (lê/escreve Dexie)
  lib/
    db.ts                # AppDB (Dexie singleton, db name "app-db")
    cookies.ts           # getCookie/setCookie/removeCookie
    utils.ts             # cn() (clsx + tailwind-merge)
  hooks/
    use-services.ts      # useContext(ServiceContext)
    use-auth.ts          # useQuery + useMutation envoltórios para auth state
    use-debounce.ts
  components/
    ui/                  # shadcn primitives (button, card, input, ...)
    layout/              # AppLayout, Navbar
    auth/                # SignInForm, ProtectedRoute
    tasks/               # TaskForm, TaskList, TaskItem
  pages/
    login/               # MVVM: index | model | view | skeleton
    tasks/               # MVVM
public/
  favicon.svg
```

## Páginas implementadas
- `/login` — `LoginPage` (formulário sign-in; redireciona pra `/tasks` se já logado).
- `/tasks` — `TasksPage` protegida (CRUD: criar, marcar feita, remover).
- `/` — redireciona pra `/tasks`.
- `*` — 404 simples.

## Características arquiteturais que guiam o template
1. **MVVM por página** (index = thin orchestrator; model = hook com queries/mutations/handlers; view = puro JSX recebendo `ReturnType<typeof useXxxModel>`; skeleton = loading/error).
2. **Use-cases com DI por construtor** seguindo `IUseCase<Input, Output>`.
3. **Service registry** monta todos os use-cases num único objeto fornecido via `ServiceContext`; tipo do context derivado de `ReturnType<typeof createAllServices>` (zero duplicação).
4. **HTTP cliente plugável** com `MockHttpClient` — substituível por implementação real sem mexer em use-case nem página.
5. **Auth via JWT em cookie** — `lib/cookies.ts` set/get/remove; mock injeta cookie `app_token` no sign-in. Implementação real ganhará envio automático com `credentials: 'include'`.
6. **Persistência local plugável** via `IAppDB` (Dexie é detalhe, contrato é abstrato). Tasks vivem na tabela `tasks` indexada por `id` e `user_id`.
7. **Erros tipados** (`UIError` com `code`) consumidos pelas mutations para UX consistente. Códigos atuais: `UNAUTHENTICATED`, `INVALID_CREDENTIALS`, `TASK_NOT_FOUND`, `TITLE_REQUIRED`.

## Credenciais mock
- Email: `admin@app.com`
- Senha: `password`
