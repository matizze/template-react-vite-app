# Componentes, Hooks e Convenções

## Estrutura
```
src/components/
├── ui/         # shadcn primitives (alert, badge, button, card, checkbox,
│               #   dialog, drawer, input, label, radio-group, scroll-area,
│               #   select, separator, sheet, skeleton, sonner, switch, tabs,
│               #   textarea)
├── layout/     # app-layout, navbar
├── auth/       # protected-route, sign-in-form
└── tasks/      # task-form, task-item, task-list
```

## Convenções de arquivos
- **Filenames**: `kebab-case.tsx` (ex.: `task-item.tsx`, `sign-in-form.tsx`).
- **Exports nomeados**: PascalCase. Páginas usam `default export` (importadas pelo router); demais usam named exports.
- **1 componente por arquivo**, exceto skeletons (loading + error juntos).
- **Imports absolutos via `@/`** ao cruzar camadas (`@/components/...`, `@/services`, `@/lib/utils`, `@/lib/factory`, `@/types/contracts/...`, `@/types/schemas/...`, `@/hooks/...`).
- **Imports relativos** dentro da mesma feature (`./model`, `./view`, `./task-item`).

## Padrão de Props
- Interface inline (raramente exportada): `interface XxxProps { ... }`.
- Wrappers de elemento HTML: `ComponentProps<'div'>` (ver `Navbar`, `AppLayout`).
- Callbacks: prefixo `on*` (`onClick`, `onSubmit`, `onToggle`, `onRemove`). Em models, handlers internos: prefixo `handle*` (`handleSignOut`, `handleCreate`).
- `disabled`, `isOpen`, `onClose`, `className` consistentes.
- **Composição via slots**: `Navbar` aceita `children` (centro), `leftSlot` e `rightSlot`.

## cn() + variants
- Sempre usa `cn(...)` de `@/lib/utils` (clsx + tailwind-merge).
- Variantes via `class-variance-authority` (`cva`) — ver `components/ui/button.tsx`.
- ESLint override em `src/components/ui/**`: `react-refresh/only-export-components` desligado, porque shadcn co-exporta `xxxVariants` no mesmo arquivo do componente.

## UI shadcn (`components/ui/`)
Padrão shadcn: função componente nomeada + `data-slot="..."` para CSS targeting. Estilo `radix-luma`, baseColor `neutral`, cssVariables (oklch tokens em `src/index.css`).

- `Button`: 6 variants (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`) + 4 sizes (`default`, `sm`, `lg`, `icon`).
- `Card`: estrutura clássica (Card/CardHeader/CardTitle/CardDescription/CardContent/CardFooter).
- `Badge`: 4 variants (`default`, `secondary`, `destructive`, `outline`).
- `Input`: simples, sem variants.
- Demais shadcn primitives (`drawer`, `sheet`, `dialog`, `tabs`, etc.) ficam disponíveis para uso, mas não são consumidos pelas páginas atuais — adicione/remova conforme necessidade. `pnpm dlx shadcn@latest add <component>` re-instala/atualiza.

## Hooks customizados (`src/hooks/`)
- **`useServices()`** — `useContext(ServiceContext)`, throw se fora do provider. Retorna o objeto namespaced `{ auth: {...}, tasks: {...} }`. Acesso típico: `useServices().auth.signIn`, `useServices().tasks.list`.
- **`useAuth()`** — wrapper sobre `useQuery(['auth','me'])` + mutations `signIn`/`signOut`. Retorna `{ user, isAuthenticated, isLoading, signIn, signOut, isSigningIn, isSigningOut, signInError }`.
- **`useDebounce<T>(value, delay)`** — clássico, retorna valor após delay sem mudança.

## Layout
- **`<AppLayout>`** — `flex flex-col min-h-[100dvh] bg-background text-foreground`. Sem mais nada — Navbar é opt-in por página.
- **`<Navbar>`** — `sticky top-0 z-30 h-14 border-b bg-background/80 backdrop-blur`. Slots: `leftSlot`, `children` (centro flex-1), `rightSlot`.

## Componentes de domínio (`auth/`, `tasks/`)
- **`<SignInForm>`** — controlled (props: `email`, `password`, callbacks). Usa `Card` + `Input` + `Label` + `Button` + `Alert`.
- **`<ProtectedRoute>`** — guard via `useAuth()`. Redireciona pra `/login` se não autenticado, mostra `<TasksSkeleton>` enquanto verifica.
- **`<TaskForm>`** — uncontrolled (state interno de title/description; chama `onSubmit({ title, description })` e reseta).
- **`<TaskList>`** — render list ou empty state. Aceita `tasks`, `onToggle`, `onRemove`, `disabled`.
- **`<TaskItem>`** — `Checkbox` + texto (line-through quando `completed`) + botão de remover (ghost icon).

## Iconografia
**`lucide-react`** como única lib de ícones (`components.json` declara). Phosphor foi removido na migração para boilerplate.

## Utilities (`src/lib/`, `src/hooks/`)
- **`lib/utils.ts`** — `cn(...inputs)` (clsx + tailwind-merge).
- **`lib/cookies.ts`** — `getCookie(name)`, `setCookie(name, value, options?)`, `removeCookie(name)`. SameSite=Lax, Secure quando https, Max-Age padrão 7 dias.
- **`lib/db.ts`** — `AppDB.getInstance(schemas)` (Dexie singleton, `'app-db'`).
- **`lib/factory.ts`** — `NamespaceBuilder` + `ServiceFactory` (infra genérica do padrão Factory com namespacing tipado; usada por `createServices`).
- **`lib/errors/ui-error.ts`** — `UIError extends Error` com `code: string` para erros de domínio com UX consistente.

## Acessibilidade
- `aria-label` em botões só com ícone (ver `<TaskItem>` — `Remove task`, `Mark as completed`).
- `<Label>` shadcn associado por `htmlFor`/`id`.
- Sign-in form usa `autoComplete="email"`/`"current-password"`.
