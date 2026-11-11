# Componentes, Hooks e Convenções

## Estrutura

```
src/components/
├── ui/         # Primitivos visuais (TailAdmin sobre Base UI): accordion, alert, avatar,
│               #   badge, breadcrumb, button, button-group, card, checkbox, collapsible,
│               #   combobox, dialog, dropdown, field, file-input, input, input-group,
│               #   label, pagination, popover, progress-bar, radio-group, scroll-area,
│               #   select, separator, sheet, sidebar, skeleton, slider, sonner, spinner,
│               #   switch, table, tabs, textarea, toggle, toggle-group, tooltip
├── shared/     # Blocos reutilizáveis entre páginas: page-meta, page-breadcrumb,
│               #   component-card, stat-card, grid-shape, theme-toggle, scroll-to-top
├── layout/     # app-layout/ (sidebar + header), auth-layout, logo
├── auth/       # protected-route, sign-in-form
└── tasks/      # task-form, task-item, task-list
src/icons/      # Ícones SVG do TailAdmin como componentes (barrel em icons/index.tsx)
```

## Identidade visual (padrão Matizze)

Base visual: **TailAdmin** (React + Tailwind v4). Tudo que é marca fica em `src/styles/theme.css`:

- Fonte **Outfit** (`@fontsource-variable/outfit`), exposta como `font-sans`/`font-outfit`.
- Paleta **`brand-50…950`** (o 500 é a cor principal: botões, links, item ativo do menu, foco).
- Tokens semânticos no padrão shadcn (`--background`, `--foreground`, `--sidebar-*`...) para compatibilidade.

`src/index.css` guarda o estrutural: breakpoints extras (`2xsm`, `xsm`, `3xl`), tipografia
(`text-title-*`, `text-heading-*`, `text-theme-*`), sombras `shadow-theme-*` e as `@utility`
do menu (`menu-item-*`, `menu-dropdown-*`), `no-scrollbar`, `custom-scrollbar`.

Superfícies seguem a escala `gray-*` do Tailwind com `dark:` explícito em tudo
(ex.: card = `border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3`).
Ao criar uma `@utility` com estados exclusivos, registre o grupo em `lib/utils.ts` (tailwind-merge).

## Convenções de arquivos

- **Filenames**: `kebab-case.tsx` (ex.: `task-item.tsx`, `sign-in-form.tsx`).
- **Exports nomeados**: PascalCase. Páginas usam `default export` (importadas pelo router); demais usam named exports.
- **1 componente por arquivo**, exceto skeletons (loading + error juntos).
- **Imports absolutos via `@/`** ao cruzar camadas; **relativos** dentro da mesma feature.

## Padrão de Props

- Interface inline (raramente exportada): `interface XxxProps { ... }`.
- Callbacks: prefixo `on*`. Em models, handlers internos: prefixo `handle*`.
- `disabled`, `isOpen`, `onClose`, `className` consistentes.

## UI (`components/ui/`)

Primitivos no estilo shadcn, mas sobre **Base UI** (`@base-ui/react`), não Radix:
função nomeada + `data-slot`, variantes via `cva`, `cn()` de `@/lib/utils`.

- Composição usa a prop **`render`** (Base UI), não `asChild`. Link com cara de botão:
  `<Button nativeButton={false} render={<Link href="/x" />}>...</Button>`.
- `Button`: variants `default | outline | ghost | destructive | link`; sizes `xs | sm | default | lg | icon | icon-xs | icon-sm | icon-lg`.
- `Badge`: `variant` (`light | solid | ghost`) × `color` (`primary | success | error | warning | info | gray | light | dark`) × `size`.
- `Alert`: variants `default | success | warning | destructive | info` (ícone como 1º filho).
- **Não use `pnpm dlx shadcn add`**: o CLI traz componentes Radix com outro visual. Novos primitivos
  devem seguir o padrão dos existentes (Base UI + classes gray/brand + `dark:`).
- ESLint override em `src/components/ui/**`: `react-refresh/only-export-components` desligado (co-export de `xxxVariants`).

## Formulários

React Hook Form + Zod + `Field` (`components/ui/field`). Padrão:

```tsx
<Controller
  control={form.control}
  name="title"
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel>Title</FieldLabel>
      <Input aria-invalid={fieldState.invalid || undefined} {...field} />
      <FieldError errors={[fieldState.error]} />
    </Field>
  )}
/>
```

`Field` gera o id e liga `FieldLabel`/`Input` automaticamente. Agrupe campos com `FieldGroup`.

## Hooks customizados (`src/hooks/`)

- **`useAuth()`** — `useQuery(['auth','me'])` + mutations `signIn`/`signOut`.
- **`useIsMobile()`** — `true` abaixo de 1280px (sidebar vira drawer). `useSyncExternalStore`.
- **`useDebounce<T>(value, delay)`**.
- **`useTheme()`** (`@/providers/theme`) — `{ theme, themeMode, setThemeMode, toggleTheme }`; modos `light | dark | system`, persistido em `localStorage['theme-mode']`. Script inline no `index.html` aplica `.dark` antes do primeiro paint.

## Layout

- **`<AppLayout>`** (`layout/app-layout/`) — shell das rotas autenticadas: `SidebarProvider` + `AppSidebar` + `AppHeader` + conteúdo (`max-w-(--breakpoint-2xl) p-4 md:p-6`). Montado **uma vez em `App.tsx`** (via `Private`), as views não o renderizam.
  - Sidebar recolhe para ícones (botão no header ou Ctrl/⌘+B), expande ao passar o mouse, vira drawer no mobile. Estado salvo no cookie `sidebar_state`.
  - Itens do menu: `layout/app-layout/sidebar/data.tsx` (`navSections`). Item com `subItems` vira grupo expansível. Ativo = path exato ou sub-rota.
  - Header: toggle do sidebar, busca (Ctrl/⌘+K foca), `ThemeToggle`, `UserDropdown` (nome/email do `useAuth` + sign out).
- **`<AuthLayout>`** — formulário à esquerda, painel `brand-950` com a logo à direita, toggle de tema flutuante.
- **`<Logo>`** — marca Matizze (placeholder em texto). Troque o conteúdo pelos assets oficiais mantendo a API (`variant`, `size`, `inverted`).

## Componentes compartilhados (`components/shared/`)

- **`PageMeta`** — `<title>`/description via React 19 (sem react-helmet).
- **`PageBreadcrumb`** — título da página + trilha Home › ... (props `crumbs`, `actions`).
- **`ComponentCard`** — card de seção com header (título, descrição, `action`) e corpo com borda.
- **`StatCard`** — KPI: ícone, rótulo, valor e `trend` opcional (ex.: `<Badge color="success">`).

## Componentes de domínio (`auth/`, `tasks/`)

- **`<SignInForm>`** — RHF + Zod; senha com botão mostrar/ocultar; erro de auth em `Alert`.
- **`<ProtectedRoute>`** — guard via `useAuth()`. Redireciona pra `/login`; spinner enquanto verifica.
- **`<TaskForm>`**, **`<TaskList>`** (com empty state), **`<TaskItem>`**.

## Iconografia

Ícones do TailAdmin em `src/icons/` (componentes SVG, `currentColor`), importados de `@/icons`.
Novo ícone: crie `src/icons/<nome>.tsx` exportando `XxxIcon(props: IconProps)` e adicione ao barrel.
Não use SVG inline em páginas.

## Utilities (`src/lib/`)

- **`lib/utils.ts`** — `cn(...)` (clsx + tailwind-merge estendido com os tokens do tema).
- **`lib/cookies.ts`** — `getCookie`, `setCookie`, `removeCookie`.
- **`lib/errors/`** — erros de UI com `code`.

## Acessibilidade

- `aria-label` em botões só com ícone.
- `Field` associa label/input por id automaticamente.
- Sign-in form usa `autoComplete="email"`/`"current-password"`.
